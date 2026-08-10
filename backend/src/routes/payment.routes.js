import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  createRazorpayOrder,
  verifyRazorpayPayment,
  createEbookOrder,
  verifyEbookPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-razorpay-payment", protect, verifyRazorpayPayment);
router.post("/create-ebook-order", protect, createEbookOrder);
router.post("/verify-ebook-payment", protect, verifyEbookPayment);

export default router;