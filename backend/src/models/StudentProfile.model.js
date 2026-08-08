import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1583247012/user-placeholder.png",
    },
    learningInterests: {
      type: [String],
      default: [],
    },
    preferredLanguage: {
      type: String,
      default: "English",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);