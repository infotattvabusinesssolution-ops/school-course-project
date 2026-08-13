import React, { useState, useEffect } from "react";
import api from "../../lib/axios";

export default function AdminTestimonialsTab() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [previewImage, setPreviewImage] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPhotoFile(null);
    setIsActive(true);
    setPreviewImage("");
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setName(t.name);
    setDescription(t.description);
    setIsActive(t.isActive);
    setPreviewImage(t.photo);
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/${id}`);
      alert("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Failed to delete testimonial");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isActive", isActive);
      
      if (photoFile) {
        formData.append("photo", photoFile);
      } else if (!editingId) {
        alert("Photo is required for new testimonials");
        setSaving(false);
        return;
      }

      if (editingId) {
        await api.put(`/testimonials/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Testimonial updated successfully");
      } else {
        await api.post("/testimonials", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Testimonial created successfully");
      }
      
      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-headline-sm font-bold text-on-surface">Testimonial Management</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-crmisa-navy text-white rounded-lg font-bold text-body-sm flex items-center gap-2 hover:bg-crmisa-accentNavy transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Testimonial
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
          <h3 className="font-bold text-lg mb-4">{editingId ? "Edit Testimonial" : "New Testimonial"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author Photo {editingId ? "(Optional)" : "*"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white"
              />
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Preview" className="w-16 h-16 object-cover rounded-full border shadow-sm" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Testimonial Text *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="What did they say?"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-slate-900"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Show on Landing Page
              </label>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-crmisa-navy text-white font-bold rounded-lg hover:bg-crmisa-accentNavy disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400">progress_activity</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="pb-4 font-bold text-on-surface text-label-md">Photo</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Name</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Testimonial</th>
                <th className="pb-4 font-bold text-on-surface text-label-md">Status</th>
                <th className="pb-4 font-bold text-on-surface text-label-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest">
                  <td className="py-4">
                    <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  </td>
                  <td className="py-4 font-bold text-crmisa-accentNavy">{t.name}</td>
                  <td className="py-4 text-sm text-slate-500 max-w-xs truncate">{t.description}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {t.isActive ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-bold mr-2 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
