import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, Clock, Users, Video, ArrowRight } from "lucide-react";

export default function JoinCertifiedSection() {
  const { user, openLogin } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      number: "10+",
      label: "Exam Categories",
      icon: BookOpen,
    },
    {
      id: 2,
      number: "1.2K+",
      label: "Mins. Watched",
      icon: Clock,
    },
    {
      id: 3,
      number: "5+",
      label: "Educators",
      icon: Users,
    },
    {
      id: 4,
      number: "9+",
      label: "Video Lessons",
      icon: Video,
    },
  ];

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/courses");
    } else {
      openLogin();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-800 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Description & Dynamic CTA Button */}
          <div
            className="lg:col-span-5 space-y-6"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-yellow-400"></div>
                <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
                  Join & Get Certified
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1] max-w-2xl mb-4">
                Unlimited access to
                <br />
                structured courses
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                Get unlimited access to structured courses & doubt clearing
                sessions.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleButtonClick}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm flex items-center gap-2 group"
              >
                <span>{isLoggedIn ? "Courses" : "Register Now"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: 2x2 Redesigned Stat Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.id}
                    data-aos="zoom-in"
                    data-aos-delay={(idx + 1) * 100}
                    className="bg-white rounded-xl p-3 sm:p-6 border border-slate-200 hover:border-slate-400 transition-colors flex items-center gap-3 sm:gap-4 group cursor-pointer"
                    onClick={handleButtonClick}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {stat.number}
                      </h3>
                      <p className="text-[9px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
