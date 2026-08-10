import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import { adminService } from "../services/adminService";
import AdminSidebar from "../components/layout/AdminSidebar";

export default function AdminDashboardPage({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, userRes, enrollRes, analyticsRes] = await Promise.all([
          courseService.getAdminCourses(),
          adminService.getUsers(),
          adminService.getEnrollments(),
          adminService.getAnalytics()
        ]);
        setCourses(courseRes.data || []);
        setUsers(userRes.data || []);
        setEnrollments(enrollRes.data || []);
        setAnalytics(analyticsRes.data || { totalUsers: 0, totalCourses: 0, totalEnrollments: 0, totalRevenue: 0 });
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

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="md:ml-72 bg-surface min-h-screen pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-background">
              {activeTab === 0 ? 'Overview & Courses' : activeTab === 1 ? 'User Management' : 'Enrollments & Financials'}
            </h1>
            {activeTab === 0 && (
              <button 
                onClick={() => navigate("/admin/course/create")}
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Create Course
              </button>
            )}
          </div>

          {/* 4 Stat Metric Cards (Bento Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">group</span>
              </div>
              <div>
                <div className="text-headline-md font-bold text-on-surface">{analytics.totalUsers}</div>
                <div className="text-body-sm text-on-surface-variant">Total Users</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">menu_book</span>
              </div>
              <div>
                <div className="text-headline-md font-bold text-on-surface">{analytics.totalCourses}</div>
                <div className="text-body-sm text-on-surface-variant">Total Courses</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">payments</span>
              </div>
              <div>
                <div className="text-headline-md font-bold text-on-surface">₹{analytics.totalRevenue.toFixed(2)}</div>
                <div className="text-body-sm text-on-surface-variant">Total Revenue</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">drafts</span>
              </div>
              <div>
                <div className="text-headline-md font-bold text-on-surface">{analytics.totalEnrollments}</div>
                <div className="text-body-sm text-on-surface-variant">Total Enrollments</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
            </div>
          ) : (
            <>
              {/* Tab 0: Manage Courses */}
              {activeTab === 0 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
                  <h2 className="text-headline-sm font-bold text-on-surface mb-6">Your Courses</h2>
                  
                  {courses.length === 0 ? (
                    <div className="text-center py-16 bg-surface-container-low rounded-xl border border-dashed border-outline">
                      <span className="material-symbols-outlined text-[64px] text-outline mb-4">video_library</span>
                      <h3 className="text-headline-sm font-bold text-on-surface mb-2">No Courses Yet</h3>
                      <p className="text-body-lg text-on-surface-variant mb-6">You haven't created any courses yet.</p>
                      <button 
                        onClick={() => navigate("/admin/course/create")}
                        className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-sm"
                      >
                        Create Your First Course
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {courses.map((course) => (
                        <div key={course._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                          <div className="w-24 h-24 sm:w-20 sm:h-20 bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {course.thumbnailUrl ? (
                              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-outline text-[40px]">video_file</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-headline-sm text-base font-bold text-on-surface truncate">{course.title}</h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`px-2 py-1 rounded-md text-label-caps font-bold ${
                                course.status === 'PUBLISHED' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                              }`}>
                                {course.status}
                              </span>
                              <span className="text-body-sm text-on-surface-variant font-medium">Price: ₹{course.price}</span>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/course/${course._id}/edit`)}
                              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                        {users.map((user) => (
                          <tr key={user._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                            <td className="py-4 text-body-md font-medium text-on-surface">{user.name}</td>
                            <td className="py-4 text-body-md text-on-surface-variant">{user.email}</td>
                            <td className="py-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-body-sm focus:border-primary focus:ring-0"
                              >
                                <option value="STUDENT">STUDENT</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
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
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-on-surface-variant">No users found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Enrollments */}
              {activeTab === 2 && (
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 overflow-hidden">
                  <h2 className="text-headline-sm font-bold text-on-surface mb-6">Enrollments</h2>
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
                            <td className="py-4 text-body-md font-medium text-on-surface">₹{enrollment.amountPaid}</td>
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
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
