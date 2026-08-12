import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blog.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createBlog);
router.put('/:id', protect, authorize('ADMIN'), updateBlog);
router.delete('/:id', protect, authorize('ADMIN'), deleteBlog);

export default router;
