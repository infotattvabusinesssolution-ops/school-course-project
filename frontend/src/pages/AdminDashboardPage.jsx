import React, { useState, useEffect } from "react";
import { BookOpenIcon, UserIcon, CheckIcon } from "../components/icons/Icons";
import { courseService } from "../services/courseService";

export default function AdminDashboardPage({
  onLogout,
  setActivePage,
  setSelectedCourseId,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminInfo = {
    name: "CRMISA Admin",
    status: "Super Admin",
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAdminCourses();
        setCourses(data.data || []);
      } catch (error) {
        console.error("Error fetching admin courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.totalEnrollments || 0),
    0,
  );
  const totalRevenue = courses.reduce(
    (sum, course) => sum + (course.totalRevenue || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 animate-fade-in py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Banner Card */}
        <div className="bg-gradient-to-r from-crmisa-darkNavy via-crmisa-navy to-crmisa-accentNavy text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-400/20 border border-sky-300/30 text-sky-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>{adminInfo.status}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, Admin!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Manage your courses, view enrollments, and track revenue.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setActivePage("admin-create-course")}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
            >
              + Create New Course
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 shadow backdrop-blur-sm transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <UserIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {totalStudents}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Total Students
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {courses.filter((c) => c.status === "PUBLISHED").length}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Published Courses
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <span className="font-bold text-xl">$</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                R{totalRevenue.toFixed(2)}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Total Revenue
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <CheckIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {courses.filter((c) => c.status === "DRAFT").length}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Draft Courses
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-extrabold transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-crmisa-navy text-crmisa-navy"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Manage Courses
          </button>
        </div>

        {/* Tab 1: Manage Courses */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-xl text-slate-900">
                Your Courses
              </h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-100 animate-pulse rounded-xl w-full"
                  ></div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <BookOpenIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-slate-700 font-bold mb-1">
                  No Courses Yet
                </h4>
                <p className="text-slate-500 text-sm mb-4">
                  You haven't created any courses yet.
                </p>
                <button
                  onClick={() => setActivePage("admin-create-course")}
                  className="px-5 py-2 bg-crmisa-navy text-white rounded-lg text-sm font-bold shadow hover:bg-crmisa-accentNavy transition-colors"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm"
                  >
                    <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <BookOpenIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-extrabold text-base text-slate-900 truncate">
                        {course.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm ${
                            course.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {course.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Price: R{course.price}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setActivePage("admin-create-course");
                      }}
                      className="px-5 py-2 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 rounded-lg font-bold text-sm transition-colors border border-sky-200 shadow-sm"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
