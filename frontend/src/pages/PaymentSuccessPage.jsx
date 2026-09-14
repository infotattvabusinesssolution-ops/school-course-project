import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../lib/axios';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const m_payment_id = searchParams.get('m_payment_id');

  useEffect(() => {
    // In simulation mode, the CheckoutModal already verified on the frontend.
    // In live PayFast mode, PayFast redirects here as a courtesy — actual fulfillment 
    // is done via ITN webhook. We can do an optional backend ping to ensure enrollment
    // is created even if ITN is delayed.
    const attemptFallbackVerification = async () => {
      if (!m_payment_id) return;
      
      try {
        setVerifying(true);
        if (type === 'course' && id) {
          // Attempt silent verify — backend is idempotent so calling twice is safe
          await api.post('/payments/verify-payfast-payment', {
            courseId: id,
            m_payment_id,
          }).catch(() => {}); // Silently ignore errors — ITN may have already handled it
        } else if (type === 'ebook' && id) {
          await api.post('/payments/verify-ebook-payment', {
            ebookId: id,
            m_payment_id,
          }).catch(() => {});
        }
      } finally {
        setVerifying(false);
      }
    };

    // Only do fallback verification in live mode (not simulate mode)
    if (import.meta.env.VITE_SIMULATE_PAYMENT !== 'true') {
      attemptFallbackVerification();
    }
  }, [type, id, m_payment_id]);

  const handleContinue = () => {
    if (type === 'course' && id) {
      navigate(`/course-premium/${id}`);
    } else if (type === 'ebook') {
      navigate('/dashboard/ebooks');
    } else if (type === 'reexam' && id) {
      navigate(`/course/${id}/exam`);
    } else {
      navigate('/dashboard/courses');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-10 max-w-lg w-full text-center border border-slate-200 shadow-sm mx-4 rounded-2xl">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-crmisa-navy mb-4">Payment Successful!</h1>
        
        <p className="text-slate-600 mb-2 leading-relaxed">
          Thank you for your purchase. Your transaction has been completed and a receipt has been emailed to you.
        </p>

        {verifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Activating your access...</span>
          </div>
        )}

        <div className="space-y-4 mt-8">
          <button
            onClick={handleContinue}
            className="w-full bg-crmisa-navy text-white py-3 px-6 font-bold hover:bg-crmisa-accentNavy transition-colors flex items-center justify-center gap-2 rounded-xl"
          >
            <span>
              {type === 'course' ? 'Go to Course' : 
               type === 'ebook' ? 'Go to My E-books' : 
               type === 'reexam' ? 'Take Exam Now' : 
               'Go to Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <Link
            to="/dashboard/courses"
            className="block w-full bg-slate-100 text-crmisa-navy py-3 px-6 font-semibold hover:bg-slate-200 transition-colors border border-slate-300 rounded-xl"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
