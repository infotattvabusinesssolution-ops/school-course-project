import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Award, RefreshCw, FileText } from "lucide-react";

export default function ExamResultPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-crmisa-navy text-xl font-bold mb-2">No Result Found</p>
        <p className="text-slate-600 mb-6">Please take the exam first.</p>
        <button
          onClick={() => navigate(`/course-premium/${courseId}`)}
          className="px-6 py-3 bg-crmisa-navy text-white font-bold rounded-xl shadow-sm hover:bg-crmisa-accentNavy transition-colors"
        >
          Go to Course
        </button>
      </div>
    );
  }

  const {
    passed,
    score,
    totalQuestions,
    percentage,
    attemptNumber,
    passingPercentage,
    certificate,
    questionResults,
  } = result;

  return (
    <div className="min-h-screen bg-slate-50 text-crmisa-navy py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* ── Score Hero ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl p-8 sm:p-12 text-center mb-8 border shadow-sm ${
            passed
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          {/* Score ring */}
          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={passed ? "#10b981" : "#ef4444"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 42}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 42 * (1 - percentage / 100)}` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${passed ? "text-emerald-600" : "text-red-600"}`}>
                {percentage}%
              </span>
            </div>
          </div>

          {passed ? (
            <>
              <div className="inline-flex items-center gap-2 bg-emerald-100 px-5 py-2 rounded-full text-sm font-black text-emerald-700 uppercase tracking-wider mb-4 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> PASSED
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-crmisa-navy mb-3">
                🎉 Congratulations!
              </h1>
              <p className="text-emerald-700 text-base font-semibold mb-2">
                You scored {score} out of {totalQuestions} ({percentage}%)
              </p>
              <p className="text-slate-600 text-sm">
                Your certificate has been generated automatically.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-red-100 px-5 py-2 rounded-full text-sm font-black text-red-700 uppercase tracking-wider mb-4 border border-red-200">
                <XCircle className="w-4 h-4" /> NOT PASSED
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-crmisa-navy mb-3">
                Keep Going!
              </h1>
              <p className="text-red-700 text-base font-semibold mb-2">
                You scored {score} out of {totalQuestions} ({percentage}%)
              </p>
              <p className="text-slate-600 text-sm mb-1">
                Minimum required: <span className="font-bold text-crmisa-navy">{passingPercentage}%</span>
              </p>
              <p className="text-slate-500 text-xs">
                This was attempt #{attemptNumber}. 
                {attemptNumber >= 3 
                  ? " You have exhausted all attempts. You must repurchase the course to try again." 
                  : " You may retake the exam."}
              </p>
            </>
          )}
        </motion.div>

        {/* ── Action Buttons ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {passed && certificate && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate(`/certificate/${certificate.certificateId}`)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-400 hover:bg-amber-500 text-crmisa-navy shadow-sm font-black rounded-2xl transition-colors text-base"
            >
              <Award className="w-5 h-5" /> View & Download Certificate
            </motion.button>
          )}
          {!passed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate(`/course/${courseId}/exam`)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-black rounded-2xl transition-colors text-base"
            >
              <RefreshCw className="w-5 h-5" /> Retake Exam
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate(`/course-premium/${courseId}`)}
            className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm font-bold rounded-2xl transition-colors text-base"
          >
            <FileText className="w-5 h-5" /> Back to Course
          </motion.button>
        </div>

        {/* ── Answers Review (only if passed) ─────────────────────────────────── */}
        {passed && questionResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-black text-crmisa-navy mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Detailed Question Review
            </h2>
            <div className="space-y-4">
              {questionResults.map((qr, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    qr.isCorrect
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-red-50/50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {qr.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-crmisa-navy font-bold text-sm leading-relaxed">
                      Q{idx + 1}. {qr.questionText}
                    </p>
                  </div>

                  <div className="space-y-2 pl-8">
                    {qr.options.map((opt, oi) => {
                      const isCorrect = oi === qr.correctAnswerIndex;
                      const isSelected = oi === qr.selectedOption;
                      return (
                        <div
                          key={oi}
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isSelected && !isCorrect
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-white border border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className="font-black text-xs w-5">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          {opt}
                          {isCorrect && (
                            <span className="ml-auto text-emerald-600 font-black text-xs">✓ Correct</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="ml-auto text-red-600 font-black text-xs">✗ Your answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {qr.explanation && (
                    <div className="mt-3 pl-8">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Explanation
                      </p>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">{qr.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Fail state: no answers shown ─────────────────────────────────────── */}
        {!passed && (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              To protect the integrity of this exam, detailed answers and explanations are only available
              to students who have successfully passed. Review the course material and try again!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
