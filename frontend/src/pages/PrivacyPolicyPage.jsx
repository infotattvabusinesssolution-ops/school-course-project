import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
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
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal & Transparency</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: August 10, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to CRMISA ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or purchase our international trade certification courses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect personal information that you voluntarily provide to us when registering an account, enrolling in courses, or contacting our support team, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and account credentials.</li>
              <li><strong>Billing & Transaction Details:</strong> Order details, course enrollment history, and payment status processed securely through our authorized gateway (Razorpay).</li>
              <li><strong>Usage & Learning Data:</strong> Course progress, lesson completion rates, video playback data, and quiz metrics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">Your information is used strictly to provide, maintain, and improve our services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Granting access to enrolled course materials and student dashboards.</li>
              <li>Processing payments securely and issuing official completion certificates.</li>
              <li>Sending important course updates, registration details, and student notifications.</li>
              <li>Providing customer support and trade advisory guidance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Payment Security</h2>
            <p>
              We do not store complete credit/debit card numbers or bank credentials on our servers. All financial transactions are processed securely through Razorpay using industry-standard PCI-DSS compliant encryption algorithms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Protection & Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties for marketing purposes. Data may only be shared with verified service providers (such as hosting and email delivery systems) strictly required to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our data privacy officer at <a href="mailto:info@crmisa.co.za" className="text-slate-900 font-semibold underline">info@crmisa.co.za</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
