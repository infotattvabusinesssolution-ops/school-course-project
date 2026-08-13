import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BookOpenIcon, AwardBadgeIcon, CheckIcon, UserIcon } from "../components/icons/Icons";
import { PlayCircle, Download, Play, FileText, Lock } from "lucide-react";
import CourseReviewModal from "../components/CourseReviewModal";
import VideoModal from "../components/VideoModal";
import { useAuth } from "../context/AuthContext";

export default function DashboardCourses() {
  const { loading, dashboardData, examStatuses, reviewStatuses, setReviewStatuses } = useOutletContext();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalCourseId, setReviewModalCourseId] = useState(null);
  
  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: null, title: "" });
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const enrolledCourses = dashboardData?.continueLearning || [];
  const stats = dashboardData?.stats || { enrolledCourses: 0, completedCourses: 0, certificatesEarned: 0 };

  const handleWatchVideo = (course) => {
    setActiveVideo({ url: course.videoUrl, title: course.title });
    setIsVideoModalOpen(true);
  };

  const getDownloadUrl = (url) => {
    if (!url) return "#";
    // If it's a cloudinary URL, append fl_attachment to force download
    if (url.includes('cloudinary.com') && !url.includes('fl_attachment')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }
    return url;
  };

  return (
    <div className="space-y-8">
      {/* Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
          <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">{stats.enrolledCourses}</h3>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Enrolled Courses</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm cursor-pointer hover:border-amber-400 group" onClick={() => navigate('/dashboard/exams')}>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 rounded-lg group-hover:scale-105 transition-transform">
            <AwardBadgeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">{stats.certificatesEarned}</h3>
            <p className="text-[10px] sm:text-xs font-semibold text-amber-700">Certificates Earned</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
          <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
            <CheckIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">{stats.completedCourses}</h3>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Courses Completed</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
          <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 uppercase">{user?.role || "Student"}</h3>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Account Type</p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">No courses yet</h3>
            <p className="text-slate-500 mb-6 text-sm">You haven't enrolled in any courses yet.</p>
            <button onClick={() => navigate("/courses")} className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl transition-colors hover:bg-slate-800">Browse Courses</button>
          </div>
        ) : (
          enrolledCourses.map((course) => {
            const hasVideo = !!course.videoUrl;
            const hasPdf = !!course.pdfGuideUrl;

            return (
              <div 
                key={course.courseId} 
                className="bg-white border border-slate-200 flex flex-col h-full cursor-pointer hover:border-slate-400 transition-colors group shadow-sm hover:shadow-md" 
                onClick={() => handleWatchVideo(course)}
              >
                {/* 4:3 Aspect Ratio Image Container */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 shrink-0 border-b border-slate-200 overflow-hidden">
                  {(course.thumbnailUrl || course.defaultThumbnailUrl) ? (
                    <img 
                      src={course.thumbnailUrl || course.defaultThumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  {hasVideo && (
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-slate-900 ml-1" />
                      </div>
                    </div>
                  )}
                  {/* Floating Level Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-slate-900 uppercase tracking-wide border border-white/50 shadow-sm">
                    {course.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  {course.subtitle && (
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      {course.subtitle}
                    </p>
                  )}

                  {/* Bottom Action Bar */}
                  <div className="mt-auto pt-5 flex gap-3">
                    <a
                      href={hasPdf ? getDownloadUrl(course.pdfGuideUrl) : "#"}
                      download
                      target={hasPdf ? "_blank" : "_self"}
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasPdf) e.preventDefault();
                      }}
                      className={`flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-sm text-xs font-bold transition-all border ${
                        hasPdf 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <FileText className="w-4 h-4 mb-1" />
                      {hasPdf ? "Download PDF" : "No PDF"}
                    </a>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasVideo) handleWatchVideo(course);
                      }}
                      disabled={!hasVideo}
                      className={`flex-1 flex flex-col items-center justify-center py-2.5 px-2 rounded-sm text-xs font-bold transition-all border ${
                        hasVideo
                          ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {hasVideo ? (
                        <>
                          <Play className="w-4 h-4 mb-1" />
                          Watch Video
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mb-1" />
                          No Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CourseReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        courseId={reviewModalCourseId}
        onSuccess={() => {
          setReviewStatuses(prev => ({ ...prev, [reviewModalCourseId]: true }));
        }}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setActiveVideo({ url: null, title: "" });
        }}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
      />
    </div>
  );
}
