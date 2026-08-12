import mongoose from "mongoose";

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
    defaultThumbnailUrl: {
      type: String, // Local folder fallback
      default: "",
    },
    thumbnailPublicId: {
      type: String,
    },
    bannerUrl: {
      type: String, // Horizontal 16:9 Image URL
      default: "",
    },
    defaultBannerUrl: {
      type: String, // Local folder fallback
      default: "",
    },
    bannerPublicId: {
      type: String,
    },
    pdfGuideUrl: {
      type: String,
      default: "",
    },
    pdfGuidePublicId: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    videoPublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
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
