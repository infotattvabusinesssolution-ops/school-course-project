import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "After 8 years working for a logistics company, I thought I knew exports. Boy, was I wrong! The market expansion strategies course showed me how to find buyers directly. Quit my job last year and now run my own export consultancy. Lifechanging!",
      name: "Thandi M",
      role: "Export Consultant & Business Owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 2,
      quote: "I nearly gave up on exporting after my first failed shipment to Zambia. Then I found CRMISA. Their step-by-step customs documentation training saved me thousands in losses. Now I'm shipping spices to countries - all because I learned how to do it properly",
      name: "David K",
      role: "Agricultural Spice Exporter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 3,
      quote: "My handmade crafts business was stuck at local markets until I took the 'Export Starter' program. Learned how to price for international buyers, handle shipping, and even got introduced to my first overseas client through the school's network. 42 international orders this quarter!",
      name: "Aisha B",
      role: "Handcrafts & Textile Artisan",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 4,
      quote: "CRMISA's free company registration and free website setup were the icing on the cake. I was fully operational within 3 weeks of starting the course!",
      name: "Kabo N",
      role: "Tech Hardware Importer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= testimonials.length - 3 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 lg:py-28 bg-slate-50 text-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Replica of Image 5 */}
        <div className="mb-12" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Testimonials
          </h2>
          <div className="w-24 h-1 bg-sky-400 mt-2 rounded-full"></div>
        </div>

        {/* Carousel Container with Left/Right arrows - Replica of Image 5 */}
        <div className="relative flex items-center">
          
          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute -left-3 sm:-left-6 z-20 w-11 h-11 rounded-xl bg-slate-300 hover:bg-crmisa-navy text-slate-700 hover:text-white items-center justify-center shadow-lg transition-all transform hover:scale-105"
            aria-label="Previous Testimonial"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Cards Grid / Mobile Swipe */}
          <div className="w-full flex overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:grid md:grid-cols-3 gap-4 lg:gap-6 px-1 md:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {testimonials.slice(currentIndex, currentIndex + 3).map((item, idx) => (
              <div 
                key={item.id}
                data-aos="zoom-in"
                data-aos-delay={(idx + 1) * 100}
                className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center shrink-0 bg-crmisa-lightBlue rounded-2xl shadow-lg border border-slate-200 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                
                {/* Quote Content */}
                <div className="p-6 sm:p-7 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic min-h-[160px] flex items-center">
                  "{item.quote}"
                </div>

                {/* Avatar & Name Banner Overlay matching Image 5 */}
                <div className="relative pt-8">
                  {/* Overlapping Circle Avatar */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Dark Navy Name Banner Box - Exact Replica of Image 5 */}
                  <div className="bg-crmisa-navy text-white text-center py-4 px-4">
                    <h4 className="font-extrabold text-base tracking-wide text-white">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-sky-300 font-semibold uppercase tracking-wider">
                      {item.role}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute -right-3 sm:-right-6 z-20 w-11 h-11 rounded-xl bg-crmisa-navy hover:bg-crmisa-accentNavy text-white items-center justify-center shadow-lg transition-all transform hover:scale-105"
            aria-label="Next Testimonial"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

        </div>

      </div>
    </section>
  );
}
