import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["WATCHED_VIDEO", "COMPLETED_LESSON", "ENROLLED_COURSE", "COMPLETED_COURSE", "EARNED_CERTIFICATE", "POSTED_DISCUSSION"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);