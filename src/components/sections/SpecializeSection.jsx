import React from 'react';
import { GlobeIcon, PackageIcon, SpeedometerIcon } from '../icons/Icons';

export default function SpecializeSection() {
  const specialties = [
    {
      id: 1,
      title: "Customs Procedures & Documentation Mastery",
      icon: <GlobeIcon className="w-6 h-6 text-white" />,
      desc: "Master bill of lading, commercial invoices, EUR.1, SAD500, and tariff classification."
    },
    {
      id: 2,
      title: "Calculating Landed Costs & Pricing Strategies",
      icon: <PackageIcon className="w-6 h-6 text-white" />,
      desc: "Accurately compute freight rates, duties, taxes, insurance, and profit margins."
    },
    {
      id: 3,
      title: "Setting Up Trade Networks & Finding Agents",
      icon: <SpeedometerIcon className="w-6 h-6 text-white" />,
      desc: "Connect with verified overseas suppliers, buyers, clearing agents, and shippers."
    }
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-slate-900 text-white overflow-hidden">
      
      {/* Background Container Port Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1920&auto=format&fit=crop')`
        }}
      />

      {/* Dark Navy Overlay matching Image 3 */}
      <div className="absolute inset-0 bg-gradient-to-r from-crmisa-darkNavy/95 via-crmisa-navy/90 to-crmisa-darkNavy/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: WE SPECIALIZE IN Title & 3 Badges - Replica of Image 3 */}
          <div className="lg:col-span-7 space-y-8" data-aos="fade-right">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
                WE SPECIALIZE IN
              </h2>
              <div className="w-20 h-1.5 bg-sky-400 rounded-full"></div>
            </div>

            {/* 3 Circular Icon Items */}
            <div className="space-y-6">
              {specialties.map((item, idx) => (
                <div 
                  key={item.id}
                  data-aos="fade-up"
                  data-aos-delay={(idx + 1) * 100}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                >
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-crmisa-navy border-2 border-white/40 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:border-sky-300 transition-all">
                    {item.icon}
                  </div>

                  {/* Text Title */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Circular Crane Graphic with Red IMPORT & Blue EXPORT Containers - Replica of Image 3 */}
          <div className="lg:col-span-5 flex justify-center" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white shadow-2xl p-6 flex flex-col items-center justify-center border-4 border-sky-400/50 group">
              
              {/* Crane Hook Representation */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1.5 h-16 bg-slate-300" />
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-8 h-4 border-2 border-slate-300 border-t-0 rounded-b-full" />

              <div className="w-full h-full rounded-full border-2 border-slate-100 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
                
                {/* Red IMPORT Container */}
                <div className="w-full max-w-[200px] bg-red-600 text-white font-black text-center py-3 rounded-lg shadow-md border-2 border-red-700 tracking-wider text-xl uppercase transform -rotate-1 group-hover:scale-105 transition-transform">
                  IMPORT
                </div>

                {/* Connecting Crane Cable */}
                <div className="w-1 h-4 bg-slate-400 my-1"></div>

                {/* Blue EXPORT Container */}
                <div className="w-full max-w-[200px] bg-sky-600 text-white font-black text-center py-3 rounded-lg shadow-md border-2 border-sky-700 tracking-wider text-xl uppercase transform rotate-1 group-hover:scale-105 transition-transform">
                  EXPORT
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
