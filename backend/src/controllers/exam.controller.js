import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Exam from "../models/Exam.model.js";
import ExamAttempt from "../models/ExamAttempt.model.js";
import Certificate from "../models/Certificate.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Progress from "../models/Progress.model.js";
import { Course } from "../models/Course.model.js";
import { generateCertificateId } from "../utils/generateCertificateId.js";

// Helper: shuffle array (Fisher-Yates)
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─────────────────────────────────────────────
//  ADMIN: Create Exam for a course
// ─────────────────────────────────────────────
export const createExam = asyncHandler(async (req, res) => {
  const { courseId, questions, passingPercentage, timeLimitMinutes, shuffleQuestions } = req.body;

  if (!courseId) throw new ApiError(400, "courseId is required");
  if (!questions || questions.length < 1) throw new ApiError(400, "At least 1 question is required");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const existing = await Exam.findOne({ course: courseId });
  if (existing) throw new ApiError(409, "An exam already exists for this course. Use update instead.");

  const exam = await Exam.create({
    course: courseId,
    questions,
    passingPercentage: passingPercentage ?? 40,
    timeLimitMinutes: timeLimitMinutes ?? 0,
    shuffleQuestions: shuffleQuestions ?? true,
    isActive: true,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, exam, "Exam created successfully"));
});

// ─────────────────────────────────────────────
//  ADMIN: Update Exam
// ─────────────────────────────────────────────
export const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const exam = await Exam.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!exam) throw new ApiError(404, "Exam not found");

  res.status(200).json(new ApiResponse(200, exam, "Exam updated successfully"));
});

// ─────────────────────────────────────────────
//  ADMIN: Delete Exam
// ─────────────────────────────────────────────
export const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) throw new ApiError(404, "Exam not found");

  res.status(200).json(new ApiResponse(200, null, "Exam deleted successfully"));
});

// ─────────────────────────────────────────────
//  ADMIN: Get full exam for a course (with answers)
// ─────────────────────────────────────────────
export const getExamForAdmin = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const exam = await Exam.findOne({ course: courseId });
  if (!exam) throw new ApiError(404, "No exam found for this course");

  res.status(200).json(new ApiResponse(200, exam, "Exam fetched"));
});

// ─────────────────────────────────────────────
//  ADMIN: Get exam attempt stats for a course
// ─────────────────────────────────────────────
export const getCourseExamStats = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const attempts = await ExamAttempt.find({ course: courseId })
    .populate("student", "name email")
    .sort({ submittedAt: -1 });

  const totalAttempts = attempts.length;
  const passed = attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
      : 0;

  // Group by student
  const studentMap = {};
  attempts.forEach((a) => {
    const sid = a.student._id.toString();
    if (!studentMap[sid]) {
      studentMap[sid] = {
        student: a.student,
        attempts: [],
        hasPassed: false,
      };
    }
    studentMap[sid].attempts.push({
      attemptNumber: a.attemptNumber,
      percentage: a.percentage,
      passed: a.passed,
      tabSwitchCount: a.tabSwitchCount,
      submittedAt: a.submittedAt,
    });
    if (a.passed) studentMap[sid].hasPassed = true;
  });

  res.status(200).json(
    new ApiResponse(200, {
      totalAttempts,
      passed,
      passRate,
      avgScore,
      studentBreakdown: Object.values(studentMap),
    }, "Exam stats fetched")
  );
});

// ─────────────────────────────────────────────
//  STUDENT: Get exam questions (NO correct answers)
// ─────────────────────────────────────────────
export const getExamForStudent = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  // Ensure enrolled
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new ApiError(403, "You are not enrolled in this course");

  // Check if already passed
  const passedAttempt = await ExamAttempt.findOne({ student: studentId, course: courseId, passed: true });
  if (passedAttempt) throw new ApiError(400, "You have already passed this exam");

  // Ensure course is complete
  const course = await Course.findById(courseId);
  const progress = await Progress.findOne({ student: studentId, course: courseId });
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = progress?.lessonProgress?.filter((lp) => lp.isCompleted)?.length || 0;
  if (totalLessons > 0 && completedLessons < totalLessons) {
    throw new ApiError(400, "You must complete all lessons before taking the exam");
  }

  const exam = await Exam.findOne({ course: courseId, isActive: true });
  if (!exam) throw new ApiError(404, "No active exam found for this course");

  // Build question order (shuffled or original)
  let questionOrder = exam.questions.map((_, i) => i);
  if (exam.shuffleQuestions) questionOrder = shuffleArray(questionOrder);

  // Strip correct answers — only send what students need
  const safeQuestions = questionOrder.map((origIdx) => {
    const q = exam.questions[origIdx];
    // shuffle options too
    let optionOrder = [0, 1, 2, 3];
    if (exam.shuffleQuestions) optionOrder = shuffleArray(optionOrder);
    return {
      originalIndex: origIdx,
      questionText: q.questionText,
      optionOrder, // frontend uses this to map back
      options: optionOrder.map((oi) => q.options[oi]),
    };
  });

  const attemptNumber =
    (await ExamAttempt.countDocuments({ student: studentId, course: courseId })) + 1;

  res.status(200).json(
    new ApiResponse(200, {
      examId: exam._id,
      totalQuestions: exam.questions.length,
      passingPercentage: exam.passingPercentage,
      timeLimitMinutes: exam.timeLimitMinutes,
      attemptNumber,
      questions: safeQuestions,
    }, "Exam fetched")
  );
});

