import React from "react";
import { GlobeIcon, PackageIcon } from "../icons/Icons";

export default function AboutSection({ onGetStarted }) {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Images & Visuals */}
          <div className="relative" data-aos="fade-right">
            {/* Decorative Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Main Image */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group border border-slate-100">
              <div className="absolute inset-0 bg-crmisa-navy/10 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
                alt="Logistics and Trade"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Stat Card */}
              <div className="absolute bottom-6 right-6 sm:bottom-10 sm:-right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-[220px] border border-white z-20 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <GlobeIcon className="w-6 h-6 text-crmisa-navy" />
                </div>
                <p className="text-4xl font-black text-crmisa-navy tracking-tight">
                  #1
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Trade Academy
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Text content */}
          <div>
            <div
              className="w-full mb-8 flex flex-col items-start"
              data-aos="fade-up"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-yellow-400"></div>
                <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
                  About CRMISA
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-crmisa-navy tracking-tight leading-[1.1] max-w-2xl text-left">
                Empowering African
                <br />
                Entrepreneurs
              </h2>
            </div>

            <div
              className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <p>
                <strong className="text-crmisa-navy font-bold">CRMISA</strong> is
                South Africa’s leading online academy for Import & Export
                education.
              </p>
              <p>
                We offer a fully online, practical course that teaches you
                everything you need to know to start and grow your own
                import/export business, from international trade basics to
                shipping, suppliers, customs, and compliance.
              </p>
            </div>

            {/* Beautiful Checklist for the extra features */}
            <div
              className="my-10 space-y-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex items-center gap-5 bg-slate-50 hover:bg-slate-100 transition-colors p-5 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shrink-0 shadow-inner">
                  <PackageIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-crmisa-navy text-lg">
                    FREE Registered Company
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    Get your business legally registered.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-slate-50 hover:bg-slate-100 transition-colors p-5 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 shadow-inner">
                  <GlobeIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-crmisa-navy text-lg">
                    Professional Website
                  </h4>
                  <p className="text-sm font-medium text-slate-500">
                    Ready-to-use digital presence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
