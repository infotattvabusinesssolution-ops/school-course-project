import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { courseService } from "../../services/courseService";

// Force reload

export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    // Fetch courses for the filter dropdown
    courseService.getAdminCourses()
      .then(res => setCourses(res.data || []))
      .catch(console.error);
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = "/reviews/admin/all";
      if (selectedCourseId) {
        url += `?courseId=${selectedCourseId}`;
      }
      const res = await api.get(url);
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedCourseId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      alert("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-headline-sm font-bold text-on-surface">Course Reviews</h2>
        <div className="w-full sm:w-auto">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-64 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400">progress_activity</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="pb-4 font-bold text-on-surface text-label-md">Student</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Course</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Rating</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Review</th>
                <th className="pb-4 font-bold text-on-surface text-label-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest">
                  <td className="py-4">
                    <p className="font-bold text-crmisa-accentNavy text-sm">{r.student?.name}</p>
                    <p className="text-xs text-slate-500">{r.student?.email}</p>
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-700">{r.course?.title}</td>
                  <td className="py-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-[16px] ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} style={{ fontVariationSettings: i < r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 max-w-xs break-words">
                    {r.comment}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
