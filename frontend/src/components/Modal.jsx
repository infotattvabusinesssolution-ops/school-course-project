import React, { useEffect } from 'react';
import { XIcon } from './icons/Icons';

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Container */}
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-slide-up z-10 my-8`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-crmisa-navy text-white">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
