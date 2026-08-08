import React from 'react';
import { BookOpenIcon } from '../icons/Icons';

export default function CourseModulesSection({ onOpenEnrol }) {
  const modules = [
    {
      id: 1,
      title: "Import & Export Full Course",
      lessons: "18 lessons",
      price: "R15000",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "International Trade Bodies",
      lessons: "3 lessons",
      price: "R3000",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Incoterms",
      lessons: "3 lessons",
      price: "R3000",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Modes of Transport",
      lessons: "3 lessons",
      price: "R3000",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Video */}
        <div className="mb-10 space-y-2" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Course Modules
          </h2>
          <div className="w-24 h-1 bg-crmisa-navy rounded-full"></div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1">
            Certificate program in import and export management
          </p>
        </div>

        {/* 4 Cards Grid with Smooth Video Hover Effect & Staggered Scroll Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((item, idx) => (
            <div 
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 100}
              className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-crmisa-navy shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Body with Smooth Navy Fill Transition */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white group-hover:bg-crmisa-navy transition-colors duration-300">
                
                <div className="space-y-2">
                  {/* Lessons Metadata */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 group-hover:text-slate-200 font-semibold transition-colors duration-300">
                    <BookOpenIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
                    <span>{item.lessons}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-white leading-snug transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* Price & Action Button */}
                <div className="pt-4 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between transition-colors duration-300">
                  <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-white transition-colors duration-300">
                    {item.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEnrol();
                    }}
                    className="px-5 py-2 bg-crmisa-navy text-white group-hover:bg-white group-hover:text-crmisa-navy font-bold rounded-xl text-xs shadow-md transition-all duration-300 transform group-hover:scale-105"
                  >
                    Enroll Now
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

