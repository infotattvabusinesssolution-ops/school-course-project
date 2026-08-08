import React from 'react';
import { CheckIcon, GlobeIcon, PackageIcon, SpeedometerIcon } from '../components/icons/Icons';

export default function AboutPage({ onOpenRegister }) {
  return (
    <div className="py-12 bg-white text-slate-800 min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-crmisa-navy uppercase tracking-widest bg-crmisa-lightBlue px-3.5 py-1.5 rounded-full">
            Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Building Africa's Next Trade Tycoons
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            CRMISA (Quality Education) was founded with a singular purpose: breaking down barriers to international commerce for aspiring African entrepreneurs.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-crmisa-navy text-white rounded-xl flex items-center justify-center font-black text-xl shadow">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900">Practical Education</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No boring theory. We teach real customs documentation, tariff codes, container logistics, and supplier negotiation techniques.
            </p>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-crmisa-navy text-white rounded-xl flex items-center justify-center font-black text-xl shadow">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900">Turnkey Business Setup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We register your company with CIPC in South Africa and build your professional trade website so you graduate ready to invoice clients.
            </p>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-crmisa-navy text-white rounded-xl flex items-center justify-center font-black text-xl shadow">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900">Global Trade Network</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access our verified directory of freight forwarders, clearing agents, and international buyers across China, Europe, and SADC countries.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-crmisa-darkNavy to-crmisa-navy text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black uppercase">Ready to launch your trade career?</h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Join thousands of successful graduates shipping products worldwide.
            </p>
          </div>
          <button
            onClick={onOpenRegister}
            className="px-8 py-3.5 bg-white text-crmisa-navy font-extrabold rounded-full shadow hover:bg-sky-50 transition-all text-sm uppercase tracking-wider shrink-0"
          >
            Register Now &gt;&gt;
          </button>
        </div>

      </div>
    </div>
  );
}
