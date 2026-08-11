import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: (arr) => arr.length === 4,
      message: "Each question must have exactly 4 options",
    },
    required: true,
  },
  correctAnswerIndex: {
    type: Number, // 0, 1, 2, or 3
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    trim: true,
    default: "",
  },
});

const examSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true, // One exam per course
      index: true,
    },
    questions: [questionSchema],
    passingPercentage: {
      type: Number,
      default: 40,
      min: 1,
      max: 100,
    },
    timeLimitMinutes: {
      type: Number,
      default: 0, // 0 = no limit
      min: 0,
    },
    shuffleQuestions: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Exam", examSchema);
