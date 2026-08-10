import React from 'react';
import ContactSection from '../components/sections/ContactSection';
import FaqSection from '../components/sections/FaqSection';

export default function ContactPage() {
  return (
    <div className="pt-16 sm:pt-20 bg-white min-h-screen">
      <FaqSection />
      <ContactSection />
    </div>
  );
}
