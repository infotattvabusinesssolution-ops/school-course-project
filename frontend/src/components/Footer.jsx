import React from 'react';
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedInIcon, 
  InstagramIcon, 
  LocationPinIcon, 
  PhoneCallIcon, 
  EnvelopeIcon 
} from './icons/Icons';

export default function Footer({ setActivePage }) {
  return (
    <footer className="relative bg-[#1c3c78] text-white pt-16 pb-8 overflow-hidden border-t border-slate-700/50">
      
      {/* Background City Skyline Overlay Graphic */}
      <div 
        className="absolute inset-0 bg-bottom bg-repeat-x opacity-10 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Grid matching exact design screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* Column 1: CRMISA Description & Social Icons (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-black text-white tracking-wide uppercase">
              CRMISA
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Crmisa is committed to transforming South Africa's participation in global trade by equipping new entrepreneurs and aspiring importers and exporters with the knowledge and skills they need to succeed. Our mission is to empower individuals to start, grow, and expand their import export businesses, enabling access to markets worldwide.
            </p>
            {/* Social Icons row matching Image: Facebook, Twitter, LinkedIn, Instagram */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-extrabold text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-200">
              <li>
                <button onClick={() => setActivePage && setActivePage('home')} className="hover:text-sky-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('about')} className="hover:text-sky-300 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('contact')} className="hover:text-sky-300 transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('courses')} className="hover:text-sky-300 transition-colors">
                  Login
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('courses')} className="hover:text-sky-300 transition-colors">
                  Register
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('forum')} className="hover:text-sky-300 transition-colors">
                  RSS Feeds
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage && setActivePage('ebook')} className="hover:text-sky-300 transition-colors">
                  Blogs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Policy (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-extrabold text-white tracking-wide">
              Legal Policy
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-200">
              <li>
                <a href="#" className="hover:text-sky-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-300 transition-colors">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-300 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Glossary (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-extrabold text-white tracking-wide">
              Contact Us
            </h3>
            
            <div className="space-y-3 text-xs font-medium text-slate-200">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <LocationPinIcon className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Pivot Building 1 Montecasino Blvd Fourways Sandton 2191</span>
              </div>

              {/* Phone 1 */}
              <div className="flex items-center space-x-3">
                <PhoneCallIcon className="w-5 h-5 text-white shrink-0" />
                <span>+27 82 496 7256</span>
              </div>

              {/* Phone 2 */}
              <div className="flex items-center space-x-3">
                <PhoneCallIcon className="w-5 h-5 text-white shrink-0" />
                <span>+27 72 035 4787</span>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-white shrink-0" />
                <span>info@crmisa.co.za</span>
              </div>
            </div>

            {/* Glossary Sub-heading */}
            <div className="pt-2">
              <h4 className="text-base font-extrabold text-white tracking-wide hover:text-sky-300 cursor-pointer transition-colors">
                Glossary
              </h4>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Line matching Image */}
        <div className="pt-8 border-t border-white/10 text-center text-xs font-semibold text-slate-300">
          &copy; 2025 Crmisa. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
