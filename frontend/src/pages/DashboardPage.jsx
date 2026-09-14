import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  AwardBadgeIcon,
  CheckIcon,
  UserIcon,
} from "../components/icons/Icons";
import {
  PlayCircle,
  Award,
  ExternalLink,
  X,
  Lock,
  BookOpen,
  CheckCircle,
  Menu,
  Settings,
  Camera
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { downloadPdf } from "../utils/downloadHelper";
import { getExamStatus } from "../services/exam.service";
import reviewService from "../services/reviewService";
import CourseReviewModal from "../components/CourseReviewModal";

export default function DashboardPage({
  onLogout,
  setActivePage,
  setSelectedCourseId,
}) {
  const [activeTab, setActiveTab] = useState("courses");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [examStatuses, setExamStatuses] = useState({}); // { [courseId]: examStatusObj }
  const [reviewStatuses, setReviewStatuses] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalCourseId, setReviewModalCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Settings States
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

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

        // Fetch exam status and review status for each enrolled course
        const courses = dashRes.data.data?.continueLearning || [];
        const examStatusMap = {};
        const reviewStatusMap = {};
        await Promise.all(
          courses.map(async (c) => {
            try {
              const st = await getExamStatus(c.courseId);
              examStatusMap[c.courseId] = st;
            } catch (_) {}

            if (c.completionPercentage >= 100) {
              try {
                const rev = await reviewService.getMyReview(c.courseId);
                reviewStatusMap[c.courseId] = !!rev.data;
              } catch (_) {}
            }
          }),
        );
        setExamStatuses(examStatusMap);
        setReviewStatuses(reviewStatusMap);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleUpdateProfilePhoto = async () => {
    if (!profilePhoto) return;
    try {
      setProfileMsg({ text: "Uploading...", type: "info" });
      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);
      const res = await api.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfileMsg({ text: "Profile photo updated. Please refresh to see changes globally.", type: "success" });
      setProfilePhoto(null);
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || "Failed to update profile photo", type: "error" });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setProfileMsg({ text: "New passwords do not match", type: "error" });
      return;
    }
    if (!oldPassword || !newPassword) {
      setProfileMsg({ text: "Please fill all password fields", type: "error" });
      return;
    }
    try {
      setProfileMsg({ text: "Updating...", type: "info" });
      await api.put("/users/reset-password", { oldPassword, newPassword });
      setProfileMsg({ text: "Password reset successful", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || "Failed to reset password", type: "error" });
    }
  };

  const enrolledCourses = dashboardData?.continueLearning || [];
  const stats = dashboardData?.stats || { enrolledCourses: 0, completedCourses: 0, certificatesEarned: 0 };

  const tabs = [
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'ebooks', label: 'My E-Books', icon: BookOpenIcon },
    { id: 'exams', label: 'Exams & Certs', icon: Award },
    { id: 'profile', label: 'Profile Settings', icon: Settings }
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-crmisa-navy/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 text-center relative">
          <button 
            className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-crmisa-navy"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5"/>
          </button>
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 border-2 border-blue-600 mb-3 overflow-hidden shadow-sm relative group cursor-pointer" onClick={() => handleTabChange('profile')}>
            <img src={user?.avatar || "https://res.cloudinary.com/demo/image/upload/v1583247012/user-placeholder.png"} className="w-full h-full object-cover" alt="Profile" />
            <div className="absolute inset-0 bg-crmisa-darkNavy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-base font-bold text-crmisa-navy truncate">{user?.name || "Student"}</h2>
          <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Dashboard</p>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-crmisa-navy'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'ebooks' && purchasedEbooks.length > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {purchasedEbooks.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-crmisa-navy text-white font-bold text-sm rounded-xl hover:bg-crmisa-accentNavy transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-crmisa-navy">Student Portal</h1>
          </div>
        </div>

        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Header Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-crmisa-navy tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Tab 1: My Courses */}
          {activeTab === "courses" && (
            <div className="space-y-8">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
                    <BookOpenIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-crmisa-navy">{stats.enrolledCourses}</h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Enrolled Courses</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm cursor-pointer hover:border-amber-400 group" onClick={() => handleTabChange('exams')}>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 rounded-lg group-hover:scale-105 transition-transform">
                    <AwardBadgeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-crmisa-navy">{stats.certificatesEarned}</h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-amber-700">Certificates Earned</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
                    <CheckIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-crmisa-navy">{stats.completedCourses}</h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Courses Completed</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3.5 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 rounded-lg">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-crmisa-navy uppercase">{user?.role || "Student"}</h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Account Type</p>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full py-16 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crmisa-navy"></div>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-crmisa-navy mb-2">No courses yet</h3>
                    <p className="text-slate-500 mb-6 text-sm">You haven't enrolled in any courses yet.</p>
                    <button onClick={() => navigate("/courses")} className="px-6 py-2.5 bg-crmisa-navy text-white font-bold text-sm rounded-xl transition-colors hover:bg-crmisa-accentNavy">Browse Courses</button>
                  </div>
                ) : (
                  enrolledCourses.map((course) => {
                    const courseComplete = course.completionPercentage >= 100;
                    return (
                      <div key={course.courseId} className="bg-white border border-slate-200 rounded-2xl flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => navigate(`/course-premium/${course.courseId}`)}>
                        <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-200">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><PlayCircle className="w-10 h-10 text-slate-300" /></div>
                          )}
                          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 uppercase bg-white/90 backdrop-blur-sm text-crmisa-navy rounded-md shadow-sm">
                            {courseComplete ? "Completed" : "In Progress"}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="space-y-1 mb-6">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
                            <h3 className="font-bold text-base text-crmisa-navy leading-snug line-clamp-2">{course.title}</h3>
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
                              <button className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${courseComplete ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-crmisa-navy border-crmisa-navy text-white hover:bg-crmisa-accentNavy"}`} onClick={(e) => { e.stopPropagation(); navigate(`/course-premium/${course.courseId}`); }}>
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
            </div>
          )}

          {/* Tab 2: My E-Books */}
          {activeTab === "ebooks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedEbooks.length === 0 ? (
                <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-crmisa-navy mb-2">No Purchased E-Books</h3>
                  <p className="text-slate-500 mb-6 text-sm">You haven't purchased any digital handbooks yet.</p>
                  <button onClick={() => navigate("/ebooks")} className="px-6 py-2.5 bg-crmisa-navy text-white font-bold text-sm rounded-xl transition-colors hover:bg-crmisa-accentNavy">Browse E-Book Store</button>
                </div>
              ) : (
                purchasedEbooks.map((purchase) => {
                  const book = purchase.ebook || {};
                  return (
                    <div key={purchase._id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className="flex gap-4 items-start">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-22 bg-crmisa-navy text-white font-bold text-xs flex items-center justify-center rounded-lg p-2 text-center flex-shrink-0">PDF</div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Unlocked</span>
                          <h3 className="font-bold text-sm text-crmisa-navy leading-snug line-clamp-2">{book.title || "Trade E-Book"}</h3>
                          <p className="text-[11px] text-slate-500 font-medium">Purchased: {new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-500">Paid: <span className="font-black text-crmisa-navy">R{purchase.amountPaid || book.price}</span></div>
                        {book.pdfUrl ? (
                          <button onClick={() => downloadPdf(book.pdfUrl, `${book.title || "Handbook"}.pdf`)} className="px-4 py-2 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-bold rounded-lg text-xs transition-colors cursor-pointer">Download PDF</button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold italic">PDF Processing</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 3: Exams & Certs */}
          {activeTab === "exams" && (
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
                  const courseComplete = course.completionPercentage >= 100;
                  // If course is purchased but not completed -> lock exam card
                  // If course completed -> open exam card
                  // If exam completed -> show certificate
                  
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
                        <h3 className="font-bold text-sm text-crmisa-navy line-clamp-2 pt-2">{course.title} Final Exam</h3>
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
          )}

          {/* Tab 4: Profile Settings */}
          {activeTab === "profile" && (
            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-10">
              
              {profileMsg.text && (
                <div className={`p-4 rounded-xl text-sm font-bold border ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {profileMsg.text}
                </div>
              )}

              {/* Profile Photo Update */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-crmisa-navy border-b border-slate-100 pb-2">Profile Picture</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0">
                    <img src={profilePhoto ? URL.createObjectURL(profilePhoto) : user?.avatar || "https://res.cloudinary.com/demo/image/upload/v1583247012/user-placeholder.png"} className="w-full h-full object-cover" alt="Avatar Preview" />
                  </div>
                  <div className="space-y-3 w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <button 
                      onClick={handleUpdateProfilePhoto}
                      disabled={!profilePhoto}
                      className="px-5 py-2 bg-crmisa-navy text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-crmisa-accentNavy transition-colors"
                    >
                      Upload New Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Reset */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-crmisa-navy border-b border-slate-100 pb-2">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleResetPassword}
                    className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors w-full"
                  >
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

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
