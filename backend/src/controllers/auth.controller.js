import User from '../models/User.model.js';
import StudentProfile from '../models/StudentProfile.model.js';
import generateToken from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';
import { auth } from '../config/firebase-admin.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role && role === 'ADMIN') {
    throw new ApiError(403, 'Admin registration is not allowed via public endpoint');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password, // Pre-save hook hashes it
    role: role || 'STUDENT',
  });

  if (user) {
    // Create Profile
    if (user.role === 'STUDENT') {
      await StudentProfile.create({ userId: user._id });
    }

    const token = generateToken(res, user._id);

    res.status(201).json(new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    token,
  }, 'User logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  
  res.status(200).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user retrieved'));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    throw new ApiError(400, 'Firebase ID token is required');
  }

  if (!auth) {
    throw new ApiError(500, 'Firebase Admin is not configured on the server');
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired Firebase ID token');
  }

  const { email, name, picture: photoUrl } = decodedToken;

  let user = await User.findOne({ email });

  if (user) {
    if (user.status === 'BLOCKED') {
      throw new ApiError(403, 'Account is blocked');
    }
    
    // User exists, log them in
    const token = generateToken(res, user._id);
    
    res.status(200).json(new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    }, 'User logged in successfully'));
  } else {
    // User doesn't exist, create them
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const selectedRole = role || 'STUDENT';

    if (selectedRole === 'ADMIN') {
      throw new ApiError(403, 'Admin registration is not allowed via public endpoint');
    }
    
    try {
      user = await User.create({
        name: name || 'Google User',
        email,
        passwordHash: randomPassword,
        role: selectedRole,
      });
    } catch (err) {
      console.error("User.create Error:", err);
      throw new ApiError(500, err.message || "Failed to create user");
    }

    if (user) {
      if (user.role === 'STUDENT') {
        await StudentProfile.create({ userId: user._id });
      }

      const token = generateToken(res, user._id);

      res.status(201).json(new ApiResponse(201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      }, 'User registered successfully via Google'));
    } else {
      throw new ApiError(400, 'Invalid user data');
    }
  }
});