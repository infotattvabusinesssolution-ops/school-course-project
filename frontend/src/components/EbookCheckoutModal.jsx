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

  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const navigate = useNavigate();

  if (!ebook) return null;

  const safeTitle = ebook.title || "Trade E-book";
  const safePrice = ebook.price || 499;

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
    if (!ebook._id) {
      alert("Invalid E-book ID");
      return;
    }
    
    setProcessing(true);

    try {
      const { data } = await api.post("/payments/create-ebook-order", {
        ebookId: ebook._id,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      });

      if (!data.success) {
        alert("Server error. Please try again.");
        setProcessing(false);
        return;
      }

      // Removed simulation mode bypass to ensure live PayFast checkout is always used for e-books.

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
          <h4 className="text-2xl font-bold text-crmisa-navy">Purchase Successful!</h4>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">
            You now own <span className="font-bold text-crmisa-navy">{safeTitle}</span>. Access your handbook from your Dashboard...
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-6 font-sans">
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            {ebook.coverImage ? (
              <img 
                src={ebook.coverImage} 
                alt={safeTitle} 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling;
                  if (fb) fb.style.display = 'flex';
                }}
                className="w-16 h-20 object-cover rounded-md border border-slate-300" 
              />
            ) : null}
            <div 
              style={{ display: ebook.coverImage ? 'none' : 'flex' }}
              className="w-16 h-20 bg-crmisa-navy text-white font-bold text-xs flex items-center justify-center rounded-md p-2 text-center"
            >
              PDF
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Digital E-Book (PDF)
              </span>
              <h3 className="text-base font-bold text-crmisa-navy leading-snug line-clamp-2">
                {safeTitle}
              </h3>
              <div className="text-xs text-slate-500 font-semibold">
                Category: {ebook.category || "Export Trade"}
              </div>
            </div>
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            
            <div className="bg-crmisa-navy p-4 rounded-xl text-left text-white space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Handbook Price
                </span>
                <span className={`text-sm font-semibold ${appliedCoupon ? 'line-through opacity-50' : ''}`}>
                  R{safePrice}
                </span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_offer</span>
                    Discount ({appliedCoupon.code})
                  </span>
                  <span className="text-sm font-bold">
                    -R{appliedCoupon.discountType === 'percentage' 
                      ? (parseFloat(safePrice) * (appliedCoupon.discountValue / 100)).toFixed(2)
                      : appliedCoupon.discountValue.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-sm font-bold uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-3xl font-black">
                  R{appliedCoupon 
                    ? Math.max(0, parseFloat(safePrice) - (appliedCoupon.discountType === 'percentage' ? parseFloat(safePrice) * (appliedCoupon.discountValue / 100) : appliedCoupon.discountValue)).toFixed(2)
                    : safePrice}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowCouponInput(!showCouponInput)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">
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
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-crmisa-navy text-white font-bold rounded-lg text-xs hover:bg-crmisa-accentNavy disabled:opacity-50 transition-colors"
                  >
                    {validatingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}
              
              {couponError && (
                <p className="text-xs text-red-500 font-medium">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span className="font-bold">{appliedCoupon.code}</span> applied successfully!
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-crmisa-navy border-slate-300 focus:ring-slate-900 rounded-sm"
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
                  className="mt-1 w-4 h-4 text-crmisa-navy border-slate-300 focus:ring-slate-900 rounded-sm"
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
                    ? 'bg-crmisa-navy hover:bg-crmisa-accentNavy text-white cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {processing ? 'Processing Order...' : `Pay & Unlock Handbook`}
              </button>
            </div>

          </form>

        </div>
      )}
    </Modal>
  );
}
