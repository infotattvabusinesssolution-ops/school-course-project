import User from '../models/User.model.js';
import StudentProfile from '../models/StudentProfile.model.js';
import generateToken from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendAccountWelcomeEmail } from "../utils/email.js";
import crypto from 'crypto';

import { uploadImageOnCloudinary } from '../utils/cloudinary.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role && role === 'ADMIN') {
    throw new ApiError(403, 'Admin registration is not allowed via public endpoint');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  let avatarUrl = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128";
  let avatarPublicId = "";

  if (req.file) {
    const avatarUpload = await uploadImageOnCloudinary(req.file.path);
    if (avatarUpload) {
      avatarUrl = avatarUpload.secure_url;
      avatarPublicId = avatarUpload.public_id;
    }
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password, // Pre-save hook hashes it
    role: role || 'STUDENT',
    avatar: avatarUrl,
    avatarPublicId: avatarPublicId,
  });

  if (user) {
    // Create Profile
    if (user.role === 'STUDENT') {
      await StudentProfile.create({ userId: user._id });
    }

    try {
      sendAccountWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.error(e);
    }

    const token = generateToken(res, user._id);

    res.status(201).json(new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    }, 'User registered successfully'));
  } else {
    throw new ApiError(400, 'Invalid user data');
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status === 'BLOCKED') {
    throw new ApiError(403, 'Account is blocked');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(res, user._id);

  res.status(200).json(new ApiResponse(200, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token,
  }, 'User logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(0),
  });
  
  res.status(200).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user retrieved'));
});