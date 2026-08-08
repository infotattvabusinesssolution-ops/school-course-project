import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getStudentDashboard, getEnrolledCourses, getCoursePlayerDetails, markLessonCompleted, syncLessonProgress } from "../controllers/student.controller.js";

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize("STUDENT"));

router.get("/dashboard", getStudentDashboard);
router.get("/courses", getEnrolledCourses);
router.get("/courses/:courseId/player", getCoursePlayerDetails);
router.post("/courses/:courseId/lessons/:lessonId/complete", markLessonCompleted);
router.put("/courses/:courseId/lessons/:lessonId/progress", syncLessonProgress);

export default router;