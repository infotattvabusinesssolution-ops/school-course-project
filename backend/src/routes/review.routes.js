import express from "express";
import { addReview, getCourseReviews, getMyReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route to get all reviews for a course
router.get("/course/:courseId", getCourseReviews);

// Protected routes
router.use(protect);

// Get logged-in user's review for a course
router.get("/course/:courseId/me", getMyReview);

// Add or update a review
router.post("/course/:courseId", addReview);

export default router;