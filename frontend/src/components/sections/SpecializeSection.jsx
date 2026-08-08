import React from 'react';
import { GlobeIcon, PackageIcon, SpeedometerIcon } from '../icons/Icons';

export default function SpecializeSection() {
  const specialties = [
    {
      id: 1,
      title: "Customs Procedures & Documentation Mastery",
      icon: <GlobeIcon className="w-8 h-8 text-sky-400" />,
      desc: "Master bill of lading, commercial invoices, EUR.1, SAD500, and tariff classification."
    },
    {
      id: 2,
      title: "Calculating Landed Costs & Pricing Strategies",
      icon: <PackageIcon className="w-8 h-8 text-sky-400" />,
      desc: "Accurately compute freight rates, duties, taxes, insurance, and profit margins."
    },
    {
      id: 3,
      title: "Setting Up Trade Networks & Finding Agents",
      icon: <SpeedometerIcon className="w-8 h-8 text-sky-400" />,
      desc: "Connect with verified overseas suppliers, buyers, clearing agents, and shippers."
    }
  ];

  return (
    <section className="relative py-12 lg:py-20 text-white overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/student/image copy.png')`
        }}
      />

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-lg">
            WE SPECIALIZE IN
          </h2>
          <div className="w-24 h-1.5 bg-sky-400 rounded-full mx-auto shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
          <p className="text-lg text-slate-300 font-medium pt-4">
            Gain comprehensive expertise in the critical pillars of international trade and logistics.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((item, idx) => (
            <div 
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 150}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-md overflow-hidden"
            >
              {/* Hover gradient effect inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                  {item.icon}
                </div>

                {/* Text Title */}
                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-white tracking-wide leading-tight group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
