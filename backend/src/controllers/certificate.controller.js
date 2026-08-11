import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Certificate from "../models/Certificate.model.js";
import Enrollment from "../models/Enrollment.model.js";
import { Course } from "../models/Course.model.js";
import Progress from "../models/Progress.model.js";
import ExamAttempt from "../models/ExamAttempt.model.js";
import { generateCertificateId } from "../utils/generateCertificateId.js";

// @desc    Issue Certificate for course completion
// @route   POST /api/certificates/issue
// @access  Private (Student)
export const issueCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user._id;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Check enrollment
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  // Check existing certificate
  let existingCert = await Certificate.findOne({ student: studentId, course: courseId })
    .populate("student", "name email")
    .populate("course", "title category");

  if (existingCert) {
    return res.status(200).json(
      new ApiResponse(200, existingCert, "Certificate already issued")
    );
  }

  // Verify 100% completion via Progress document
  const progress = await Progress.findOne({ student: studentId, course: courseId });
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = progress?.lessonProgress?.filter(lp => lp.isCompleted)?.length || 0;

  const isCompleted = (totalLessons > 0 && completedLessons >= totalLessons) || enrollment.completionPercentage >= 100 || enrollment.status === "COMPLETED";

  if (!isCompleted) {
    throw new ApiError(400, "You must complete 100% of course lessons to claim your certificate");
  }

  // Generate unique certificate ID
  let certId = generateCertificateId();
  let certExists = await Certificate.findOne({ certificateId: certId });
  while (certExists) {
    certId = generateCertificateId();
    certExists = await Certificate.findOne({ certificateId: certId });
  }

  const newCertificate = await Certificate.create({
    certificateId: certId,
    student: studentId,
    course: courseId,
    issueDate: new Date(),
    completionPercentage: 100,
  });

  // Ensure enrollment status is COMPLETED
  enrollment.status = "COMPLETED";
  enrollment.completionPercentage = 100;
  await enrollment.save();

  const populatedCertificate = await Certificate.findById(newCertificate._id)
    .populate("student", "name email")
    .populate("course", "title category");

  res.status(201).json(
    new ApiResponse(201, populatedCertificate, "Certificate generated successfully")
  );
});

// @desc    Public verification of a certificate by certificateId
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  let certificate = await Certificate.findOne({ certificateId })
    .populate("student", "name email")
    .populate("course", "title category description");

  if (!certificate) {
    throw new ApiError(404, "Invalid or unrecognized Certificate ID");
  }

  if (certificate.examScore === null || certificate.examScore === undefined) {
    const bestAttempt = await ExamAttempt.findOne({ 
      student: certificate.student._id, 
      course: certificate.course._id, 
      passed: true 
    }).sort({ percentage: -1 });
    
    if (bestAttempt) {
      certificate.examScore = bestAttempt.percentage;
      await Certificate.updateOne({ _id: certificate._id }, { examScore: bestAttempt.percentage });
    }
  }

  res.status(200).json(
    new ApiResponse(200, certificate, "Certificate verification details retrieved")
  );
});

// @desc    Verify if logged-in student has certificate for a specific course
// @route   GET /api/certificates/verify-student/:courseId
// @access  Private (Student)
export const verifyStudentCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  let certificate = await Certificate.findOne({ course: courseId, student: studentId })
    .populate("student", "name email")
    .populate("course", "title category");

  if (!certificate) {
    throw new ApiError(404, "Certificate not found for this course");
  }

  if (certificate.examScore === null || certificate.examScore === undefined) {
    const bestAttempt = await ExamAttempt.findOne({ 
      student: studentId, 
      course: courseId, 
      passed: true 
    }).sort({ percentage: -1 });
    
    if (bestAttempt) {
      certificate.examScore = bestAttempt.percentage;
      await Certificate.updateOne({ _id: certificate._id }, { examScore: bestAttempt.percentage });
    }
  }

  res.status(200).json(
    new ApiResponse(200, certificate, "Certificate found")
  );
});

// @desc    Get all certificates for logged-in student
// @route   GET /api/certificates/my-certificates
// @access  Private (Student)
export const getMyCertificates = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const certificates = await Certificate.find({ student: studentId })
    .sort({ issueDate: -1 })
    .populate("student", "name email")
    .populate("course", "title category thumbnailUrl");

  // Retroactively fill missing exam scores
  for (let cert of certificates) {
    if (cert.examScore === null || cert.examScore === undefined) {
      const bestAttempt = await ExamAttempt.findOne({ 
        student: studentId, 
        course: cert.course._id, 
        passed: true 
      }).sort({ percentage: -1 });
      
      if (bestAttempt) {
        cert.examScore = bestAttempt.percentage;
        await Certificate.updateOne({ _id: cert._id }, { examScore: bestAttempt.percentage });
      }
    }
  }

  res.status(200).json(
    new ApiResponse(200, certificates, "Student certificates retrieved successfully")
  );
});