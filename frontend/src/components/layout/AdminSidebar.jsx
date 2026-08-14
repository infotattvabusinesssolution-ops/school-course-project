import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const adminNavItems = [
    { id: 0, icon: "dashboard", label: "Overview" },
    { id: 5, icon: "video_library", label: "Course Management" },
    { id: 6, icon: "quiz", label: "Exam Management" },
    { id: 1, icon: "group", label: "User Management" },
    { id: 2, icon: "payments", label: "Enrollments & Financials" },
    { id: 3, icon: "forum", label: "Forum Management" },
    { id: 4, icon: "auto_stories", label: "E-book Management" },
    { id: 7, icon: "article", label: "Blog Management" },
    { id: 8, icon: "mark_email_read", label: "Newsletter Subscribers" },
    { id: 9, icon: "local_offer", label: "Coupons" },
    { id: 10, icon: "campaign", label: "Referrals & Influencers" },
    { id: 11, icon: "format_quote", label: "Testimonials" },
    { id: 12, icon: "reviews", label: "Course Reviews" },
    { id: 13, icon: "rss_feed", label: "RSS Feeds" },
    { id: 14, icon: "menu_book", label: "Glossary" },
  ];

  return (
    <>
      {/* Mobile TopBar */}
      <header className="md:hidden flex justify-between items-center w-full px-4 h-16 bg-surface-container-lowest border-b border-outline-variant fixed top-0 z-50">
        <div
          className="flex items-center gap-2 text-headline-sm font-headline-sm font-bold text-primary cursor-pointer"
          onClick={() => setActiveTab(0)}
        >
          <img src="/image.png" alt="CRMISA Logo" className="h-8" />
          CRMISA Admin
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-crmisa-darkNavy/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-out Sidebar */}
      <nav
        className={`md:hidden fixed top-16 left-0 bottom-0 w-72 bg-surface-container-lowest border-r border-outline-variant z-40 p-6 flex flex-col gap-2 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-4 mb-8 p-2 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface font-semibold">
              {user?.name || "CRMISA Admin"}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Super Admin
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 w-full text-left ${
                  isActive
                    ? "bg-crmisa-navy text-white font-bold shadow-md border-l-4 border-yellow-400 translate-x-1"
                    : "text-slate-600 hover:bg-slate-100 hover:text-crmisa-navy font-medium"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => {
              window.open('/certificate/preview', '_blank');
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-3 transition-all w-full"
          >
            <span className="material-symbols-outlined">workspace_premium</span>
            <span className="font-label-md text-label-md font-bold">Preview Certificate</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-error hover:bg-error-container/20 rounded-xl px-4 py-3 transition-all w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md font-bold">Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-72 bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 z-40 p-6 gap-2">
        <div className="flex items-center justify-between mb-8">
          <div
            className="flex items-center gap-2 text-headline-sm font-headline-sm font-bold text-primary cursor-pointer"
            onClick={() => setActiveTab(0)}
          >
            <img src="/image.png" alt="CRMISA Logo" className="h-10" />
            CRMISA Admin
          </div>
        </div>
        <div className="flex items-center gap-4 mb-8 p-2 rounded-xl hover:bg-surface-container-high transition-all cursor-default">
          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface font-semibold truncate w-32">
              {user?.name || "CRMISA Admin"}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Super Admin
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6">
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 w-full text-left ${
                  isActive
                    ? "bg-crmisa-navy text-white font-bold shadow-md border-l-4 border-yellow-400 translate-x-1"
                    : "text-slate-600 hover:bg-slate-100 hover:text-crmisa-navy font-medium"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => window.open('/certificate/preview', '_blank')}
            className="flex items-center gap-3 text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-3 transition-all"
          >
            <span className="material-symbols-outlined">workspace_premium</span>
            <span className="font-label-md text-label-md font-bold">Preview Certificate</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-error hover:bg-error-container/20 rounded-xl px-4 py-3 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md font-bold">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
