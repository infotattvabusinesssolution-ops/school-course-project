import express from 'express';
import { 
  getAllReferrals, 
  createReferral, 
  updateReferral, 
  deleteReferral, 
  validateReferral 
} from '../controllers/referral.controller.js';

const router = express.Router();

// Public routes
router.post('/validate', validateReferral);

// Admin routes (ideally should be protected with auth middleware)
router.get('/', getAllReferrals);
router.post('/', createReferral);
router.put('/:id', updateReferral);
router.delete('/:id', deleteReferral);

export default router;
