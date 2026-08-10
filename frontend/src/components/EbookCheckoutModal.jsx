import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { CheckIcon } from './icons/Icons';
import api from '../lib/axios';

export default function EbookCheckoutModal({ 
  isOpen, 
  onClose, 
  ebook,
  onPaymentSuccess 
}) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const navigate = useNavigate();

  if (!ebook) return null;

  const safeTitle = ebook.title || "Trade E-book";
  const safePrice = ebook.price || 499;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    if (!ebook._id) {
      alert("Invalid E-book ID");
      return;
    }
    
    setProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // Create order on backend for E-book
      const { data } = await api.post("/payments/create-ebook-order", {
        ebookId: ebook._id,
      });

      if (!data.success) {
        alert("Server error. Please try again.");
        setProcessing(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CRMISA Trade Library",
        description: `Buy Handbook: ${safeTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payments/verify-ebook-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ebookId: ebook._id,
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              if (onPaymentSuccess) onPaymentSuccess();
              setTimeout(() => {
                setSuccess(false);
                onClose();
                navigate("/dashboard");
              }, 2000);
            }
          } catch (error) {
            console.error(error);
            alert("E-book payment verification failed.");
          }
        },
        prefill: {
          name: "Buyer",
          email: "student@example.com",
        },
        theme: {
          color: "#0f172a", // slate-900
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to initialize e-book payment");
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = agreeTerms && agreePrivacy && !processing;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buy E-Book Handbook" maxWidth="max-w-lg">
      {success ? (
        <div className="py-8 text-center space-y-4 font-sans">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckIcon className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Purchase Successful!</h4>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">
            You now own <span className="font-bold text-slate-900">{safeTitle}</span>. Access your handbook from your Dashboard...
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-6 font-sans">
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            {ebook.coverImage ? (
              <img src={ebook.coverImage} alt={safeTitle} className="w-16 h-20 object-cover rounded-md border border-slate-300" />
            ) : (
              <div className="w-16 h-20 bg-slate-900 text-white font-bold text-xs flex items-center justify-center rounded-md p-2 text-center">
                PDF
              </div>
            )}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Digital E-Book (PDF)
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                {safeTitle}
              </h3>
              <div className="text-xs text-slate-500 font-semibold">
                Category: {ebook.category || "Export Trade"}
              </div>
            </div>
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            
            <div className="bg-slate-900 p-4 rounded-xl text-center text-white">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Handbook Price
              </span>
              <span className="block text-3xl font-black text-white">
                ₹{safePrice}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 rounded-sm"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> for digital handbook access.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 rounded-sm"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  I consent to processing my order and receiving instant digital PDF access.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 font-bold text-sm rounded-xl transition-all shadow-sm ${
                  isFormValid 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {processing ? 'Processing Order...' : `Pay ₹${safePrice} & Unlock Handbook`}
              </button>
            </div>

          </form>

        </div>
      )}
    </Modal>
  );
}
