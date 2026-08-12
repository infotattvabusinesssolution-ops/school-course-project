import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay so it animates in nicely
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 text-black p-4 md:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 animate-slide-up flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex-1 w-full">
        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-lg">
          <span className="material-symbols-outlined text-gray-700">
            cookie
          </span>
          Cookie Preferences
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          We use cookies to ensure you get the best experience on our website.
          You can choose to accept all cookies or reject non-essential ones.
        </p>
      </div>
      <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
        <button
          onClick={handleReject}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-lg transition-colors whitespace-nowrap border border-gray-300"
        >
          Reject All
        </button>
        <button
          onClick={handleAccept}
          className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
