import React from 'react';
import { UserPlusIcon, TeacherIcon, AwardBadgeIcon } from '../icons/Icons';

export default function HowItWorksSection({ onOpenRegister }) {
  const steps = [
    {
      step: "01",
      title: "Sign Up",
      description: "Ready to start learning online? It's simple—just sign up!",
      icon: <UserPlusIcon className="w-7 h-7 text-white" />
    },
    {
      step: "02",
      title: "Learn",
      description: "Learn at your own pace by booking sessions with your mentor.",
      icon: <TeacherIcon className="w-7 h-7 text-white" />
    },
    {
      step: "03",
      title: "Get Certified",
      description: "Acquire a diverse skill set—and even become a mentor yourself.",
      icon: <AwardBadgeIcon className="w-7 h-7 text-white" />
    }
  ];

  return (
    <section className="py-12 lg:py-24 bg-white text-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Image */}
        <div className="mb-12 space-y-2" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-crmisa-navy rounded-full"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
            Start your learning journey in just a few easy steps
          </p>
        </div>

        {/* 3 Step Cards Grid / Mobile Swipe */}
        <div className="relative flex overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:grid md:grid-cols-3 gap-4 md:gap-8 items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Subtle background connecting line */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-6 z-0" />

          {steps.map((item, idx) => (
            <div 
              key={item.step}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 120}
              onClick={onOpenRegister}
              className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center shrink-0 relative z-10 bg-white rounded-2xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-between text-center group cursor-pointer hover:-translate-y-1"
            >
              <div className="space-y-6 flex flex-col items-center w-full">
                
                {/* Circle Icon - Navy Circle with White Ring matching Image */}
                <div className="w-24 h-24 rounded-full bg-crmisa-navy border-4 border-slate-100 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Title & Description */}
                <div className="space-y-2 max-w-xs">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-crmisa-navy transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

              </div>

              {/* Bottom Right Number Badge matching Image */}
              <div className="w-full flex justify-end pt-6">
                <div className="bg-crmisa-darkNavy text-white font-black text-sm px-3.5 py-1.5 rounded-lg shadow">
                  {item.step}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
