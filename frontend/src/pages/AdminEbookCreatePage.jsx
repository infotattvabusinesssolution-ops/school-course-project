import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, BookOpen, FileText, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { ebookService } from "../services/ebookService";

export default function AdminEbookCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 499,
    coverTitle: "",
    subtitle: "",
    description: "",
    category: "Export Marketing",
    coverImageFile: null,
    samplePdfFile: null,
    pdfFile: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    coverImage: "",
    samplePdfUrl: "",
    pdfUrl: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchEbook = async () => {
        try {
          setLoading(true);
          const res = await ebookService.getEbookById(id);
          const ebook = res.data;
          setFormData({
            title: ebook.title || "",
            price: ebook.price || 499,
            coverTitle: ebook.coverTitle || "",
            subtitle: ebook.subtitle || "",
            description: ebook.description || "",
            category: ebook.category || "Export Marketing",
            coverImageFile: null,
            samplePdfFile: null,
            pdfFile: null,
          });
          setExistingFiles({
            coverImage: ebook.coverImage || "",
            samplePdfUrl: ebook.samplePdfUrl || "",
            pdfUrl: ebook.pdfUrl || "",
          });
        } catch (err) {
          console.error("Failed to load ebook for editing:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEbook();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please fill in the required fields (Title and Price)");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("coverTitle", formData.coverTitle);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (formData.coverImageFile) data.append("coverImage", formData.coverImageFile);
      if (formData.samplePdfFile) data.append("samplePdf", formData.samplePdfFile);
      if (formData.pdfFile) data.append("pdf", formData.pdfFile);

      if (isEditMode) {
        await ebookService.updateEbook(id, data);
      } else {
        await ebookService.createEbook(data);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Failed to save ebook to Cloudinary:", err);
      alert("Failed to save ebook to Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </button>
          <span className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded-md">
            Admin Portal
          </span>
        </div>

        {/* Page Title */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {isEditMode ? "Edit E-book" : "Upload New E-book"}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {isEditMode ? "Update trade handbook details and Cloudinary file assets." : "Add trade handbooks with Cloudinary cover images, sample previews, and full PDFs."}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                E-book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. CRMISA – Shipping Containers & Customs Clearance"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 transition-colors"
              >
                <option value="Export Marketing">Export Marketing</option>
                <option value="Shipping & Logistics">Shipping & Logistics</option>
                <option value="Customs & Compliance">Customs & Compliance</option>
                <option value="Trade Finance">Trade Finance</option>
              </select>
            </div>
          </div>

          {/* Price & Cover Banner Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cover Banner Title (Graphic text)
              </label>
              <input
                type="text"
                value={formData.coverTitle}
                onChange={(e) => setFormData({ ...formData, coverTitle: e.target.value })}
                placeholder="e.g. HOW TO WIN BUYERS ACROSS BORDERS"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subtitle / Summary
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Learn essential documentation & container shipping procedures"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive breakdown of chapters, trade topics, and compliance guidelines..."
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors resize-none"
            />
          </div>

          {/* Cloudinary File Uploads Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-base">Cloudinary File Assets</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cover Image Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>Cover Image File</span>
                </div>
                {existingFiles.coverImage && (
                  <img src={existingFiles.coverImage} alt="Current Cover" className="w-16 h-20 object-cover rounded border border-slate-300 mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, coverImageFile: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 border border-slate-200 rounded-lg file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">{isEditMode ? "Choose file to replace current cover" : "JPG or PNG cover graphic"}</p>
              </div>

              {/* Sample PDF Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Sample Preview PDF</span>
                </div>
                {existingFiles.samplePdfUrl && (
                  <span className="text-[11px] font-bold text-emerald-600 block mb-1">✓ Sample PDF Attached</span>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFormData({ ...formData, samplePdfFile: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 border border-slate-200 rounded-lg file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">{isEditMode ? "Choose file to replace sample PDF" : "Free preview PDF sample"}</p>
              </div>

              {/* Full E-book PDF Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  <span>Full E-book PDF File</span>
                </div>
                {existingFiles.pdfUrl && (
                  <span className="text-[11px] font-bold text-blue-600 block mb-1">✓ Full E-book PDF Attached</span>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFormData({ ...formData, pdfFile: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 border border-slate-200 rounded-lg file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">{isEditMode ? "Choose file to replace full PDF" : "Complete handbook file"}</p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 rounded-lg border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors text-xs flex items-center gap-2"
            >
              {uploading ? (
                "Saving Assets to Cloudinary..."
              ) : (
                <>
                  <span>{isEditMode ? "Update E-book" : "Publish E-book"}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
