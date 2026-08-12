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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Container - Flat design without shadows */}
      <div className={`relative w-full ${maxWidth} bg-white border border-slate-200 overflow-hidden transform transition-all animate-slide-up z-10 my-8`}>
        
        {/* Modal Header - Light theme */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto font-sans text-slate-800">
          {children}
        </div>

      </div>
    </div>
  );
}
