import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, useNavigationType, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import CheckoutModal from "./components/CheckoutModal";
import CartCheckoutModal from "./components/CartCheckoutModal";
import EnrolModal from "./components/EnrolModal";
import CartModal from "./components/CartModal";
import { useAOS } from "./hooks/useAOS";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import EbookPage from "./pages/EbookPage";
import EbookDetailPage from "./pages/EbookDetailPage";
import ForumPage from "./pages/ForumPage";
import PostDetailPage from "./pages/PostDetailPage";
import ContactPage from "./pages/ContactPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardCourses from "./pages/DashboardCourses";
import DashboardEbooks from "./pages/DashboardEbooks";
import DashboardExams from "./pages/DashboardExams";
import DashboardProfile from "./pages/DashboardProfile";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCreateCoursePage from "./pages/AdminCreateCoursePage";
import AdminEbookCreatePage from "./pages/AdminEbookCreatePage";
import CourseDetailsPremiumPage from "./pages/CourseDetailsPremiumPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import FaqPage from "./pages/FaqPage";
import RssFeedsPage from './pages/RssFeedsPage';
import GlossaryPage from './pages/GlossaryPage';
import VerifyCertificatePage from "./pages/VerifyCertificatePage";
import CertificatePage from "./pages/CertificatePage";
import ExamPage from "./pages/ExamPage";
import ExamResultPage from "./pages/ExamResultPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFoundPage from "./pages/NotFoundPage";
import CookieConsent from "./components/CookieConsent";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'

  // Smart scroll restoration:
  // - On PUSH (forward link click): scroll to top
  // - On POP (back/forward button): restore saved scroll position
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const key = location.key; // unique key per history entry
    let restoreTimer = null;

    if (navigationType === 'POP') {
      // Restore saved scroll position — use setTimeout to wait for React to finish rendering
      const saved = sessionStorage.getItem(`scroll-${key}`);
      if (saved) {
        restoreTimer = setTimeout(() => {
          window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' });
        }, 80);
      }
    } else {
      // PUSH or REPLACE — scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Save scroll on every scroll event, keyed by this route's history key
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${key}`, String(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // Save the last scroll position when leaving this route
      sessionStorage.setItem(`scroll-${key}`, String(window.scrollY));
      window.removeEventListener('scroll', handleScroll);
      if (restoreTimer) clearTimeout(restoreTimer);
    };
  }, [location.key, navigationType]);

  // Intercept /login and /register to open modals
  useEffect(() => {
    if (location.pathname === '/login') {
      openLogin();
      navigate('/', { replace: true });
    } else if (location.pathname === '/register') {
      openRegister();
      navigate('/', { replace: true });
    }
  }, [location.pathname]);

  // Use AOS
  useAOS(location.pathname);

  // Auth state and modals from Context
  const { 
    user, 
    logout: contextLogout,
    isLoginModalOpen,
    isRegisterModalOpen,
    openLogin,
    openRegister,
    closeAuthModals
  } = useAuth();
  
  const isLoggedIn = !!user;

  // Shopping Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartCheckoutOpen, setIsCartCheckoutOpen] = useState(false);
  const [isEnrolOpen, setIsEnrolOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const { cartItems, addToCart, removeFromCart } = useCart();

  // Track selected course/item for checkout
  const [checkoutCourse, setCheckoutCourse] = useState({
    id: null,
    title: "Import & Export Full Course",
    price: "R15000",
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleEnrollNowClick = (courseTitle, coursePrice, courseId = null) => {
    const title = courseTitle || "Course Checkout";
    const price = coursePrice || 0;
    setCheckoutCourse({ title, price, id: courseId });

    if (isLoggedIn) {
      setIsCheckoutOpen(true);
    } else {
      showToast("Please log in to your account to proceed with checkout.");
      openLogin();
    }
  };

  const handleLogout = async () => {
    await contextLogout();
    navigate("/");
    showToast("Logged out successfully.");
  };

  const handleAddToCartClick = (item) => {
    if (!isLoggedIn) {
      showToast("Please log in to add items to your cart.");
      openLogin();
      return;
    }
    addToCart({
      ...item,
      type: item.coverImage ? 'ebook' : 'course',
    });
    showToast(`Added "${item.title || "Item"}" to Cart!`);
    setIsCartModalOpen(true);
  };

  // Determine if we should hide the Navbar/Footer
  const hideLayoutPaths = [
    "/login", 
    "/register", 
    "/admin", 
    "/course/", 
    "/certificate/", 
    "/verify-certificate/"
  ];
  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-crmisa-navy font-sans selection:bg-sky-400 selection:text-crmisa-navy overflow-x-hidden">
      <CookieConsent />
      {!hideLayout && (
        <Navbar
          cartCount={cartItems.length}
          isLoggedIn={isLoggedIn}
          user={user}
          onOpenRegister={openRegister}
          onOpenLogin={openLogin}
          onOpenEnrol={() => handleEnrollNowClick()}
          onOpenCartDrawer={() => setIsCartModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-crmisa-navy text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-400 font-bold text-xs flex items-center space-x-2 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<HomePage onOpenEnrol={() => handleEnrollNowClick()} onOpenLogin={openLogin} onOpenRegister={openRegister} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/courses"
            element={
              <CoursesPage
                onOpenEnrol={handleEnrollNowClick}
                onAddToCart={handleAddToCartClick}
              />
            }
          />
          <Route
            path="/courses/:id"
            element={
              <CourseDetailsPage onOpenEnrol={(title, price, id) => handleEnrollNowClick(title, price, id)} />
            }
          />

          <Route
            path="/ebook"
            element={
              <EbookPage
                onAddToCart={handleAddToCartClick}
              />
            }
          />
          <Route
            path="/ebook/:id"
            element={<EbookDetailPage onAddToCart={handleAddToCartClick} />}
          />

          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:id" element={<PostDetailPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/rss-feeds" element={<RssFeedsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificatePage />} />
          <Route path="/certificate/:certificateId" element={<CertificatePage />} />
          <Route path="/course/:id/exam" element={<ExamPage />} />
          <Route path="/course/:id/exam/result" element={<ExamResultPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard/courses" replace />} />
            <Route path="courses" element={<DashboardCourses />} />
            <Route path="ebooks" element={<DashboardEbooks />} />
            <Route path="exams" element={<DashboardExams />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>
          <Route path="/course-premium/:id" element={<CourseDetailsPremiumPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboardPage onLogout={handleLogout} />}
          />
          <Route
            path="/admin/course/create"
            element={<AdminCreateCoursePage />}
          />
          <Route
            path="/admin/course/:id/edit"
            element={<AdminCreateCoursePage />}
          />
          <Route
            path="/admin/ebook/create"
            element={<AdminEbookCreatePage />}
          />
          <Route
            path="/admin/ebook/:id/edit"
            element={<AdminEbookCreatePage />}
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* hideLayout includes /login /register so if they briefly load it won't show footer/navbar but then redirects */}
      {(!hideLayout && !location.pathname.startsWith('/dashboard')) && <Footer />}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeAuthModals} 
        switchToRegister={openRegister} 
        onLoginSuccess={() => navigate('/courses')}
      />

      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeAuthModals} 
        switchToLogin={openLogin} 
        onRegisterSuccess={() => navigate('/courses')}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onProceedToCheckout={() => {
          if (!isLoggedIn) {
            showToast("Please log in to checkout your cart.");
            openLogin();
            return;
          }
          setIsCartCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        courseTitle={checkoutCourse.title}
        coursePrice={checkoutCourse.price}
        courseId={checkoutCourse.id}
        onPaymentSuccess={() => showToast("Payment Received! Access Granted.")}
      />

      <CartCheckoutModal
        isOpen={isCartCheckoutOpen}
        onClose={() => setIsCartCheckoutOpen(false)}
        onPaymentSuccess={() => showToast("Cart Purchase Successful! Access Granted.")}
      />

      <EnrolModal
        isOpen={isEnrolOpen}
        onClose={() => setIsEnrolOpen(false)}
        onEnrolSuccess={() =>
          showToast("Enrollment Confirmed! Check your email.")
        }
      />


    </div>
  );
}
