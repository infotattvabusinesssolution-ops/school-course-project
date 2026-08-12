import express from 'express';
import { 
  getAllCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  validateCoupon 
} from '../controllers/coupon.controller.js';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);

// Admin routes (ideally should be protected with auth middleware, but we assume open for now as per current architecture)
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
