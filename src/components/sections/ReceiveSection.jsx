import React from 'react';
import { CheckIcon, ChevronRightIcon } from '../icons/Icons';

export default function ReceiveSection({ onOpenEnrol }) {
  const receiveList = [
    "Import & Export Course",
    "Certificate of Completion",
    "FREE Company Registration",
    "FREE Professional Website",
    "Step-by-Step Guidance",
    "Supplier & Buyer Tips"
  ];

  const courseBulletList = [
    "Import & Export Procedures",
    "International Trade Bodies",
    "Incoterms",
    "Modes of Transport",
    "Custom Procedures",
    "Cross Trade Modules",
    "Free Company Registration",
    "Tax Number",
    "Free Website",
    "Import & Export License"
  ];

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Carousel Dots Indicator matching Image 4 */}
        <div className="flex justify-center items-center space-x-2 mb-10">
          <div className="w-3 h-3 rounded-full bg-sky-300"></div>
          <div className="w-3 h-3 rounded-full bg-crmisa-navy"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Navy Course Banner Box with R15 000* Price & Student Image - Replica of Image 4 */}
          <div className="lg:col-span-6 flex justify-center" data-aos="fade-right" data-aos-duration="800">
            <div className="relative w-full max-w-lg bg-gradient-to-br from-crmisa-darkNavy via-crmisa-navy to-crmisa-accentNavy text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-slate-700">
              
              {/* Top Title Banner */}
              <div className="relative z-10 mb-6">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                  Import & Export<br />
                  <span className="text-sky-300">Full Course</span>
                </h3>
                <div className="w-12 h-1 bg-sky-400 mt-2 rounded-full"></div>
              </div>

              {/* Grid content inside card */}
              <div className="relative z-10 grid grid-cols-12 gap-4 items-end">
                
                {/* Left checklist of modules */}
                <div className="col-span-7 space-y-2">
                  {courseBulletList.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-sky-400 text-crmisa-navy flex items-center justify-center shrink-0 font-bold text-[9px]">
                        ✓
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-100 leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Student Portrait overlapping background */}
                <div className="col-span-5 relative h-64 flex items-end">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                    alt="Student Enrolling in CRMISA"
                    className="w-full h-full object-cover object-top rounded-2xl border-2 border-white/30 shadow-xl"
                  />
                </div>

              </div>

              {/* Price Tag & Enrol Now Button matching Image 4 */}
              <div className="relative z-10 mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    R15 000<span className="text-sky-300 text-xl font-bold">*</span>
                  </span>
                  <span className="block text-[10px] text-slate-300 uppercase tracking-wider">All-Inclusive Tuition</span>
                </div>

                <button
                  onClick={onOpenEnrol}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-crmisa-navy hover:bg-sky-50 font-extrabold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide group"
                >
                  <div className="w-6 h-6 rounded-full bg-crmisa-navy text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                  <span>Enrol now</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: "What You Will Receive" Checklist - Replica of Image 4 */}
          <div className="lg:col-span-6 space-y-8" data-aos="fade-left" data-aos-duration="800">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                What You Will Receive
              </h2>
              <div className="w-16 h-1.5 bg-crmisa-navy rounded-full"></div>
            </div>

            {/* Checkmarked benefits list */}
            <div className="space-y-4">
              {receiveList.map((item, idx) => (
                <div 
                  key={idx}
                  data-aos="fade-left"
                  data-aos-delay={(idx + 1) * 80}
                  className="flex items-center space-x-4 p-3.5 rounded-xl hover:bg-crmisa-lightBlue transition-colors group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-crmisa-navy text-white flex items-center justify-center shrink-0 shadow">
                    <CheckIcon className="w-4 h-4" />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-crmisa-navy transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
