import { asyncHandler } from "../utils/asyncHandler.js";
import Enrollment from "../models/Enrollment.model.js";
import Progress from "../models/Progress.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import { Course } from "../models/Course.model.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Private (Student only)
export const getStudentDashboard = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const totalEnrolled = await Enrollment.countDocuments({ 
    student: studentId,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
  });
  const totalCompleted = await Enrollment.countDocuments({ 
    student: studentId, 
    status: "COMPLETED"
  });
  
  // Assuming a Certificate model or logic exists, just mocking count for now
  // Or we can just use totalCompleted if every completion = certificate
  const certificatesEarned = totalCompleted; 

  // 2. Get active enrolled courses (with course details populated)
  // We'll limit to 3 for "Continue Learning" section
  const enrollments = await Enrollment.find({ 
      student: studentId,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
    })
    .sort({ lastAccessed: -1 })
    .limit(3)
    .populate({
      path: "course",
      select: "title subtitle thumbnailUrl modules category",
    });

  const continueLearning = enrollments
    .filter(enrollment => enrollment && enrollment.course && enrollment.course._id)
    .map((enrollment) => {
      return {
        _id: enrollment._id,
        courseId: enrollment.course._id,
        title: enrollment.course.title,
        thumbnailUrl: enrollment.course.thumbnailUrl,
        category: enrollment.course.category,
        completionPercentage: enrollment.completionPercentage,
        lastAccessed: enrollment.lastAccessed,
      };
    });

  // 3. Get recent activity
  const recentActivity = await ActivityLog.find({ student: studentId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("course", "title");

  res.status(200).json({
    success: true,
    data: {
      stats: {
        enrolledCourses: totalEnrolled,
        completedCourses: totalCompleted,
        certificatesEarned: certificatesEarned,
      },
      continueLearning,
      recentActivity,
    },
  });
});

// @desc    Get all enrolled courses for the student
// @route   GET /api/student/courses
// @access  Private (Student only)
export const getEnrolledCourses = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      select: "title thumbnailUrl instructor price",
      populate: {
        path: "instructor",
        select: "name",
      },
    })
    .sort({ enrolledAt: -1 });

  const validEnrollments = enrollments.filter(e => e.course != null);

  res.status(200).json({
    success: true,
    count: validEnrollments.length,
    data: validEnrollments,
  });
});

// @desc    Get course player details (modules, lessons, progress)
// @route   GET /api/student/courses/:courseId/player
// @access  Private (Student)
export const getCoursePlayerDetails = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).sort({ enrolledAt: -1 });
  if (!enrollment) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  // Check expiration
  if (enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()) {
    throw new ApiError(403, "Your access to this course has expired.");
  }

  // 2. Fetch Course with modules and lessons
  const course = await Course.findById(courseId)
    .populate({
      path: "modules",
      populate: { path: "lessons" }
    })
    .populate("instructor", "name")
    .select("-draftData");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // 3. Fetch student progress (fetch latest)
  const progress = await Progress.findOne({ student: studentId, course: courseId }).sort({ createdAt: -1 });

  // 4. Update last accessed
  enrollment.lastAccessed = Date.now();
  await enrollment.save();

  let newPercentage = enrollment.completionPercentage || 0;
  const progressObj = progress ? progress.toObject() : { lessonProgress: [], completionPercentage: 0 };
  progressObj.completionPercentage = newPercentage;

  res.status(200).json({
    success: true,
    data: {
      course,
      progress: progressObj
    }
  });
});

