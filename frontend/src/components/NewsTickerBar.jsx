import React from 'react';

export default function NewsTickerBar() {
  const newsItems = [
    "Logistics News",
    "Global Trade Magazine-Import/Export Industry News",
    "Shipping and Freight Resource-Education & Industry Updates",
    "International Trade Centre (ITC) News",
    "African Continental Free Trade Area (AfCFTA) Updates",
    "Customs & Port Authority Compliance Directives 2026",
    "South African Export Council Certified Accreditation",
  ];

  return (
    <div className="bg-crmisa-navy text-white text-xs sm:text-sm py-2.5 overflow-hidden relative shadow-inner border-y border-crmisa-accentNavy z-20">
      <div className="animate-marquee-scroll flex items-center whitespace-nowrap space-x-8 font-semibold tracking-wide text-slate-100">
        {[...newsItems, ...newsItems].map((item, index) => (
          <span key={index} className="flex items-center space-x-6">
            <span className="hover:text-sky-300 transition-colors cursor-pointer">{item}</span>
            <span className="text-sky-400 font-bold text-lg">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
