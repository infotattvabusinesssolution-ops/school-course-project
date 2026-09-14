import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadBufferOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import sharp from 'sharp';

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a valid image file");
  }

  const user = await User.findById(req.user._id);

  // Compress the image buffer using sharp
  const compressedBuffer = await sharp(req.file.buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Upload compressed buffer to Cloudinary
  const avatarUpload = await uploadBufferOnCloudinary(compressedBuffer);
  
  if (!avatarUpload) {
    throw new ApiError(500, "Failed to upload avatar to cloud storage");
  }

  // Delete old avatar if it exists and isn't the default placeholder
  if (user.avatarPublicId) {
    await deleteFromCloudinary(user.avatarPublicId);
  }

  user.avatar = avatarUpload.secure_url;
  user.avatarPublicId = avatarUpload.public_id;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, { avatar: user.avatar }, "Avatar updated successfully")
  );
});

// @desc    Reset password (while logged in)
// @route   PUT /api/users/reset-password
// @access  Private
export const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.user._id).select("+passwordHash");

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Incorrect old password");
  }

  user.passwordHash = newPassword;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, {}, "Password updated successfully")
  );
});

// @desc    Update profile name and phone
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Name is required");
  }

  const user = await User.findById(req.user._id);
  user.name = name.trim();
  user.phone = (phone || "").trim();
  await user.save();

  res.status(200).json(
    new ApiResponse(200, { name: user.name, phone: user.phone }, "Profile updated successfully")
  );
});
