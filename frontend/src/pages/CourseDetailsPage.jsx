import React, { useState } from 'react';
import { ChevronDownIcon } from '../components/icons/Icons';

export default function CourseDetailsPage({ onOpenEnrol, initialModuleId = 1 }) {
  const [expandedModule, setExpandedModule] = useState(initialModuleId);

  const modules = [
    {
      id: 1,
      title: "Module 1 - Import & Export Full Course",
      intro: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
      duration: "15 Days",
      certification: "CRMISA EXPERT",
      price: "R15000"
    },
    {
      id: 2,
      title: "Module 2 - International Trade Bodies",
      intro: "Overview of WTO, ICC, WCO, AfCFTA, and global trade regulatory organizations governing international commerce.",
      duration: "5 Days",
      certification: "CRMISA TRADE BODIES",
      price: "R3000"
    },
    {
      id: 3,
      title: "Module 3 - Incoterms",
      intro: "Master Incoterms 2020 rules (FOB, CIF, EXW, DDP) and liability allocations between buyers and sellers.",
      duration: "5 Days",
      certification: "CRMISA INCOTERMS",
      price: "R3000"
    },
    {
      id: 4,
      title: "Module 4 - Modes of Transport",
      intro: "Understand sea freight containerization, air cargo, road haulage, multimodal transit, and chartering.",
      duration: "7 Days",
      certification: "CRMISA LOGISTICS",
      price: "R3000"
    },
    {
      id: 5,
      title: "Module 5 - Export and Import Procedures",
      intro: "Comprehensive training on SARS SAD500 clearance forms, EUR.1 origin certificates, and commercial invoicing.",
      duration: "10 Days",
      certification: "CRMISA PROCEDURES",
      price: "R3000"
    },
    {
      id: 6,
      title: "Module 6 - Customs Procedures",
      intro: "Customs tariff classification, duty rates calculation, SARS compliance, bonded warehousing, and port inspection.",
      duration: "8 Days",
      certification: "CRMISA CUSTOMS",
      price: "R3000"
    },
    {
      id: 7,
      title: "Module 7 - Cross Trades Module",
      intro: "Managing triangular trade, third-country shipping logistics, switch bills of lading, and foreign currency financing.",
      duration: "7 Days",
      certification: "CRMISA CROSS TRADES",
      price: "R3000"
    }
  ];

  const toggleAccordion = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="py-12 bg-white text-slate-800 min-h-screen animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title matching Image */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Course Modules
          </h1>
        </div>

        {/* Accordion List Container matching Image */}
        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm divide-y divide-slate-200">
          {modules.map((mod) => {
            const isExpanded = expandedModule === mod.id;
            return (
              <div key={mod.id} className="bg-white">
                
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(mod.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-sm transition-colors ${
                    isExpanded 
                      ? 'bg-blue-50 text-blue-600 font-bold border-b border-blue-200' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{mod.title}</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>

                {/* Accordion Content Body - Exact Replica of Image */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 space-y-6 bg-white animate-fade-in">
                    
                    {/* Intro description line */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {mod.intro}
                    </p>

                    {/* Module Details Box */}
                    <div className="border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
                      
                      <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                        Module Details
                      </h4>

                      {/* Details Table Header & Values */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-xs">
                        
                        <div>
                          <span className="block text-slate-500 font-semibold mb-1">Duration</span>
                          <span className="text-sm font-black text-slate-900">{mod.duration}</span>
                        </div>

                        <div>
                          <span className="block text-slate-500 font-semibold mb-1">Certification</span>
                          <span className="text-sm font-black text-slate-900 uppercase">{mod.certification}</span>
                        </div>

                        <div>
                          <span className="block text-slate-500 font-semibold mb-1">Price</span>
                          <span className="text-sm font-black text-slate-900">{mod.price}</span>
                        </div>

                        <div className="col-span-2 sm:col-span-1 flex justify-start sm:justify-end">
                          <button
                            onClick={onOpenEnrol}
                            className="px-6 py-2.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold text-xs rounded shadow transition-all transform hover:scale-105"
                          >
                            Enroll Now
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
