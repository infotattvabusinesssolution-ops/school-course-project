import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  createPayfastOrder,
  verifyPayfastPaymentSimulated,
  createEbookOrder,
  verifyEbookPaymentSimulated,
  createCartOrder,
  verifyCartPaymentSimulated,
  createReexamPayment,
  verifyReexamPaymentSimulated,
  payfastItnHandler
} from "../controllers/payment.controller.js";

const router = express.Router();

// Order creation
router.post("/create-payfast-order", protect, createPayfastOrder);
router.post("/create-ebook-order", protect, createEbookOrder);
router.post("/create-cart-order", protect, createCartOrder);
router.post("/create-reexam-payment", protect, createReexamPayment);

// Simulated verification (for VITE_SIMULATE_PAYMENT=true)
router.post("/verify-payfast-payment", protect, verifyPayfastPaymentSimulated);
router.post("/verify-ebook-payment", protect, verifyEbookPaymentSimulated);
router.post("/verify-cart-payment", protect, verifyCartPaymentSimulated);
router.post("/verify-reexam-payment", protect, verifyReexamPaymentSimulated);

// Real ITN Webhook
router.post("/payfast-itn", payfastItnHandler);

export default router;