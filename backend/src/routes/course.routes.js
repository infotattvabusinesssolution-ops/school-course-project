import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createCourse,
  getAdminCourses,
  getCourseById,
  updateCourse,
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseImage,
  deleteCourse,
} from '../controllers/course.controller.js';

const router = express.Router();

// Admin route (must be before /:id)
router.get('/admin', protect, authorize('ADMIN'), getAdminCourses);

// Public / Student accessible route
router.get('/:id', protect, getCourseById);

// Admin only routes (for the rest below)
router.use(protect);
router.use(authorize('ADMIN'));

// Course CRUD
router.route('/')
  .post(createCourse);

router.post('/upload-video', upload.single('video'), uploadCourseVideo);
router.post('/upload-image', upload.single('image'), uploadCourseImage);

router.route('/:id')
  .put(updateCourse)
  .delete(deleteCourse);

router.route('/:id/thumbnail')
  .post(upload.single('thumbnail'), uploadCourseThumbnail);

export default router;