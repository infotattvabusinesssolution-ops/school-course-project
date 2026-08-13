import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/Course.model.js";
import Ebook from "../models/Ebook.model.js";
import Enrollment from "../models/Enrollment.model.js";
import EbookPurchase from "../models/EbookPurchase.model.js";
import Progress from "../models/Progress.model.js";
import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";
import Exam from "../models/Exam.model.js";
import User from "../models/User.model.js";
import { sendPurchaseInvoiceEmail, sendReExamReceiptEmail } from "../utils/email.js";

const generatePayfastSignature = (payload, passPhrase = null) => {
    let pfOutput = "";
    for (let key in payload) {
        if(payload.hasOwnProperty(key)){
            // Skip empty strings, nulls, and undefineds
            if (payload[key] !== "" && payload[key] !== null && payload[key] !== undefined) {
                pfOutput += `${key}=${encodeURIComponent(String(payload[key]).trim()).replace(/%20/g, "+")}&`
            }
        }
    }
    let getString = pfOutput.slice(0, -1);
    if (passPhrase) {
        getString += `&passphrase=${encodeURIComponent(String(passPhrase).trim()).replace(/%20/g, "+")}`;
    }
    return crypto.createHash("md5").update(getString).digest("hex");
};

const getPayfastConfig = () => {
    const isTest = process.env.PAYFAST_TEST_MODE === "true";
    return {
        merchant_id: isTest ? process.env.PAYFAST_SANDBOX_MERCHANT_ID : process.env.PAYFAST_MERCHANT_ID,
        merchant_key: isTest ? process.env.PAYFAST_SANDBOX_MERCHANT_KEY : process.env.PAYFAST_MERCHANT_KEY,
        passphrase: isTest ? process.env.PAYFAST_SANDBOX_PASSPHRASE : process.env.PAYFAST_PASSPHRASE,
        actionUrl: isTest ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"
    };
};

export const createPayfastOrder = asyncHandler(async (req, res, next) => {
  const { courseId, couponCode } = req.body;
  const studentId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const existingEnrollments = await Enrollment.find({
    student: studentId,
    course: courseId,
  }).sort({ enrolledAt: -1 });

  const latestEnrollment = existingEnrollments[0];
  if (latestEnrollment && latestEnrollment.status !== "COMPLETED") {
    throw new ApiError(400, "You are already actively enrolled in this course");
  }

  let finalPrice = course.price;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isValid()) {
      if (coupon.discountType === 'percentage') {
        finalPrice = finalPrice - (finalPrice * (coupon.discountValue / 100));
      } else {
        finalPrice = Math.max(0, finalPrice - coupon.discountValue);
      }
    }
  }

  const { merchant_id, merchant_key, passphrase, actionUrl } = getPayfastConfig();
  const m_payment_id = `course_${courseId}_${studentId}_${Date.now()}`;

  const nameParts = (req.user.name || 'Student').trim().split(' ');
  const payload = {
    merchant_id,
    merchant_key,
    return_url: `${process.env.CLIENT_URL}/payment-success?type=course&id=${courseId}&m_payment_id=${m_payment_id}`,
    cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
    notify_url: `${process.env.SERVER_URL}/api/payments/payfast-itn`,
    name_first: nameParts[0] || 'Student',
    name_last: nameParts.slice(1).join(' ') || '',
    email_address: req.user.email || '',
    m_payment_id,
    amount: finalPrice.toFixed(2),
    item_name: (course.title || 'Course').substring(0, 100),
  };

  payload.signature = generatePayfastSignature(payload, passphrase);

  res.status(200).json({ success: true, payload, actionUrl });
});

export const verifyPayfastPaymentSimulated = asyncHandler(async (req, res, next) => {
  if (process.env.SIMULATE_PAYMENT !== "true") {
      throw new ApiError(400, "Simulated payments are disabled");
  }

  const { courseId, m_payment_id } = req.body;
  const studentId = req.user._id;

  let enrollment = await Enrollment.findOne({ razorpayOrderId: m_payment_id });

  if (!enrollment) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "Course not found");
    
    let expiresAt = null;
    if (course.validityPeriod) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + course.validityPeriod);
    }

    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      enrolledAt: new Date(),
      status: "ACTIVE",
      razorpayOrderId: m_payment_id,
      razorpayPaymentId: "simulated_pf_" + Date.now(),
      expiresAt: expiresAt,
      amountPaid: course.price, 
    });

    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalEnrollments: 1, totalRevenue: course.price }
    });

    const totalLessons = (course.modules || []).reduce((acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0), 0);
    await Progress.create({
      student: studentId,
      course: courseId,
      completedLessons: [],
      totalLessons: totalLessons,
    });
  }

  const courseDetails = await Course.findById(courseId).populate('admin', 'name email');
  const user = await User.findById(studentId);
  if (user && courseDetails) {
    sendPurchaseInvoiceEmail(user.email, user.name, {
      itemName: courseDetails.title,
      amount: courseDetails.price
    });
  }

  res.status(200).json({
    success: true,
    message: "Simulated payment successful",
    courseId,
    course: courseDetails
  });
});

