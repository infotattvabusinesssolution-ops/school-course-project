import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, useNavigationType, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import CheckoutModal from "./components/CheckoutModal";
import EnrolModal from "./components/EnrolModal";
import CartModal from "./components/CartModal";
import CartWishlistDrawer from "./components/CartWishlistDrawer";
import { useAOS } from "./hooks/useAOS";
import { useAuth } from "./context/AuthContext";

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
import DashboardLayout from "./pages/DashboardLayout";
import DashboardCourses from "./pages/DashboardCourses";
import DashboardEbooks from "./pages/DashboardEbooks";
import DashboardExams from "./pages/DashboardExams";
import DashboardProfile from "./pages/DashboardProfile";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCreateCoursePage from "./pages/AdminCreateCoursePage";
import AdminEbookCreatePage from "./pages/AdminEbookCreatePage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import FaqPage from "./pages/FaqPage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";
import CertificatePage from "./pages/CertificatePage";
import ExamPage from "./pages/ExamPage";
import ExamResultPage from "./pages/ExamResultPage";

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

  // Use AOS
  useAOS(location.pathname);

  // Auth state from Context
  const { user, logout: contextLogout } = useAuth();
  const isLoggedIn = !!user;

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEnrolOpen, setIsEnrolOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title:
        "CRMISA – How to Find Buyers Worldwide Marketing, Fairs, B2B Portals & Smart Outreach",
      price: 499,
    },
  ]);

  // Track selected course/item for checkout
  const [checkoutCourse, setCheckoutCourse] = useState({
    id: null,
    title: "Import & Export Full Course",
    price: "R15000",
  });

  const [wishlistCount, setWishlistCount] = useState(2);
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
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await contextLogout();
    navigate("/");
    showToast("Logged out successfully.");
  };

  const handleAddToCart = (item) => {
    const newItem = {
      id: Date.now(),
      title: item.title || "CRMISA Import & Export Learning Material",
      price: item.price || "R499",
    };
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added "${newItem.title}" to Cart!`);
    setIsCartModalOpen(true);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart.");
  };

  const handleAddToWishlist = (item) => {
    setWishlistCount((prev) => prev + 1);
    showToast(`Saved "${item.title || "Item"}" to Wishlist!`);
  };

  // Determine if we should hide the Navbar/Footer
  const hideLayoutPaths = [
    "/login", 
    "/register", 
    "/course-player", 
    "/admin", 
    "/course/", 
    "/certificate/", 
    "/verify-certificate/"
  ];
  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 font-sans selection:bg-sky-400 selection:text-slate-900 overflow-x-hidden">
      {!hideLayout && (
        <Navbar
          wishlistCount={wishlistCount}
          cartCount={cartItems.length}
          isLoggedIn={isLoggedIn}
          user={user}
          onOpenRegister={() => navigate("/register")}
          onOpenLogin={() => navigate("/login")}
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
            element={<HomePage onOpenEnrol={() => handleEnrollNowClick()} />}
          />
          <Route
            path="/login"
            element={
              <HomePage
                isLoginMode
                onOpenEnrol={() => handleEnrollNowClick()}
              />
            }
          />
          <Route
            path="/register"
            element={
              <HomePage
                isRegisterMode
                onOpenEnrol={() => handleEnrollNowClick()}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/courses"
            element={
              <CoursesPage
                onOpenEnrol={handleEnrollNowClick}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
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
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            }
          />
          <Route
            path="/ebooks"
            element={
              <EbookPage
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            }
          />
          <Route
            path="/ebook/:id"
            element={<EbookDetailPage onAddToCart={handleAddToCart} />}
          />

          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:id" element={<PostDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificatePage />} />
          <Route path="/certificate/:certificateId" element={<CertificatePage />} />
          <Route path="/course/:id/exam" element={<ExamPage />} />
          <Route path="/course/:id/exam/result" element={<ExamResultPage />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard/courses" replace />} />
            <Route path="courses" element={<DashboardCourses />} />
            <Route path="ebooks" element={<DashboardEbooks />} />
            <Route path="exams" element={<DashboardExams />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>
          <Route path="/course-player/:id" element={<CoursePlayerPage />} />

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
        </Routes>
      </main>

      {['/', '/login', '/register'].includes(location.pathname) && <Footer />}

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          const firstItem = cartItems[0] || {
            title: "CRMISA Ebook",
            price: "R499",
          };
          handleEnrollNowClick(firstItem.title, String(firstItem.price));
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

      <EnrolModal
        isOpen={isEnrolOpen}
        onClose={() => setIsEnrolOpen(false)}
        onEnrolSuccess={() =>
          showToast("Enrollment Confirmed! Check your email.")
        }
      />

      <CartWishlistDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        wishlistCount={wishlistCount}
        cartCount={cartItems.length}
        onOpenEnrol={() => handleEnrollNowClick()}
      />
    </div>
  );
}
