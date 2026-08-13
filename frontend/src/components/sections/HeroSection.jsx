import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Award, Star, Globe, Plane, GraduationCap, ShieldCheck, TrendingUp } from "lucide-react";
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
        <h3 className="text-3xl font-black text-crmisa-navy tracking-tight">
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
          <label className="block text-sm font-bold text-crmisa-accentNavy">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-crmisa-navy font-medium transition-all"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-crmisa-accentNavy">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-crmisa-navy font-medium transition-all"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>
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
    confirmPassword: '',
    profilePhoto: null
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
    
    const submitData = new FormData();
    submitData.append('name', fullName);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('role', 'STUDENT');
    if (formData.profilePhoto) {
      submitData.append('profilePhoto', formData.profilePhoto);
    }

    const result = await register(submitData);
    
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
        <h3 className="text-3xl font-black text-crmisa-navy tracking-tight">
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
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Profile Picture (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files[0] })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-crmisa-accentNavy mb-1">Confirm</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 text-sm text-crmisa-navy font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
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

export default function HeroSection({ isLoginMode, isRegisterMode, onOpenLogin, onOpenRegister }) {
  const isAuthMode = isLoginMode || isRegisterMode;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [desktopImageSrc, setDesktopImageSrc] = useState('/hero/crmisa-stu.png');
  const [mobileImageSrc, setMobileImageSrc] = useState('/hero/mobile-coont.png');

  useEffect(() => {
    const loadCachedImage = async (key, url, setter) => {
      const cached = localStorage.getItem(key);
      if (cached) {
        setter(cached);
      } else {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            try {
              localStorage.setItem(key, base64data);
            } catch (e) {
              console.warn('LocalStorage full, could not cache image', e);
            }
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.error("Failed to fetch image for caching", err);
        }
      }
    };

    loadCachedImage('hero_desktop_img', '/hero/crmisa-stu.png', setDesktopImageSrc);
    loadCachedImage('hero_mobile_img', '/hero/mobile-coont.png', setMobileImageSrc);
  }, []);

  return (
    <section className={`relative w-full ${isAuthMode ? 'h-screen overflow-hidden' : 'min-h-screen lg:h-screen lg:overflow-hidden'} flex flex-col lg:flex-row lg:items-center lg:justify-center bg-white`}>
      
      {/* Sliding Dark Background for the left half during Auth Mode */}
      <motion.div
         initial={false}
         animate={{ x: isAuthMode ? '0%' : '-100%' }}
         transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
         className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-crmisa-navy z-0"
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
              <div className="flex flex-col items-center text-center w-full max-w-2xl px-4 mt-8 lg:mt-0 mx-auto">
                <h1 className="text-crmisa-darkNavy text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.1]">
                  Master
                </h1>
                <h2 className="text-crmisa-darkNavy text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.1] pt-2">
                  Global trade
                </h2>
                <p className="mt-6 text-crmisa-darkNavy text-base md:text-lg font-medium max-w-lg leading-relaxed">
                  South Africa's leading online academy for Import & Export education.
                  Gain the expertise to navigate international trade, customs, and global shipping.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => {
                      if (user) {
                        navigate('/courses');
                      } else {
                        if (onOpenLogin) onOpenLogin();
                        else navigate('/login');
                      }
                    }}
                    className="group flex items-center justify-center w-full sm:w-auto gap-3 bg-crmisa-darkNavy border-2 border-crmisa-darkNavy text-white px-8 py-4 rounded-none font-bold text-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-xl"
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
               y: isAuthMode ? -80 : 0, 
               opacity: 1,
               scale: isAuthMode ? 0.95 : 1.15 
            }}
            transition={{ type: "spring", bounce: 0.15, duration: 2.5, delay: 0.1 }}
            className="absolute top-20 z-10 w-full max-w-lg lg:max-w-xl"
          >
            <img 
              src={desktopImageSrc} 
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
          <div className="flex lg:hidden w-full justify-center mt-12 relative z-10 pb-0">

            {/* Floating Chip 1 — Top Left: Star Rating */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              className="absolute top-[8%] left-1 z-0 w-14 h-14 rounded-full bg-amber-400 shadow-[0_8px_24px_rgba(251,191,36,0.5)] flex items-center justify-center border-2 border-white"
            >
              <Star className="w-6 h-6 text-white fill-white" />
            </motion.div>

            {/* Floating Chip 2 — Top Right: Shield */}
            <motion.div
              animate={{ y: [0, -16, 0], x: [0, 4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-[18%] right-0 z-0 w-12 h-12 rounded-full bg-blue-500 shadow-[0_8px_24px_rgba(59,130,246,0.5)] flex items-center justify-center border-2 border-white"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </motion.div>

            {/* Floating Chip 3 — Mid Left: Globe */}
            <motion.div
              animate={{ y: [0, 14, 0], x: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-[40%] left-0 z-0 w-[52px] h-[52px] rounded-full bg-emerald-500 shadow-[0_8px_24px_rgba(16,185,129,0.5)] flex items-center justify-center border-2 border-white"
            >
              <Globe className="w-5 h-5 text-white" />
            </motion.div>

            {/* Floating Chip 4 — Mid Right: Award */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
              className="absolute top-[52%] right-1 z-0 w-14 h-14 rounded-full bg-purple-500 shadow-[0_8px_24px_rgba(168,85,247,0.5)] flex items-center justify-center border-2 border-white"
            >
              <Award className="w-6 h-6 text-white" />
            </motion.div>

            {/* Floating Chip 5 — Lower Left: Graduation Cap */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[72%] left-2 z-0 w-12 h-12 rounded-full bg-rose-500 shadow-[0_8px_24px_rgba(244,63,94,0.5)] flex items-center justify-center border-2 border-white"
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </motion.div>

            {/* Floating Chip 6 — Lower Right: TrendingUp */}
            <motion.div
              animate={{ y: [0, -18, 0], x: [0, -3, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute top-[83%] right-3 z-0 w-11 h-11 rounded-full bg-sky-500 shadow-[0_8px_24px_rgba(14,165,233,0.5)] flex items-center justify-center border-2 border-white"
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </motion.div>

            <img src={mobileImageSrc} alt="CRMISA Student" className="relative z-10 w-[135%] max-w-[135%] translate-x-6 drop-shadow-2xl origin-bottom object-bottom" />
          </div>
        )}

      </div>
    </section>
  );
}
