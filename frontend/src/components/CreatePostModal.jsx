import React, { useState } from 'react';
import Modal from './Modal';

export default function CreatePostModal({ isOpen, onClose, onSubmitPost }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Import');
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (onSubmitPost) {
        onSubmitPost({
          id: Date.now(),
          author: "Gyana Singh",
          category,
          time: "Just now",
          question: title,
          details,
          replies: 0
        });
      }
      setTitle('');
      setDetails('');
      setImageFile(null);
      onClose();
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Forum Post" maxWidth="max-w-lg">
      <div className="py-2 space-y-5">
        
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-[#1c3c78] tracking-tight">
            Ask A Question / Create Post
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Share your inquiry with the CRMISA community and export consultants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#1c3c78]"
            >
              <option value="General">General</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
            </select>
          </div>

          {/* Question / Post Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Question Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What are the SARS SAD500 clearance requirements for Durban port?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1c3c78]"
            />
          </div>

          {/* Post Details / Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Details / Context (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide additional details or context for your question..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1c3c78]"
            />
          </div>

          {/* Attach Image */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Attach Image / Document (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-xl shadow-md transition-all duration-200 text-sm"
            >
              {processing ? 'Publishing Post...' : 'Publish Post'}
            </button>
          </div>

        </form>

      </div>
    </Modal>
  );
}
