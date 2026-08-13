import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../lib/axios';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasShown, setHasShown] = useState(() => {
    return sessionStorage.getItem('newsletter_shown') === 'true';
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('newsletter_shown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await api.post('/newsletter/subscribe', { name, email, phone });
      setStatus('success');
      setMessage(res.data.message || 'Subscribed successfully!');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crmisa-navy/40 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-none shadow-2xl w-full max-w-[500px] p-8 flex flex-col relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
        
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shrink-0 rounded-none">
            <span className="material-symbols-outlined text-xl">mail</span>
          </div>
          
          <h3 className="text-lg font-bold text-crmisa-navy mb-2">
            Join Newsletter
          </h3>
          <p className="text-sm text-slate-500 mb-6 px-2 leading-relaxed">
            Get updates & discounts.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-none border border-emerald-100 font-semibold text-sm w-full">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-3 flex flex-col">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-none border border-slate-200 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm"
                placeholder="Full Name"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-none border border-slate-200 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm"
                placeholder="Email Address"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-none border border-slate-200 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm"
                placeholder="Phone Number"
              />
              {status === 'error' && <p className="text-red-500 text-xs font-semibold text-left">{message}</p>}
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none text-sm transition-colors disabled:opacity-70"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
