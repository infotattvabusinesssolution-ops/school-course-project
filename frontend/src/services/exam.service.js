import api from "../lib/axios";

// ─── STUDENT ──────────────────────────────────────────────────────────────────

// Get exam status for a course (hasExam, hasPassed, attemptCount, certificate, etc.)
export const getExamStatus = (courseId) =>
  api.get(`/exams/status/${courseId}`).then((r) => r.data.data);

// Get exam questions (no answers) ready to take
export const takeExam = (courseId) =>
  api.get(`/exams/take/${courseId}`).then((r) => r.data.data);

// Submit answers and receive graded result
export const submitExam = (payload) =>
  api.post("/exams/submit", payload).then((r) => r.data.data);

// Get student's own past attempts for a course
export const getMyAttempts = (courseId) =>
  api.get(`/exams/my-attempts/${courseId}`).then((r) => r.data.data);

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Get full exam with correct answers (admin only)
export const getExamForAdmin = (courseId) =>
  api.get(`/exams/admin/course/${courseId}`).then((r) => r.data.data);

// Get exam attempt stats for a course (admin only)
export const getCourseExamStats = (courseId) =>
  api.get(`/exams/admin/stats/${courseId}`).then((r) => r.data.data);

// Create a new exam for a course
export const createExam = (payload) =>
  api.post("/exams", payload).then((r) => r.data.data);

// Update an existing exam
export const updateExam = (examId, payload) =>
  api.put(`/exams/${examId}`, payload).then((r) => r.data.data);

// Delete an exam
export const deleteExam = (examId) =>
  api.delete(`/exams/${examId}`).then((r) => r.data.data);
