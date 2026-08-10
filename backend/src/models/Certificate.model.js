import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    issueDate: {
      type: Date,
      default: Date.now,
    },
    completionPercentage: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

// Prevent duplicate certificates for the same student and course
certificateSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Certificate", certificateSchema);