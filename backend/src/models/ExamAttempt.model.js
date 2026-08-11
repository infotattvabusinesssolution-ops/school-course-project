import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
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
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    // The order questions were presented (may be shuffled)
    questionOrder: {
      type: [Number],
      default: [],
    },
    // Student's submitted answers: index in questionOrder → selected option index
    answers: [
      {
        questionIndex: { type: Number, required: true }, // original question index in exam.questions
        selectedOption: { type: Number, required: true }, // 0-3
      },
    ],
    score: {
      type: Number,
      default: 0, // number of correct answers
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0, // (score / totalQuestions) * 100
    },
    passed: {
      type: Boolean,
      default: false,
    },
    attemptNumber: {
      type: Number,
      default: 1, // 1 = first attempt, increments per student per course
    },
    tabSwitchCount: {
      type: Number,
      default: 0, // number of times student switched tabs/window during exam
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0, // how long student spent on the exam
    },
  },
  { timestamps: true }
);

// Index for efficient lookup
examAttemptSchema.index({ student: 1, course: 1 });

export default mongoose.model("ExamAttempt", examAttemptSchema);
