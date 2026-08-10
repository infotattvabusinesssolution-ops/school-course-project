import React from 'react';
import { CheckIcon } from '../icons/Icons';

export default function ReceiveSection() {
  const courseBulletList = [
    "Import & Export Procedures",
    "International Trade Bodies",
    "Incoterms & Transport",
    "Custom Procedures",
    "Cross Trade Modules",
    "Free Company Registration",
    "Free Professional Website",
    "Import & Export License Guidance",
    "Step-by-Step Mentorship",
    "Supplier & Buyer Tips"
  ];

  return (
    <section className="w-full bg-slate-50 text-slate-800 flex flex-col lg:flex-row">
      
      {/* Left Side: Full Bleed Image */}
      <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-[700px] relative overflow-hidden group">
        {/* Dark overlay for aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-crmisa-navy/60 via-transparent to-transparent z-10"></div>
        
        <img
          src="/student/image copy 2.png"
          alt="Student Enrolling in CRMISA"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700"
        />
        
        {/* Floating verification badge */}
        <div className="absolute bottom-12 left-8 sm:left-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <p className="font-bold text-sm">Verified Curriculum</p>
            <p className="text-xs text-slate-200 opacity-90">Industry Standard</p>
          </div>
        </div>
      </div>

      {/* Right Side: Text Content */}
      <div className="w-full lg:w-1/2 flex items-center relative overflow-hidden">
        
        {/* Decorative elements behind the text */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 rounded-full blur-[150px] opacity-40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-100 rounded-full blur-[150px] opacity-50 mix-blend-multiply pointer-events-none"></div>
        
        {/* Constrain the text width so it doesn't stretch too far on ultrawide monitors */}
        <div className="max-w-2xl w-full p-8 sm:p-12 lg:p-20 xl:px-24 mx-auto lg:ml-0 relative z-10">
          
          {/* Header */}
          <div className="mb-10 lg:mb-12" data-aos="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-0.5 bg-yellow-400"></div>
              <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
                Program Benefits
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
              What You Will<br />Receive
            </h2>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            {courseBulletList.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-4 group"
                data-aos="fade-left"
                data-aos-delay={(idx % 5) * 100}
              >
                <div className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 text-sky-500 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <CheckIcon className="w-4 h-4" />
                </div>
                <span className="text-base sm:text-lg font-semibold text-slate-700 leading-tight pt-0.5">
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
      
    </section>
  );
}
