import React, { useState } from 'react';
import { HeartIcon, CartIcon, UserIcon, ChevronDownIcon, MenuIcon, XIcon, SpeedometerIcon } from './icons/Icons';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  wishlistCount = 0, 
  cartCount = 0, 
  isLoggedIn = false,
  onOpenRegister,
  onOpenLogin, 
  onOpenEnrol,
  onOpenCartDrawer,
  setSelectedModuleId,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Courses', id: 'coursedetails', hasDropdown: true },
    { name: 'Ebook', id: 'ebook' },
    { name: 'Forum', id: 'forum' },
    { name: 'Contact Us', id: 'contact' },
  ];

  const courseDropdownItems = [
    { name: 'Enrol Now For Our Import & Export Course', moduleId: 1 },
    { name: 'International Trade Bodies', moduleId: 2 },
    { name: 'Incoterms', moduleId: 3 },
    { name: 'Modes of Transport', moduleId: 4 },
    { name: 'Export and Import Procedures', moduleId: 5 },
    { name: 'Customs Procedures', moduleId: 6 },
    { name: 'Cross Trades Module', moduleId: 7 },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDropdownItemClick = (item) => {
    setCoursesDropdownOpen(false);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    if (setSelectedModuleId) setSelectedModuleId(item.moduleId);
    setActivePage('coursedetails');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group py-1"
          >
            <div className="relative w-14 h-14 bg-gradient-to-br from-crmisa-navy via-crmisa-accentNavy to-crmisa-darkNavy rounded-xl flex items-center justify-center p-2 shadow-md group-hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 25 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V25 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 15 L80 30 V60 C80 80 50 100 50 100 C50 100 20 80 20 60 V30 Z" fill="#0d2859" stroke="#ffffff" strokeWidth="3" />
                <line x1="50" y1="25" x2="50" y2="90" stroke="#3b82f6" strokeWidth="4" />
                <line x1="25" y1="55" x2="75" y2="55" stroke="#3b82f6" strokeWidth="4" />
                <text x="50" y="50" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">CRMISA</text>
                <text x="50" y="72" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="600">QUALITY</text>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl text-crmisa-navy tracking-tight group-hover:text-blue-600 transition-colors">
                CRMISA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Quality Education
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.id} className="relative group">
                <button
                  onClick={() => {
                    if (link.hasDropdown) {
                      setCoursesDropdownOpen(!coursesDropdownOpen);
                    } else {
                      handleNavClick(link.id);
                    }
                  }}
                  className={`flex items-center space-x-1 font-bold text-sm transition-colors duration-200 ${
                    activePage === link.id
                      ? 'text-crmisa-navy border-b-2 border-crmisa-navy py-1'
                      : 'text-slate-800 hover:text-crmisa-navy'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDownIcon className="w-4 h-4 text-crmisa-navy group-hover:rotate-180 transition-transform duration-200" />
                  )}
                </button>

                {link.hasDropdown && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 mt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-slate-100" />
                    <div className="relative z-10 divide-y divide-slate-100">
                      {courseDropdownItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDropdownItemClick(item)}
                          className={`w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors duration-150 ${
                            item.moduleId === 1
                              ? 'text-slate-900 font-extrabold hover:bg-crmisa-lightBlue hover:text-crmisa-navy'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-crmisa-navy'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Icons & Profile Badge matching Image 1 */}
          <div className="hidden sm:flex items-center space-x-6">
            
            {/* Wishlist Icon */}
            <button 
              onClick={onOpenCartDrawer}
              className="relative p-2 text-crmisa-navy hover:text-blue-600 transition-colors focus:outline-none"
              title="Wishlist"
            >
              <HeartIcon className="w-6 h-6 fill-crmisa-navy text-crmisa-navy hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                {wishlistCount}
              </span>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={onOpenCartDrawer}
              className="relative p-2 text-crmisa-navy hover:text-blue-600 transition-colors focus:outline-none"
              title="Cart"
            >
              <CartIcon className="w-6 h-6 text-crmisa-navy hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Profile Dropdown Badge matching Image 1 */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 cursor-pointer focus:outline-none py-1 group"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-400 text-blue-600 font-extrabold flex items-center justify-center text-xs shadow-xs">
                    GS
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Gyana Singh
                  </span>
                </button>

                {/* Profile Dropdown Menu matching Image 1 */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white transform rotate-45 border-t border-l border-slate-100" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNavClick('dashboard');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-100 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-xs font-bold text-[#1c3c78] hover:text-crmisa-navy px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Login
              </button>
            )}

            {/* Register CTA Button */}
            <button
              onClick={onOpenRegister}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-crmisa-navy rounded-full shadow hover:bg-crmisa-accentNavy transition-all duration-300 hover:shadow-md"
            >
              Register Now
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={onOpenCartDrawer}
              className="relative p-2 text-crmisa-navy"
            >
              <CartIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-crmisa-navy focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <div key={link.id}>
                <button
                  onClick={() => {
                    if (link.hasDropdown) {
                      setCoursesDropdownOpen(!coursesDropdownOpen);
                    } else {
                      handleNavClick(link.id);
                    }
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    activePage === link.id
                      ? 'bg-crmisa-lightBlue text-crmisa-navy font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDownIcon className="w-4 h-4" />}
                </button>

                {link.hasDropdown && coursesDropdownOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1.5 border-l-2 border-crmisa-navy my-1 bg-slate-50 rounded-r-lg">
                    {courseDropdownItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDropdownItemClick(item)}
                        className="w-full text-left py-2 px-3 text-xs font-semibold text-slate-700 hover:text-crmisa-navy"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('dashboard');
                }}
                className="w-full py-2.5 border border-[#1c3c78] text-[#1c3c78] font-bold rounded-xl text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 border border-[#1c3c78] text-[#1c3c78] font-bold rounded-xl text-center"
              >
                Login
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 bg-crmisa-navy text-white font-bold rounded-xl text-center shadow hover:bg-crmisa-accentNavy"
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
