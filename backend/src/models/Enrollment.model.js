import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE",
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    stripeSessionId: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments for the exact same checkout session
enrollmentSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Enrollment", enrollmentSchema);