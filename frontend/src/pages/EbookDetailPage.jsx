import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  BookOpen,
  FileText,
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react";
import { ebookService } from "../services/ebookService";
import { useAuth } from "../context/AuthContext";
import EbookCheckoutModal from "../components/EbookCheckoutModal";
import { downloadPdf } from "../utils/downloadHelper";
import api from "../lib/axios";

export default function EbookDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await ebookService.getEbookById(id);
        setEbook(res.data);

        if (user && user.role === "STUDENT") {
          try {
            const purchaseRes = await api.get("/student/purchased-ebooks");
            const purchases = purchaseRes.data.purchases || [];
            setIsPurchased(purchases.some(p => (p.ebook?._id || p.ebook) === id));
          } catch (pErr) {
            console.error("Failed to check ebook purchase:", pErr);
          }
        }
      } catch (err) {
        console.error("Failed to load ebook details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbook();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-white pt-28 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-crmisa-navy mb-2">E-book Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The trade handbook you are looking for does not exist.</p>
        <Link to="/ebooks" className="px-6 py-2.5 bg-crmisa-navy text-white font-semibold text-sm rounded-lg">
          Back to E-books
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-crmisa-accentNavy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <button
          onClick={() => navigate("/ebooks")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-crmisa-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to E-books
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start shadow-xs">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-r-xl rounded-l-sm overflow-hidden bg-crmisa-navy border-l-[14px] border-slate-800 shadow-[4px_0px_0px_#f8fafc,8px_0px_0px_#f1f5f9,12px_0px_0px_#e2e8f0,13px_0px_0px_#cbd5e1] flex flex-col justify-between group">
              {/* Book Spine Highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/30 to-transparent z-20 mix-blend-overlay"></div>
              
              {ebook.coverImage ? (
                <img src={ebook.coverImage} alt={ebook.title} className="absolute inset-0 w-full h-full object-cover z-0" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-crmisa-accentNavy text-slate-500 font-bold text-sm z-0">No Cover</div>
              )}
              
              {/* Fallback overlay if no image or to darken */}
              <div className="absolute inset-0 bg-gradient-to-t from-crmisa-navy/80 via-transparent to-crmisa-navy/40 z-10"></div>

              {/* Bottom Notice */}
              <div className="relative z-20 p-3 text-[10px] font-bold text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5 bg-crmisa-navy/80 px-2 py-1 rounded-md backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant PDF
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Ebook Information */}
          <div className="md:col-span-7 space-y-6 pt-2">
            <div className="space-y-3">
              <span className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1 rounded-md">
                {ebook.category || "Digital Book"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-crmisa-navy leading-tight">
                {ebook.title}
              </h1>
              {ebook.subtitle && (
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {ebook.subtitle}
                </p>
              )}
            </div>

            {/* Price & In Stock Badge */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs text-slate-500 font-medium">Digital PDF Price</span>
                <div className="text-3xl font-black text-crmisa-navy">R{ebook.price}</div>
              </div>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-md">
                Instant PDF Delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isAdmin ? (
                <button
                  onClick={() => navigate(`/admin/ebook/${id}/edit`)}
                  className="px-8 py-3.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Edit E-book (Admin)</span>
                </button>
              ) : isPurchased ? (
                <a
                  href={ebook.pdfUrl}
                  download
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full E-Book (PDF)</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      openLogin();
                      return;
                    }
                    setIsCheckoutModalOpen(true);
                  }}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Verified Customs Content</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Printable PDF Format</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-crmisa-navy">Handbook Description</h3>
          <p className="text-sm text-slate-600 font-normal leading-relaxed whitespace-pre-line">
            {ebook.description || "Learn the core practices, procedures and documents required in any international merchandise transaction."}
          </p>
        </div>
      </div>

      {/* E-book Razorpay Checkout Modal */}
      <EbookCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        ebook={ebook}
      />
    </div>
  );
}
