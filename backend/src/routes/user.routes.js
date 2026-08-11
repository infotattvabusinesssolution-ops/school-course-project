import express from 'express';
import { updateAvatar, resetPassword } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.put('/avatar', protect, upload.single('profilePhoto'), updateAvatar);
router.put('/reset-password', protect, resetPassword);

export default router;
