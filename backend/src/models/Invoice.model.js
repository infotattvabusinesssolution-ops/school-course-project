import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type of purchase
    type: {
      type: String,
      enum: ["course", "ebook", "cart", "reexam"],
      required: true,
    },
    // Line items
    items: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["course", "ebook", "reexam"] },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        _id: false,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "ZAR" },
    // Reference to what was bought
    m_payment_id: { type: String },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED"],
      default: "PAID",
    },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", InvoiceSchema);
