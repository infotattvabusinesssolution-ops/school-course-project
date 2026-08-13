import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { CheckIcon } from './icons/Icons';
import api from '../lib/axios';
import { useCart } from '../context/CartContext';

export default function CartCheckoutModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess 
}) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();
  const totalPrice = getCartTotal();

  // No need to load external script for Payfast form POST

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode });
      if (data.success) {
        setAppliedCoupon({
          code: couponCode,
          discountType: data.data.discountType,
          discountValue: data.data.discountValue
        });
        setCouponCode("");
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    
    setProcessing(true);

    try {
      const { data } = await api.post("/payments/create-cart-order", {
        items: cartItems,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      });

      if (!data.success) {
        alert("Server error. Please try again.");
        setProcessing(false);
        return;
      }

      // SIMULATION MODE BYPASS
      if (import.meta.env.VITE_SIMULATE_PAYMENT === 'true') {
        const verifyRes = await api.post("/payments/verify-cart-payment", {
          items: cartItems,
          m_payment_id: data.payload.m_payment_id
        });

        if (verifyRes.data.success) {
          setSuccess(true);
          clearCart();
          if (onPaymentSuccess) onPaymentSuccess();
          setTimeout(() => {
            setSuccess(false);
            onClose();
            navigate(`/courses`);
          }, 2000);
        }
        setProcessing(false);
        return;
      }

      // LIVE MODE: Create dynamic form and submit
      const form = document.createElement('form');
      form.action = data.actionUrl;
      form.method = 'POST';
      
      Object.keys(data.payload).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.payload[key];
          form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to initialize payment");
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = agreeTerms && agreePrivacy && !processing && cartItems.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cart Checkout" maxWidth="max-w-lg">
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckIcon className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold text-crmisa-navy">Payment Successful!</h4>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">
            Your purchase is complete. Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-crmisa-navy leading-tight">
              Checkout
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              You are purchasing {cartItems.length} items
            </p>
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-500">
                  Cart Total
                </span>
                <span className={`text-base font-medium ${appliedCoupon ? 'text-slate-400 line-through' : 'text-crmisa-navy'}`}>
                  R{totalPrice}
                </span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center mb-1 text-emerald-600">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span>
                    Discount ({appliedCoupon.code})
                  </span>
                  <span className="text-base font-bold">
                    -R{appliedCoupon.discountType === 'percentage' 
                      ? (parseFloat(totalPrice) * (appliedCoupon.discountValue / 100)).toFixed(2)
                      : appliedCoupon.discountValue.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                <span className="text-base font-bold text-crmisa-navy">
                  Total Payable
                </span>
                <span className="text-2xl font-bold text-crmisa-navy">
                  R{appliedCoupon 
                    ? Math.max(0, parseFloat(totalPrice) - (appliedCoupon.discountType === 'percentage' ? parseFloat(totalPrice) * (appliedCoupon.discountValue / 100) : appliedCoupon.discountValue)).toFixed(2)
                    : totalPrice}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowCouponInput(!showCouponInput)}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showCouponInput ? 'remove' : 'add'}
                </span>
                Have a coupon or referral code?
              </button>
              
              {showCouponInput && !appliedCoupon && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-crmisa-navy text-white font-bold rounded-md text-sm hover:bg-crmisa-accentNavy disabled:opacity-50 transition-colors"
                  >
                    {validatingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}
              
              {couponError && (
                <p className="text-xs text-red-500 font-medium">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-2 rounded-md border border-emerald-200 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span className="font-bold">{appliedCoupon.code}</span> applied successfully!
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-crmisa-navy border-slate-300 focus:ring-slate-900 rounded-sm"
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
                  className="mt-1 w-4 h-4 text-crmisa-navy border-slate-300 focus:ring-slate-900 rounded-sm"
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
                className={`w-full py-3.5 font-bold text-base transition-colors rounded-xl ${
                  isFormValid 
                    ? 'bg-crmisa-navy hover:bg-crmisa-accentNavy text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {processing ? 'Processing...' : 'Pay securely with Payfast'}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
