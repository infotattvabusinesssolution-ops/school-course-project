import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { takeExam, submitExam } from "../services/exam.service";

const TAB_SWITCH_LIMIT = 3;

export default function ExamPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState(null);

  // Answers: map of questionIndex → { selectedOption, optionOrder }
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Tab switch detection
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const tabSwitchCountRef = useRef(0);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ─── Fetch exam ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await takeExam(courseId);
        setExamData(data);
        if (data.timeLimitMinutes > 0) {
          setTimeLeft(data.timeLimitMinutes * 60);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load exam.");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [courseId]);

  // ─── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  // ─── Tab / window focus detection ────────────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current += 1;
        setTabSwitchCount(tabSwitchCountRef.current);
        setShowTabWarning(true);
      }
    };
    const handleBlur = () => {
      tabSwitchCountRef.current += 1;
      setTabSwitchCount(tabSwitchCountRef.current);
      setShowTabWarning(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (!examData) return;
      setSubmitting(true);
      setSubmitError(null);

      const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

      const answersPayload = examData.questions.map((q, idx) => ({
        originalIndex: q.originalIndex,
        selectedOption: answers[idx]?.selectedOption ?? -1,
        optionOrder: q.optionOrder,
      }));

      try {
        const result = await submitExam({
          courseId,
          answers: answersPayload,
          tabSwitchCount: tabSwitchCountRef.current,
          timeTakenSeconds: timeTaken,
        });
        setShowSubmitConfirm(false);
        navigate(`/course/${courseId}/exam/result`, { state: { result } });
      } catch (err) {
        setSubmitError(err?.response?.data?.message || "Submission failed. Please try again.");
        setSubmitting(false);
        if (autoSubmit) {
          setShowSubmitConfirm(true); // show modal if it auto-submitted so user sees error
        }
      }
    },
    [examData, answers, courseId, navigate]
  );

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;

  // ─── Loading / Error ──────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 text-lg font-semibold">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mr-3"></div>
        Loading exam…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-slate-900 text-xl font-bold mb-2">Cannot Start Exam</p>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => navigate(`/course-premium/${courseId}`)}
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Return to Course
        </button>
      </div>
    );

  const { questions, totalQuestions, passingPercentage, timeLimitMinutes, attemptNumber } = examData;
  const currentQuestion = questions[currentQ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-400 selection:text-slate-900">
      {/* ── Tab Switch Warning Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showTabWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-2 border-red-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-red-600 mb-2">⚠️ Exam Integrity Warning</h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                You have left the exam window. This activity has been{" "}
                <span className="text-red-500 font-bold">recorded and logged</span>.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-red-700 text-sm font-bold mb-1">⛔ Important Notice:</p>
                <p className="text-red-600 text-sm leading-relaxed">
                  Navigating away from this exam is considered a violation of examination integrity rules.
                  Repeated violations may result in a <strong>permanent ban from attempting this exam</strong>.
                  All tab switches are being tracked and reported to the administrator.
                </p>
              </div>
              <p className="text-slate-500 text-xs mb-6">
                Violation recorded. Please remain on this page for the duration of the exam.
              </p>
              <button
                onClick={() => setShowTabWarning(false)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-colors text-base"
              >
                I Understand — Return to Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit Confirm Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
            >
              <Send className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-black text-slate-900 mb-2">Submit Exam?</h2>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-left">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 font-medium">{submitError}</p>
                </div>
              )}

              <p className="text-slate-600 text-sm mb-2">
                You have answered <span className="text-slate-900 font-bold">{answeredCount}</span> of{" "}
                <span className="text-slate-900 font-bold">{totalQuestions}</span> questions.
              </p>
              {answeredCount < totalQuestions && (
                <p className="text-amber-600 text-xs mb-4 font-semibold">
                  ⚠️ {totalQuestions - answeredCount} question(s) are unanswered and will be marked incorrect.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowSubmitConfirm(false); setSubmitError(null); }}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Final Exam</p>
            <p className="text-sm font-extrabold text-slate-900">Attempt #{attemptNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-slate-600 text-sm font-bold">
            {answeredCount}/{totalQuestions} answered
          </span>

          {/* Timer */}
          {timeLeft !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-black text-base ${
                timeLeft <= 60
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-slate-100 text-slate-900 border border-slate-200"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <button
            onClick={() => { setShowSubmitConfirm(true); setSubmitError(null); }}
            disabled={submitting}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-colors text-sm disabled:opacity-50 shadow-xs"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-0 sm:gap-6 px-2 sm:px-6 py-6">
        {/* Question Area */}
        <main className="flex-1 min-w-0">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-600 font-bold mb-1.5">
              <span>Question {currentQ + 1} of {totalQuestions}</span>
              <span>{Math.round(((currentQ + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                animate={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 mb-6"
            >
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-4">
                Question {currentQ + 1}
              </p>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed mb-8">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQ]?.selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQ]: {
                            selectedOption: optIdx,
                            optionOrder: currentQuestion.optionOrder,
                          },
                        }))
                      }
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-semibold transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ((q) => Math.max(q - 1, 0))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-700 bg-white shadow-sm font-extrabold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentQ((q) => Math.min(q + 1, totalQuestions - 1))}
              disabled={currentQ === totalQuestions - 1}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-extrabold rounded-xl transition-colors disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* Question Palette Sidebar */}
        <aside className="hidden sm:flex flex-col w-52 shrink-0">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sticky top-24">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">
              Question Palette
            </p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const answered = !!answers[idx];
                const isCurrent = idx === currentQ;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQ(idx)}
                    className={`w-full aspect-square rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-200 shadow-sm"
                        : answered
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 space-y-3 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-100 border border-emerald-300" />
                Answered
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-3.5 h-3.5 rounded-sm bg-slate-100 border border-slate-300" />
                Not answered
              </div>
            </div>

            <button
              onClick={() => { setShowSubmitConfirm(true); setSubmitError(null); }}
              className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 shadow-sm text-white font-extrabold rounded-xl text-sm transition-colors"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
