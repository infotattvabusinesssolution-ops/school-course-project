import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  createRazorpayOrder,
  verifyRazorpayPayment 
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-razorpay-order", protect, createRazorpayOrder);
router.post("/verify-razorpay-payment", protect, verifyRazorpayPayment);

export default router;