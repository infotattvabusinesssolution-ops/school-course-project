import React from "react";
import { GlobeIcon, PackageIcon } from "../icons/Icons";

export default function AboutSection({ onGetStarted, setActivePage }) {
  return (
    <section className="py-12 lg:py-16 bg-slate-900 text-white overflow-hidden relative flex items-center">
      {/* Background Image (Physically Rotated & Reduced) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
        <img
          src="/about/Gemini_Generated_Image_2pg0lr2pg0lr2pg0.png"
          alt="Logistics Background"
          className="w-[90%] h-[90%] object-cover rotate-180 rounded-[3rem] blur-[3px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Side: Circular Import/Export Graphic */}
          <div
            className="lg:col-span-6 flex justify-center w-full mt-4 lg:mt-0 order-2 lg:order-1"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md aspect-square bg-gradient-to-br from-crmisa-lightBlue to-slate-100 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 flex flex-col justify-between overflow-hidden">
              {/* Circular Graphic Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Outer Rotating Arrow Ring */}
                <div className="absolute inset-2 rounded-full border-4 border-dashed border-crmisa-navy/30 animate-[spin_60s_linear_infinite]" />

                {/* Circular Container Graphic */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full bg-crmisa-navy border-4 border-white shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop')`,
                    }}
                  />

                  <div className="relative z-10 space-y-2">
                    <GlobeIcon className="w-12 h-12 text-sky-300 mx-auto animate-bounce" />
                    <h4 className="font-black text-xl tracking-wider uppercase text-white">
                      IMPORT & EXPORT
                    </h4>
                    <p className="text-[10px] text-sky-200 uppercase font-bold tracking-widest">
                      Global Trade Ecosystem
                    </p>
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
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">
                    GET CERTIFIED
                  </span>
                  <span className="text-xs font-black text-white">
                    STUDY TRADE ONLINE
                  </span>
                </div>

                <div className="absolute top-2 right-2 bg-blue-700 text-white p-2.5 rounded-xl shadow-md text-center font-bold text-xs uppercase tracking-wider">
                  IMPORTED
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: ABOUT CRMISA Text */}
          <div
            className="lg:col-span-6 space-y-5 sm:space-y-6 w-full text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2"
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="150"
          >
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-sky-400 uppercase tracking-widest bg-crmisa-darkNavy/80 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-sky-900/50">
                South Africa's #1 Trade Academy
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md">
                ABOUT CRMISA
              </h2>
              <div className="w-16 h-1.5 bg-sky-500 rounded-full"></div>
            </div>

            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-normal drop-shadow">
              <p>
                <strong className="text-white font-bold">CRMISA</strong> is
                South Africa’s leading online academy for Import & Export
                education, built to empower the next generation of African
                entrepreneurs.
              </p>
              <p>
                We offer a fully online, practical course that teaches you
                everything you need to know to start and grow your own
                import/export business, from international trade basics to
                shipping, suppliers, customs, and compliance.
              </p>
              <p>
                But we don’t stop at education. When you complete our course,
                you receive a{" "}
                <span className="font-bold text-sky-400 underline underline-offset-2">
                  FREE registered company
                </span>{" "}
                and a{" "}
                <span className="font-bold text-sky-400 underline underline-offset-2">
                  professional business website
                </span>
                , so you’re ready to trade right away.
              </p>
            </div>

            {/* Get Started Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (setActivePage) setActivePage("about");
                  if (onGetStarted) onGetStarted();
                }}
                className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 text-sm tracking-wide transform hover:-translate-y-0.5"
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
