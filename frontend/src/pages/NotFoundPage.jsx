import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center font-sans">
      <div className="bg-white p-10 sm:p-16 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-7xl font-black text-crmisa-navy mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-sm">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link 
          to="/"
          className="flex items-center gap-2 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-crmisa-navy/20"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
