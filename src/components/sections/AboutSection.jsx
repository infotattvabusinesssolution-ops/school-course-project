import React from 'react';
import { GlobeIcon, PackageIcon } from '../icons/Icons';

export default function AboutSection({ onGetStarted, setActivePage }) {
  return (
    <section className="py-16 lg:py-24 bg-white text-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Circular Import/Export Graphic - Exact Replica of Image 2 */}
          <div className="lg:col-span-6 flex justify-center" data-aos="fade-right" data-aos-duration="800">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-crmisa-lightBlue to-slate-100 rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between overflow-hidden">
              
              {/* Circular Graphic Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Outer Rotating Arrow Ring */}
                <div className="absolute inset-2 rounded-full border-4 border-dashed border-crmisa-navy/30 animate-[spin_60s_linear_infinite]" />

                {/* Circular Container Graphic */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-crmisa-navy border-4 border-white shadow-2xl flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden group">
                  
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop')`
                    }}
                  />

                  <div className="relative z-10 space-y-2">
                    <GlobeIcon className="w-12 h-12 text-sky-300 mx-auto animate-bounce" />
                    <h4 className="font-black text-xl tracking-wider uppercase text-white">IMPORT & EXPORT</h4>
                    <p className="text-[10px] text-sky-200 uppercase font-bold tracking-widest">Global Trade Ecosystem</p>
                  </div>

                  {/* Badges on circle */}
                  <div className="absolute top-3 left-4 bg-sky-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase shadow">
                    Export
                  </div>
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase shadow">
                    Import
                  </div>

                </div>

                {/* Corner Banner Badges matching Image 2 */}
                <div className="absolute bottom-2 left-2 bg-crmisa-darkNavy text-white p-3 rounded-xl shadow-lg border border-crmisa-navy max-w-[170px]">
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">GET CERTIFIED</span>
                  <span className="text-xs font-black text-white">STUDY TRADE ONLINE</span>
                </div>

                <div className="absolute top-2 right-2 bg-blue-700 text-white p-2.5 rounded-xl shadow-md text-center font-bold text-xs uppercase tracking-wider">
                  IMPORTED
                </div>

              </div>

            </div>
          </div>

          {/* Right Side: ABOUT CRMISA Text - Exact Replica of Image 2 */}
          <div className="lg:col-span-6 space-y-6" data-aos="fade-left" data-aos-duration="800" data-aos-delay="150">
            
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-crmisa-navy uppercase tracking-widest bg-crmisa-lightBlue px-3 py-1 rounded-full inline-block">
                South Africa's #1 Trade Academy
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                ABOUT CRMISA
              </h2>
              <div className="w-16 h-1.5 bg-crmisa-navy rounded-full"></div>
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                <strong className="text-slate-900 font-bold">CRMISA</strong> is South Africa’s leading online academy for Import & Export education, built to empower the next generation of African entrepreneurs.
              </p>
              <p>
                We offer a fully online, practical course that teaches you everything you need to know to start and grow your own import/export business, from international trade basics to shipping, suppliers, customs, and compliance.
              </p>
              <p>
                But we don’t stop at education. When you complete our course, you receive a <span className="font-bold text-crmisa-navy underline underline-offset-2">FREE registered company</span> and a <span className="font-bold text-crmisa-navy underline underline-offset-2">professional business website</span>, so you’re ready to trade right away.
              </p>
            </div>

            {/* Get Started Button - Replica of Image 2 */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (setActivePage) setActivePage('about');
                  if (onGetStarted) onGetStarted();
                }}
                className="inline-flex items-center space-x-2 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide transform hover:-translate-y-0.5"
              >
                <span>Get Started &gt;&gt;</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
