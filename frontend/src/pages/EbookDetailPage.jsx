import React from 'react';

export default function EbookDetailPage({ ebook, onAddToCart, onBack }) {
  const selectedEbook = ebook || {
    id: 2,
    title: "CRMISA – Shipping Mastery Containers, Freight Rates & Customs Without the Jargon",
    price: "₹499",
    coverTitle: "UNFOLDING THE CHAPTERS OF SHIPPING SUCCESS",
    subtitle: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
    description: "Learn the core practices, procedures and documents required in any international merchandise transaction",
    coverImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop"
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        {onBack && (
          <button 
            onClick={onBack}
            className="text-xs font-bold text-[#1c3c78] hover:text-crmisa-navy flex items-center space-x-1"
          >
            <span>&larr; Back to Ebooks</span>
          </button>
        )}

        {/* Main Product Card matching Image */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Ebook Cover Graphic matching Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-slate-200 shadow-md flex flex-col justify-between p-4 text-white group">
              
              {/* Background Image overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                style={{ backgroundImage: `url('${selectedEbook.coverImage}')` }}
              />

              {/* Top Logo Shield Emblem */}
              <div className="relative z-10 flex justify-end">
                <div className="w-8 h-8 bg-crmisa-navy rounded-lg flex items-center justify-center border border-white/40 shadow">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 100 120" fill="none">
                    <path d="M50 5 L90 25 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V25 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                    <path d="M50 15 L80 30 V60 C80 80 50 100 50 100 C50 100 20 80 20 60 V30 Z" fill="#0d2859" stroke="#ffffff" strokeWidth="3" />
                  </svg>
                </div>
              </div>

              {/* Center Banner Cover Text */}
              <div className="relative z-10 bg-white/90 text-slate-900 p-3 rounded-lg text-center shadow-md backdrop-blur-xs my-auto">
                <span className="text-xs font-black tracking-wider uppercase text-[#1c3c78] block leading-tight">
                  {selectedEbook.coverTitle || "UNFOLDING THE CHAPTERS OF SHIPPING SUCCESS"}
                </span>
              </div>

              {/* Bottom Geometric Triangle */}
              <div className="relative z-10 flex justify-center">
                <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[20px] border-b-sky-600/80" />
              </div>

            </div>
          </div>

          {/* Right Column: Ebook Information matching Image */}
          <div className="md:col-span-7 space-y-6 pt-2">
            
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {selectedEbook.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                {selectedEbook.subtitle || "Learn the core practices, procedures and documents required in any international merchandise transaction."}
              </p>
            </div>

            {/* Price & In Stock Badge matching Image */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0891b2] tracking-tight">
                {selectedEbook.price}
              </span>

              <span className="bg-[#0891b2] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
                In Stock
              </span>
            </div>

            {/* Add to Cart Button matching Image */}
            <div className="pt-2">
              <button
                onClick={() => onAddToCart && onAddToCart(selectedEbook)}
                className="px-8 py-3.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-full shadow-md hover:shadow-xl transition-all duration-200 text-sm tracking-wide"
              >
                Add to Cart
              </button>
            </div>

          </div>

        </div>

        {/* Description Section matching Image */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Description
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {selectedEbook.description || "Learn the core practices, procedures and documents required in any international merchandise transaction"}
          </p>
        </div>

      </div>
    </div>
  );
}
