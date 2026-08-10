import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    a: "Inside the Course Player, navigate to the Q&A section to ask questions directly to your instructor and view answers."
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400" />
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Got Questions?
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Everything you need to know before getting started.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-slate-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`w-full px-5 py-4 text-left flex items-center justify-between gap-4 transition-colors ${
                    isOpen ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-semibold leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-slate-600 text-sm leading-relaxed bg-slate-50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
