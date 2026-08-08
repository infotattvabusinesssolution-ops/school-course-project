import React from 'react';
import { UserIcon } from '../icons/Icons';
import NewsTickerBar from '../NewsTickerBar';

export default function HeroSection({ onOpenRegister }) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
      
      {/* Container Freight Port Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      
      {/* Dark Gradient Overlay matching Image 1 */}
      <div className="absolute inset-0 bg-gradient-to-r from-crmisa-darkNavy via-crmisa-navy/90 to-transparent z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Navy Banner & WHY YOU Card */}
          <div className="lg:col-span-6 space-y-6" data-aos="fade-right" data-aos-duration="800">
            
            {/* Top Large Banner Box - Exact Replica of Image 1 */}
            <div className="bg-crmisa-darkNavy/90 border border-slate-700/60 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-md">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase leading-tight">
                IMPORT & EXPORT COURSES<br />
                <span className="text-sky-300">NURTURING PASSION</span>
              </h1>
            </div>

            {/* WHY YOU Info Card - Exact Replica of Image 1 */}
            <div className="bg-crmisa-navy/70 border border-crmisa-accentNavy/50 p-6 sm:p-7 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <h2 className="text-xl font-extrabold tracking-wide text-white uppercase flex items-center">
                <span className="w-3 h-3 bg-sky-400 rounded-full mr-2.5 animate-pulse"></span>
                WHY YOU
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                We aim to cultivate self-made trade entrepreneurs who not only transport goods but also build lasting legacies by equipping them with the skills and knowledge needed to excel in global commerce and make a positive impact on their communities and the world.
              </p>
              
              {/* Register Now Pill Button - Exact Replica of Image 1 */}
              <div className="pt-2">
                <button
                  onClick={onOpenRegister}
                  className="group relative inline-flex items-center space-x-3 bg-crmisa-darkNavy hover:bg-crmisa-accentNavy text-white font-extrabold px-6 py-3 rounded-full border-2 border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-crmisa-navy flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserIcon className="w-5 h-5 text-crmisa-navy" />
                  </div>
                  <span className="text-sm tracking-wide">Register now</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Graduate Student & Cargo Visual - Replica of Image 1 */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200">
            
            {/* Visual Container Frame */}
            <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-800/80">
              
              {/* Background Ship & Plane Freight */}
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
                alt="Freight Cargo Ship and Logistics"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Foreground Student Graduate Portrait */}
              <div className="absolute bottom-0 right-0 w-3/4 sm:w-2/3 h-full flex items-end justify-center pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="CRMISA Graduate Student"
                  className="w-full h-full object-contain object-bottom drop-shadow-2xl filter contrast-105"
                />
              </div>

              {/* Decorative Overlay Tag */}
              <div className="absolute top-4 left-4 bg-crmisa-navy/90 border border-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md backdrop-blur-sm">
                Certified Graduate Path
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom News Marquee Bar */}
      <NewsTickerBar />

    </section>
  );
}