export const createEbookOrder = asyncHandler(async (req, res) => {
  const { ebookId } = req.body;
  const studentId = req.user._id;

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new ApiError(404, "Ebook not found");

  const existingPurchase = await EbookPurchase.findOne({
    student: studentId,
    ebook: ebookId,
    status: "PAID",
  });

  if (existingPurchase) throw new ApiError(400, "You have already purchased this E-book");

  let finalPrice = ebook.price;
  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase() });
    if (coupon && coupon.isValid()) {
      if (coupon.discountType === 'percentage') {
        finalPrice = finalPrice - (finalPrice * (coupon.discountValue / 100));
      } else {
        finalPrice = Math.max(0, finalPrice - coupon.discountValue);
      }
    }
  }

  const { merchant_id, merchant_key, passphrase, actionUrl } = getPayfastConfig();
  const m_payment_id = `ebook_${ebookId}_${studentId}_${Date.now()}`;

  const nameParts2 = (req.user.name || 'Student').trim().split(' ');
  const payload = {
    merchant_id,
    merchant_key,
    return_url: `${process.env.CLIENT_URL}/payment-success?type=ebook&id=${ebookId}&m_payment_id=${m_payment_id}`,
    cancel_url: `${process.env.CLIENT_URL}/ebook`,
    notify_url: `${process.env.SERVER_URL}/api/payments/payfast-itn`,
    name_first: nameParts2[0] || 'Student',
    name_last: nameParts2.slice(1).join(' ') || '',
    email_address: req.user.email || '',
    m_payment_id,
    amount: finalPrice.toFixed(2),
    item_name: (ebook.title || 'Ebook').substring(0, 100),
  };

  payload.signature = generatePayfastSignature(payload, passphrase);

  res.status(200).json({ success: true, payload, actionUrl });
});

export const verifyEbookPaymentSimulated = asyncHandler(async (req, res) => {
    if (process.env.SIMULATE_PAYMENT !== "true") {
        throw new ApiError(400, "Simulated payments are disabled");
    }
    const { ebookId, m_payment_id } = req.body;
    const studentId = req.user._id;

    let purchase = await EbookPurchase.findOne({ razorpayOrderId: m_payment_id });

    if (!purchase) {
      const ebook = await Ebook.findById(ebookId);
      if (!ebook) throw new ApiError(404, "Ebook not found");

      purchase = await EbookPurchase.create({
        student: studentId,
        ebook: ebookId,
        amountPaid: ebook.price,
        status: "PAID",
        razorpayOrderId: m_payment_id,
        razorpayPaymentId: "simulated_pf_" + Date.now(),
        purchasedAt: new Date(),
      });
      const user = await User.findById(studentId);
      if (user && ebook) {
        sendPurchaseInvoiceEmail(user.email, user.name, {
          itemName: ebook.title,
          amount: ebook.price
        });
      }
    }

    return res.status(200).json({ success: true, purchase });
});


export const createCartOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const studentId = req.user._id;

  if (!items || items.length === 0) throw new ApiError(400, "Cart is empty");

  let totalAmount = 0;
  for (const item of items) {
    if (item.type === 'course') {
      const course = await Course.findById(item.id);
      if (course) totalAmount += course.price;
    } else if (item.type === 'ebook') {
      const ebook = await Ebook.findById(item.id);
      if (ebook) totalAmount += ebook.price;
    }
  }

  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase() });
    if (coupon && coupon.isValid()) {
      if (coupon.discountType === 'percentage') {
        totalAmount = totalAmount - (totalAmount * (coupon.discountValue / 100));
      } else {
        totalAmount = Math.max(0, totalAmount - coupon.discountValue);
      }
    }
  }

  const { merchant_id, merchant_key, passphrase, actionUrl } = getPayfastConfig();
  const m_payment_id = `cart_${studentId}_${Date.now()}`;

  const nameParts3 = (req.user.name || 'Student').trim().split(' ');
  const payload = {
    merchant_id,
    merchant_key,
    return_url: `${process.env.CLIENT_URL}/payment-success?type=cart&m_payment_id=${m_payment_id}`,
    cancel_url: `${process.env.CLIENT_URL}/courses`,
    notify_url: `${process.env.SERVER_URL}/api/payments/payfast-itn`,
    name_first: nameParts3[0] || 'Student',
    name_last: nameParts3.slice(1).join(' ') || '',
    email_address: req.user.email || '',
    m_payment_id,
    amount: totalAmount.toFixed(2),
    item_name: `CRMISA Cart (${items.length} items)`,
  };

  payload.signature = generatePayfastSignature(payload, passphrase);

  const orderItems = items.map(i => ({ type: i.type, id: i.id, price: i.price }));
  await Order.create({
    student: studentId,
    m_payment_id,
    items: orderItems,
    totalAmount
  });

  res.status(200).json({ success: true, payload, actionUrl, m_payment_id });
});

