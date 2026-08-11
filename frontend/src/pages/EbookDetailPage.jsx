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
  const { user } = useAuth();
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
        <h2 className="text-xl font-bold text-slate-900 mb-2">E-book Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The trade handbook you are looking for does not exist.</p>
        <Link to="/ebooks" className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg">
          Back to E-books
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <button
          onClick={() => navigate("/ebooks")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to E-books
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start shadow-xs">
          {/* Left Column: Ebook Cover Graphic */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md flex flex-col justify-between p-5 text-white group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url('${ebook.coverImage}')` }}
              />

              {/* Header Badge */}
              <div className="relative z-10 flex justify-between items-center">
                <span className="bg-slate-800/90 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  {ebook.category || "Handbook"}
                </span>
                <div className="w-8 h-8 bg-yellow-400 text-slate-900 rounded-lg flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              {/* Center Title */}
              <div className="relative z-10 bg-white/95 text-slate-900 p-4 rounded-xl text-center shadow-md border border-slate-200 my-auto">
                <span className="text-xs font-black tracking-wider uppercase text-slate-900 block leading-tight">
                  {ebook.coverTitle || ebook.title}
                </span>
              </div>

              {/* Bottom Notice */}
              <div className="relative z-10 text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Official CRMISA Digital Edition
              </div>
            </div>
          </div>

          {/* Right Column: Ebook Information */}
          <div className="md:col-span-7 space-y-6 pt-2">
            <div className="space-y-3">
              <span className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1 rounded-md">
                {ebook.category || "Digital Book"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
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
                <div className="text-3xl font-black text-slate-900">R{ebook.price}</div>
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
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Edit E-book (Admin)</span>
                </button>
              ) : isPurchased ? (
                <button
                  onClick={() => {
                    if (ebook.pdfUrl) {
                      downloadPdf(ebook.pdfUrl, `${ebook.title || "Handbook"}.pdf`);
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full E-Book (PDF)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setIsCheckoutModalOpen(true);
                  }}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              )}

              {ebook.samplePdfUrl && (
                <button
                  onClick={() => downloadPdf(ebook.samplePdfUrl, `${ebook.title || "Sample"}_Sample.pdf`)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample PDF</span>
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
          <h3 className="text-lg font-bold text-slate-900">Handbook Description</h3>
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
