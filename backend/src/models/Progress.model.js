import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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
    lessonProgress: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
        },
        watchedSeconds: {
          type: Number,
          default: 0,
        },
        totalSeconds: {
          type: Number,
          default: 0,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to calculate completion percentage dynamically based on tracked seconds and completed status
progressSchema.virtual("completionPercentage").get(function () {
  if (!this.lessonProgress || this.lessonProgress.length === 0) return 0;
  
  let totalWatched = 0;
  let totalDuration = 0;

  this.lessonProgress.forEach(lp => {
    totalDuration += (lp.totalSeconds || 0);
    // If it's explicitly marked complete, count the full duration as watched.
    // Otherwise count the actual watched seconds.
    totalWatched += lp.isCompleted ? (lp.totalSeconds || 0) : (lp.watchedSeconds || 0);
  });

  if (totalDuration === 0) return 0;
  
  // Cap at 100% just in case
  const percentage = Math.round((totalWatched / totalDuration) * 100);
  return Math.min(percentage, 100);
});

export default mongoose.model("Progress", progressSchema);