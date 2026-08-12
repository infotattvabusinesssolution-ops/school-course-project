import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import { adminService } from "../services/adminService";
import { forumService } from "../services/forumService";
import { ebookService } from "../services/ebookService";
import { downloadPdf } from "../utils/downloadHelper";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminExamManagementPage from "./AdminExamManagementPage";
import AdminBlogTab from "../components/admin/AdminBlogTab";
import AdminNewsletterTab from "../components/admin/AdminNewsletterTab";
import AdminCouponTab from "../components/admin/AdminCouponTab";
import AdminReferralTab from "../components/admin/AdminReferralTab";
import AdminCourseTab from "../components/admin/AdminCourseTab";
export default function AdminDashboardPage({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTabState] = useState(() => {
    const saved = localStorage.getItem("adminActiveTab");
    return saved !== null ? Number(saved) : 0;
  });

  const setActiveTab = (tab) => {
    localStorage.setItem("adminActiveTab", tab);
    setActiveTabState(tab);
  };
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [ebookPurchases, setEbookPurchases] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [adminEbooks, setAdminEbooks] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    totalEbooksSold: 0,
    totalEbookRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchForumPosts = async () => {
    try {
      const res = await forumService.getPosts();
      setForumPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching forum posts:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, userRes, enrollRes, analyticsRes, forumRes, ebookRes] = await Promise.all([
          courseService.getAdminCourses(),
          adminService.getUsers(),
          adminService.getEnrollments(),
          adminService.getAnalytics(),
          forumService.getPosts(),
          ebookService.getEbooks(),
        ]);
        setCourses(courseRes.data || []);
        setUsers(userRes.data || []);
        if (enrollRes.data?.enrollments) {
          setEnrollments(enrollRes.data.enrollments);
          setEbookPurchases(enrollRes.data.ebookPurchases || []);
        } else {
          setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
        }
        setAnalytics(analyticsRes.data || { totalUsers: 0, totalCourses: 0, totalEnrollments: 0, totalRevenue: 0 });
        setForumPosts(forumRes.data || []);
        setAdminEbooks(ebookRes.data || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminService.updateUser(userId, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteForumPost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this forum discussion?")) return;
    try {
      await forumService.deletePost(postId);
      setForumPosts(forumPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete forum post:", err);
      alert("Failed to delete forum post");
    }
  };



  const handleDeleteEbook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ebook?")) return;
    try {
      await ebookService.deleteEbook(id);
      setAdminEbooks(adminEbooks.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Failed to delete ebook:", err);
      alert("Failed to delete ebook");
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="md:ml-72 bg-surface min-h-screen pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-background">
              {activeTab === 0 ? 'Overview' : activeTab === 1 ? 'User Management' : activeTab === 2 ? 'Enrollments & Financials' : activeTab === 3 ? 'Forum Management' : activeTab === 4 ? 'E-book Management' : activeTab === 6 ? 'Exam Management' : activeTab === 7 ? 'Blog Management' : activeTab === 8 ? 'Newsletter Subscribers' : activeTab === 9 ? 'Coupons' : activeTab === 10 ? 'Referrals & Influencers' : 'Course Management'}
            </h1>
            {activeTab === 5 && (
              <button 
                onClick={() => navigate("/admin/course/create")}
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Create Course
              </button>
            )}
            {activeTab === 4 && (
              <button 
                onClick={() => navigate("/admin/ebook/create")}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add New E-book
              </button>
            )}
          </div>



          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
            </div>
          ) : (
            <>
              {/* Tab 0: Overview (Stats Only) */}
              {activeTab === 0 && (
                <div className="space-y-6">
                  {/* Stat Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {/* Card 1: Total Revenue */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[22px]">payments</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate" title={`R${Math.round(analytics.totalRevenue || 0).toLocaleString("en-ZA")}`}>
                          R{Math.round(analytics.totalRevenue || 0).toLocaleString("en-ZA")}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span> All Sales Combined
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Total Users */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Users</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <span className="material-symbols-outlined text-[22px]">group</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                          {(analytics.totalUsers || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-1">
                          Registered Members
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Total Courses */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Courses</span>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                          <span className="material-symbols-outlined text-[22px]">video_library</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                          {analytics.totalCourses || 0}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-1">
                          Active Programs
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Course Enrollments */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Enrollments</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                          <span className="material-symbols-outlined text-[22px]">school</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                          {(analytics.totalEnrollments || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-1">
                          Student Enrollments
                        </div>
                      </div>
                    </div>

                    {/* Card 5: E-books Sold */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">E-books Sold</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                          <span className="material-symbols-outlined text-[22px]">menu_book</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                          {analytics.totalEbooksSold || 0}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 mt-1 truncate">
                          R{Math.round(analytics.totalEbookRevenue || 0).toLocaleString("en-ZA")} E-book Revenue
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      onClick={() => setActiveTab(5)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">video_library</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{analytics.totalCourses || 0}</p>
                        <p className="text-xs text-slate-500 truncate">Manage Courses →</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab(1)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">group</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{analytics.totalUsers || 0}</p>
                        <p className="text-xs text-slate-500 truncate">Manage Users →</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab(2)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{analytics.totalEnrollments || 0}</p>
                        <p className="text-xs text-slate-500 truncate">Enrollments →</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab(4)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">auto_stories</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{analytics.totalEbooksSold || 0}</p>
                        <p className="text-xs text-slate-500 truncate">E-books Sold →</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab(3)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">forum</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{forumPosts.length}</p>
                        <p className="text-xs text-slate-500 truncate">Discussions →</p>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">payments</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">R{Math.round((analytics.totalRevenue || 0)).toLocaleString('en-ZA')}</p>
                        <p className="text-xs text-slate-500 truncate">Total Revenue</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Enrollments Preview */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-slate-900 text-lg">Recent Enrollments</h2>
                      <button onClick={() => setActiveTab(2)} className="text-xs font-semibold text-blue-600 hover:underline">View All →</button>
                    </div>
                    {enrollments.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-6">No enrollments yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {enrollments.slice(0, 5).map(e => (
                          <div key={e._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{e.student?.name || 'Student'}</p>
                              <p className="text-xs text-slate-500">{e.course?.title || 'Course'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 text-sm">R{e.amountPaid}</p>
                              <p className="text-xs text-slate-400">{new Date(e.enrolledAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Course Management */}
              {activeTab === 5 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
                  <AdminCourseTab />
                </div>
              )}

              {/* Tab 1: Users */}
              {activeTab === 1 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                  <h2 className="text-headline-sm font-bold text-on-surface mb-6">User Management</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-4 font-bold text-on-surface text-label-md">Name</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Email</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Role</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => u.role !== 'ADMIN').map((user) => (
                          <tr key={user._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                            <td className="py-4 text-body-md font-medium text-on-surface">{user.name}</td>
                            <td className="py-4 text-body-md text-on-surface-variant">{user.email}</td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-md text-label-caps font-bold bg-surface-container-high text-on-surface">
                                STUDENT
                              </span>
                            </td>
                            <td className="py-4">
                              <select
                                value={user.status}
                                onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                className={`border border-outline-variant rounded-lg px-3 py-1.5 text-body-sm focus:border-primary focus:ring-0 ${
                                  user.status === 'BLOCKED' ? 'bg-error-container/30 text-error' : 'bg-surface-container text-on-surface'
                                }`}
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="BLOCKED">BLOCKED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => u.role !== 'ADMIN').length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-on-surface-variant">No users found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Enrollments & Financials */}
              {activeTab === 2 && (
                <div className="space-y-8">
                  {/* Course Enrollments */}
                  <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                    <h2 className="text-headline-sm font-bold text-on-surface mb-6">Course Enrollments</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-outline-variant/30">
                            <th className="pb-4 font-bold text-on-surface text-label-md">Student</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Course</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Amount Paid</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Date</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments.map((enrollment) => (
                            <tr key={enrollment._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                              <td className="py-4">
                                <div className="text-body-md font-bold text-on-surface">{enrollment.student?.name}</div>
                                <div className="text-body-sm text-on-surface-variant">{enrollment.student?.email}</div>
                              </td>
                              <td className="py-4 text-body-md text-on-surface-variant">{enrollment.course?.title}</td>
                              <td className="py-4 text-body-md font-medium text-on-surface">R{enrollment.amountPaid}</td>
                              <td className="py-4 text-body-sm text-on-surface-variant">{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-md text-label-caps font-bold ${
                                  enrollment.status === 'ACTIVE' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                                }`}>
                                  {enrollment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {enrollments.length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-on-surface-variant">No enrollments found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* E-book Sales Transactions */}
                  <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-headline-sm font-bold text-on-surface">E-book Sales & Revenue</h2>
                      <span className="text-body-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        Total E-book Sales: R{analytics.totalEbookRevenue || 0}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-outline-variant/30">
                            <th className="pb-4 font-bold text-on-surface text-label-md">Buyer</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">E-book Handbook</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Price Paid</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Purchase Date</th>
                            <th className="pb-4 font-bold text-on-surface text-label-md">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ebookPurchases.map((purchase) => (
                            <tr key={purchase._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                              <td className="py-4">
                                <div className="text-body-md font-bold text-on-surface">{purchase.student?.name}</div>
                                <div className="text-body-sm text-on-surface-variant">{purchase.student?.email}</div>
                              </td>
                              <td className="py-4 text-body-md text-on-surface-variant font-medium">{purchase.ebook?.title || "Trade E-book"}</td>
                              <td className="py-4 text-body-md font-bold text-on-surface">R{purchase.amountPaid}</td>
                              <td className="py-4 text-body-sm text-on-surface-variant">{new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString()}</td>
                              <td className="py-4">
                                <span className="px-2.5 py-1 rounded-md text-label-caps font-bold bg-emerald-100 text-emerald-800">
                                  PAID
                                </span>
                              </td>
                            </tr>
                          ))}
                          {ebookPurchases.length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-on-surface-variant">No e-book sales recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Forum Management */}
              {activeTab === 3 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-headline-sm font-bold text-on-surface">Forum Management</h2>
                    <span className="text-body-sm font-medium text-on-surface-variant">
                      Total Discussions: {forumPosts.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-4 font-bold text-on-surface text-label-md">Author</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Title</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Category</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Replies</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Date</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forumPosts.map((post) => (
                          <tr key={post._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                            <td className="py-4">
                              <div className="text-body-md font-bold text-on-surface">
                                {post.authorName || post.author?.name || "Student"}
                              </div>
                              <div className="text-body-sm text-on-surface-variant">
                                {post.author?.email || "Community User"}
                              </div>
                            </td>
                            <td className="py-4 max-w-xs">
                              <div className="text-body-md font-medium text-on-surface truncate" title={post.title}>
                                {post.title}
                              </div>
                              {post.content && (
                                <div className="text-body-sm text-on-surface-variant truncate">
                                  {post.content}
                                </div>
                              )}
                            </td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-md text-label-caps font-bold bg-surface-container-high text-on-surface">
                                {post.category || "General"}
                              </span>
                            </td>
                            <td className="py-4 text-body-md font-medium text-on-surface">
                              💬 {post.replies?.length || 0}
                            </td>
                            <td className="py-4 text-body-sm text-on-surface-variant">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => navigate(`/forum/${post._id}`)}
                                  className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface font-bold text-body-sm hover:bg-surface-container-high transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleDeleteForumPost(post._id)}
                                  className="px-3 py-1.5 rounded-lg bg-error-container/30 text-error font-bold text-body-sm hover:bg-error-container/60 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {forumPosts.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                              No forum posts found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: E-book Management */}
              {activeTab === 4 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-headline-sm font-bold text-on-surface">E-book Library</h2>
                    <button
                      onClick={() => navigate("/admin/ebook/create")}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-body-sm hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Upload E-book
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-4 font-bold text-on-surface text-label-md">Cover</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Title</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Category</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Price</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md">Cloudinary PDFs</th>
                          <th className="pb-4 font-bold text-on-surface text-label-md text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminEbooks.map((book) => (
                          <tr key={book._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                            <td className="py-4">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-10 h-14 object-cover rounded shadow-xs border border-outline-variant/30"
                              />
                            </td>
                            <td className="py-4 max-w-xs">
                              <div className="text-body-md font-bold text-on-surface truncate" title={book.title}>
                                {book.title}
                              </div>
                              <div className="text-body-sm text-on-surface-variant truncate">
                                {book.subtitle || book.coverTitle}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-md text-label-caps font-bold bg-surface-container-high text-on-surface">
                                {book.category || "Trade"}
                              </span>
                            </td>
                            <td className="py-4 text-body-md font-bold text-on-surface">
                              R{book.price}
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col gap-1 text-[11px] font-semibold">
                                {book.samplePdfUrl ? (
                                  <button
                                    onClick={() => downloadPdf(book.samplePdfUrl, `${book.title}_Sample.pdf`)}
                                    className="text-left text-emerald-600 hover:underline cursor-pointer"
                                  >
                                    ✓ Sample PDF
                                  </button>
                                ) : (
                                  <span className="text-slate-400">✕ No Sample</span>
                                )}
                                {book.pdfUrl ? (
                                  <button
                                    onClick={() => downloadPdf(book.pdfUrl, `${book.title}_Full.pdf`)}
                                    className="text-left text-blue-600 hover:underline cursor-pointer"
                                  >
                                    ✓ Full PDF
                                  </button>
                                ) : (
                                  <span className="text-slate-400">✕ No PDF</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => navigate(`/ebook/${book._id}`)}
                                  className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface font-bold text-body-sm hover:bg-surface-container-high transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/ebook/${book._id}/edit`)}
                                  className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface font-bold text-body-sm hover:bg-surface-container-high transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEbook(book._id)}
                                  className="px-3 py-1.5 rounded-lg bg-error-container/30 text-error font-bold text-body-sm hover:bg-error-container/60 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {adminEbooks.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                              No e-books found. Click Upload E-book to add your first handbook.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Exam Management */}
              {activeTab === 6 && <AdminExamManagementPage />}

              {/* Tab 7: Blog Management */}
              {activeTab === 7 && <AdminBlogTab />}

              {/* Tab 8: Newsletter Subscribers */}
              {activeTab === 8 && <AdminNewsletterTab />}
              
              {/* Tab 9: Coupons */}
              {activeTab === 9 && <AdminCouponTab />}
              
              {/* Tab 10: Referrals */}
              {activeTab === 10 && <AdminReferralTab />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
