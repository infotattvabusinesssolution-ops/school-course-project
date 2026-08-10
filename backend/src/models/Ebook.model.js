import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 499,
    },
    coverTitle: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop",
    },
    coverImagePublicId: {
      type: String,
    },
    samplePdfUrl: {
      type: String,
    },
    samplePdfPublicId: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    pdfPublicId: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: "Trade & Logistics",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Ebook", ebookSchema);
