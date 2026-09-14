import mongoose from "mongoose";
import { Course } from "./Course.model.js";

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent a student from reviewing the same course multiple times
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Static method to calculate average rating and update Course
reviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount,
      });
    } else {
      await Course.findByIdAndUpdate(courseId, {
        averageRating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error("Error updating course average rating: ", err);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.course);
});

// Call getAverageRating after delete
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.course);
  }
});


export default mongoose.model("Review", reviewSchema);