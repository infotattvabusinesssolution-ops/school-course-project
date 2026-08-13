import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksSection({ onOpenRegister }) {
  const navigate = useNavigate();
  const steps = [
    {
      step: "01",
      title: "Sign Up",
      description: "Fill out a quick form with your details to create your student account.",
      bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop"
    },
    {
      step: "02",
      title: "Learn & Prepare",
      description: "Access our comprehensive online curriculum and learn at your own pace.",
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
    },
    {
      step: "03",
      title: "Get Mentored",
      description: "Book 1-on-1 sessions with industry experts to guide your export journey.",
      bgImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop"
    },
    {
      step: "04",
      title: "Get Certified",
      description: "Acquire your certificate, register your company, and launch your business.",
      bgImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white text-crmisa-accentNavy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div data-aos="fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-yellow-400"></div>
              <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
                How It Works
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-crmisa-navy tracking-tight leading-[1.1] max-w-2xl">
              Master Global Trade<br />in Four Steps
            </h2>
          </div>
          <p className="text-slate-600 text-base sm:text-lg lg:max-w-xs lg:text-right font-medium" data-aos="fade-left" data-aos-delay="200">
            Start learning immediately and launch your business in weeks.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((item, idx) => (
            <div 
              key={item.step}
              data-aos="zoom-in"
              data-aos-delay={(idx + 1) * 100}
              className="relative bg-crmisa-navy rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden h-[240px] sm:h-[280px] lg:h-[320px] p-6 sm:p-10 flex items-center group cursor-pointer"
              onClick={onOpenRegister}
            >
              {/* Background Image & Overlay */}
              <img 
                src={item.bgImage} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-crmisa-navy/90 via-slate-900/60 to-transparent pointer-events-none"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center h-full w-full">
                
                {/* Massive Number */}
                <span className="text-white/30 text-[100px] sm:text-[140px] lg:text-[170px] font-light tracking-tighter leading-none -ml-2 sm:-ml-6 select-none transition-colors duration-500 group-hover:text-white/40">
                  {item.step}
                </span>
                
                {/* Text Content */}
                <div className="ml-4 sm:ml-6 lg:ml-8 flex-1 mt-4 sm:mt-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-[280px]">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 sm:mt-28 flex flex-col md:flex-row items-start md:items-center justify-between border-t border-slate-200 pt-12 gap-8" data-aos="fade-up">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-crmisa-navy uppercase tracking-widest mb-2">
              Ready to get started?
            </h4>
            <p className="text-slate-500 text-sm sm:text-base font-medium max-w-md">
              Simple enrollment, comprehensive education - see what works for your career.
            </p>
          </div>
          <button 
            onClick={() => navigate('/courses')} 
            className="w-full md:w-auto bg-crmisa-navy text-white font-bold px-10 py-4 sm:py-5 rounded-full transition-all duration-300 tracking-wide"
          >
            Enrol Now
          </button>
        </div>

      </div>
    </section>
  );
}
