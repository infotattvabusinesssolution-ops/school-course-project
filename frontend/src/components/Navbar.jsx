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
    <>
      <header className="absolute top-0 w-full z-[60] bg-white/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none shadow-sm sm:shadow-none border-b border-slate-200/50 sm:border-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center cursor-pointer group py-1 z-[60] relative"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/image.png" alt="CRMISA Logo" className="w-full h-full object-contain" />
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
    </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[80] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="font-bold text-lg text-slate-900">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-500 hover:text-crmisa-navy focus:outline-none rounded-lg hover:bg-slate-50 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
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
                  className={`w-full flex justify-between items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.path || (link.path === '/courses' && location.pathname.startsWith('/courses'))
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDownIcon className="w-4 h-4" />}
                </button>

                {link.hasDropdown && coursesDropdownOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1 my-1 border-l-2 border-slate-100">
                    {courseDropdownItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDropdownItemClick(item)}
                        className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100 flex flex-col space-y-3">
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
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-center transition-colors"
                >
                  {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-3 border border-red-200 text-red-600 font-semibold rounded-xl text-center hover:bg-red-50 transition-colors"
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
                className="w-full py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-center transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
