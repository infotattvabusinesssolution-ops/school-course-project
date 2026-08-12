import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  useEffect(() => {
    // We could do additional verification here by calling backend to check order status
    // but Payfast ITN will handle the actual fulfillment.
  }, [type, id]);

  const handleContinue = () => {
    if (type === 'course' && id) {
      navigate(`/course-player/${id}`);
    } else if (type === 'ebook') {
      navigate('/dashboard'); // Ebooks are usually in dashboard or a specific ebook viewer
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-10 max-w-lg w-full text-center border border-slate-200 shadow-sm mx-4">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Thank you for your purchase. Your transaction has been completed successfully and a receipt has been emailed to you.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-slate-900 text-white py-3 px-6 font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <Link
            to="/dashboard"
            className="block w-full bg-slate-100 text-slate-900 py-3 px-6 font-semibold hover:bg-slate-200 transition-colors border border-slate-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