// ─────────────────────────────────────────────
//  STUDENT: Submit exam answers
// ─────────────────────────────────────────────
export const submitExam = asyncHandler(async (req, res) => {
  const { courseId, answers, tabSwitchCount, timeTakenSeconds } = req.body;
  // answers: [{ originalIndex: Number, selectedOption: Number (0-3 in shuffled option order), optionOrder: [Number] }]
  const studentId = req.user._id;

  if (!courseId) throw new ApiError(400, "courseId is required");
  if (!answers || !Array.isArray(answers)) throw new ApiError(400, "answers array is required");

  // Check if already passed
  const passedAttempt = await ExamAttempt.findOne({ student: studentId, course: courseId, passed: true });
  if (passedAttempt) throw new ApiError(400, "You have already passed this exam and cannot retake it");

  const exam = await Exam.findOne({ course: courseId, isActive: true });
  if (!exam) throw new ApiError(404, "No active exam found for this course");

  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new ApiError(403, "You are not enrolled in this course");

  // Grade answers
  let correctCount = 0;
  const gradedAnswers = answers.map(({ originalIndex, selectedOption, optionOrder }) => {
    const question = exam.questions[originalIndex];
    // Map selected shuffled option back to original option index
    let originalSelectedOption = -1;
    if (selectedOption >= 0) {
      originalSelectedOption = optionOrder ? optionOrder[selectedOption] : selectedOption;
    }
    const isCorrect = originalSelectedOption === question.correctAnswerIndex;
    if (isCorrect) correctCount++;
    return {
      questionIndex: originalIndex,
      selectedOption: originalSelectedOption,
      isCorrect,
    };
  });

  const totalQuestions = exam.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= exam.passingPercentage;

  // Save attempt
  const attemptNumber =
    (await ExamAttempt.countDocuments({ student: studentId, course: courseId })) + 1;

  const attempt = await ExamAttempt.create({
    student: studentId,
    course: courseId,
    exam: exam._id,
    answers: gradedAnswers.map((a) => ({ questionIndex: a.questionIndex, selectedOption: a.selectedOption })),
    score: correctCount,
    totalQuestions,
    percentage,
    passed,
    attemptNumber,
    tabSwitchCount: tabSwitchCount || 0,
    timeTakenSeconds: timeTakenSeconds || 0,
    submittedAt: new Date(),
  });

  let certificate = null;

  if (passed) {
    // Auto-generate certificate
    enrollment.status = "COMPLETED";
    enrollment.completionPercentage = 100;
    enrollment.completedAt = new Date();
    await enrollment.save();

    let certId = generateCertificateId();
    let certExists = await Certificate.findOne({ certificateId: certId });
    while (certExists) {
      certId = generateCertificateId();
      certExists = await Certificate.findOne({ certificateId: certId });
    }

    // Upsert — update examScore if cert already exists, create it fresh otherwise
    const newCert = await Certificate.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        $setOnInsert: {
          certificateId: certId,
          student: studentId,
          course: courseId,
          issueDate: new Date(),
          completionPercentage: 100,
        },
        $set: { examScore: percentage },
      },
      { upsert: true, new: true }
    );

    certificate = await Certificate.findById(newCert._id)
      .populate("student", "name email")
      .populate("course", "title category");
  }

  // Build result payload
  const result = {
    passed,
    score: correctCount,
    totalQuestions,
    percentage,
    attemptNumber,
    passingPercentage: exam.passingPercentage,
    certificate: certificate || null,
  };

  // Only reveal answers if passed
  if (passed) {
    result.questionResults = gradedAnswers.map((a, idx) => {
      const q = exam.questions[a.questionIndex];
      return {
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        selectedOption: a.selectedOption,
        isCorrect: a.isCorrect,
        explanation: q.explanation || "",
      };
    });
  }

  res.status(200).json(new ApiResponse(200, result, passed ? "Congratulations! You passed." : "You did not pass. Please retake the exam."));
});

// ─────────────────────────────────────────────
//  STUDENT: Get my exam attempts for a course
// ─────────────────────────────────────────────
export const getMyAttempts = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  const attempts = await ExamAttempt.find({ student: studentId, course: courseId })
    .select("-answers")
    .sort({ attemptNumber: 1 });

  res.status(200).json(new ApiResponse(200, attempts, "Attempts fetched"));
});

// ─────────────────────────────────────────────
//  STUDENT: Get exam status for a course
// ─────────────────────────────────────────────
export const getExamStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  const exam = await Exam.findOne({ course: courseId, isActive: true }).select("_id passingPercentage timeLimitMinutes questions");
  const hasExam = !!exam;

  const passedAttempt = await ExamAttempt.findOne({ student: studentId, course: courseId, passed: true });
  const attemptCount = await ExamAttempt.countDocuments({ student: studentId, course: courseId });
  const certificate = await Certificate.findOne({ student: studentId, course: courseId }).select("certificateId examScore issueDate");

  // Check lesson completion
  const course = await Course.findById(courseId);
  const progress = await Progress.findOne({ student: studentId, course: courseId });
  const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedLessons = progress?.lessonProgress?.filter((lp) => lp.isCompleted)?.length || 0;
  const lessonsComplete = totalLessons > 0 && completedLessons >= totalLessons;

  res.status(200).json(
    new ApiResponse(200, {
      hasExam,
      examId: exam?._id || null,
      lessonsComplete,
      hasPassed: !!passedAttempt,
      attemptCount,
      certificate: certificate || null,
      questionCount: exam?.questions?.length || 0,
      passingPercentage: exam?.passingPercentage || 40,
      timeLimitMinutes: exam?.timeLimitMinutes || 0,
    }, "Exam status fetched")
  );
});
