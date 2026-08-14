import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AwardBadgeIcon } from "../components/icons/Icons";
import { Award, Lock, BookOpen, ExternalLink, Loader2 } from "lucide-react";
import api from "../lib/axios";

export default function DashboardExams() {
  const { dashboardData, examStatuses } = useOutletContext();
  const navigate = useNavigate();
  const [loadingPayment, setLoadingPayment] = useState(null);

  const enrolledCourses = dashboardData?.continueLearning || [];

  const handleEnrollReExam = async (courseId) => {
    try {
      setLoadingPayment(courseId);
      const res = await api.post("/payments/create-reexam-payment", { courseId });
      if (res.data.success && res.data.actionUrl && res.data.payload) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = res.data.actionUrl;
        
        for (const key in res.data.payload) {
          if (res.data.payload.hasOwnProperty(key)) {
            const hiddenField = document.createElement("input");
            hiddenField.type = "hidden";
            hiddenField.name = key;
            hiddenField.value = res.data.payload[key];
            form.appendChild(hiddenField);
          }
        }
        
        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Failed to generate payment form.");
        setLoadingPayment(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to initiate payment");
      setLoadingPayment(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrolledCourses.length === 0 ? (
        <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-crmisa-navy mb-2">No Exams Available</h3>
          <p className="text-slate-500 mb-6 text-sm">Enroll in a course and complete it to unlock exams.</p>
        </div>
      ) : (
        enrolledCourses.map((course) => {
          const es = examStatuses[course.courseId];
          
          if (!es?.hasExam) return null;

          return (
            <div key={`exam-${course.courseId}`} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${es.hasPassed ? 'bg-amber-50 text-amber-600 border-amber-200' : es.hasFailed ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                    {es.hasPassed ? <AwardBadgeIcon className="w-5 h-5"/> : <BookOpen className="w-5 h-5"/>}
                  </div>
                  {es.hasPassed ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-md">Passed</span>
                  ) : es.hasFailed ? (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-1 rounded-md">Failed</span>
                  ) : (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-md">Available</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-crmisa-navy line-clamp-2 pt-2">{course.title} Final Exam</h3>
                <p className="text-xs font-medium text-slate-500">
                  {es.hasPassed 
                    ? 'You have passed this exam.' 
                    : es.hasMaxAttemptsReached 
                      ? 'Maximum attempts reached.'
                      : `Attempt ${es.attemptCount + 1} of ${es.maxAttempts || 3}`}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {es.hasPassed ? (
                   <button onClick={() => navigate(`/certificate/${es.certificate.certificateId}`)} className="w-full py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                     View Certificate <ExternalLink className="w-4 h-4"/>
                   </button>
                ) : es.hasMaxAttemptsReached ? (
                  <button onClick={() => navigate(`/course/${course.courseId}`)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                    Repurchase Course
                  </button>
                ) : es.hasFailed && !es.reexamPaid ? (
                  <button disabled={loadingPayment === course.courseId} onClick={() => handleEnrollReExam(course.courseId)} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                    {loadingPayment === course.courseId ? <Loader2 className="w-4 h-4 animate-spin" /> : `Enroll for Attempt ${es.attemptCount + 1} (R${es.reExamFee || 500})`}
                  </button>
                ) : (
                  <button onClick={() => navigate(`/course/${course.courseId}/exam`)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                    {es.hasFailed && es.reexamPaid ? `Start Attempt ${es.attemptCount + 1}` : 'Start Exam'}
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