// @desc    Mark lesson as completed
// @route   POST /api/student/courses/:courseId/lessons/:lessonId/complete
// @access  Private (Student)
export const markLessonCompleted = asyncHandler(async (req, res, next) => {
  const { courseId, lessonId } = req.params;
  const studentId = req.user._id;

  let progress = await Progress.findOne({ student: studentId, course: courseId }).sort({ createdAt: -1 });
  if (!progress) {
    progress = new Progress({ student: studentId, course: courseId, lessonProgress: [] });
  }

  let lessonProg = progress.lessonProgress.find(lp => lp.lesson.toString() === lessonId);
  if (!lessonProg) {
    lessonProg = { lesson: lessonId, watchedSeconds: 0, totalSeconds: 0, isCompleted: true };
    progress.lessonProgress.push(lessonProg);
  } else {
    lessonProg.isCompleted = true;
  }

  await progress.save();

  // Log Activity
  await ActivityLog.create({
    student: studentId,
    course: courseId,
    lesson: lessonId,
    action: "COMPLETED_LESSON",
    details: `Completed lesson ${lessonId}`
  });

  // Calculate true completion percentage based purely on completed videos
  const course = await Course.findById(courseId);
  let totalLessons = 0;
  if (course && course.modules) {
    course.modules.forEach(mod => {
      totalLessons += mod.lessons.length;
    });
  }

  let completedLessons = progress.lessonProgress.filter(lp => lp.isCompleted).length;

  let newPercentage = 0;
  if (totalLessons > 0) {
    newPercentage = Math.round((completedLessons / totalLessons) * 100);
    newPercentage = Math.min(newPercentage, 100);
  }

  // Also update Enrollment percentage
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).sort({ enrolledAt: -1 });
  if (enrollment) {
    enrollment.completionPercentage = newPercentage;
    if (newPercentage === 100) {
      enrollment.status = "COMPLETED";
    }
    await enrollment.save();
  }

  // Send back progress including the percentage (overriding the old virtual if needed)
  const progressObj = progress.toObject();
  progressObj.completionPercentage = newPercentage;

  res.status(200).json({
    success: true,
    message: "Lesson marked as complete",
    progress: progressObj
  });
});

// @desc    Sync granular watch progress
// @route   PUT /api/student/courses/:courseId/lessons/:lessonId/progress
// @access  Private (Student)
export const syncLessonProgress = asyncHandler(async (req, res, next) => {
  const { courseId, lessonId } = req.params;
  const { watchedSeconds, totalSeconds } = req.body;
  const studentId = req.user._id;

  let progress = await Progress.findOne({ student: studentId, course: courseId }).sort({ createdAt: -1 });
  
  // If progress record doesn't exist, create it
  if (!progress) {
    progress = new Progress({
      student: studentId,
      course: courseId,
      lessonProgress: []
    });
  }

  // Find existing lesson progress or create new
  let lessonProg = progress.lessonProgress.find(lp => lp.lesson.toString() === lessonId);
  
  if (lessonProg) {
    // Only update if it's more than what we currently have, to avoid backwards seeking overriding progress
    if (watchedSeconds > lessonProg.watchedSeconds && !lessonProg.isCompleted) {
      lessonProg.watchedSeconds = watchedSeconds;
    }
    if (totalSeconds) {
      lessonProg.totalSeconds = totalSeconds;
    }
    // Auto-mark complete if watched > 95%
    if (totalSeconds && watchedSeconds >= totalSeconds * 0.95) {
      lessonProg.isCompleted = true;
    }
  } else {
    progress.lessonProgress.push({
      lesson: lessonId,
      watchedSeconds: watchedSeconds || 0,
      totalSeconds: totalSeconds || 0,
      isCompleted: totalSeconds ? (watchedSeconds >= totalSeconds * 0.95) : false
    });
  }

  await progress.save();

  // Calculate true completion percentage based purely on completed videos
  const course = await Course.findById(courseId);
  let totalLessons = 0;
  if (course && course.modules) {
    course.modules.forEach(mod => {
      totalLessons += mod.lessons.length;
    });
  }

  let completedLessons = progress.lessonProgress.filter(lp => lp.isCompleted).length;

  let newPercentage = 0;
  if (totalLessons > 0) {
    newPercentage = Math.round((completedLessons / totalLessons) * 100);
    newPercentage = Math.min(newPercentage, 100);
  }

  // Update Enrollment percentage silently
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).sort({ enrolledAt: -1 });
  if (enrollment) {
    enrollment.completionPercentage = newPercentage;
    if (newPercentage >= 100) {
      enrollment.status = "COMPLETED";
    }
    await enrollment.save();
  }

  const progressObj = progress.toObject();
  progressObj.completionPercentage = newPercentage;

  res.status(200).json({
    success: true,
    progress: progressObj
  });
});