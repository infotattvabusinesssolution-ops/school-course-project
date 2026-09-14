import express from 'express';
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getActiveTestimonials
} from '../controllers/testimonial.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public route for landing page
router.get('/active', getActiveTestimonials);

// Admin routes
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getAllTestimonials);
router.post('/', upload.single('photo'), createTestimonial);
router.put('/:id', upload.single('photo'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
