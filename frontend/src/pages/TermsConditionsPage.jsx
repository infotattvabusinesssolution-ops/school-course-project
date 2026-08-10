import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: August 10, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the CRMISA website, purchasing courses, or accessing learning resources, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Course Enrollment & Access</h2>
            <p className="mb-3">Upon successful payment for a course or certification program:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are granted a personal, non-exclusive, non-transferable license to access the course content through our student dashboard.</li>
              <li>Access validity periods are specified on the course details page.</li>
              <li>Sharing account credentials or distributing proprietary video lessons is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Payments & Refund Policy</h2>
            <p>
              All course fees are listed in Indian Rupees (₹). Payments are securely processed via Razorpay. Due to the immediate digital delivery of course content, video materials, and downloadable resources, refund requests are evaluated on a case-by-case basis according to our administrative review policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
            <p>
              All course curriculum, text, graphics, video lessons, logos, and materials available on CRMISA are the intellectual property of CRMISA and its instructors. Unauthorized copying, recording, or redistribution is strictly prohibited and subject to legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Student Conduct</h2>
            <p>
              Students must maintain professional conduct in Q&A sections, forums, and interactive sessions. Harassment, spamming, or posting offensive content will result in immediate account termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of South Africa and applicable international trade standards.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
