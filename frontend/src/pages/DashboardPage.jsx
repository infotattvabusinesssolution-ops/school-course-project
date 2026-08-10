import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  AwardBadgeIcon,
  CheckIcon,
  UserIcon,
} from "../components/icons/Icons";
import { PlayCircle, Award, ExternalLink, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { downloadPdf } from "../utils/downloadHelper";

export default function DashboardPage({
  onLogout,
  setActivePage,
  setSelectedCourseId,
}) {
  const [activeTab, setActiveTab] = useState("courses");
  const [dashboardData, setDashboardData] = useState(null);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [isCertListOpen, setIsCertListOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, ebooksRes, certsRes] = await Promise.all([
          api.get("/student/dashboard"),
          api.get("/student/purchased-ebooks"),
          api.get("/certificates/my-certificates").catch(() => ({ data: { data: [] } })),
        ]);
        setDashboardData(dashRes.data.data);
        setPurchasedEbooks(ebooksRes.data.purchases || []);
        setMyCertificates(certsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const enrolledCourses = dashboardData?.continueLearning || [];
  const stats = dashboardData?.stats || { enrolledCourses: 0, completedCourses: 0, certificatesEarned: 0 };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-16">
      
      {/* Light Header Section */}
      <div className="pt-28 pb-10 lg:pt-32 lg:pb-12 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Active Student</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user?.name || "Student"}!
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                <span className="font-semibold text-slate-700">Email:</span> {user?.email}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* 4 Stat Metric Cards - Flat Design (2 cols x 2 rows on Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 shrink-0 rounded-lg">
              <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{stats.enrolledCourses}</h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                Enrolled Courses
              </p>
            </div>
          </div>

          <div
            onClick={() => setIsCertListOpen(true)}
            className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0 rounded-lg group-hover:scale-105 transition-transform">
              <AwardBadgeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                {myCertificates.length > 0 ? myCertificates.length : stats.certificatesEarned}
              </h3>
              <p className="text-[10px] sm:text-xs font-semibold text-amber-700 group-hover:underline truncate">
                Certificates Earned
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 shrink-0 rounded-lg">
              <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{stats.completedCourses}</h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                Courses Completed
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 shrink-0 rounded-lg">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 uppercase truncate">
                {user?.role || "Student"}
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
                Account Type
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "courses"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab("ebooks")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "ebooks"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>My E-Books</span>
            {purchasedEbooks.length > 0 && (
              <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {purchasedEbooks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "benefits"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Included Benefits
          </button>
        </div>

        {/* Tab 1: My Courses */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-16 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="col-span-full text-center py-20 border border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">No courses yet</h3>
                <p className="text-slate-500 mb-6">You haven't enrolled in any courses yet.</p>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-6 py-2.5 bg-slate-900 text-white font-medium text-sm transition-colors hover:bg-slate-800"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              enrolledCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white border border-slate-200 flex flex-col group cursor-pointer hover:border-slate-300 transition-colors"
                  onClick={() => navigate(`/course-player/${course.courseId}`)}
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                    {course.thumbnailUrl ? (
                       <img
                         src={course.thumbnailUrl}
                         alt={course.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center">
                          <PlayCircle className="w-10 h-10 text-slate-300" />
                       </div>
                    )}
                    <span
                      className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 uppercase bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200"
                    >
                      {course.completionPercentage >= 100 ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="space-y-1 mb-6">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Progress</span>
                        <span>{course.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${course.completionPercentage >= 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${course.completionPercentage}%` }}
                        ></div>
                      </div>
                      <button
                        className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-colors"
                      >
                        {course.completionPercentage >= 100 ? "Review Course" : "Continue Learning"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: My E-Books */}
        {activeTab === "ebooks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedEbooks.length === 0 ? (
              <div className="col-span-full text-center py-20 border border-slate-200 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Purchased E-Books</h3>
                <p className="text-slate-500 mb-6 text-sm">You haven't purchased any digital handbooks yet.</p>
                <button
                  onClick={() => navigate("/ebooks")}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors hover:bg-slate-800"
                >
                  Browse E-Book Store
                </button>
              </div>
            ) : (
              purchasedEbooks.map((purchase) => {
                const book = purchase.ebook || {};
                return (
                  <div
                    key={purchase._id}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex gap-4 items-start">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-cover rounded border border-slate-300 flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-22 bg-slate-900 text-white font-bold text-xs flex items-center justify-center rounded p-2 text-center flex-shrink-0">
                          PDF
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Unlocked Handbook
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                          {book.title || "Trade E-Book"}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Purchased: {new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-extrabold text-slate-900">
                        Paid: <span className="font-black">₹{purchase.amountPaid || book.price}</span>
                      </div>

                      {book.pdfUrl ? (
                        <button
                          onClick={() => downloadPdf(book.pdfUrl, `${book.title || "Handbook"}.pdf`)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Download PDF</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold italic">
                          PDF Processing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Included Benefits */}
        {activeTab === "benefits" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900">
                  Registered Business Entity
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Access your official CIPC company registration details.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p>
                  <strong className="text-slate-900 font-semibold">Entity:</strong>{" "}
                  Pending Setup
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Reg Status:</strong>{" "}
                  Awaiting Verification
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900">
                  Professional Business Website
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your custom trade domain and e-commerce import/export showcase
                site status.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p>
                  <strong className="text-slate-900 font-semibold">Website:</strong>{" "}
                  Not Assigned
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Hosting:</strong>{" "}
                  Inactive
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Earned Certificates List Modal */}
      {isCertListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900">My Earned Certificates</h3>
              </div>
              <button
                onClick={() => setIsCertListOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {myCertificates.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Certificates Earned Yet</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Complete 100% of the lessons in any enrolled course to claim your official certificate!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {myCertificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="p-4 border border-slate-200 rounded-xl flex items-center justify-between gap-4 hover:border-amber-400 hover:bg-amber-50/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {cert.course?.title || "Course Program"}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        ID: {cert.certificateId}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/certificate/${cert.certificateId}`);
                        setIsCertListOpen(false);
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
