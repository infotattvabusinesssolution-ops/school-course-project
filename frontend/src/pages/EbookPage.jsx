import React from 'react';
import { CartIcon, HeartIcon } from '../components/icons/Icons';

export default function EbookPage({ onAddToCart, onAddToWishlist, onSelectEbook }) {
  const ebooks = [
    {
      id: 1,
      title: "CRMISA – How to Find Buyers Worldwide Marketing, Fairs, B2B Portals & Smart Outreach",
      price: "₹499",
      coverTitle: "FROM LOCAL TO GLOBAL: HOW TO WIN BUYERS ACROSS BORDERS",
      subtitle: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
      description: "Learn the core practices, procedures and documents required in any international merchandise transaction",
      coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "CRMISA – Shipping Mastery Containers, Freight Rates & Customs Without the Jargon",
      price: "₹499",
      coverTitle: "UNFOLDING THE CHAPTERS OF SHIPPING SUCCESS",
      subtitle: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
      description: "Learn the core practices, procedures and documents required in any international merchandise transaction",
      coverImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "CRMISA – Customs Clearance & Import Export Documentation",
      price: "₹499",
      coverTitle: "CUSTOMS CLEARANCE & IMPORT EXPORT DOCUMENTATION",
      subtitle: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
      description: "Learn the core practices, procedures and documents required in any international merchandise transaction",
      coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "CRMISA – Trade Finance & Payment Methods",
      price: "₹499",
      coverTitle: "TRADE FINANCE & PAYMENT METHODS",
      subtitle: "Learn the core practices, procedures and documents required in any international merchandise transaction.",
      description: "Learn the core practices, procedures and documents required in any international merchandise transaction",
      coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="py-12 bg-white text-slate-800 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ebooks
          </h1>
        </div>

        {/* 4 Ebook Cards Grid matching Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 space-y-4 group cursor-pointer"
            >
              {/* Ebook Graphic Cover - Clicking opens EbookDetailPage */}
              <div 
                onClick={() => onSelectEbook && onSelectEbook(item)}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-800 border border-slate-200 shadow-inner flex flex-col justify-between p-4 text-white"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${item.coverImage}')` }}
                />

                <div className="relative z-10 flex justify-end">
                  <div className="w-8 h-8 bg-crmisa-navy rounded-lg flex items-center justify-center border border-white/40 shadow">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 100 120" fill="none">
                      <path d="M50 5 L90 25 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V25 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                      <path d="M50 15 L80 30 V60 C80 80 50 100 50 100 C50 100 20 80 20 60 V30 Z" fill="#0d2859" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 bg-white/90 text-slate-900 p-3 rounded-lg text-center shadow-md backdrop-blur-xs my-auto">
                  <span className="text-[10px] font-black tracking-wider uppercase text-[#1c3c78] block leading-tight">
                    {item.coverTitle}
                  </span>
                </div>

                <div className="relative z-10 flex justify-center">
                  <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[20px] border-b-sky-600/80" />
                </div>
              </div>

              {/* Title & Price & Action Buttons */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                
                <div 
                  onClick={() => onSelectEbook && onSelectEbook(item)}
                  className="space-y-2"
                >
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-crmisa-navy transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-black text-[#1c3c78]">
                    Price : <span className="text-[#1c3c78]">{item.price}</span>
                  </div>
                </div>

                {/* Square Cart & Heart Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(item);
                    }}
                    className="w-8 h-8 rounded border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors shadow-xs"
                    title="Add to Cart"
                  >
                    <CartIcon className="w-4 h-4 text-sky-600" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToWishlist) onAddToWishlist(item);
                    }}
                    className="w-8 h-8 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors shadow-xs"
                    title="Add to Wishlist"
                  >
                    <HeartIcon className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