export const verifyCartPaymentSimulated = asyncHandler(async (req, res) => {
    if (process.env.SIMULATE_PAYMENT !== "true") {
        throw new ApiError(400, "Simulated payments are disabled");
    }
    const { items, m_payment_id } = req.body;
    const studentId = req.user._id;

    for (const item of items) {
        if (item.type === 'course') {
            let enrollment = await Enrollment.findOne({ student: studentId, course: item.id, razorpayOrderId: m_payment_id });
            if (!enrollment) {
                const course = await Course.findById(item.id);
                if (course) {
                    await Enrollment.create({
                        student: studentId,
                        course: item.id,
                        enrolledAt: new Date(),
                        status: "ACTIVE",
                        razorpayOrderId: m_payment_id,
                        razorpayPaymentId: "simulated_pf_" + Date.now(),
                        amountPaid: course.price, 
                    });
                    await Course.findByIdAndUpdate(item.id, { $inc: { totalEnrollments: 1, totalRevenue: course.price }});
                    const totalLessons = (course.modules || []).reduce((acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0), 0);
                    await Progress.create({ student: studentId, course: item.id, completedLessons: [], totalLessons: totalLessons });
                }
            }
        } else if (item.type === 'ebook') {
            let purchase = await EbookPurchase.findOne({ student: studentId, ebook: item.id, razorpayOrderId: m_payment_id });
            if (!purchase) {
                const ebook = await Ebook.findById(item.id);
                if (ebook) {
                    await EbookPurchase.create({
                        student: studentId,
                        ebook: item.id,
                        amountPaid: ebook.price,
                        status: "PAID",
                        razorpayOrderId: m_payment_id,
                        razorpayPaymentId: "simulated_pf_" + Date.now(),
                        purchasedAt: new Date(),
                    });
                }
            }
        }
    }
    return res.status(200).json({ success: true, message: "Cart items purchased successfully" });
});

