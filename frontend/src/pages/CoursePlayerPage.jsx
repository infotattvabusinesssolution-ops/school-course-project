import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  BookOpen,
  Users,
  Check,
  Play,
  Award,
  Download,
  FileText
} from "lucide-react";
import api from "../lib/axios";
import reviewService from "../services/reviewService";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import CourseReviewModal from "../components/CourseReviewModal";
import { getExamStatus } from "../services/exam.service";

// ─── Video Detection ────────────────────────────────────────────────────────

const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([^#&?]{11})/);
  return m ? m[1] : null;
};

const isDirectVideo = (url) => {
  if (!url) return false;
  const l = url.toLowerCase();
  return (
    l.includes("res.cloudinary.com") ||
    l.includes(".mp4") ||
    l.includes(".webm") ||
    l.includes("/video/upload/")
  );
};

// Wraps CustomVideoPlayer for direct videos, or YouTube iframe
function VideoPlayer({ lesson, onProgress, startTime }) {
  if (!lesson?.videoUrl) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
        <p className="text-sm text-slate-400">No video for this lesson</p>
      </div>
    );
  }

  const ytId = getYouTubeId(lesson.videoUrl);
  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          key={lesson._id}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideo(lesson.videoUrl)) {
    return (
      <CustomVideoPlayer
        key={lesson._id}
        src={lesson.videoUrl}
        title={lesson.title}
        autoPlay
        onProgress={onProgress}
        startTime={startTime}
      />
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl bg-slate-900 flex flex-col items-center justify-center gap-3">
      <Play className="w-12 h-12 text-white/30" />
      <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-sm">
        Open video link
      </a>
    </div>
  );
}

// ─── Course Content Sidebar ─────────────────────────────────────────────────

