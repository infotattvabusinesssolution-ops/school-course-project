import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createExam,
  updateExam,
  deleteExam,
  getExamForAdmin,
  getExamForStudent,
  submitExam,
  getMyAttempts,
  getExamStatus,
  getCourseExamStats,
} from "../controllers/exam.controller.js";

const router = express.Router();

// All routes require auth
router.use(protect);

// ─── STUDENT ROUTES ───────────────────────────────────────────────────────────
// Get exam status (has exam? passed? attempt count? certificate?)
router.get("/status/:courseId", getExamStatus);

// Get exam questions (no answers) — starts an attempt
router.get("/take/:courseId", getExamForStudent);

// Submit answers
router.post("/submit", submitExam);

// Get own past attempts
router.get("/my-attempts/:courseId", getMyAttempts);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
router.use(authorize("ADMIN"));

// Get full exam with correct answers
router.get("/admin/course/:courseId", getExamForAdmin);

// Get exam stats (attempts, pass rate, per-student breakdown)
router.get("/admin/stats/:courseId", getCourseExamStats);

// Create / update / delete exam
router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
