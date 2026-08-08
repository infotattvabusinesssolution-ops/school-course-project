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
  deleteCourse,
} from '../controllers/course.controller.js';

const router = express.Router();

// Public / Student accessible route
router.get('/:id', protect, getCourseById);

// Admin only routes
router.use(protect);
router.use(authorize('ADMIN'));

// Course CRUD
router.route('/')
  .post(createCourse);

router.route('/admin')
  .get(getAdminCourses);

router.post('/upload-video', upload.single('video'), uploadCourseVideo);

router.route('/:id')
  .put(updateCourse)
  .delete(deleteCourse);

router.route('/:id/thumbnail')
  .post(upload.single('thumbnail'), uploadCourseThumbnail);

export default router;