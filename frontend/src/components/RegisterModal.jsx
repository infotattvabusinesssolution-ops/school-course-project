import React, { useState } from 'react';
import Modal from './Modal';
import { EyeIcon } from './icons/Icons';
import { useAuth } from '../context/AuthContext';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setProcessing(false);
      return;
    }
    
    // Convert to FormData for backend upload if needed
    const submitData = new FormData();
    submitData.append('name', formData.fullName);
    submitData.append('fullName', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('password', formData.password);
    if (formData.profilePhoto) {
      submitData.append('profilePhoto', formData.profilePhoto);
    }
    
    const result = await register(submitData);
    
    setProcessing(false);
    if (result.success) {
      if (onRegisterSuccess) onRegisterSuccess();
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account" maxWidth="max-w-md">
      <div className="py-2 space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-crmisa-navy tracking-tight">
            JOIN <span className="text-[#1c3c78]">CRMISA</span>
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Register to access our world-class educational portal.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-crmisa-navy font-medium"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-crmisa-navy font-medium"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-crmisa-navy font-medium"
              placeholder="+27 82 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-crmisa-navy font-medium"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-crmisa-navy font-medium"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1.5">Profile Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, profilePhoto: e.target.files[0]})}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1c3c78]/10 file:text-[#1c3c78] hover:file:bg-[#1c3c78]/20 transition-all cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-xl shadow-md transition-all duration-200 text-sm"
            >
              {processing ? 'Registering...' : 'Create Account'}
            </button>
          </div>

        </form>

        {/* Switch to Login link */}
        <div className="text-center pt-2 text-sm text-slate-600 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (switchToLogin) switchToLogin();
            }}
            className="text-sky-600 hover:text-sky-800 font-bold underline underline-offset-2"
          >
            Login
          </button>
        </div>

      </div>
    </Modal>
  );
}
