import React from 'react';

const headlines = [
  "Global Trade Magazine-Import/Export Industry News",
  "Shipping and Freight Resource-Education & Industry Updates",
  "International Trade Centre (ITC) News",
  "Trade Finance Global (TFG)",
  "Journal of Commerce (JOC.com)-Trade & Logistics",
  "Export.gov (via Trade.gov) - U.S. Trade News & Tools",
  "World Trade Organization (WTO) News",
  "UNCTAD - Global Trade & Development"
];

export default function HeadlineTicker() {
  // Duplicate the headlines to create a seamless infinite loop
  const duplicatedHeadlines = [...headlines, ...headlines];

  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 py-3 overflow-hidden">
      <div className="animate-marquee-scroll flex items-center space-x-12 px-6">
        {duplicatedHeadlines.map((text, index) => (
          <div key={index} className="flex items-center space-x-4 whitespace-nowrap">
            <span className="text-slate-300 font-semibold text-sm tracking-wide uppercase">
              {text}
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500 opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
