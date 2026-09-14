import express from 'express';
const router = express.Router();
import { getFeeds, createFeed, updateFeed, deleteFeed } from '../controllers/feed.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.get('/', getFeeds);
router.post('/', protect, authorize('admin'), createFeed);
router.put('/:id', protect, authorize('admin'), updateFeed);
router.delete('/:id', protect, authorize('admin'), deleteFeed);

export default router;
