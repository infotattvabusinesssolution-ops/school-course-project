import React, { useState } from 'react';
import { UserIcon } from '../components/icons/Icons';

export default function PostDetailPage({ post, onBack }) {
  const [replyText, setReplyText] = useState('');
  const [repliesList, setRepliesList] = useState([
    {
      id: 1,
      author: "CRMISA Trade Advisor",
      time: "1 hour ago",
      text: "You will need a Bill of Lading, Commercial Invoice, SARS SAD500 declaration, and Origin Certificate EUR.1."
    },
    {
      id: 2,
      author: "David K (Export Consultant)",
      time: "45 mins ago",
      text: "Also make sure your Customs Client Number (CCN) is activated on eFiling before vessel arrival!"
    }
  ]);

  const activePost = post || {
    id: 1,
    author: "Gyana Singh",
    category: "Import",
    time: "2 hours ago",
    question: "What are the key documents required for SARS SAD500 customs clearance in Durban port?",
    details: "I am importing a 20ft container of electronics from Guangzhou to Durban harbor and need clarification on duty rates and SAD500 processing timelines."
  };

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setRepliesList([
      ...repliesList,
      {
        id: Date.now(),
        author: "Gyana Singh",
        time: "Just now",
        text: replyText
      }
    ]);
    setReplyText('');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Back Link */}
        {onBack && (
          <button 
            onClick={onBack}
            className="text-xs font-bold text-[#1c3c78] hover:text-crmisa-navy flex items-center space-x-1"
          >
            <span>&larr; Back to Forum</span>
          </button>
        )}

        {/* Main Post Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1c3c78] text-white flex items-center justify-center font-bold text-xs shadow">
                GS
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{activePost.author}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{activePost.time}</span>
              </div>
            </div>

            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              {activePost.category}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {activePost.question}
          </h1>

          {activePost.details && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 border-t border-slate-100">
              {activePost.details}
            </p>
          )}

        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Discussion Replies ({repliesList.length})
          </h4>

          {/* Replies List */}
          <div className="space-y-4 divide-y divide-slate-100">
            {repliesList.map((reply) => (
              <div key={reply.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1c3c78]">{reply.author}</span>
                  <span className="text-slate-400">{reply.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {reply.text}
                </p>
              </div>
            ))}
          </div>

          {/* Add Reply Form */}
          <form onSubmit={handleAddReply} className="pt-4 border-t border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Leave a Reply
            </label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response or advice..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-[#1c3c78]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1c3c78] hover:bg-crmisa-navy text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Post Reply
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
