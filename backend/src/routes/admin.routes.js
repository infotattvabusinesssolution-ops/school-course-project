import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getAnalytics, getUsers, updateUser, getEnrollments } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/enrollments', getEnrollments);

export default router;