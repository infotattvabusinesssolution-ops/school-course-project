import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Play,
  Award,
  BookOpen,
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

function VideoPlayer({ videoUrl }) {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
        <p className="text-sm text-slate-400">No video available</p>
      </div>
    );
  }

  const ytId = getYouTubeId(videoUrl);
  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title="Course Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideo(videoUrl)) {
    return (
      <CustomVideoPlayer
        src={videoUrl}
        title="Course Video"
        autoPlay={false}
      />
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl bg-slate-900 flex flex-col items-center justify-center gap-3">
      <Play className="w-12 h-12 text-white/30" />
      <a href={videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-sm">
        Open video link
      </a>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CoursePlayerPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [examStatus, setExamStatus] = useState(null); 
  
  const [myReview, setMyReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/courses/${courseId}/player`);
        setCourse(res.data.data.course);
        
        // Check for certificate
        try {
          const certRes = await api.get(`/certificates/verify-student/${courseId}`);
          if (certRes.data.success) {
            setActiveCertificate(certRes.data.data);
          }
        } catch (err) {
          console.error("Certificate check failed:", err);
        }
        
        // Check for reviews
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
      setIsReviewModalOpen(false);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
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
      alert(err.response?.data?.message || "Failed to generate certificate.");
    } finally {
      setIssuingCertificate(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Breadcrumb Header ── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate("/courses")} className="hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1">
             <ChevronLeft className="w-4 h-4" />
             Courses
          </button>
          <span>/</span>
          <span className="text-slate-400 shrink-0">{course.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{course.title}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ── Smart Exam / Certificate CTA Banner ── */}
        <div className="mb-8">
          {/* CASE 1: No exam configured — show old-style cert claim */}
          {(!examStatus || !examStatus.hasExam) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-400 text-slate-900 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">🎉 Course Unlocked!</h4>
                  <p className="text-xs font-medium text-slate-900/80">Your official CRMISA Certificate of Completion is ready to claim.</p>
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
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500 text-white border border-emerald-400 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white border border-indigo-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                    🎓 Course Exam Unlocked!
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
        </div>

        {/* ── Main Video Area ── */}
        <div className="mb-8">
           <VideoPlayer videoUrl={course.videoUrl} />
        </div>

        {/* ── Course Info & Resources ── */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
             <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{course.title}</h1>
                {course.subtitle && (
                   <p className="text-lg text-slate-600 mb-6">{course.subtitle}</p>
                )}
                
                <h3 className="text-lg font-bold text-slate-900 mb-3">Course Description</h3>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{course.description}</p>
             </div>
             
             {/* Resources Panel */}
             <div className="w-full md:w-72 shrink-0 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Course Resources
                </h3>
                {course.pdfGuideUrl ? (
                  <a 
                    href={course.pdfGuideUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                     <FileText className="w-4 h-4" />
                     Download PDF Guide
                  </a>
                ) : (
                  <div className="text-sm text-slate-500 italic text-center p-4 bg-white rounded-lg border border-slate-100">
                    No resources available
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    {myReview ? "Edit Your Review" : "Leave a Review"}
                  </button>
                </div>
             </div>
           </div>
        </div>
      </div>

      <CourseReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        isSubmittingReview={isSubmittingReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
