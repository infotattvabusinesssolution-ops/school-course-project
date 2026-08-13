import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Play,
  FileText,
  Video,
  Check,
  Users,
  BarChart,
  Download,
  X,
  PlayCircle
} from "lucide-react";
import api from "../lib/axios";
import reviewService from "../services/reviewService";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import CourseReviewModal from "../components/CourseReviewModal";

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
      <div className="w-full aspect-video bg-crmisa-navy flex flex-col items-center justify-center gap-3">
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
      <div className="w-full aspect-video bg-crmisa-darkNavy shadow-lg">
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
        autoPlay={true}
      />
    );
  }

  return (
    <div className="w-full aspect-video bg-crmisa-navy flex flex-col items-center justify-center gap-3">
      <Play className="w-12 h-12 text-white/30" />
      <a href={videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-sm">
        Open video link
      </a>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CourseDetailsPremiumPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [myReview, setMyReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/courses/${courseId}/player`);
        setCourse(res.data.data.course);
        
        // Check for my review
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

        // Fetch all course reviews
        try {
          const allReviewsRes = await reviewService.getCourseReviews(courseId);
          setAllReviews(allReviewsRes.data || []);
        } catch (err) {
          console.error("Failed to fetch course reviews:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crmisa-navy"></div>
      </div>
    );
  }

  if (error === "not-enrolled") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-2xl font-bold text-crmisa-navy">Access Restricted</h2>
        <p className="text-slate-500 text-lg max-w-sm">You need to enroll to access the premium content for this course.</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="px-6 py-2.5 bg-crmisa-navy text-white text-sm font-semibold rounded-lg mt-4">
          View Public Course Details
        </button>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-2xl font-bold text-crmisa-navy">Course Not Found</h2>
        <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-crmisa-navy text-white text-sm font-semibold rounded-lg">Dashboard</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans pt-24 pb-24 text-crmisa-accentNavy">
      
      
      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (Course Details) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Top Info Section: Thumbnail + Title */}
            <div className="flex flex-col sm:flex-row gap-6 items-start border-b border-slate-200 pb-8">
              <div className="w-full sm:w-[45%] aspect-[4/3] rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-100 flex items-center justify-center">
                {(course.thumbnailUrl || course.defaultThumbnailUrl) ? (
                  <img 
                    src={course.thumbnailUrl || course.defaultThumbnailUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video className="w-12 h-12 text-slate-300" />
                )}
              </div>
              
              <div className="flex-1 flex flex-col pt-1">
                <span className="inline-block text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 w-fit border border-blue-100">
                  {course.category}
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-crmisa-navy mb-3 leading-tight">
                  {course.title}
                </h1>
                
                {course.subtitle && (
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {course.subtitle}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-600 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="font-bold text-crmisa-navy">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
                    <span>({course.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{course.totalEnrollments || 0} Students</span>
                  </div>
                </div>
              </div>
            </div>
            
            <section>
              <h2 className="text-2xl font-bold text-crmisa-navy mb-4">About This Course</h2>
              <div className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                <p>{course.description}</p>
              </div>
            </section>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-crmisa-navy mb-6">What you'll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crmisa-navy shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Student Reviews Section */}
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-crmisa-navy mb-6">Student Reviews</h2>
              
              <div className="flex items-center gap-4 mb-8 bg-slate-50 p-6 border border-slate-200 rounded-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold text-crmisa-navy">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</div>
                  <div className="flex items-center justify-center gap-1 my-2 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(course.averageRating || 0) ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">Course Rating</div>
                </div>
              </div>

              {allReviews.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-slate-200 bg-slate-50">
                  No reviews yet. Be the first to review this course after you complete it!
                </div>
              ) : (
                <div className="space-y-6">
                  {allReviews.map((review) => (
                    <div key={review._id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          {review.student?.avatar ? (
                            <img src={review.student.avatar} alt={review.student?.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-blue-700 font-bold text-lg">
                              {review.student?.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-crmisa-navy">{review.student?.name || 'Anonymous User'}</h4>
                            <span className="text-xs text-slate-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-current' : 'text-slate-300'}`} />
                            ))}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Sticky Premium Sidebar) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden">
              
              <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
                <h3 className="text-2xl font-bold text-crmisa-navy mb-2">Premium Content</h3>
                <p className="text-sm text-slate-500">You have full access to this course.</p>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                
                {course.videoUrl ? (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 group"
                  >
                    <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Watch Course Video
                  </button>
                ) : (
                  <div className="w-full py-4 bg-slate-100 text-slate-400 font-bold text-lg rounded-xl flex items-center justify-center gap-3 border border-slate-200">
                    <Video className="w-6 h-6" /> No Video Available
                  </div>
                )}

                {course.pdfGuideUrl && (
                  <>
                    <a
                      href={course.pdfGuideUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-semibold text-lg rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" /> View PDF Guide
                    </a>
                    
                    <a
                      href={course.pdfGuideUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </>
                )}

                <div className="pt-6 mt-6 border-t border-slate-200">
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5 fill-current" /> 
                    {myReview ? "Edit Your Review" : "Leave a Review"}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      
      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl bg-crmisa-darkNavy rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-0 right-0 z-10 p-4">
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="w-10 h-10 bg-crmisa-darkNavy/50 hover:bg-crmisa-darkNavy text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full aspect-video">
              <VideoPlayer videoUrl={course.videoUrl} />
            </div>
          </div>
        </div>
      )}


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
