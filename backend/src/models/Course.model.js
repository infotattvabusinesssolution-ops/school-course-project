import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  videoUrl: {
    type: String,
    default: "",
  },
  videoPublicId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
    default: "",
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  order: {
    type: Number,
    required: true,
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Module title is required"],
    trim: true,
    maxlength: 100,
  },
  order: {
    type: Number,
    required: true,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: 60,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Full Certification",
        "Customs & Compliance",
        "Finance & Costing",
        "Sourcing & Logistics",
        "other",
      ],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["beginner", "intermediate", "advanced", "all"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      enum: ["english", "spanish", "french", "german", "other"],
      default: "english",
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: 0,
      default: 0,
    },
    validityPeriod: {
      type: Number, // duration in months
      default: null, // null means lifetime access
    },
    thumbnailUrl: {
      type: String, // Cloudinary URL
      default: "",
    },
    thumbnailPublicId: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modules: [moduleSchema],
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
