import React from 'react';

export default function JoinCertifiedSection({ onOpenRegister }) {
  const stats = [
    {
      id: 1,
      number: "10+",
      label: "Exam Categories",
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      )
    },
    {
      id: 2,
      number: "1.2K+",
      label: "Mins. Watched",
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      )
    },
    {
      id: 3,
      number: "5+",
      label: "Educators",
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    {
      id: 4,
      number: "9+",
      label: "Video Lessons",
      icon: (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title, Description & CTA Button */}
          <div className="lg:col-span-5 space-y-6" data-aos="fade-right" data-aos-duration="800">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Join & Get Certified
              </h2>
              <div className="w-24 h-1 bg-crmisa-navy rounded-full"></div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Get unlimited access to structured courses & doubt clearing sessions
            </p>

            <div>
              <button
                onClick={onOpenRegister}
                className="px-7 py-3 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-extrabold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-sm tracking-wide transform hover:-translate-y-0.5"
              >
                Register Now
              </button>
            </div>

          </div>

          {/* Right Column: 2x2 Stat Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {stats.map((stat, idx) => (
                <div 
                  key={stat.id}
                  data-aos="zoom-in"
                  data-aos-delay={(idx + 1) * 100}
                  className="group bg-white text-slate-900 hover:bg-crmisa-navy hover:text-white rounded-2xl p-6 shadow-md border border-slate-100 hover:border-crmisa-accentNavy flex items-center space-x-4 hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 group-hover:bg-sky-300/30 group-hover:border-sky-300/40 text-sky-500 group-hover:text-sky-200 flex items-center justify-center shrink-0 p-3 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-crmisa-navy group-hover:text-white tracking-tight transition-colors duration-300">
                      {stat.number}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 group-hover:text-slate-200 transition-colors duration-300">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

