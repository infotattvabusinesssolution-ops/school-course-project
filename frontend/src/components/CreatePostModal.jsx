import React, { useState } from "react";
import Modal from "./Modal";
import { MessageSquare, Send } from "lucide-react";

export default function CreatePostModal({ isOpen, onClose, onSubmitPost }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setProcessing(true);
      if (onSubmitPost) {
        await onSubmitPost({
          title: title.trim(),
          category,
          content: content.trim(),
        });
      }
      setTitle("");
      setContent("");
      setCategory("General");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start Discussion" maxWidth="max-w-lg">
      <div className="py-2 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-crmisa-navy text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-crmisa-navy tracking-tight">
              Start a Discussion
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Share your trade question or topic with the CRMISA community.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-crmisa-navy bg-white focus:outline-none focus:border-crmisa-navy transition-colors"
            >
              <option value="General">General</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
              <option value="Customs">Customs</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Discussion Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What documents are needed for Durban customs clearance?"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-crmisa-navy focus:outline-none focus:border-crmisa-navy transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Discussion Details / Question
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background information, context, or specific questions..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-crmisa-navy focus:outline-none focus:border-crmisa-navy transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-semibold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
            >
              {processing ? (
                "Publishing..."
              ) : (
                <>
                  <span>Publish Discussion</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
