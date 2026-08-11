import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AwardBadgeIcon } from "../components/icons/Icons";
import { Award, Lock, BookOpen, ExternalLink } from "lucide-react";

export default function DashboardExams() {
  const { dashboardData, examStatuses } = useOutletContext();
  const navigate = useNavigate();

  const enrolledCourses = dashboardData?.continueLearning || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrolledCourses.length === 0 ? (
        <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Exams Available</h3>
          <p className="text-slate-500 mb-6 text-sm">Enroll in a course and complete it to unlock exams.</p>
        </div>
      ) : (
        enrolledCourses.map((course) => {
          const es = examStatuses[course.courseId];
          const courseComplete = course.completionPercentage >= 100;
          
          if (!es?.hasExam) return null;

          return (
            <div key={`exam-${course.courseId}`} className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-5 transition-all ${courseComplete ? 'border-slate-200 hover:shadow-md' : 'border-slate-100 opacity-75 grayscale-[0.2]'}`}>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${es.hasPassed ? 'bg-amber-50 text-amber-600 border-amber-200' : courseComplete ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {es.hasPassed ? <AwardBadgeIcon className="w-5 h-5"/> : courseComplete ? <BookOpen className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}
                  </div>
                  {es.hasPassed ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-md">Passed</span>
                  ) : courseComplete ? (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-md">Available</span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-md">Locked</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 pt-2">{course.title} Final Exam</h3>
                <p className="text-xs font-medium text-slate-500">{courseComplete ? 'Course completed. You can now take the exam.' : `Complete course to unlock (${course.completionPercentage}% done)`}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {es.hasPassed ? (
                   <button onClick={() => navigate(`/certificate/${es.certificate.certificateId}`)} className="w-full py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                     View Certificate <ExternalLink className="w-4 h-4"/>
                   </button>
                ) : courseComplete ? (
                  <button onClick={() => navigate(`/course/${course.courseId}/exam`)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                    Start Exam
                  </button>
                ) : (
                  <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm cursor-not-allowed">
                    Locked
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
