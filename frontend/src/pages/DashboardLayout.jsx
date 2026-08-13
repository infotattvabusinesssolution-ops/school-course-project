import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  AwardBadgeIcon,
  CheckIcon,
  UserIcon,
} from "../components/icons/Icons";
import {
  Award,
  BookOpen,
  Settings,
  Camera,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { getExamStatus } from "../services/exam.service";
import reviewService from "../services/reviewService";

export default function DashboardLayout({ onLogout }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const [myCertificates, setMyCertificates] = useState([]);
  const [examStatuses, setExamStatuses] = useState({});
  const [reviewStatuses, setReviewStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const tabs = [
    { id: 'courses', path: '/dashboard/courses', label: 'Courses', icon: BookOpen },
    { id: 'ebooks', path: '/dashboard/ebooks', label: 'E-Books', icon: BookOpenIcon },
    { id: 'exams', path: '/dashboard/exams', label: 'Exams', icon: Award },
    { id: 'profile', path: '/dashboard/profile', label: 'Profile', icon: Settings }
  ];

  // Define active title based on location
  const currentTab = tabs.find(t => location.pathname.includes(t.path)) || tabs[0];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pt-[96px] sm:pt-[112px]">

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed top-[112px] bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-[40] flex-col">
        <div className="p-6 border-b border-slate-200 text-center relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 border-2 border-crmisa-darkNavy mb-3 overflow-hidden relative group cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
            <img src={user?.avatar && user.avatar.includes('http') && !user.avatar.includes('user-placeholder.png') ? user.avatar : "https://ui-avatars.com/api/?name=User&background=000&color=fff&size=128"} className="w-full h-full object-cover" alt="Profile" />
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
            
            // Determine badge count
            let badgeCount = 0;
            if (tab.id === 'ebooks' && purchasedEbooks?.length) {
              badgeCount = purchasedEbooks.length;
            } else if (tab.id === 'courses' && dashboardData?.continueLearning?.length) {
              badgeCount = dashboardData.continueLearning.length;
            } else if (tab.id === 'exams' && dashboardData?.continueLearning?.length) {
              badgeCount = dashboardData.continueLearning.length;
            }

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  isActive || (tab.id === 'courses' && location.pathname === '/dashboard')
                    ? 'bg-crmisa-darkNavy text-white' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-crmisa-navy'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive || (tab.id === 'courses' && location.pathname === '/dashboard') ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {badgeCount > 0 && (
                      <span className="ml-auto bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {badgeCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-crmisa-navy text-white font-bold text-sm rounded-xl hover:bg-crmisa-accentNavy transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full md:ml-64 pb-20 md:pb-8">
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 mt-2 md:mt-0">
          
          {/* Header Title & Mobile User Info */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-crmisa-navy tracking-tight">
                {currentTab.label}
              </h1>
            </div>
            
            {/* Quick Mobile Profile Snippet */}
            <div className="md:hidden flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <div className="flex flex-col text-right">
                 <span className="text-xs font-bold text-crmisa-navy leading-tight truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
                 <button onClick={onLogout} className="text-[9px] font-bold text-red-600 uppercase">Sign Out</button>
              </div>
              <img onClick={() => navigate('/dashboard/profile')} src={user?.avatar && user.avatar.includes('http') && !user.avatar.includes('user-placeholder.png') ? user.avatar : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128"} className="w-8 h-8 rounded-full border border-slate-200 object-cover cursor-pointer" alt="Profile" />
            </div>
          </div>

          <Outlet context={{
            loading,
            dashboardData,
            purchasedEbooks,
            examStatuses,
            reviewStatuses,
            setReviewStatuses
          }} />
          
        </div>
      </main>

      {/* Mobile Bottom Navigation (Icons Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center h-16 px-2 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = location.pathname.includes(tab.path) || (tab.id === 'courses' && location.pathname === '/dashboard');
          
          let badgeCount = 0;
          if (tab.id === 'ebooks' && purchasedEbooks?.length) {
            badgeCount = purchasedEbooks.length;
          } else if (tab.id === 'courses' && dashboardData?.continueLearning?.length) {
            badgeCount = dashboardData.continueLearning.length;
          } else if (tab.id === 'exams' && dashboardData?.continueLearning?.length) {
            badgeCount = dashboardData.continueLearning.length;
          }

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                active ? 'text-blue-600' : 'text-slate-500 hover:text-crmisa-navy'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-blue-50' : ''}`}>
                {tab.id === 'profile' ? (
                  <img 
                    src={user?.avatar && user.avatar.includes('http') && !user.avatar.includes('user-placeholder.png') ? user.avatar : "https://ui-avatars.com/api/?name=User&background=000&color=fff&size=128"} 
                    className="w-5 h-5 rounded-full object-cover" 
                    alt="Profile" 
                  />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {badgeCount > 0 && (
                <span className="absolute top-1 right-5 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
