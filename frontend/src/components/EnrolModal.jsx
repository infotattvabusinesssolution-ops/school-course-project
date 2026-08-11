import React, { useState } from 'react';
import Modal from './Modal';
import { CheckIcon } from './icons/Icons';

export default function EnrolModal({ isOpen, onClose, onEnrolSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('eft');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnrol = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      if (onEnrolSuccess) onEnrolSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enrol in Import & Export Full Course" maxWidth="max-w-xl">
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-crmisa-navy text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
            <CheckIcon className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-extrabold text-crmisa-navy">Congratulations! You're Enrolled!</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            You are officially registered for the <span className="font-bold text-slate-800">CRMISA Import & Export Full Course</span>. Access details have been sent to your email.
          </p>
          <div className="p-4 bg-crmisa-lightBlue rounded-xl text-xs text-crmisa-navy font-bold space-y-1">
            <div>✓ Course Portal Activated</div>
            <div>✓ Company Registration Form Sent</div>
            <div>✓ Website Setup Voucher Issued</div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEnrol} className="space-y-5">
          {/* Price Header Banner */}
          <div className="bg-gradient-to-r from-crmisa-navy to-crmisa-accentNavy p-5 rounded-2xl text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-300 block">Course Tuition</span>
              <h4 className="text-xl font-black">Import & Export Full Course</h4>
              <p className="text-xs text-slate-200 mt-1">Includes 6 Core Modules & 2 Free Business Perks</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">R15,000*</span>
              <span className="block text-[10px] text-sky-200 font-medium">All-Inclusive</span>
            </div>
          </div>

          {/* Included Features List matching Image 4 */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">What's Included in R15,000:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span>Import & Export Course</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span>Certificate of Completion</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span className="font-bold text-blue-700">FREE Company Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span className="font-bold text-blue-700">FREE Professional Website</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span>Step-by-Step Guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-4 h-4 text-crmisa-navy" />
                <span>Supplier & Buyer Tips</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Payment Option</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('eft')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  paymentMethod === 'eft'
                    ? 'border-crmisa-navy bg-crmisa-lightBlue text-crmisa-navy ring-2 ring-crmisa-navy'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Instant EFT
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  paymentMethod === 'card'
                    ? 'border-crmisa-navy bg-crmisa-lightBlue text-crmisa-navy ring-2 ring-crmisa-navy'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('installments')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  paymentMethod === 'installments'
                    ? 'border-crmisa-navy bg-crmisa-lightBlue text-crmisa-navy ring-2 ring-crmisa-navy'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                3x Installments
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-6 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wider flex items-center justify-center space-x-2"
            >
              {processing ? (
                <span>Securing Enrollment...</span>
              ) : (
                <span>Confirm Enrollment (R15,000) &gt;&gt;</span>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
