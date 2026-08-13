import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExamForAdmin,
  getCourseExamStats,
  createExam,
  updateExam,
  deleteExam,
} from "../services/exam.service";
import { courseService } from "../services/courseService";

const emptyQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
  explanation: "",
});

export default function AdminExamManagementPage() {
  const navigate = useNavigate();

  // Course list & selection
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Exam state
  const [existingExam, setExistingExam] = useState(null);
  const [loadingExam, setLoadingExam] = useState(false);

  // Form state
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0);
  const [reExamFee, setReExamFee] = useState(500);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [questions, setQuestions] = useState([emptyQuestion()]);

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // UI
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [activeView, setActiveView] = useState("editor"); // 'editor' | 'stats'
  const [expandedQ, setExpandedQ] = useState(0);

  // ── Load courses ─────────────────────────────────────────────────────────────
  useEffect(() => {
    courseService
      .getAdminCourses()
      .then((res) => setCourses(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingCourses(false));
  }, []);

  // ── Load exam when course changes ────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCourseId) {
      setExistingExam(null);
      setQuestions([emptyQuestion()]);
      setStats(null);
      return;
    }

    setLoadingExam(true);
    getExamForAdmin(selectedCourseId)
      .then((exam) => {
        setExistingExam(exam);
        setPassingPercentage(exam.passingPercentage);
        setTimeLimitMinutes(exam.timeLimitMinutes);
        setReExamFee(exam.reExamFee ?? 500);
        setShuffleQuestions(exam.shuffleQuestions);
        setQuestions(
          exam.questions.length > 0
            ? exam.questions.map((q) => ({
                questionText: q.questionText,
                options: [...q.options],
                correctAnswerIndex: q.correctAnswerIndex,
                explanation: q.explanation || "",
              }))
            : [emptyQuestion()]
        );
      })
      .catch(() => {
        // No exam yet — fresh
        setExistingExam(null);
        setPassingPercentage(40);
        setTimeLimitMinutes(0);
        setReExamFee(500);
        setShuffleQuestions(true);
        setQuestions([emptyQuestion()]);
      })
      .finally(() => setLoadingExam(false));
  }, [selectedCourseId]);

  // ── Load stats ───────────────────────────────────────────────────────────────
  const loadStats = () => {
    if (!selectedCourseId) return;
    setLoadingStats(true);
    getCourseExamStats(selectedCourseId)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  };

  useEffect(() => {
    if (activeView === "stats" && selectedCourseId) loadStats();
  }, [activeView, selectedCourseId]);

  // ── Question helpers ─────────────────────────────────────────────────────────
  const addQuestion = () => {
    setQuestions((qs) => [...qs, emptyQuestion()]);
    setExpandedQ(questions.length);
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
    setExpandedQ(Math.max(0, expandedQ - 1));
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIdx, oIdx, value) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, oi) => (oi === oIdx ? value : o)) }
          : q
      )
    );
  };

  const moveQuestion = (idx, direction) => {
    const newQs = [...questions];
    const target = idx + direction;
    if (target < 0 || target >= newQs.length) return;
    [newQs[idx], newQs[target]] = [newQs[target], newQs[idx]];
    setQuestions(newQs);
    setExpandedQ(target);
  };

  // ── Validate ─────────────────────────────────────────────────────────────────
  const validate = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1}: text is required`;
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) return `Question ${i + 1}: Option ${String.fromCharCode(65 + o)} is empty`;
      }
    }
    return null;
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate();
    if (err) return setSaveMsg({ type: "error", text: err });
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        courseId: selectedCourseId,
        questions,
        passingPercentage: Number(passingPercentage),
        timeLimitMinutes: Number(timeLimitMinutes),
        reExamFee: Number(reExamFee),
        shuffleQuestions,
      };
      if (existingExam) {
        await updateExam(existingExam._id, payload);
        setSaveMsg({ type: "success", text: "Exam updated successfully!" });
      } else {
        const created = await createExam(payload);
        setExistingExam(created);
        setSaveMsg({ type: "success", text: "Exam created successfully!" });
      }
    } catch (err) {
      setSaveMsg({ type: "error", text: err?.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete exam ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!existingExam) return;
    if (!window.confirm("Are you sure you want to delete this entire exam? This cannot be undone.")) return;
    try {
      await deleteExam(existingExam._id);
      setExistingExam(null);
      setQuestions([emptyQuestion()]);
      setSaveMsg({ type: "success", text: "Exam deleted." });
    } catch (err) {
      setSaveMsg({ type: "error", text: "Failed to delete exam." });
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-crmisa-navy">Exam Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Create and manage final exams for each course. Students must pass to receive their certificate.
          </p>
        </div>
      </div>

      {/* ── Course Selector ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Select Course
        </label>
        {loadingCourses ? (
          <p className="text-slate-400 text-sm">Loading courses…</p>
        ) : (
          <select
            value={selectedCourseId}
            onChange={(e) => { setSelectedCourseId(e.target.value); setActiveView("editor"); }}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-crmisa-accentNavy bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">— View All Exams —</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Default View: All Courses/Exams ──────────────────────────────────── */}
      {!selectedCourseId && !loadingCourses && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">quiz</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-crmisa-navy text-lg line-clamp-2">{c.title}</h3>
               </div>
               <div className="mt-5 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => { setSelectedCourseId(c._id); setActiveView("editor"); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-crmisa-navy border border-slate-200 rounded-xl font-bold text-sm hover:bg-crmisa-navy hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Manage Exam
                  </button>
               </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center">
              <p className="text-slate-500 font-semibold">No courses found to manage exams for.</p>
            </div>
          )}
        </div>
      )}

      {selectedCourseId && loadingExam && (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-[40px] text-slate-400">progress_activity</span>
        </div>
      )}

      {selectedCourseId && !loadingExam && (
        <>
          {/* ── Status Banner ────────────────────────────────────────────────── */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold ${
            existingExam
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {existingExam ? "check_circle" : "info"}
            </span>
            {existingExam
              ? `Exam exists · ${existingExam.questions.length} questions · Pass: ${existingExam.passingPercentage}% · Timer: ${existingExam.timeLimitMinutes === 0 ? "No limit" : `${existingExam.timeLimitMinutes} min`}`
              : "No exam found for this course — create one below"}
          </div>

          {/* ── View Toggle ──────────────────────────────────────────────────── */}
          {existingExam && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView("editor")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  activeView === "editor"
                    ? "bg-crmisa-navy text-white"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">edit</span>
                Edit Exam
              </button>
              <button
                onClick={() => setActiveView("stats")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  activeView === "stats"
                    ? "bg-crmisa-navy text-white"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">bar_chart</span>
                Attempt Stats
              </button>
            </div>
          )}

          {/* ════ EDITOR VIEW ════════════════════════════════════════════════ */}
          {activeView === "editor" && (
            <div className="space-y-5">
              {/* Settings Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-crmisa-navy uppercase tracking-widest mb-5">
                  Exam Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Passing % */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Passing Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-crmisa-accentNavy focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <p className="text-xs text-slate-400 mt-1">Min score to pass & get certificate</p>
                  </div>

                  {/* Time Limit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-crmisa-accentNavy focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <p className="text-xs text-slate-400 mt-1">Set 0 for no time limit</p>
                  </div>

                  {/* Re-Exam Fee */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Re-Exam Fee (ZAR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={reExamFee}
                      onChange={(e) => setReExamFee(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-crmisa-accentNavy focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <p className="text-xs text-slate-400 mt-1">Fee for retaking a failed exam</p>
                  </div>

                  {/* Shuffle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Shuffle Questions & Options
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none mt-2">
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 accent-slate-900 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Randomise per attempt
                      </span>
                    </label>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {shuffleQuestions ? "On — questions & options shuffled for each student" : "Off — fixed order for all"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Question header row */}
                    <button
                      type="button"
                      onClick={() => setExpandedQ(expandedQ === qIdx ? -1 : qIdx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-crmisa-navy text-white text-xs font-black flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">
                          {q.questionText || <span className="text-slate-400 italic">Untitled question</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          q.questionText && q.options.every(o => o.trim())
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {q.questionText && q.options.every(o => o.trim()) ? "Complete" : "Incomplete"}
                        </span>
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">
                          {expandedQ === qIdx ? "expand_less" : "expand_more"}
                        </span>
                      </div>
                    </button>

                    {/* Expanded body */}
                    {expandedQ === qIdx && (
                      <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-5">
                        {/* Question text */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Question Text *
                          </label>
                          <textarea
                            rows={2}
                            value={q.questionText}
                            onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                            placeholder="Enter question here…"
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-crmisa-accentNavy resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Answer Options (select the correct one)
                          </label>
                          <div className="space-y-2.5">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => updateQuestion(qIdx, "correctAnswerIndex", oIdx)}
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                                    q.correctAnswerIndex === oIdx
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-slate-300 text-slate-400 hover:border-slate-500"
                                  }`}
                                  title="Mark as correct answer"
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </button>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                  className={`flex-1 border rounded-xl px-4 py-2.5 text-sm text-crmisa-accentNavy focus:outline-none focus:ring-2 transition-colors ${
                                    q.correctAnswerIndex === oIdx
                                      ? "border-emerald-400 bg-emerald-50 focus:ring-emerald-500"
                                      : "border-slate-300 focus:ring-slate-900"
                                  }`}
                                />
                                {q.correctAnswerIndex === oIdx && (
                                  <span className="text-xs font-bold text-emerald-600 shrink-0">✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Explanation */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Explanation <span className="font-normal normal-case">(shown to students who pass)</span>
                          </label>
                          <textarea
                            rows={2}
                            value={q.explanation}
                            onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                            placeholder="Optional: explain why the correct answer is right…"
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>

                        {/* Question Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => moveQuestion(qIdx, -1)}
                            disabled={qIdx === 0}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold disabled:opacity-30"
                          >
                            ↑ Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion(qIdx, 1)}
                            disabled={qIdx === questions.length - 1}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold disabled:opacity-30"
                          >
                            ↓ Move Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIdx)}
                            disabled={questions.length === 1}
                            className="ml-auto px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold disabled:opacity-30"
                          >
                            Remove Question
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Question */}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-crmisa-navy hover:text-crmisa-navy font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Add New Question ({questions.length} total)
                </button>
              </div>

              {/* Save Message */}
              {saveMsg && (
                <div className={`px-5 py-3.5 rounded-xl text-sm font-bold ${
                  saveMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {saveMsg.type === "success" ? "✓ " : "⚠ "}{saveMsg.text}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                {existingExam && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full sm:w-auto px-6 py-3 bg-red-50 border border-red-300 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm"
                  >
                    Delete Entire Exam
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto sm:ml-auto px-8 py-3.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-black rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Saving…</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px]">save</span> {existingExam ? "Save Changes" : "Create Exam"}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ════ STATS VIEW ═════════════════════════════════════════════════ */}
          {activeView === "stats" && (
            <div className="space-y-5">
              {loadingStats ? (
                <div className="flex justify-center py-16">
                  <span className="material-symbols-outlined animate-spin text-[40px] text-slate-400">progress_activity</span>
                </div>
              ) : !stats ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                  <p className="text-slate-500 font-semibold">No attempt data yet</p>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Attempts", value: stats.totalAttempts, icon: "quiz", color: "blue" },
                      { label: "Students Passed", value: stats.passed, icon: "check_circle", color: "emerald" },
                      { label: "Pass Rate", value: `${stats.passRate}%`, icon: "percent", color: "purple" },
                      { label: "Average Score", value: `${stats.avgScore}%`, icon: "bar_chart", color: "amber" },
                    ].map((card) => (
                      <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className={`w-9 h-9 rounded-xl bg-${card.color}-50 text-${card.color}-600 border border-${card.color}-100 flex items-center justify-center mb-3`}>
                          <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                        </div>
                        <div className="text-2xl font-black text-crmisa-navy">{card.value}</div>
                        <div className="text-xs text-slate-500 font-semibold mt-0.5">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Per-student breakdown */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100">
                      <h3 className="text-sm font-black text-crmisa-navy uppercase tracking-widest">Student Attempt Log</h3>
                    </div>
                    {stats.studentBreakdown.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">No attempts recorded yet</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {stats.studentBreakdown.map((entry, i) => (
                          <div key={i} className="px-6 py-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-crmisa-navy text-white font-bold text-xs flex items-center justify-center">
                                  {entry.student?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-crmisa-accentNavy">{entry.student?.name || "Unknown"}</p>
                                  <p className="text-xs text-slate-400">{entry.student?.email}</p>
                                </div>
                              </div>
                              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                                entry.hasPassed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {entry.hasPassed ? "✓ Passed" : "✗ Not Passed"}
                              </span>
                            </div>
                            {/* Attempt rows */}
                            <div className="space-y-1.5 pl-11">
                              {entry.attempts.map((a, ai) => (
                                <div key={ai} className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${
                                  a.passed ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-100"
                                }`}>
                                  <span className="font-semibold text-slate-600">Attempt #{a.attemptNumber}</span>
                                  <div className="flex items-center gap-4 text-slate-500">
                                    <span className={`font-black ${a.passed ? "text-emerald-600" : "text-red-500"}`}>{a.percentage}%</span>
                                    {a.tabSwitchCount > 0 && (
                                      <span className="text-amber-600 font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                        {a.tabSwitchCount} tab switch{a.tabSwitchCount > 1 ? "es" : ""}
                                      </span>
                                    )}
                                    <span>{new Date(a.submittedAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
