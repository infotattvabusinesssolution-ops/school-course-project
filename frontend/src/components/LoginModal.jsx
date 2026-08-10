import React, { useState } from 'react';
import Modal from './Modal';
import { EyeIcon } from './icons/Icons';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('gyan123priya@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    
    const result = await login(email, password);
    
    setProcessing(false);
    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Authentication" maxWidth="max-w-md">
      <div className="py-2 space-y-6">
        
        {/* Header matching Image 2 */}
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            LOGIN <span className="text-[#1c3c78]">CRMISA</span>
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {/* Email Address */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-slate-900 font-medium"
              placeholder="gyan123priya@gmail.com"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1c3c78] focus:border-[#1c3c78] text-sm text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Submit Button matching Image 2 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-xl shadow-md transition-all duration-200 text-base"
            >
              {processing ? 'Logging in...' : 'Login'}
            </button>
          </div>

        </form>

        {/* Switch to Register link matching Image 2 */}
        <div className="text-center pt-2 text-sm text-slate-600 font-medium">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (switchToRegister) switchToRegister();
            }}
            className="text-sky-600 hover:text-sky-800 font-bold underline underline-offset-2"
          >
            Register
          </button>
        </div>

      </div>
    </Modal>
  );
}
