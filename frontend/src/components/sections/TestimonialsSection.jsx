import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../lib/axios";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonials/active");
        setTestimonials(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Helper to get 3 items for the desktop circular view
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    if (testimonials.length === 1) return [testimonials[0]];
    if (testimonials.length === 2) return [testimonials[currentIndex], testimonials[(currentIndex + 1) % 2]];
    return [
      testimonials[currentIndex],
      testimonials[(currentIndex + 1) % testimonials.length],
      testimonials[(currentIndex + 2) % testimonials.length],
    ];
  };

  // Reusable Testimonial Card Component
  const TestimonialCard = ({ item, className = "" }) => (
    <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between relative group transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 ${className}`}>
      {/* Large Quote Icon Background */}
      <div className="absolute top-4 right-6 text-slate-100 text-7xl sm:text-8xl font-serif leading-none select-none group-hover:text-blue-50 transition-colors duration-300">
        &rdquo;
      </div>

      <div className="relative z-10">
        {/* Star Ratings */}
        <div className="flex gap-1 text-amber-400 mb-4 sm:mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote Text */}
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium mb-8">
          "{item.description || item.quote}"
        </p>
      </div>

      {/* Author Profile */}
      <div className="flex items-center gap-4 pt-5 sm:pt-6 relative z-10 mt-auto border-t border-slate-100">
        <div className="relative">
          <img
            src={item.photo || item.avatar}
            alt={item.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-crmisa-navy rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-crmisa-navy text-sm sm:text-base leading-tight">
            {item.name}
          </h4>
          <p className="text-[10px] sm:text-xs text-sky-600 font-bold uppercase tracking-wider mt-0.5 sm:mt-1">
            Student / Alumnus
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 lg:py-32 bg-slate-50 text-crmisa-accentNavy relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crmisa-lightBlue rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200 rounded-full blur-[100px] opacity-40 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section with Navigation Arrows for Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div data-aos="fade-up" className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-yellow-400"></div>
              <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
                Success Stories
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-crmisa-navy tracking-tight leading-[1.1]">
              Hear from our
              <br className="hidden sm:block" />
              global alumni
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-crmisa-navy hover:border-slate-300 hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-crmisa-navy hover:border-slate-300 hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Responsive Layout: Circular Carousel (1 on mobile, 2 on md, 3 on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {getVisibleTestimonials().map((item, idx) => (
            <div 
              key={`${item.id}-${currentIndex}-${idx}`} 
              className={`animate-fade-in h-full ${idx === 1 ? 'hidden md:block' : ''} ${idx === 2 ? 'hidden lg:block' : ''}`}
            >
              <TestimonialCard item={item} className="h-full" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
