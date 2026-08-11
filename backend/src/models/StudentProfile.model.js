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
      default: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128",
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