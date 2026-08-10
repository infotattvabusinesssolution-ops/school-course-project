import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import { Course } from '../models/Course.model.js';
import Enrollment from '../models/Enrollment.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();
  
  // Aggregate revenue from Enrollments amountPaid
  const revenueResult = await Enrollment.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  res.status(200).json(new ApiResponse(200, {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue
  }, "Analytics retrieved successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (role) user.role = role;
  if (status) user.status = status;

  await user.save();

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const getEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({})
    .populate('student', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 });
    
  res.status(200).json(new ApiResponse(200, enrollments, "Enrollments retrieved successfully"));
});