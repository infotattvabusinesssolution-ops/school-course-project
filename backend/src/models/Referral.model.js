import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  influencerName: {
    type: String,
    required: [true, 'Influencer name is required'],
    trim: true,
  },
  referralCode: {
    type: String,
    required: [true, 'Referral code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  userDiscountPercentage: {
    type: Number,
    required: [true, 'User discount percentage is required'],
    min: 0,
    max: 100
  },
  totalUses: {
    type: Number,
    default: 0
  },
  totalRevenueGenerated: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Check if referral code is currently valid
referralSchema.methods.isValid = function() {
  return this.isActive;
};

export default mongoose.model('Referral', referralSchema);
