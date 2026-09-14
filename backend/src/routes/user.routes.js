import express from 'express';
import { updateAvatar, resetPassword, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { memoryUpload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.put('/avatar', protect, memoryUpload.single('profilePhoto'), updateAvatar);
router.put('/reset-password', protect, resetPassword);
router.put('/profile', protect, updateProfile);

export default router;
