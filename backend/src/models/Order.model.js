import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["course", "ebook"],
    required: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    m_payment_id: {
      type: String,
      required: true,
      unique: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);