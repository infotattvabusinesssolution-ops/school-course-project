import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  verifyCheckoutSession,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("STUDENT")); // Only students can buy courses

router.post("/create-checkout-session", createCheckoutSession);
router.post("/verify-checkout-session", verifyCheckoutSession);

export default router;