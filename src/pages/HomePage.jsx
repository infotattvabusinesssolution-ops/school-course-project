import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SpecializeSection from '../components/sections/SpecializeSection';
import CourseModulesSection from '../components/sections/CourseModulesSection';
import ReceiveSection from '../components/sections/ReceiveSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import JoinCertifiedSection from '../components/sections/JoinCertifiedSection';

export default function HomePage({ onOpenRegister, onOpenEnrol, setActivePage }) {
  return (
    <div className="animate-fade-in">
      <HeroSection onOpenRegister={onOpenRegister} />
      <AboutSection onGetStarted={onOpenRegister} setActivePage={setActivePage} />
      <SpecializeSection />
      <CourseModulesSection onOpenEnrol={onOpenEnrol} />
      <ReceiveSection onOpenEnrol={onOpenEnrol} />
      <TestimonialsSection />
      <HowItWorksSection onOpenRegister={onOpenRegister} />
      {/* Join & Get Certified Section inserted right after How It Works */}
      <JoinCertifiedSection onOpenRegister={onOpenRegister} />
    </div>
  );
}
