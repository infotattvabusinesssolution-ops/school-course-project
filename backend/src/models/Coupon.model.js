import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required (percentage or fixed)']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  maxUses: {
    type: Number,
    default: 100
  },
  currentUses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Check if coupon is currently valid
couponSchema.methods.isValid = function() {
  return this.isActive && 
         this.currentUses < this.maxUses && 
         new Date() <= this.expiryDate;
};

export default mongoose.model('Coupon', couponSchema);