export const createReexamPayment = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user._id;

  const exam = await Exam.findOne({ course: courseId });
  if (!exam) throw new ApiError(404, "Exam not found for this course");

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new ApiError(400, "You must be enrolled to take the exam");

  const finalPrice = exam.reExamFee || 500;
  
  const { merchant_id, merchant_key, passphrase, actionUrl } = getPayfastConfig();
  const m_payment_id = `reexam_${courseId}_${studentId}_${Date.now()}`;

  const nameParts = (req.user.name || 'Student').trim().split(' ');
  const payload = {
    merchant_id,
    merchant_key,
    return_url: `${process.env.CLIENT_URL}/payment-success?type=reexam&id=${courseId}&m_payment_id=${m_payment_id}`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard/exams`,
    notify_url: `${process.env.SERVER_URL}/api/payments/payfast-itn`,
    name_first: nameParts[0] || 'Student',
    name_last: nameParts.slice(1).join(' ') || '',
    email_address: req.user.email || '',
    m_payment_id,
    amount: finalPrice.toFixed(2),
    item_name: `Re-Exam Fee`,
  };

  payload.signature = generatePayfastSignature(payload, passphrase);

  res.status(200).json({ success: true, payload, actionUrl, m_payment_id });
});

export const verifyReexamPaymentSimulated = asyncHandler(async (req, res) => {
  if (process.env.SIMULATE_PAYMENT !== "true") {
      throw new ApiError(400, "Simulated payments are disabled");
  }
  const { courseId, m_payment_id } = req.body;
  const studentId = req.user._id;

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (enrollment) {
      enrollment.reexamPaid = true;
      await enrollment.save();
      const user = await User.findById(studentId);
      if (user) {
         sendReExamReceiptEmail(user.email, user.name);
      }
  }

  return res.status(200).json({ success: true, message: "Re-exam payment simulated successfully" });
});


export const payfastItnHandler = asyncHandler(async (req, res) => {
    // Payfast sends a POST request here
    const pfData = req.body;
    const { passphrase } = getPayfastConfig();
    
    // 1. Verify signature
    let pfParamString = "";
    for (let key in pfData) {
        if (pfData.hasOwnProperty(key) && key !== "signature") {
            pfParamString += `${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
        }
    }
    let getString = pfParamString.slice(0, -1);
    if (passphrase) {
        getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    }
    const signature = crypto.createHash("md5").update(getString).digest("hex");

    if (signature !== pfData.signature) {
        console.error("ITN Signature mismatch");
        return res.status(400).send("Signature mismatch");
    }

    // 2. Process based on m_payment_id
    if (pfData.payment_status === "COMPLETE") {
        const m_payment_id = pfData.m_payment_id;
        
        // This is where real DB updates happen. 
        // We parse m_payment_id to know what was bought.
        // e.g. course_COURSEID_STUDENTID_TIMESTAMP
        const parts = m_payment_id.split('_');
        const type = parts[0];

        if (type === 'course') {
            const courseId = parts[1];
            const studentId = parts[2];
            let enrollment = await Enrollment.findOne({ razorpayOrderId: m_payment_id });
            if (!enrollment) {
                const course = await Course.findById(courseId);
                if (course) {
                    await Enrollment.create({
                        student: studentId,
                        course: courseId,
                        enrolledAt: new Date(),
                        status: "ACTIVE",
                        razorpayOrderId: m_payment_id,
                        razorpayPaymentId: pfData.pf_payment_id,
                        amountPaid: parseFloat(pfData.amount_gross), 
                    });
                    await Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1, totalRevenue: course.price }});
                    const totalLessons = (course.modules || []).reduce((acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0), 0);
                    await Progress.create({ student: studentId, course: courseId, completedLessons: [], totalLessons: totalLessons });
                    const user = await User.findById(studentId);
                    if (user) sendPurchaseInvoiceEmail(user.email, user.name, { itemName: course.title, amount: parseFloat(pfData.amount_gross) });
                }
            }
        } else if (type === 'ebook') {
            const ebookId = parts[1];
            const studentId = parts[2];
            let purchase = await EbookPurchase.findOne({ razorpayOrderId: m_payment_id });
            if (!purchase) {
                await EbookPurchase.create({
                    student: studentId,
                    ebook: ebookId,
                    amountPaid: parseFloat(pfData.amount_gross),
                    status: "PAID",
                    razorpayOrderId: m_payment_id,
                    razorpayPaymentId: pfData.pf_payment_id,
                    purchasedAt: new Date(),
                });
                const user = await User.findById(studentId);
                const ebook = await Ebook.findById(ebookId);
                if (user && ebook) sendPurchaseInvoiceEmail(user.email, user.name, { itemName: ebook.title, amount: parseFloat(pfData.amount_gross) });
            }
        } else if (type === 'reexam') {
            const courseId = parts[1];
            const studentId = parts[2];
            const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
            if (enrollment) {
                enrollment.reexamPaid = true;
                await enrollment.save();
                const user = await User.findById(studentId);
                if (user) sendReExamReceiptEmail(user.email, user.name);
            }
        } else if (type === 'cart') {
            const order = await Order.findOne({ m_payment_id });
            if (order && order.status !== "COMPLETED") {
                const studentId = order.student;
                for (const item of order.items) {
                    if (item.type === 'course') {
                        let enrollment = await Enrollment.findOne({ student: studentId, course: item.id });
                        if (!enrollment) {
                            const course = await Course.findById(item.id);
                            if (course) {
                                await Enrollment.create({
                                    student: studentId,
                                    course: item.id,
                                    enrolledAt: new Date(),
                                    status: "ACTIVE",
                                    razorpayOrderId: m_payment_id,
                                    razorpayPaymentId: pfData.pf_payment_id,
                                    amountPaid: item.price || 0, 
                                });
                                await Course.findByIdAndUpdate(item.id, { $inc: { totalEnrollments: 1, totalRevenue: item.price || 0 }});
                                const totalLessons = (course.modules || []).reduce((acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0), 0);
                                await Progress.create({ student: studentId, course: item.id, completedLessons: [], totalLessons: totalLessons });
                            }
                        }
                    } else if (item.type === 'ebook') {
                        let purchase = await EbookPurchase.findOne({ student: studentId, ebook: item.id });
                        if (!purchase) {
                            await EbookPurchase.create({
                                student: studentId,
                                ebook: item.id,
                                amountPaid: item.price || 0,
                                status: "PAID",
                                razorpayOrderId: m_payment_id,
                                razorpayPaymentId: pfData.pf_payment_id,
                                purchasedAt: new Date(),
                            });
                        }
                    }
                }
                order.status = "COMPLETED";
                await order.save();
                const user = await User.findById(studentId);
                if (user) sendPurchaseInvoiceEmail(user.email, user.name, { itemName: "CRMISA Cart Purchase", amount: parseFloat(pfData.amount_gross) });
            }
        }
    }
    
    res.status(200).send("OK");
});