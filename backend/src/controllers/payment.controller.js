import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Progress from "../models/Progress.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private (Student)
export const createCheckoutSession = asyncHandler(async (req, res, next) => {
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

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout/cancel?course_id=${courseId}`,
    client_reference_id: studentId.toString(),
    customer_email: req.user.email,
    metadata: {
      courseId: courseId.toString(),
      studentId: studentId.toString(),
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.subtitle,
            images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
          },
          unit_amount: Math.round(course.price * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    success: true,
    sessionId: session.id,
    url: session.url,
  });
});

// @desc    Verify Checkout Session and Enroll Student
// @route   POST /api/payments/verify-checkout-session
// @access  Private (Student)
export const verifyCheckoutSession = asyncHandler(async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      throw new ApiError(400, "Session ID is required");
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      throw new ApiError(400, "Payment not completed or invalid session");
    }

    const courseId = session.metadata.courseId;
    const studentId = session.metadata.studentId;

    // Make sure it matches the logged in user
    if (studentId !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to verify this session");
    }

    let enrollment = await Enrollment.findOne({ stripeSessionId: sessionId });

    if (!enrollment) {
      const course = await Course.findById(courseId);
      
      let expiresAt = null;
      if (course.validityPeriod) {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + course.validityPeriod);
      }

      // 1. Create Enrollment (handle potential concurrent duplicate requests)
      try {
        enrollment = await Enrollment.create({
          student: studentId,
          course: courseId,
          enrolledAt: new Date(),
          status: "ACTIVE",
          stripeSessionId: sessionId,
          expiresAt: expiresAt,
          amountPaid: session.amount_total ? session.amount_total / 100 : 0,
        });

        // 1.5 Increment Course totalEnrollments and totalRevenue
        await Course.findByIdAndUpdate(courseId, {
          $inc: { 
            totalEnrollments: 1,
            totalRevenue: session.amount_total ? session.amount_total / 100 : 0
          }
        });
      } catch (createErr) {
        // If it's a duplicate key error (11000) for stripeSessionId, it means another request just created it.
        // We can safely ignore and just return success.
        if (createErr.code === 11000) {
          const courseDetails = await Course.findById(courseId).populate('instructor', 'name email');
          const existingEnroll = await Enrollment.findOne({ stripeSessionId: sessionId });
          return res.status(200).json({
            success: true,
            message: "Enrollment already verified",
            courseId,
            course: courseDetails,
            invoice: {
              invoiceNumber: session.payment_intent || sessionId.substring(0, 14),
              orderTime: existingEnroll ? existingEnroll.enrolledAt : new Date(),
              paymentMethod: "Card (Stripe)",
              amountPaid: session.amount_total ? session.amount_total / 100 : 0,
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

    const courseDetails = await Course.findById(courseId).populate('instructor', 'name email');

    res.status(200).json({
      success: true,
      message: "Enrollment verified successfully",
      courseId,
      course: courseDetails,
      invoice: {
        invoiceNumber: session.payment_intent || sessionId.substring(0, 14),
        orderTime: enrollment.enrolledAt,
        paymentMethod: "Card (Stripe)",
        amountPaid: session.amount_total ? session.amount_total / 100 : 0,
      }
    });
  } catch (err) {
    console.error("VERIFY CHECKOUT SESSION ERROR:", err);
    throw err;
  }
});