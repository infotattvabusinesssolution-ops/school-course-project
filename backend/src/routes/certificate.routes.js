import { Router } from "express";
import {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
  verifyStudentCertificate,
} from "../controllers/certificate.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public route for public verification page / QR scan
router.get("/verify/:certificateId", verifyCertificate);

// Protected routes
router.use(protect);
router.post("/issue", issueCertificate);
router.get("/my-certificates", getMyCertificates);
router.get("/verify-student/:courseId", verifyStudentCertificate);

export default router;