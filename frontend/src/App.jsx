import React, { useState } from "react";
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
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCreateCoursePage from "./pages/AdminCreateCoursePage";
import CoursePlayerPage from "./pages/CoursePlayerPage";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  useAOS(activePage);

  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Auth state from Context
  const { user, logout: contextLogout } = useAuth();
  const isLoggedIn = !!user;

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
    title: "Import & Export Full Course",
    price: "R15000",
  });

  const [wishlistCount, setWishlistCount] = useState(2);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Smart Enroll / Checkout Trigger
  const handleEnrollNowClick = (courseTitle, coursePrice) => {
    const title =
      typeof courseTitle === "string"
        ? courseTitle
        : "Import & Export Full Course";
    const price = typeof coursePrice === "string" ? coursePrice : "R15000";
    setCheckoutCourse({ title, price });

    if (isLoggedIn) {
      setIsCheckoutOpen(true);
    } else {
      showToast("Please log in to your account to proceed with checkout.");
      setActivePage("login");
    }
  };

  const handleLoginSuccess = () => {
    showToast("Login Successful!");
    setTimeout(() => {
      setActivePage("dashboard");
    }, 400);
  };

  const handleRegisterSuccess = () => {
    showToast("Registration Successful! Account Created.");
    setTimeout(() => {
      setActivePage("dashboard");
    }, 400);
  };

  const handleLogout = async () => {
    await contextLogout();
    setActivePage("home");
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

  const handleSelectEbook = (ebook) => {
    setSelectedEbook(ebook);
    setActivePage("ebookdetail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setActivePage("postdetail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 font-sans selection:bg-sky-400 selection:text-slate-900 overflow-x-hidden">
      {/* Top Navbar */}
      {activePage !== "login" &&
        activePage !== "register" &&
        activePage !== "course-player" && (
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            wishlistCount={wishlistCount}
            cartCount={cartItems.length}
            isLoggedIn={isLoggedIn}
            user={user}
            onOpenRegister={() => setActivePage("register")}
            onOpenLogin={() => setActivePage("login")}
            onOpenEnrol={() => handleEnrollNowClick()}
            onOpenCartDrawer={() => setIsCartModalOpen(true)}
            setSelectedModuleId={setSelectedModuleId}
            onLogout={handleLogout}
          />
        )}

      {/* Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-crmisa-navy text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-400 font-bold text-xs flex items-center space-x-2 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dynamic View Router */}
      <main className="flex-1">
        {(activePage === "home" ||
          activePage === "login" ||
          activePage === "register") && (
          <HomePage
            onOpenRegister={() => setActivePage("register")}
            onOpenEnrol={() => handleEnrollNowClick()}
            setActivePage={setActivePage}
            isLoginMode={activePage === "login"}
            isRegisterMode={activePage === "register"}
          />
        )}
        {activePage === "about" && (
          <AboutPage onOpenRegister={() => setActivePage("register")} />
        )}
        {activePage === "courses" && (
          <CoursesPage
            onOpenEnrol={(cTitle, cPrice) =>
              handleEnrollNowClick(cTitle, cPrice)
            }
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        )}
        {activePage === "coursedetails" && (
          <CourseDetailsPage
            onOpenEnrol={() => handleEnrollNowClick()}
            initialModuleId={selectedModuleId}
          />
        )}
        {activePage === "ebook" && (
          <EbookPage
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onSelectEbook={handleSelectEbook}
          />
        )}
        {activePage === "ebookdetail" && (
          <EbookDetailPage
            ebook={selectedEbook}
            onAddToCart={handleAddToCart}
            onBack={() => setActivePage("ebook")}
          />
        )}
        {activePage === "forum" && (
          <ForumPage onSelectPost={handleSelectPost} />
        )}
        {activePage === "postdetail" && (
          <PostDetailPage
            post={selectedPost}
            onBack={() => setActivePage("forum")}
          />
        )}
        {activePage === "contact" && <ContactPage />}
        {activePage === "dashboard" && (
          <DashboardPage
            onLogout={handleLogout}
            setActivePage={setActivePage}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}
        {activePage === "admin-dashboard" && (
          <AdminDashboardPage
            onLogout={handleLogout}
            setActivePage={setActivePage}
            setSelectedCourseId={setSelectedCourseId}
          />
        )}
        {activePage === "admin-create-course" && (
          <AdminCreateCoursePage
            setActivePage={setActivePage}
            selectedCourseId={selectedCourseId}
          />
        )}
        {activePage === "course-player" && (
          <CoursePlayerPage
            setActivePage={setActivePage}
            courseId={selectedCourseId}
          />
        )}
      </main>

      {/* Global Footer */}
      {activePage !== "login" &&
        activePage !== "register" &&
        activePage !== "course-player" && (
          <Footer setActivePage={setActivePage} />
        )}

      {/* Cart Modal matching User Screenshot */}
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

      {/* Auth & Checkout Modals */}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        courseTitle={checkoutCourse.title}
        coursePrice={checkoutCourse.price}
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
