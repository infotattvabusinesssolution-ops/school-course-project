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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Container - Full screen on mobile, centered modal on desktop */}
      <div className={`relative w-full h-full sm:h-auto ${maxWidth} bg-white sm:border sm:border-slate-200 overflow-hidden transform transition-all animate-slide-up z-10 sm:my-8 flex flex-col sm:rounded-xl max-h-screen sm:max-h-[90vh]`}>
        
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
        <div className="p-5 sm:p-8 overflow-y-auto font-sans text-slate-800 flex-1 overscroll-contain">
          {children}
        </div>

      </div>
    </div>
  );
}
