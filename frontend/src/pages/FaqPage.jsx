import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ChevronDown, ArrowLeft, Search } from "lucide-react";

export default function FaqPage() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "What is CRMISA and what courses do you offer?",
      a: "CRMISA is a premier trade education platform providing practical, certified training in international import/export management, customs clearance, incoterms, trade finance, and supply chain logistics."
    },
    {
      q: "How do I enroll in a course?",
      a: "Browse our Courses page, select your preferred course, and click 'Enroll Now'. Complete the secure checkout via Razorpay to gain immediate access to your student dashboard and course player."
    },
    {
      q: "Will I receive a certificate upon completion?",
      a: "Yes! Every student who completes 100% of the lessons in a course receives an official, verifiable Certificate of Completion from CRMISA."
    },
    {
      q: "What payment methods are supported?",
      a: "We support secure online payments via Razorpay including Credit/Debit Cards, Net Banking, UPI, and Instant EFT options."
    },
    {
      q: "How long do I have access to course materials?",
      a: "Most courses include full ongoing access so you can review lessons and reference guides anytime at your own pace."
    },
    {
      q: "Can I watch videos on mobile devices?",
      a: "Yes, our course player and student dashboard are fully optimized for seamless playback across desktop, tablet, and mobile browsers."
    },
    {
      q: "How can I contact my instructor if I have questions?",
      a: "Inside the Course Player, use the Q&A tab under any lesson to ask questions directly to your instructor and view answers."
    }
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support & Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Find quick answers to common questions about enrollment, payment, course access, and certificates.
          </p>

          {/* Search box */}
          <div className="relative mt-6 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-slate-500 text-sm">No questions found matching your search query.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-base hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-slate-900" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
