import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "What is this course about?",
    a: "This course is a comprehensive guide to starting and growing an import/export business, covering everything from international trade basics to shipping, customs, and compliance."
  },
  {
    q: "Who is this course for?",
    a: "It is designed for aspiring entrepreneurs, business owners, and professionals looking to understand and enter the global trade market."
  },
  {
    q: "Do I need any prior experience in trade or business?",
    a: "No prior experience is necessary. The course is built to take you from a complete beginner to a confident trader."
  },
  {
    q: "What countries or regions does the course focus on?",
    a: "While the core principles apply globally, the course includes specific modules focused on the African market and cross-border trade."
  },
  {
    q: "How long is the course?",
    a: "The course is self-paced, but most students complete the core modules within 4 to 6 weeks, depending on their schedule."
  },
  {
    q: "What topics are covered in the course?",
    a: "Topics include finding buyers/suppliers, logistics, customs, trade finance, compliance, and how to successfully register and run your business."
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
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

        {/* Accordion */}
        <div className="space-y-3 mb-8">
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
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4 text-slate-600 text-sm leading-relaxed bg-slate-50 border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-full transition-colors text-sm uppercase tracking-wider"
          >
            View More FAQs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
