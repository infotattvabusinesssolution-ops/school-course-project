import React, { useState } from 'react';
import { BookOpenIcon, AwardBadgeIcon, CheckIcon, UserIcon } from '../components/icons/Icons';

export default function DashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('courses');

  const studentInfo = {
    name: "Alex Morgan",
    email: "alex.morgan@example.co.za",
    studentId: "CRMISA-2026-8842",
    enrolledDate: "January 2026",
    status: "Active Student",
    companyName: "Morgan Global Trade Pty Ltd (CIPC Registered)",
    websiteUrl: "www.morganglobaltrade.co.za"
  };

  const courses = [
    {
      id: 1,
      title: "Import & Export Full Course",
      progress: 85,
      completedLessons: 15,
      totalLessons: 18,
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "International Trade Bodies",
      progress: 100,
      completedLessons: 3,
      totalLessons: 3,
      status: "Completed",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Incoterms 2020 Rules",
      progress: 100,
      completedLessons: 3,
      totalLessons: 3,
      status: "Completed",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 animate-fade-in py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner Card */}
        <div className="bg-gradient-to-r from-crmisa-darkNavy via-crmisa-navy to-crmisa-accentNavy text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-400/20 border border-sky-300/30 text-sky-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>{studentInfo.status}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, {studentInfo.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Student ID: <span className="font-bold text-sky-300">{studentInfo.studentId}</span> | Enrolled: {studentInfo.enrolledDate}
            </p>
          </div>

          <div className="relative z-10 flex items-center space-x-3">
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
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">3</h3>
              <p className="text-xs font-semibold text-slate-500">Enrolled Courses</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <AwardBadgeIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">2</h3>
              <p className="text-xs font-semibold text-slate-500">Certificates Earned</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <CheckIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">21 / 24</h3>
              <p className="text-xs font-semibold text-slate-500">Lessons Completed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <UserIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">CIPC Registered</h3>
              <p className="text-xs font-semibold text-slate-500">Company Status</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 text-sm font-extrabold transition-colors border-b-2 ${
              activeTab === 'courses'
                ? 'border-crmisa-navy text-crmisa-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 text-sm font-extrabold transition-colors border-b-2 ${
              activeTab === 'benefits'
                ? 'border-crmisa-navy text-crmisa-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Included Benefits (Company & Website)
          </button>
        </div>

        {/* Tab 1: My Courses */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow ${
                    course.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-crmisa-navy text-white'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {course.completedLessons} of {course.totalLessons} lessons finished
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-crmisa-navy h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-bold rounded-xl text-xs shadow transition-colors">
                    {course.status === 'Completed' ? 'View Certificate' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Included Benefits */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600">
                <CheckIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900">Registered Business Entity</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                As part of your enrollment, CRMISA has completed your official CIPC company registration.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong className="text-slate-900">Entity:</strong> {studentInfo.companyName}</p>
                <p><strong className="text-slate-900">Reg Status:</strong> Active & Verified</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-3 text-sky-600">
                <GlobeIcon className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900">Professional Business Website</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Your custom trade domain and e-commerce import/export showcase site is live.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong className="text-slate-900">Website:</strong> {studentInfo.websiteUrl}</p>
                <p><strong className="text-slate-900">Hosting:</strong> Active (CRMISA Managed)</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
