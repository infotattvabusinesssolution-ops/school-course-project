import React from 'react';
import { GlobeIcon, PackageIcon, SpeedometerIcon } from '../icons/Icons';

export default function SpecializeSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-60 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-start" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Our Expertise
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-crmisa-navy tracking-tight leading-[1.1] max-w-3xl">
            We Specialize in<br />Global Trade Pillars
          </h2>
          <p className="text-slate-500 font-medium mt-6 max-w-xl text-lg">
            Gain comprehensive expertise in the critical pillars of international trade and logistics, designed for real-world application.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Large Left Card */}
          <div 
            data-aos="fade-up" 
            data-aos-delay="100"
            className="lg:col-span-7 bg-white rounded-[2rem] p-10 sm:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[400px]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-50 rounded-full blur-3xl opacity-60 group-hover:bg-sky-100 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mb-8 shadow-inner border border-sky-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <GlobeIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-crmisa-navy tracking-tight mb-5 group-hover:text-sky-600 transition-colors leading-[1.15]">
                Customs Procedures &<br />Documentation Mastery
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                Master bill of lading, commercial invoices, EUR.1, SAD500, and tariff classification. Learn to ensure your shipments always clear customs smoothly and legally.
              </p>
            </div>
            
            <div className="relative z-10 mt-10">
               <span className="inline-block px-4 py-2 bg-sky-50 text-sky-600 text-sm font-bold rounded-full uppercase tracking-wider">
                 Core Pillar
               </span>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            
            {/* Top Right Card */}
            <div 
              data-aos="fade-up" 
              data-aos-delay="200"
              className="flex-1 bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-50 rounded-full blur-3xl opacity-60 group-hover:bg-yellow-100 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 shadow-inner border border-yellow-100 relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <PackageIcon className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-crmisa-navy tracking-tight mb-3 group-hover:text-yellow-500 transition-colors leading-snug">
                  Calculating Landed Costs<br />& Pricing Strategies
                </h3>
                <p className="text-slate-500 font-medium">
                  Accurately compute freight rates, duties, taxes, insurance, and profit margins to maximize profitability.
                </p>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div 
              data-aos="fade-up" 
              data-aos-delay="300"
              className="flex-1 bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-100 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60 group-hover:bg-indigo-100 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 shadow-inner border border-indigo-100 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <SpeedometerIcon className="w-7 h-7" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-crmisa-navy tracking-tight mb-3 group-hover:text-indigo-500 transition-colors leading-snug">
                  Setting Up Trade<br />Networks & Agents
                </h3>
                <p className="text-slate-500 font-medium">
                  Connect with verified overseas suppliers, buyers, clearing agents, and shippers seamlessly.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
