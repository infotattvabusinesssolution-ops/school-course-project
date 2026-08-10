import React, { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SpecializeSection from '../components/sections/SpecializeSection';
import CourseModulesSection from '../components/sections/CourseModulesSection';
import ReceiveSection from '../components/sections/ReceiveSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import JoinCertifiedSection from '../components/sections/JoinCertifiedSection';
import ContactSection from '../components/sections/ContactSection';
import FaqSection from '../components/sections/FaqSection';


export default function HomePage({ onOpenRegister, onOpenEnrol, isLoginMode, isRegisterMode, onViewCourseDetails }) {
  useEffect(() => {
    // If we land on /login or /register, wait for DOM to settle then open the modal
    if (isLoginMode) {
      setTimeout(() => document.getElementById('login-btn')?.click(), 100);
    } else if (isRegisterMode) {
      setTimeout(() => document.getElementById('register-btn')?.click(), 100);
    }

    // Scroll to hash if present
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isLoginMode, isRegisterMode]);

  const isAuthMode = isLoginMode || isRegisterMode;

  return (
    <div className="animate-fade-in bg-slate-900">
      {!isAuthMode ? (
        <main className="animate-fade-in relative z-10">
          <div className="relative">
            <HeroSection 
              onOpenRegister={onOpenRegister} 
              isLoginMode={isLoginMode}
              isRegisterMode={isRegisterMode}
            />
            

            <AboutSection onGetStarted={onOpenRegister} />
            <SpecializeSection />
            <CourseModulesSection onOpenEnrol={onOpenEnrol} onViewCourseDetails={onViewCourseDetails} />
            <ReceiveSection onOpenEnrol={onOpenEnrol} />
            <TestimonialsSection />
            <HowItWorksSection onOpenRegister={onOpenRegister} />
            {/* Join & Get Certified Section inserted right after How It Works */}
            <JoinCertifiedSection onOpenRegister={onOpenRegister} />
            <FaqSection />
            {/* Contact Section inserted right before Footer */}
            <ContactSection />
          </div>
        </main>
      ) : (
        <HeroSection 
          onOpenRegister={onOpenRegister} 
          isLoginMode={isLoginMode}
          isRegisterMode={isRegisterMode}
        />
      )}
    </div>
  );
}
