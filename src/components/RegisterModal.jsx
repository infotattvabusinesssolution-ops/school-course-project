import React, { useState } from 'react';
import Modal from './Modal';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'gyan123priya@gmail.com',
    phone: '',
    profilePic: null,
    country: 'Select',
    province: 'Select',
    password: '',
    confirmPassword: ''
  });

  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (onRegisterSuccess) onRegisterSuccess();
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Account" maxWidth="max-w-xl">
      <div className="py-2 space-y-5">
        
        {/* Header matching Image 3 */}
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-[#1c3c78] tracking-tight uppercase">
            CRMISA REGISTER
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Access to our dashboard
          </p>
        </div>

        {/* Register Form matching Image 3 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
          </div>

          {/* Email Address & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
          </div>

          {/* Upload Profile Picture matching Image 3 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Upload your Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
              className="w-full text-xs text-slate-500 border border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>

          {/* Country & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-[#1c3c78]"
              >
                <option value="Select">Select</option>
                <option value="South Africa">South Africa</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Province</label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-[#1c3c78]"
              >
                <option value="Select">Select</option>
                <option value="Gauteng">Gauteng</option>
                <option value="Western Cape">Western Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#1c3c78]"
              />
            </div>
          </div>

          {/* Submit Button matching Image 3 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-lg shadow-md transition-all duration-200 text-sm"
            >
              {processing ? 'Submitting...' : 'Submit'}
            </button>
          </div>

        </form>

        {/* Switch to Login link matching Image 3 */}
        <div className="text-center text-xs text-slate-600 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (switchToLogin) switchToLogin();
            }}
            className="text-slate-900 font-bold underline underline-offset-2 hover:text-[#1c3c78]"
          >
            Login
          </button>
        </div>

      </div>
    </Modal>
  );
}
