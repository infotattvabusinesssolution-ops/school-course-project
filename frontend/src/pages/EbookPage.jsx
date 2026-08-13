import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ShoppingBag, ShoppingCart, CheckCircle2, ArrowRight, Filter, ChevronDown, Download } from "lucide-react";
import { ebookService } from "../services/ebookService";
import { useAuth } from "../context/AuthContext";
import EbookCheckoutModal from "../components/EbookCheckoutModal";
import api from "../lib/axios";
import { downloadPdf } from "../utils/downloadHelper";

export default function EbookPage({ onAddToCart }) {
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
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
        <div data-aos="fade-up" className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Premium Digital Library
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
                Master Global Trade <br className="hidden sm:block" /> At Your Own Pace
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl">
                Download practical, step-by-step handbooks on customs clearance, export buyer outreach, shipping containers, and international trade finance.
              </p>
            </div>
          </div>
        </div>

        {/* Browse Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse E-Books</h2>
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
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 space-y-5 group cursor-pointer"
              >
                {/* 3D Ebook Graphic Cover */}
                <div
                  onClick={() => navigate(`/ebook/${item._id || item.id}`)}
                  className="relative aspect-[3/4] w-[80%] mx-auto rounded-r-xl rounded-l-sm overflow-hidden bg-slate-900 border-l-[14px] border-slate-800 shadow-[4px_0px_0px_#f8fafc,8px_0px_0px_#f1f5f9,12px_0px_0px_#e2e8f0,13px_0px_0px_#cbd5e1] flex flex-col justify-between transition-all duration-300"
                >
                  {/* Book Spine Highlight */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/30 to-transparent z-20 mix-blend-overlay"></div>
                  
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500 font-bold text-sm z-0">No Cover</div>
                  )}

                  {/* Fallback overlay if no image or to darken */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 z-10"></div>



                  {/* Stock Indicator */}
                  <div className="relative z-20 p-3 flex items-center justify-between text-[10px] font-bold text-slate-100">
                    <span className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant PDF
                    </span>
                  </div>
                </div>

                {/* Info & Price */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div
                    onClick={() => navigate(`/ebook/${item._id || item.id}`)}
                    className="space-y-2"
                  >
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-sm font-bold text-slate-500">
                      Price: <span className="text-blue-600 font-black text-lg">R{item.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    {isAdmin ? (
                      <span className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-semibold text-center cursor-not-allowed">
                        Admin Mode
                      </span>
                    ) : purchasedEbookIds.has(item._id) ? (
                      <a
                        href={item.pdfUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            openLogin();
                            return;
                          }
                          setSelectedEbookForCheckout(item);
                          setIsCheckoutModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-600/20"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Buy Now</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToCart) onAddToCart(item);
                      }}
                      className="w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
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
