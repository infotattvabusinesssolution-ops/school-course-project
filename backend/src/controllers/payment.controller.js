import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/Course.model.js";
import Ebook from "../models/Ebook.model.js";
import Enrollment from "../models/Enrollment.model.js";
import EbookPurchase from "../models/EbookPurchase.model.js";
import Progress from "../models/Progress.model.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "mock_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_key_secret",
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-razorpay-order
// @access  Private (Student)
export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  const studentId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Check if already actively enrolled
  const existingEnrollments = await Enrollment.find({
    student: studentId,
    course: courseId,
  }).sort({ enrolledAt: -1 });

  const latestEnrollment = existingEnrollments[0];
  if (latestEnrollment && latestEnrollment.status !== "COMPLETED") {
    throw new ApiError(400, "You are already actively enrolled in this course");
  }

  // Create Razorpay Order
  const amount = Math.round(course.price * 100); // Amount in smallest currency unit (paise for INR)
  
  const options = {
    amount,
    currency: "INR", // Change to your preferred currency if needed
    receipt: `rcpt_${courseId.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
    notes: {
      courseId: courseId.toString(),
      studentId: studentId.toString(),
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw new ApiError(500, "Failed to create payment order");
  }
});

// @desc    Verify Razorpay Payment and Enroll Student
// @route   POST /api/payments/verify-razorpay-payment
// @access  Private (Student)
export const verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const studentId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      throw new ApiError(400, "Missing required payment parameters");
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_key_secret")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(400, "Invalid payment signature");
    }

    // Double-check if the payment is already recorded
    let enrollment = await Enrollment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!enrollment) {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new ApiError(404, "Course not found");
      }
      
      let expiresAt = null;
      if (course.validityPeriod) {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + course.validityPeriod);
      }

      // 1. Create Enrollment
      try {
        enrollment = await Enrollment.create({
          student: studentId,
          course: courseId,
          enrolledAt: new Date(),
          status: "ACTIVE",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          expiresAt: expiresAt,
          amountPaid: course.price, 
        });

        // 1.5 Increment Course totalEnrollments and totalRevenue
        await Course.findByIdAndUpdate(courseId, {
          $inc: { 
            totalEnrollments: 1,
            totalRevenue: course.price
          }
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          // Already verified in concurrent request
          const courseDetails = await Course.findById(courseId).populate('admin', 'name email');
          return res.status(200).json({
            success: true,
            message: "Enrollment already verified",
            courseId,
            course: courseDetails,
            invoice: {
              invoiceNumber: razorpay_payment_id,
              orderTime: new Date(),
              paymentMethod: "Razorpay",
              amountPaid: course.price,
            }
          });
        }
        throw createErr;
      }

      // 2. Initialize Progress Document
      const totalLessons = course.modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
      );

      await Progress.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        totalLessons: totalLessons,
      });
    }

    const courseDetails = await Course.findById(courseId).populate('admin', 'name email');

    res.status(200).json({
      success: true,
      message: "Enrollment verified successfully",
      courseId,
      course: courseDetails,
      invoice: {
        invoiceNumber: razorpay_payment_id,
        orderTime: enrollment.enrolledAt,
        paymentMethod: "Razorpay",
        amountPaid: enrollment.amountPaid,
      }
    });
  } catch (err) {
    console.error("VERIFY RAZORPAY PAYMENT ERROR:", err);
    throw err;
  }
});

// @desc    Create Razorpay Order for Ebook
// @route   POST /api/payments/create-ebook-order
// @access  Private (Student)
export const createEbookOrder = asyncHandler(async (req, res) => {
  const { ebookId } = req.body;
  const studentId = req.user._id;

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) {
    throw new ApiError(404, "Ebook not found");
  }

  // Check if already purchased
  const existingPurchase = await EbookPurchase.findOne({
    student: studentId,
    ebook: ebookId,
    status: "PAID",
  });

  if (existingPurchase) {
    throw new ApiError(400, "You have already purchased this E-book");
  }

  const amount = Math.round(ebook.price * 100);

  const options = {
    amount,
    currency: "INR",
    receipt: `ebk_${ebookId.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
    notes: {
      ebookId: ebookId.toString(),
      studentId: studentId.toString(),
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "mock_key_id",
    });
  } catch (error) {
    console.error("Razorpay Ebook Order Error:", error);
    throw new ApiError(500, "Failed to create payment order for ebook");
  }
});

// @desc    Verify Razorpay Payment and Record Ebook Purchase
// @route   POST /api/payments/verify-ebook-payment
// @access  Private (Student)
export const verifyEbookPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ebookId } = req.body;
  const studentId = req.user._id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ebookId) {
    throw new ApiError(400, "Missing required payment parameters");
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_key_secret")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  let purchase = await EbookPurchase.findOne({ razorpayOrderId: razorpay_order_id });

  if (!purchase) {
    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      throw new ApiError(404, "Ebook not found");
    }

    purchase = await EbookPurchase.create({
      student: studentId,
      ebook: ebookId,
      amountPaid: ebook.price,
      status: "PAID",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      purchasedAt: new Date(),
    });
  }

  const populatedPurchase = await EbookPurchase.findById(purchase._id)
    .populate("ebook")
    .populate("student", "name email");

  return res.status(200).json({
    success: true,
    message: "Ebook purchased successfully",
    purchase: populatedPurchase,
  });
});