function CourseSidebar({ course, activeLesson, completedLessons, lessonProgressData, onSelect }) {
  const [openModules, setOpenModules] = useState(new Set([course?.modules?.[0]?._id]));

  const toggle = (id) => {
    setOpenModules((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div>
      {course?.modules?.map((mod, mIdx) => {
        const isOpen = openModules.has(mod._id);
        const totalSecs = mod.lessons?.reduce((a, l) => a + (l.duration || 0), 0) ?? 0;
        const modMins = Math.round(totalSecs / 60);

        return (
          <div key={mod._id} className="border-b border-slate-100 last:border-0">
            <button
              onClick={() => toggle(mod._id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {String(mIdx + 1).padStart(2, "0")}: {mod.title}
                </p>
                {modMins > 0 && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {modMins >= 60 ? `${Math.floor(modMins / 60)}h ${modMins % 60}min` : `${modMins}min`}
                  </p>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="pb-1">
                {mod.lessons?.map((lesson) => {
                  const active = activeLesson?._id === lesson._id;
                  const done = completedLessons.has(lesson._id?.toString());
                  const mins = lesson.duration ? Math.ceil(lesson.duration / 60) : null;
                  const lp = lessonProgressData?.find(p => p.lesson?.toString() === lesson._id?.toString());
                  const progPercent = lp ? (lp.isCompleted ? 100 : Math.round((lp.watchedSeconds / (lp.totalSeconds || lesson.duration || 1)) * 100)) : 0;

                  return (
                    <button
                      key={lesson._id}
                      onClick={() => onSelect(lesson)}
                      className={`w-full flex flex-col px-4 py-2 text-left transition-colors border-l-2 ${
                        active ? "bg-blue-50 border-l-blue-500" : "hover:bg-slate-50 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="shrink-0">
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${active ? "border-blue-500" : "border-slate-300"}`}>
                              {active && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs leading-snug flex-1 min-w-0 ${active ? "font-semibold text-blue-800" : "font-medium text-slate-700"}`}>
                          {lesson.title}
                        </p>
                        {mins && (
                          <span className="text-[10px] text-slate-400 shrink-0">{mins}m</span>
                        )}
                      </div>
                      
                      {/* Mini Progress Bar */}
                      {lp && lp.watchedSeconds > 0 && !done && (
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5 ml-6 max-w-[80%]">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(progPercent, 100)}%` }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CoursePlayerPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarTab, setSidebarTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "content";
  });
  const [infoTab, setInfoTab] = useState("Overview");
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [lessonProgressData, setLessonProgressData] = useState([]);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [examStatus, setExamStatus] = useState(null); // { hasExam, lessonsComplete, hasPassed, attemptCount, certificate, questionCount, passingPercentage, timeLimitMinutes }
  const [myReview, setMyReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const lastSyncTimeRef = useRef(0);

  const handleVideoProgress = async (currentTime, duration) => {
    if (!courseId || !activeLesson?._id || !duration) return;
    
    const isCompletedNow = currentTime >= duration * 0.95;
    const alreadyCompleted = completedLessons.has(activeLesson._id.toString());
    
    // Auto-sync every 10 seconds, OR immediately if crossing the 95% threshold
    const now = Date.now();
    if (now - lastSyncTimeRef.current < 10000 && !(isCompletedNow && !alreadyCompleted)) return;
    
    lastSyncTimeRef.current = now;

    try {
      const res = await api.put(`/student/courses/${courseId}/lessons/${activeLesson._id}/progress`, {
        watchedSeconds: Math.floor(currentTime),
        totalSeconds: Math.floor(duration)
      });
      
      if (res.data?.success && res.data?.progress) {
        const updatedProg = res.data.progress;
        setLessonProgressData(updatedProg.lessonProgress || []);
        
        const newCompleted = new Set(
          updatedProg.lessonProgress
            .filter((lp) => lp.isCompleted)
            .map((lp) => lp.lesson?.toString())
        );
        
        // Update state if completed lessons count changed
        if (newCompleted.size !== completedLessons.size) {
          setCompletedLessons(newCompleted);
        }
      }
    } catch (err) {
      console.error("Failed to sync video progress:", err);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/courses/${courseId}/player`);
        const { course: c, progress } = res.data.data;
        setCourse(c);
        if (progress?.lessonProgress) {
          setLessonProgressData(progress.lessonProgress);
          setCompletedLessons(
            new Set(
              progress.lessonProgress
                .filter((lp) => lp.isCompleted)
                .map((lp) => lp.lesson?.toString())
            )
          );
        }
        
        // Check for certificate and reviews
        try {
          const certRes = await api.get(`/certificates/verify-student/${courseId}`);
          if (certRes.data.success) {
            setActiveCertificate(certRes.data.data);
          }
        } catch (err) {
          console.error("Certificate check failed:", err);
        }
        
        try {
          const reviewRes = await reviewService.getMyReview(courseId);
          if (reviewRes.data) {
            setMyReview(reviewRes.data);
            setReviewRating(reviewRes.data.rating);
            setReviewComment(reviewRes.data.comment);
          }
        } catch (err) {
          console.error("Failed to fetch my review:", err);
        }

        try {
          const allReviewsRes = await reviewService.getCourseReviews(courseId);
          setAllReviews(allReviewsRes.data || []);
        } catch (err) {
          console.error("Failed to fetch course reviews:", err);
        }

        // Fetch exam status
        try {
          const examSt = await getExamStatus(courseId);
          setExamStatus(examSt);
        } catch (err) {
          console.error("Exam status check failed:", err);
        }

        const firstLesson = c?.modules?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch (err) {
        setError(err.response?.status === 403 ? "not-enrolled" : "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) return alert("Please select a rating between 1 and 5.");
    setIsSubmittingReview(true);
    try {
      const res = await reviewService.submitReview(courseId, reviewRating, reviewComment);
      setMyReview(res.data);
      // Refresh all reviews list
      try {
        const allReviewsRes = await reviewService.getCourseReviews(courseId);
        setAllReviews(allReviewsRes.data || []);
      } catch (_) {}
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleLessonComplete = async (lessonId) => {
    if (!lessonId || !courseId) return;
    const isCompleted = completedLessons.has(lessonId.toString());
    try {
      if (isCompleted) {
        setCompletedLessons((prev) => {
          const next = new Set(prev);
          next.delete(lessonId.toString());
          return next;
        });
      } else {
        await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
        setCompletedLessons((prev) => new Set([...prev, lessonId.toString()]));
      }
    } catch (err) {
      console.error("Failed to update lesson completion status:", err);
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        if (isCompleted) next.delete(lessonId.toString());
        else next.add(lessonId.toString());
        return next;
      });
    }
  };

  const handleClaimCertificate = async () => {
    if (!courseId) return;
    try {
      setIssuingCertificate(true);
      const res = await api.post("/certificates/issue", { courseId });
      setActiveCertificate(res.data.data);
      navigate(`/certificate/${res.data.data.certificateId}`);
    } catch (err) {
      console.error("Failed to claim certificate:", err);
      alert(err.response?.data?.message || "Failed to generate certificate. Please complete all lessons first.");
    } finally {
      setIssuingCertificate(false);
    }
  };

  const flatLessons = course?.modules?.flatMap((m) => m.lessons ?? []) ?? [];
  const idx = flatLessons.findIndex((l) => l._id === activeLesson?._id);
  const totalLessons = flatLessons.length;
  const completedCount = completedLessons.size;
  const totalDurationSecs = flatLessons.reduce((a, l) => a + (l.duration || 0), 0);
  const totalHours = Math.floor(totalDurationSecs / 3600);
  const totalMins = Math.floor((totalDurationSecs % 3600) / 60);

  // ── States ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (loading) return;
    if (completedCount === totalLessons && totalLessons > 0 && !myReview) {
      if (!sessionStorage.getItem(`hasPromptedReview_${courseId}`)) {
        const timer = setTimeout(() => {
          setIsReviewModalOpen(true);
          sessionStorage.setItem(`hasPromptedReview_${courseId}`, "true");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [completedCount, totalLessons, myReview, courseId, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading course…</p>
        </div>
      </div>
    );
  }

  if (error === "not-enrolled") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-xs">You need to enroll to access this course.</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">
          View Course
        </button>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">Dashboard</button>
      </div>
    );
  }

  const activeModule = course.modules?.find((m) => m.lessons?.some((l) => l._id === activeLesson?._id));

  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  // Find start time for active lesson
  const activeLessonProgress = lessonProgressData.find((lp) => lp.lesson?.toString() === activeLesson?._id?.toString());
  const startTime = activeLessonProgress?.isCompleted ? 0 : (activeLessonProgress?.watchedSeconds || 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Breadcrumb & Top Progress Header ── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate("/courses")} className="hover:text-slate-900 transition-colors shrink-0">Courses</button>
          <span>/</span>
          <span className="text-slate-400 shrink-0">{course.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{course.title}</span>
        </div>

        {/* Top Header Progress Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-700 whitespace-nowrap">
            <span>Course Progress: </span>
            <span className="text-blue-600 font-black">{progressPercentage}%</span>
            <span className="text-slate-400 font-normal ml-1">({completedCount}/{totalLessons})</span>
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* ════ LEFT — video & main content ════ */}
          <div className="flex-1 min-w-0">

            {/* Overall Course Progress Banner Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 border border-blue-100">
                  {progressPercentage}%
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Overall Course Progress</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {completedCount} of {totalLessons} lessons completed
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-56 flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-black text-slate-900 shrink-0">{progressPercentage}%</span>
              </div>
            </div>

            {/* ── Smart Exam / Certificate CTA Banner ── */}
            {totalLessons > 0 && completedCount >= totalLessons && (
              <>
                {/* CASE 1: No exam configured — show old-style cert claim */}
                {(!examStatus || !examStatus.hasExam) && (
                  <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-amber-400 text-slate-900 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base leading-snug">🎉 Congratulations! Course Completed!</h4>
                        <p className="text-xs font-medium text-slate-900/80">Your official CRMISA Certificate of Completion is ready.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClaimCertificate}
                      disabled={issuingCertificate}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{issuingCertificate ? "Generating Certificate..." : "Claim Official Certificate"}</span>
                    </button>
                  </div>
                )}

                {/* CASE 2: Exam exists, student has already PASSED */}
                {examStatus?.hasExam && examStatus?.hasPassed && (
                  <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-emerald-500 text-white border border-emerald-400 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base leading-snug">✅ Exam Passed! Certificate Issued.</h4>
                        <p className="text-xs font-medium text-white/80">
                          Score: {examStatus.certificate?.examScore ?? "—"}% &nbsp;·&nbsp; You've earned your CRMISA certificate.
                        </p>
                      </div>
                    </div>
                    {examStatus.certificate?.certificateId && (
                      <button
                        onClick={() => navigate(`/certificate/${examStatus.certificate.certificateId}`)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-white/90 text-emerald-700 font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>View My Certificate</span>
                      </button>
                    )}
                  </div>
                )}

                {/* CASE 3: Exam exists, NOT yet passed — show Start Exam CTA */}
                {examStatus?.hasExam && !examStatus?.hasPassed && (
                  <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white border border-indigo-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                          🎓 Course Complete — Take Your Exam!
                        </h4>
                        <p className="text-xs font-medium text-white/70">
                          {examStatus.questionCount} questions &nbsp;·&nbsp; Pass ≥{examStatus.passingPercentage}%
                          {examStatus.timeLimitMinutes > 0 && ` · ⏱ ${examStatus.timeLimitMinutes} min limit`}
                          {examStatus.attemptCount > 0 && ` · Attempt #${examStatus.attemptCount + 1}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/course/${courseId}/exam`)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>{examStatus.attemptCount > 0 ? "Retake Exam" : "Start Exam"}</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Exam locked hint (course not complete yet) ── */}
            {examStatus?.hasExam && !examStatus?.hasPassed && totalLessons > 0 && completedCount < totalLessons && (
              <div className="mb-5 p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700">Exam Unlocks After Course Completion</p>
                  <p className="text-[11px] text-slate-500">
                    Complete all {totalLessons} lessons to unlock the certification exam ({examStatus.questionCount} questions, pass ≥{examStatus.passingPercentage}%).
                  </p>
                </div>
              </div>
            )}

            {/* Back + lesson title */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium truncate">{activeModule?.title ?? course.category}</p>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {activeLesson?.title ?? course.title}
                </h1>
                {course.pdfGuideUrl && (
                  <a
                    href={course.pdfGuideUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 ml-4 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors shrink-0"
                    title="Download Course PDF Guide"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF Guide</span>
                  </a>
                )}
              </div>
            </div>

            {/* Video */}
            <VideoPlayer lesson={activeLesson} onProgress={handleVideoProgress} startTime={startTime} />

            {/* Prev / Next */}
            <div className="flex flex-wrap items-center justify-end gap-3 mt-4">

              <div className="flex items-center gap-3">
                <button
                  onClick={() => idx > 0 && setActiveLesson(flatLessons[idx - 1])}
                  disabled={idx <= 0}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-slate-400 font-medium">{idx + 1} / {totalLessons}</span>
                <button
                  onClick={() => idx < flatLessons.length - 1 && setActiveLesson(flatLessons[idx + 1])}
                  disabled={idx >= flatLessons.length - 1}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="hidden lg:flex flex-col w-[300px] xl:w-[330px] shrink-0 sticky top-6 max-h-[calc(100vh-5rem)] bg-white border border-slate-200 rounded-xl overflow-hidden">

            {/* Sidebar top-level tabs: Content | Overview */}
            <div className="flex border-b border-slate-200 shrink-0">
              {[
                { id: "content", label: "Content" },
                { id: "info", label: "Overview" },
                { id: "review", label: "Review" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSidebarTab(id)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                    sidebarTab === id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                  {sidebarTab === id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content tab ── */}
            {sidebarTab === "content" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{completedCount}/{totalLessons}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: totalLessons ? `${(completedCount / totalLessons) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CourseSidebar
                    course={course}
                    activeLesson={activeLesson}
                    completedLessons={completedLessons}
                    lessonProgressData={lessonProgressData}
                    onSelect={setActiveLesson}
                  />
                </div>
              </div>
            )}

            {/* ── Info tab ── */}
            {sidebarTab === "info" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Sub-tabs: Overview / Author / FAQ / Announcements */}
                <div className="flex gap-1 px-3 py-2 border-b border-slate-100 shrink-0 overflow-x-auto">
                  {["Overview", "Author", "FAQ", "Announcements"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setInfoTab(tab)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
                        infoTab === tab
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

                  {infoTab === "Overview" && (
                    <>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1.5">About</h3>
                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <BookOpen className="w-3 h-3 text-slate-400" /> {totalLessons} lessons
                        </span>
                        {(totalHours > 0 || totalMins > 0) && (
                          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {totalHours > 0 && `${totalHours}h `}{totalMins > 0 && `${totalMins}min`}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {course.averageRating?.toFixed(1) ?? "0.0"}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Users className="w-3 h-3 text-slate-400" /> {course.totalEnrollments ?? 0}
                        </span>
                      </div>
                      {course.whatYouWillLearn?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">What You'll Learn</h3>
                          <ul className="space-y-1.5">
                            {course.whatYouWillLearn.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <div className="w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-px">
                                  <Check className="w-2 h-2 text-blue-500" />
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {course.requirements?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">Requirements</h3>
                          <ul className="space-y-1">
                            {course.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-slate-600">
                                <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {infoTab === "Author" && (
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <span className="text-base font-bold text-slate-500">
                          {(course.admin?.name ?? "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{course.admin?.name ?? "Instructor"}</h3>
                        <p className="text-slate-400 mb-1.5">{course.admin?.email}</p>
                        <p className="text-slate-600 leading-relaxed">
                          Expert instructor with deep knowledge in {course.category}.
                        </p>
                      </div>
                    </div>
                  )}

                  {infoTab === "FAQ" && (
                    <div className="space-y-2.5">
                      {[
                        { q: "How long do I have access?", a: course.validityPeriod ? `${course.validityPeriod} months.` : "Lifetime access." },
                        { q: "Is there a certificate?", a: "Yes, upon completing all lessons." },
                        { q: "Mobile accessible?", a: "Yes, fully responsive." },
                      ].map((faq, i) => (
                        <div key={i} className="border border-slate-100 rounded-lg p-3">
                          <h4 className="font-semibold text-slate-900 mb-1">{faq.q}</h4>
                          <p className="text-slate-500">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {infoTab === "Announcements" && (
                    <div className="text-center py-8 text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No announcements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Review tab ── */}
            {sidebarTab === "review" && (
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                {/* Submit / Edit Review Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    {myReview ? "✏️ Update Your Review" : "⭐ Leave a Review"}
                  </h3>
                  {completedCount < totalLessons ? (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs border border-amber-200">
                      Complete all lessons to leave a review.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)}
                            className={`p-0.5 transition-colors ${star <= reviewRating ? "text-amber-400" : "text-slate-300"}`}>
                            <Star className="w-7 h-7 fill-current" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you think of this course?"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                        required
                      />
                      <button type="submit" disabled={isSubmittingReview || !reviewRating}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50">
                        {isSubmittingReview ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* All Reviews List */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">All Reviews ({allReviews.length})</h3>
                  {allReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <div key={review._id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              {review.student?.avatar ? (
                                <img src={review.student.avatar} alt={review.student?.name} className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <span className="text-blue-700 font-bold text-xs">{review.student?.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{review.student?.name || 'Anonymous'}</p>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: curriculum + info below video */}
        <div className="lg:hidden mt-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[600px]">
            {/* Sidebar top-level tabs: Content | Overview */}
            <div className="flex border-b border-slate-200 shrink-0">
              {[
                { id: "content", label: "Content" },
                { id: "info", label: "Overview" },
                { id: "review", label: "Review" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSidebarTab(id)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                    sidebarTab === id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                  {sidebarTab === id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content tab ── */}
            {sidebarTab === "content" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{completedCount}/{totalLessons}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: totalLessons ? `${(completedCount / totalLessons) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CourseSidebar
                    course={course}
                    activeLesson={activeLesson}
                    completedLessons={completedLessons}
                    lessonProgressData={lessonProgressData}
                    onSelect={setActiveLesson}
                  />
                </div>
              </div>
            )}

            {/* ── Info tab ── */}
            {sidebarTab === "info" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Sub-tabs: Overview / Author / FAQ / Announcements */}
                <div className="flex gap-1 px-3 py-2 border-b border-slate-100 shrink-0 overflow-x-auto">
                  {["Overview", "Author", "FAQ", "Announcements"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setInfoTab(tab)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
                        infoTab === tab
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

                  {infoTab === "Overview" && (
                    <>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1.5">About</h3>
                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <BookOpen className="w-3 h-3 text-slate-400" /> {totalLessons} lessons
                        </span>
                        {(totalHours > 0 || totalMins > 0) && (
                          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {totalHours > 0 && `${totalHours}h `}{totalMins > 0 && `${totalMins}min`}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {course.averageRating?.toFixed(1) ?? "0.0"}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Users className="w-3 h-3 text-slate-400" /> {course.totalEnrollments ?? 0}
                        </span>
                      </div>
                      {course.whatYouWillLearn?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">What You'll Learn</h3>
                          <ul className="space-y-1.5">
                            {course.whatYouWillLearn.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <div className="w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-px">
                                  <Check className="w-2 h-2 text-blue-500" />
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {course.requirements?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">Requirements</h3>
                          <ul className="space-y-1">
                            {course.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-slate-600">
                                <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {infoTab === "Author" && (
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <span className="text-base font-bold text-slate-500">
                          {(course.admin?.name ?? "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{course.admin?.name ?? "Instructor"}</h3>
                        <p className="text-slate-400 mb-1.5">{course.admin?.email}</p>
                        <p className="text-slate-600 leading-relaxed">
                          Expert instructor with deep knowledge in {course.category}.
                        </p>
                      </div>
                    </div>
                  )}

                  {infoTab === "FAQ" && (
                    <div className="space-y-2.5">
                      {[
                        { q: "How long do I have access?", a: course.validityPeriod ? `${course.validityPeriod} months.` : "Lifetime access." },
                        { q: "Is there a certificate?", a: "Yes, upon completing all lessons." },
                        { q: "Mobile accessible?", a: "Yes, fully responsive." },
                      ].map((faq, i) => (
                        <div key={i} className="border border-slate-100 rounded-lg p-3">
                          <h4 className="font-semibold text-slate-900 mb-1">{faq.q}</h4>
                          <p className="text-slate-500">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {infoTab === "Announcements" && (
                    <div className="text-center py-8 text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No announcements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Review tab (mobile) ── */}
            {sidebarTab === "review" && (
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                {/* Submit / Edit Review Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    {myReview ? "✏️ Update Your Review" : "⭐ Leave a Review"}
                  </h3>
                  {completedCount < totalLessons ? (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs border border-amber-200">
                      Complete all lessons to leave a review.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)}
                            className={`p-0.5 transition-colors ${star <= reviewRating ? "text-amber-400" : "text-slate-300"}`}>
                            <Star className="w-7 h-7 fill-current" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you think of this course?"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                        required
                      />
                      <button type="submit" disabled={isSubmittingReview || !reviewRating}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50">
                        {isSubmittingReview ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* All Reviews List */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">All Reviews ({allReviews.length})</h3>
                  {allReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <div key={review._id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              {review.student?.avatar ? (
                                <img src={review.student.avatar} alt={review.student?.name} className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <span className="text-blue-700 font-bold text-xs">{review.student?.name?.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{review.student?.name || 'Anonymous'}</p>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <CourseReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        courseId={courseId}
        existingReview={myReview}
        onSuccess={(rev) => {
          setMyReview(rev);
          // Also optionally refetch all reviews if we wanted, but not strictly necessary here 
          // if we already have logic to refresh or we just let it be.
          reviewService.getCourseReviews(courseId).then(res => setAllReviews(res.data || [])).catch(() => {});
        }}
      />
    </div>
  );
}
