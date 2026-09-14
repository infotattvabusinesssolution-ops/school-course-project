import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  subscribe,
  getAllSubscribers,
  removeSubscriber
} from '../controllers/newsletter.controller.js';

const router = express.Router();

// Public route
router.post('/subscribe', subscribe);

// Admin routes
router.get('/', protect, authorize('ADMIN'), getAllSubscribers);
router.delete('/:id', protect, authorize('ADMIN'), removeSubscriber);

export default router;
