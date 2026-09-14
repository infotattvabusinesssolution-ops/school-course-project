import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  submitDoubts,
  getStudentDoubts,
  getInstructorDoubts,
  answerDoubt,
  submitReview,
  getCourseReviews,
  getInstructorReviews
} from "../controllers/interaction.controller.js";

const router = express.Router();

// ----- DOUBTS ROUTES -----
router.post("/doubts/bulk", protect, authorize("STUDENT"), submitDoubts);
router.get("/doubts/student", protect, authorize("STUDENT"), getStudentDoubts);
router.get("/doubts/instructor", protect, authorize("INSTRUCTOR"), getInstructorDoubts);
router.put("/doubts/:doubtId/answer", protect, authorize("INSTRUCTOR"), answerDoubt);

// ----- REVIEWS ROUTES -----
router.post("/reviews", protect, authorize("STUDENT"), submitReview);
router.get("/reviews/course/:courseId", getCourseReviews); // Public access to view reviews
router.get("/reviews/instructor", protect, authorize("INSTRUCTOR"), getInstructorReviews);

export default router;
