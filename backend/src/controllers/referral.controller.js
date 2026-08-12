import Referral from '../models/Referral.model.js';

// Get all referrals (Admin)
export const getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: referrals });
  } catch (error) {
    next(error);
  }
};

// Create a referral code (Admin)
export const createReferral = async (req, res, next) => {
  try {
    const referral = await Referral.create(req.body);
    res.status(201).json({ success: true, data: referral });
  } catch (error) {
    next(error);
  }
};

// Update a referral (Admin)
export const updateReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }
    res.status(200).json({ success: true, data: referral });
  } catch (error) {
    next(error);
  }
};

// Delete a referral (Admin)
export const deleteReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }
    res.status(200).json({ success: true, message: 'Referral deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Validate a referral code (Public/User)
export const validateReferral = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Referral code is required' });
    }

    const referral = await Referral.findOne({ referralCode: code.toUpperCase() });
    
    if (!referral) {
      return res.status(404).json({ success: false, message: 'Invalid referral code' });
    }

    if (!referral.isValid()) {
      return res.status(400).json({ success: false, message: 'Referral code is inactive' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Referral code is valid',
      data: {
        discountPercentage: referral.userDiscountPercentage,
        influencerName: referral.influencerName
      }
    });
  } catch (error) {
    next(error);
  }
};
