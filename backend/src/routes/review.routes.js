import express from "express";
import { addReview, getCourseReviews, getMyReview, getAllReviewsAdmin, deleteReviewAdmin } from "../controllers/review.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/course/:courseId", getCourseReviews);

// Protected routes for students
router.use(protect);
router.get("/course/:courseId/me", getMyReview);
router.post("/course/:courseId", addReview);

// Admin routes
router.get("/admin/all", authorize('ADMIN'), getAllReviewsAdmin);
router.delete("/admin/:id", authorize('ADMIN'), deleteReviewAdmin);

export default router;