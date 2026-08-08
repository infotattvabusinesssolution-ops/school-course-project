import { Course } from '../models/Course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Create a new course (Draft)
// @route   POST /api/courses
// @access  Private (Admin)
export const createCourse = asyncHandler(async (req, res) => {
  const { title, subtitle, description, category, level, language, price } = req.body;

  if (!title || !description || !category || !level) {
    throw new ApiError(400, 'Please provide all required basic course details');
  }

  const course = await Course.create({
    title,
    subtitle,
    description,
    category,
    level,
    language,
    price: price || 0,
    admin: req.user._id,
    status: 'DRAFT',
  });

  res.status(201).json(new ApiResponse(201, course, 'Course draft created successfully'));
});

// @desc    Get all courses for the admin
// @route   GET /api/courses/admin
// @access  Private (Admin)
export const getAdminCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ admin: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, courses, 'Admin courses fetched successfully'));
});

// @desc    Get course by ID (for editing)
// @route   GET /api/courses/:id
// @access  Private (Admin)
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Check if admin owns the course (or just return since there's only one admin context)
  if (course.admin.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to access this course');
  }

  res.status(200).json(new ApiResponse(200, course, 'Course fetched successfully'));
});

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private (Admin)
export const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (course.admin.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this course');
  }

  course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, course, 'Course updated successfully'));
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (course.admin.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to delete this course');
  }

  // Delete Thumbnail
  if (course.thumbnailPublicId) {
    try {
      await deleteFromCloudinary(course.thumbnailPublicId, 'image');
    } catch (err) {
      console.error('Failed to delete thumbnail from cloudinary', err);
    }
  }

  // Delete all lesson videos
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.videoPublicId) {
        try {
          await deleteFromCloudinary(lesson.videoPublicId, 'video');
        } catch (err) {
          console.error(`Failed to delete video ${lesson.videoPublicId} from cloudinary`, err);
        }
      }
    }
  }

  // Finally delete the course
  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Course deleted successfully'));
});

// @desc    Upload course thumbnail
// @route   POST /api/courses/:id/thumbnail
// @access  Private (Admin)
export const uploadCourseThumbnail = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (course.admin.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this course');
  }

  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  const thumbnailLocalPath = req.file.path;
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, 'Error uploading thumbnail to Cloudinary');
  }

  // Delete old thumbnail from Cloudinary if it exists
  if (course.thumbnailPublicId) {
    await deleteFromCloudinary(course.thumbnailPublicId);
  }

  course.thumbnailUrl = thumbnail.secure_url;
  course.thumbnailPublicId = thumbnail.public_id;
  await course.save();

  res.status(200).json(new ApiResponse(200, course, 'Thumbnail uploaded successfully'));
});

// @desc    Upload course video (general utility for course videos)
// @route   POST /api/courses/upload-video
// @access  Private (Admin)
export const uploadCourseVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a video file');
  }

  const videoLocalPath = req.file.path;
  // This will take longer for videos, so we await it
  const video = await uploadOnCloudinary(videoLocalPath);

  if (!video) {
    throw new ApiError(500, 'Error uploading video to Cloudinary');
  }

  res.status(200).json(new ApiResponse(200, {
    videoUrl: video.secure_url,
    videoPublicId: video.public_id,
  }, 'Video uploaded successfully'));
});

// @desc    Get all published courses (Public)
// @route   GET /api/public/courses
// @access  Public
export const getPublishedCourses = asyncHandler(async (req, res) => {
  const { category, level, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  // Build query
  const query = { status: 'PUBLISHED' };

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  // Build sort options
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { averageRating: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const totalCourses = await Course.countDocuments(query);
  const totalPages = Math.ceil(totalCourses / Number(limit));

  const courses = await Course.find(query)
    .populate('admin', 'name')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, { courses, totalPages, currentPage: Number(page), totalCourses }, 'Published courses fetched successfully'));
});

// @desc    Get public course details
// @route   GET /api/public/courses/:id
// @access  Public
export const getPublicCourseDetails = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, status: 'PUBLISHED' })
    .populate('admin', 'name email');

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // For public view, we don't send private video URLs or sensitive data.
  // In a real app, we would exclude modules/lessons video content URLs.

  res.status(200).json(new ApiResponse(200, course, 'Course details fetched successfully'));
});