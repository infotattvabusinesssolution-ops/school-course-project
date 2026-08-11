import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ShoppingBag, Heart, CheckCircle2, ArrowRight, Filter, ChevronDown, Download } from "lucide-react";
import { ebookService } from "../services/ebookService";
import { useAuth } from "../context/AuthContext";
import EbookCheckoutModal from "../components/EbookCheckoutModal";
import api from "../lib/axios";
import { downloadPdf } from "../utils/downloadHelper";

export default function EbookPage({ onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEbookForCheckout, setSelectedEbookForCheckout] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [purchasedEbookIds, setPurchasedEbookIds] = useState(new Set());

  const categories = [
    "All",
    "Export Marketing",
    "Shipping & Logistics",
    "Customs & Compliance",
    "Trade Finance",
  ];

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
        const res = await ebookService.getEbooks();
        setEbooks(res.data || []);

        if (user && user.role === "STUDENT") {
          try {
            const purchaseRes = await api.get("/student/purchased-ebooks");
            const ids = new Set((purchaseRes.data.purchases || []).map(p => p.ebook?._id || p.ebook));
            setPurchasedEbookIds(ids);
          } catch (pErr) {
            console.error("Failed to load student purchased ebooks:", pErr);
          }
        }
      } catch (err) {
        console.error("Failed to load ebooks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, [user]);

  const filteredEbooks =
    activeCategory === "All"
      ? ebooks
      : ebooks.filter((b) => b.category === activeCategory);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Digital Library & Trade Handbooks
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
                CRMISA Trade E-Books
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl">
                Practical step-by-step handbooks on customs clearance, export buyer outreach, shipping containers, and international trade finance.
              </p>
            </div>

            {/* Single Filter Dropdown Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all border border-slate-800"
              >
                <Filter className="w-4 h-4 text-yellow-400" />
                <span>Filter: {activeCategory}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <>
                  {/* Backdrop to close on click outside */}
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsFilterOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 divide-y divide-slate-100">
                    <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Category
                    </div>
                    <div className="py-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                            activeCategory === cat
                              ? "bg-slate-100 text-slate-900 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{cat}</span>
                          {activeCategory === cat && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Ebooks Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : filteredEbooks.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            No e-books found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEbooks.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 space-y-4 group cursor-pointer"
              >
                {/* Ebook Graphic Cover */}
                <div
                  onClick={() => navigate(`/ebook/${item._id || item.id}`)}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex flex-col justify-between p-4 text-white"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${item.coverImage}')` }}
                  />

                  {/* Category Pill Badge */}
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="bg-slate-800/90 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                      {item.category || "Trade"}
                    </span>
                    <div className="w-7 h-7 bg-yellow-400 text-slate-900 rounded-md flex items-center justify-center shadow-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Cover Title */}
                  <div className="relative z-10 bg-white/95 text-slate-900 p-3 rounded-lg text-center shadow-md backdrop-blur-xs my-auto border border-slate-200">
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-900 block leading-tight">
                      {item.coverTitle || item.title}
                    </span>
                  </div>

                  {/* Stock Indicator */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Instant PDF Download
                    </span>
                  </div>
                </div>

                {/* Info & Price */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div
                    onClick={() => navigate(`/ebook/${item._id || item.id}`)}
                    className="space-y-1.5"
                  >
                    <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs font-extrabold text-slate-900">
                      Price: <span className="text-slate-900 font-black">R{item.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {isAdmin ? (
                      <span className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold text-center cursor-not-allowed">
                        Admin Mode
                      </span>
                    ) : purchasedEbookIds.has(item._id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.pdfUrl) {
                            downloadPdf(item.pdfUrl, `${item.title || "Handbook"}.pdf`);
                          } else {
                            navigate("/dashboard");
                          }
                        }}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            navigate("/login");
                            return;
                          }
                          setSelectedEbookForCheckout(item);
                          setIsCheckoutModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToWishlist) onAddToWishlist(item);
                      }}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"
                      title="Add to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* E-book Razorpay Checkout Modal */}
      <EbookCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        ebook={selectedEbookForCheckout}
      />
    </div>
  );
}
