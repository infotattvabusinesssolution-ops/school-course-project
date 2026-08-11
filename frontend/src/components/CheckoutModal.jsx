import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { CheckIcon } from './icons/Icons';
import api from '../lib/axios';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  courseTitle = "Import & Export Full Course", 
  coursePrice = 15000, 
  courseId,
  onPaymentSuccess 
}) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const navigate = useNavigate();

  // Ensure safe string rendering in case an event object was passed
  const safeTitle = typeof courseTitle === 'string' ? courseTitle : "Course";
  // Remove any non-numeric characters in case a formatted string was passed
  const safePrice = String(coursePrice).replace(/[^0-9.]/g, '');

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
    if (!courseId) {
      alert("Invalid course ID");
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

      // Create order on backend
      const { data } = await api.post("/payments/create-razorpay-order", {
        courseId,
      });

      if (!data.success) {
        alert("Server error. Please try again.");
        setProcessing(false);
        return;
      }

      // SIMULATION MODE BYPASS
      if (import.meta.env.VITE_SIMULATE_PAYMENT === 'true') {
        const verifyRes = await api.post("/payments/verify-razorpay-payment", {
          razorpay_order_id: data.orderId,
          razorpay_payment_id: "sim_pay_" + Date.now(),
          razorpay_signature: "SIMULATED_SIGNATURE",
          courseId,
        });

        if (verifyRes.data.success) {
          setSuccess(true);
          if (onPaymentSuccess) onPaymentSuccess();
          setTimeout(() => {
            setSuccess(false);
            onClose();
            navigate(`/course-player/${courseId}`);
          }, 2000);
        }
        return; // Skip loading actual Razorpay
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Skillwell",
        description: `Enroll in ${safeTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payments/verify-razorpay-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              if (onPaymentSuccess) onPaymentSuccess();
              setTimeout(() => {
                setSuccess(false);
                onClose();
                navigate(`/course-player/${courseId}`);
              }, 2000);
            }
          } catch (error) {
            console.error(error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Student",
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
      alert(err.response?.data?.message || "Failed to initialize payment");
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = agreeTerms && agreePrivacy && !processing;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Checkout" maxWidth="max-w-lg">
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckIcon className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Payment Successful!</h4>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">
            You are enrolled in <span className="font-bold text-slate-900">{safeTitle}</span>. Redirecting to the course player...
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-6">
          
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              Checkout
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {safeTitle}
            </p>
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-md text-center">
              <span className="block text-sm font-medium text-slate-500 mb-1">
                Total Price
              </span>
              <span className="block text-3xl font-bold text-slate-900">
                R{safePrice}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 rounded-sm"
                />
                <span className="text-sm text-slate-600 leading-snug">
                  I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> of this platform.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 rounded-sm"
                />
                <span className="text-sm text-slate-600 leading-snug">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to the processing of my data.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 font-bold text-base transition-colors ${
                  isFormValid 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {processing ? 'Processing...' : 'Pay securely with Razorpay'}
              </button>
            </div>

          </form>

        </div>
      )}
    </Modal>
  );
}
