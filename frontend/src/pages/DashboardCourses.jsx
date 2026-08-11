import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BookOpenIcon, AwardBadgeIcon, CheckIcon, UserIcon } from "../components/icons/Icons";
import { PlayCircle } from "lucide-react";
import CourseReviewModal from "../components/CourseReviewModal";
import { useAuth } from "../context/AuthContext";

export default function DashboardCourses() {
  const { loading, dashboardData, examStatuses, reviewStatuses, setReviewStatuses } = useOutletContext();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalCourseId, setReviewModalCourseId] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const enrolledCourses = dashboardData?.continueLearning || [];
  const stats = dashboardData?.stats || { enrolledCourses: 0, completedCourses: 0, certificatesEarned: 0 };

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
            const courseComplete = course.completionPercentage >= 100;
            return (
              <div key={course.courseId} className="bg-white border border-slate-200 rounded-2xl flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => navigate(`/course-player/${course.courseId}`)}>
                <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><PlayCircle className="w-10 h-10 text-slate-300" /></div>
                  )}
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 uppercase bg-white/90 backdrop-blur-sm text-slate-900 rounded-md shadow-sm">
                    {courseComplete ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="space-y-1 mb-6">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>Progress</span>
                        <span>{course.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${courseComplete ? "bg-green-500" : "bg-blue-600"}`} style={{ width: `${course.completionPercentage}%` }}></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${courseComplete ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"}`} onClick={(e) => { e.stopPropagation(); navigate(`/course-player/${course.courseId}`); }}>
                        {courseComplete ? "Review Course" : "Continue Learning"}
                      </button>
                      {courseComplete && reviewStatuses[course.courseId] === false && (
                        <button className="px-4 py-2.5 border border-slate-200 font-bold text-sm rounded-xl transition-colors bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shrink-0" onClick={(e) => { e.stopPropagation(); setReviewModalCourseId(course.courseId); setIsReviewModalOpen(true); }}>
                          Rate
                        </button>
                      )}
                    </div>
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
    </div>
  );
}
