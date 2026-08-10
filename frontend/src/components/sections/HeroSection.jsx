import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { EyeIcon } from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    const result = await login(email, password);
    setProcessing(false);
    if (result.success) {
      if (result.user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-12">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          LOGIN <span className="text-blue-600">CRMISA</span>
        </h3>
        <p className="text-base text-slate-500 font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-6 mt-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}
        
        {/* Email Address */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 font-medium transition-all"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 font-medium transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Forgot Password */}
          <div className="flex justify-end pt-2">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-base flex justify-center items-center"
          >
            {processing ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign In'}
          </button>
        </div>
      </form>

      {/* Switch to Register link */}
      <div className="text-center pt-6 text-sm text-slate-600 font-medium">
        Don’t have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-2 transition-colors"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setProcessing(true);
    setError(null);
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const result = await register(fullName, formData.email, formData.password, 'STUDENT');
    
    setProcessing(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-12 h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          REGISTER <span className="text-blue-600">CRMISA</span>
        </h3>
        <p className="text-base text-slate-500 font-medium">
          Create an account to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Confirm</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg transition-all duration-200 text-base flex justify-center items-center"
          >
            {processing ? 'Registering...' : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="text-center text-sm text-slate-600 font-medium pb-8">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-2 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default function HeroSection({ isLoginMode, isRegisterMode }) {
  const isAuthMode = isLoginMode || isRegisterMode;
  const navigate = useNavigate();

  return (
    <section className={`relative w-full ${isAuthMode ? 'h-screen overflow-hidden' : 'min-h-screen lg:h-screen lg:overflow-hidden'} flex flex-col lg:flex-row lg:items-center lg:justify-center bg-white`}>
      
      {/* Sliding Dark Background for the left half during Auth Mode */}
      <motion.div
         initial={false}
         animate={{ x: isAuthMode ? '0%' : '-100%' }}
         transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
         className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-slate-900 z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex-1 relative z-10 flex flex-col lg:block pt-24 pb-0 lg:pt-0">
        
        {/* Back Button */}
        <AnimatePresence>
          {isAuthMode && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => navigate('/')}
              className="absolute top-6 left-2 lg:top-10 lg:left-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-50 font-bold"
            >
              <ArrowLeft className="w-6 h-6" />
              Back to Home
            </motion.button>
          )}
        </AnimatePresence>

        {/* HERO TYPOGRAPHY (Left side, only in Hero Mode) */}
        <AnimatePresence>
          {!isAuthMode && (
            <motion.div
              className="w-full lg:w-[52%] relative lg:absolute left-0 top-0 h-auto lg:h-full flex flex-col items-start justify-center z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-start text-left w-full max-w-2xl px-4 mt-8 lg:mt-0">
                <h1 className="text-crmisa-navy text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.1]">
                  Master
                </h1>
                <h2 className="text-blue-600 text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.1] pt-2">
                  Global trade
                </h2>
                <p className="mt-6 text-slate-500 text-base md:text-lg font-medium max-w-lg leading-relaxed">
                  South Africa's leading online academy for Import & Export education.
                  Gain the expertise to navigate international trade, customs, and global shipping.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-start">
                  <button
                    onClick={() => navigate('/register')}
                    className="group flex items-center justify-center w-full sm:w-auto gap-3 bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    Start Learning
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AUTH FORMS (Right side, only in Auth Mode) */}
        <AnimatePresence>
          {isAuthMode && (
            <motion.div
              className="w-full lg:w-1/2 relative lg:absolute right-0 top-0 h-auto lg:h-full flex items-center justify-center z-20 mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {isLoginMode ? (
                  <motion.div 
                    key="login-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                  >
                    <LoginForm />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="register-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                  >
                    <RegisterForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING CONTAINER IMAGE (Animates from Right to Left) */}
        <motion.div
          initial={false}
          animate={{
            left: isAuthMode ? '0%' : '50%',
          }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
          className="hidden lg:flex absolute top-0 w-1/2 h-full justify-center z-30 pointer-events-none"
        >
          {/* Background Glow */}
          <motion.div 
            animate={{ opacity: isAuthMode ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] -z-10"
          />

          <motion.div
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ 
               y: isLoginMode ? -80 : 0, 
               opacity: 1,
               scale: isAuthMode ? 0.95 : 1.15 
            }}
            transition={{ type: "spring", bounce: 0.15, duration: 2.5, delay: 0.1 }}
            className="absolute top-0 z-10 w-full max-w-lg lg:max-w-xl"
          >
            <img 
              src="/hero/crmisa-stu.png" 
              alt="CRMISA Logistics" 
              className="w-full drop-shadow-2xl object-contain animate-swing origin-top"
            />
          </motion.div>

          <AnimatePresence>
            {isAuthMode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute bottom-12 left-12 z-20 pointer-events-auto"
              >
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">
                  Master Global<br/><span className="text-sky-400">Trade</span>
                </h2>
                <p className="text-slate-300 mt-2 font-medium max-w-sm">
                  {isLoginMode 
                    ? "Log in to access your CRMISA dashboard and continue your learning journey." 
                    : "Create an account to gain access to our world-class educational portal."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile Container Image (Only shown in Hero Mode on mobile) */}
        {!isAuthMode && (
          <motion.div 
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.15, duration: 2.5, delay: 0.2 }}
            className="flex lg:hidden w-full justify-center mt-auto relative z-10"
          >
             <img src="/student/download (17)-Photoroom.png" alt="CRMISA Student" className="w-[95%] max-w-[300px] drop-shadow-2xl origin-bottom object-bottom" />
          </motion.div>
        )}

      </div>
    </section>
  );
}
