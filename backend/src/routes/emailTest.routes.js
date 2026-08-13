import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { sendAllTestEmails } from "../controllers/emailTest.controller.js";

const router = Router();

router.post("/send-all", protect, authorize("ADMIN"), sendAllTestEmails);

export default router;
