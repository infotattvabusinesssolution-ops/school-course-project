import mongoose from "mongoose";

const ebookPurchaseSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ebook",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "FAILED", "REFUNDED"],
      default: "PAID",
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

ebookPurchaseSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });

export default mongoose.model("EbookPurchase", ebookPurchaseSchema);
