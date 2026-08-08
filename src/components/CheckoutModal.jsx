import React, { useState } from 'react';
import Modal from './Modal';
import { CheckIcon } from './icons/Icons';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  courseTitle = "Import & Export Full Course", 
  coursePrice = "R15000", 
  onPaymentSuccess 
}) {
  const [hasCoupon, setHasCoupon] = useState('no');
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('payfast');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Ensure safe string rendering in case an event object was passed
  const safeTitle = typeof courseTitle === 'string' ? courseTitle : "Import & Export Full Course";
  const safePrice = typeof coursePrice === 'string' ? coursePrice : "R15000";

  const handleProceed = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Checkout" maxWidth="max-w-md">
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-[#1c3c78] text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
            <CheckIcon className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-slate-900">Payment Successful!</h4>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">
            You are enrolled in <span className="font-bold text-slate-900">{safeTitle}</span>. Your portal credentials have been emailed to you.
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-6">
          
          {/* Header Title matching Image 1 */}
          <div className="text-center space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1c3c78] leading-tight">
              Checkout - {safeTitle}
            </h3>
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            
            {/* Course Price Section matching Image 1 */}
            <div className="space-y-1">
              <span className="block text-sm font-bold text-slate-800">
                Course Price:
              </span>
              <span className="block text-2xl font-black text-green-500 tracking-tight">
                {safePrice}
              </span>
            </div>

            {/* Coupon Radio Options matching Image 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Do you have a coupon code?
              </label>
              <div className="space-y-1.5 pl-1">
                <label className="flex items-center space-x-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="coupon"
                    value="yes"
                    checked={hasCoupon === 'yes'}
                    onChange={() => setHasCoupon('yes')}
                    className="w-4 h-4 text-[#1c3c78] focus:ring-[#1c3c78]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="coupon"
                    value="no"
                    checked={hasCoupon === 'no'}
                    onChange={() => setHasCoupon('no')}
                    className="w-4 h-4 text-[#1c3c78] focus:ring-[#1c3c78]"
                  />
                  <span>No</span>
                </label>
              </div>

              {hasCoupon === 'yes' && (
                <div className="pt-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-[#1c3c78]"
                  />
                </div>
              )}
            </div>

            {/* Select Payment Method matching Image 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Select Payment Method:
              </label>
              <div className="space-y-2 pl-1">
                <label className="flex items-center space-x-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="payfast"
                    checked={paymentMethod === 'payfast'}
                    onChange={() => setPaymentMethod('payfast')}
                    className="w-4 h-4 text-[#1c3c78] focus:ring-[#1c3c78]"
                  />
                  <span>PayFast Payment</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="direct"
                    checked={paymentMethod === 'direct'}
                    onChange={() => setPaymentMethod('direct')}
                    className="w-4 h-4 text-[#1c3c78] focus:ring-[#1c3c78]"
                  />
                  <span>Direct Payment</span>
                </label>
              </div>
            </div>

            {/* Proceed to Payment Button matching Image 1 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-lg shadow-md transition-all duration-200 text-base tracking-wide"
              >
                {processing ? 'Processing Payment...' : 'Proceed to Payment'}
              </button>
            </div>

          </form>

        </div>
      )}
    </Modal>
  );
}
