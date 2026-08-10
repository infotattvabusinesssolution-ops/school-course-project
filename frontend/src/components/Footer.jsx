import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, Shield, Globe, Award, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Description (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                C
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl text-white tracking-tight">
                  CRMISA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Quality Education
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering global entrepreneurs with comprehensive import & export management certification, customs clearance training, and direct trade advisory.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Global Trade
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Certified
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About CRMISA
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/ebook" className="hover:text-white transition-colors">
                  E-Books & Publications
                </Link>
              </li>
              <li>
                <Link to="/forum" className="hover:text-white transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Legal & Help
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> FAQ & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Contact Info
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  The Pivot Conference Centre, 1 Montecasino Blvd, Fourways, Sandton, 2191
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300">+27 82 496 7256 / +27 72 035 4787</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300">info@crmisa.co.za</span>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=The+Pivot+Conference+Centre,+1+Montecasino+Blvd,+Fourways,+Sandton,+2191,+South+Africa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold pt-1 transition-colors"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} CRMISA. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
