import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronDownIcon, MenuIcon, XIcon } from './icons/Icons';

export default function Navbar({ 
  onOpenLogin, 
  isLoggedIn,
  user,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'E-book', path: '/ebook' },
    { name: 'Forum', path: '/forum' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const courseDropdownItems = [
    { name: 'Enrol Now For Our Import & Export Course' },
    { name: 'International Trade Bodies' },
    { name: 'Incoterms' },
    { name: 'Modes of Transport' },
    { name: 'Export and Import Procedures' },
    { name: 'Customs Procedures' },
    { name: 'Cross Trades Module' },
  ];

  const handleNavClick = (path) => {
    if (path.startsWith('/#')) {
      const targetId = path.substring(2);
      if (location.pathname === '/') {
        // Already on home, just scroll
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home then it will scroll (needs useEffect in HomePage)
        navigate(path);
      }
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
  };

  const handleDropdownItemClick = (item) => {
    setCoursesDropdownOpen(false);
    setMobileMenuOpen(false);
    // Since course modules aren't heavily tracked by ID here, 
    // we can just send to /courses where users can select courses.
    navigate('/courses');
  };

  return (
    <header className="absolute top-0 w-full z-50 bg-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 cursor-pointer group py-1"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-crmisa-navy via-crmisa-accentNavy to-crmisa-darkNavy rounded-xl flex items-center justify-center p-2 shadow-md group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 25 V65 C90 90 50 115 50 115 C50 115 10 90 10 65 V25 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 15 L80 30 V60 C80 80 50 100 50 100 C50 100 20 80 20 60 V30 Z" fill="#0d2859" stroke="#ffffff" strokeWidth="3" />
                <line x1="50" y1="25" x2="50" y2="90" stroke="#3b82f6" strokeWidth="4" />
                <line x1="25" y1="55" x2="75" y2="55" stroke="#3b82f6" strokeWidth="4" />
                <text x="50" y="50" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">CRMISA</text>
                <text x="50" y="72" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="600">QUALITY</text>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-crmisa-navy tracking-tight group-hover:text-blue-600 transition-colors">
                CRMISA
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                Quality Education
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link, i) => (
              <div key={i} className="relative group">
                <button
                  onClick={() => {
                    if (link.hasDropdown) {
                      setCoursesDropdownOpen(!coursesDropdownOpen);
                    } else {
                      handleNavClick(link.path);
                    }
                  }}
                  className={`flex items-center space-x-1 font-normal text-base transition-colors duration-200 py-1 border-b ${
                    location.pathname === link.path || (link.path === '/courses' && location.pathname.startsWith('/courses'))
                      ? 'text-crmisa-navy border-crmisa-navy'
                      : 'text-slate-700 hover:text-crmisa-navy border-transparent'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <ChevronDownIcon className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-200" />
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
                          className={`w-full text-left px-5 py-3.5 text-sm font-normal transition-colors duration-150 ${
                            idx === 0
                              ? 'text-slate-900 font-medium hover:bg-crmisa-lightBlue hover:text-crmisa-navy'
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

          {/* Right Action Icons */}
          <div className="hidden sm:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    if (user?.role === 'ADMIN') {
                      navigate('/admin/dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="text-base font-bold text-crmisa-navy hover:text-blue-600 px-3 py-1.5 transition-colors"
                >
                  {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={onLogout}
                  className="text-base font-normal text-slate-700 hover:text-red-600 px-3 py-1.5 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-base font-normal text-slate-700 hover:text-crmisa-navy px-3 py-1.5 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center lg:hidden">
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
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fade-in absolute w-full top-16 sm:top-20">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, i) => (
              <div key={i}>
                <button
                  onClick={() => {
                    if (link.hasDropdown) {
                      setCoursesDropdownOpen(!coursesDropdownOpen);
                    } else {
                      handleNavClick(link.path);
                    }
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-base font-normal transition-colors ${
                    location.pathname === link.path || (link.path === '/courses' && location.pathname.startsWith('/courses'))
                      ? 'bg-crmisa-lightBlue text-crmisa-navy font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDownIcon className="w-4 h-4" />}
                </button>

                {link.hasDropdown && coursesDropdownOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1.5 border-l-2 border-slate-200 my-1 bg-slate-50 rounded-r-lg">
                    {courseDropdownItems.map((item, idx) => (
                      <button
                         key={idx}
                        onClick={() => handleDropdownItemClick(item)}
                        className="w-full text-left py-2 px-3 text-sm font-normal text-slate-600 hover:text-crmisa-navy"
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
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user?.role === 'ADMIN') {
                      navigate('/admin/dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="w-full py-2.5 bg-crmisa-navy text-white font-bold rounded-xl text-center"
                >
                  {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 border border-red-200 text-red-600 font-normal rounded-xl text-center hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 border border-slate-300 text-slate-700 font-normal rounded-xl text-center"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
