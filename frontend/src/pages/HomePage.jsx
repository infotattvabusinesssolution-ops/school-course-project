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
import HeadlineTicker from '../components/sections/HeadlineTicker';
import FloatingSocialBar from '../components/FloatingSocialBar';
import NewsletterModal from '../components/NewsletterModal';

export default function HomePage({ onOpenRegister, onOpenLogin, onOpenEnrol, onViewCourseDetails }) {
  useEffect(() => {
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
  }, []);

  return (
    <div className="animate-fade-in bg-slate-900">
        <main className="animate-fade-in relative z-10">
          <div className="relative">
            <NewsletterModal />
            <HeroSection 
              onOpenRegister={onOpenRegister} 
              onOpenLogin={onOpenLogin}
            />
            
            <FloatingSocialBar />
            
            <HeadlineTicker />

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
    </div>
  );
}
