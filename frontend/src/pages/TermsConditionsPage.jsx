import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsConditionsPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-crmisa-accentNavy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-crmisa-navy mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-crmisa-navy text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-crmisa-navy tracking-tight mb-3">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: August 10, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <p>
              Welcome to CRMISA (“we,” “us,” “our”). These Terms and Conditions (“Terms”) govern your use of our website, online learning platform, and any courses, services, or content offered through CRMISA.
            </p>
            <p className="mt-3">
              By accessing or using CRMISA, you agree to be bound by these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">1. Eligibility</h2>
            <p className="mb-3">To use our services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 13 years old (or meet the minimum legal age in your jurisdiction)</li>
              <li>Provide accurate and complete registration information</li>
              <li>Agree to comply with these Terms and our Privacy Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">2. User Accounts</h2>
            <p className="mb-3">When you register for a course or create an account:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              <li>You may not share your account with others or use someone else’s account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">3. Course Enrollment and Access</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enrollment grants you a limited, non-transferable license to access course content for personal, non-commercial use.</li>
              <li>Access may be limited by time (e.g., per term or course period) as outlined during registration.</li>
              <li>CRMISA may update, modify, or remove course materials at any time to improve quality or reflect current standards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">4. Payments and Refunds</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All fees must be paid in full before course access is granted.</li>
              <li>Prices are listed in rands and may be subject to taxes where applicable.</li>
              <li>Refund policies, if available, are described on the relevant course registration pages or in a separate Refund Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">5. Code of Conduct</h2>
            <p className="mb-3">When using CRMISA, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Behave respectfully toward instructors, staff, and fellow students</li>
              <li>Refrain from posting or sharing offensive, abusive, or illegal content</li>
              <li>Not engage in cheating, plagiarism, or unauthorized collaboration</li>
              <li>Not reproduce, distribute, or sell any course material without permission</li>
            </ul>
            <p>
              Violation of this code may result in suspension or permanent termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">6. Intellectual Property</h2>
            <p>
              All content on CRMISA—including videos, text, images, logos, and course materials—is owned by or licensed to CRMISA and protected by copyright and intellectual property laws.
            </p>
            <p className="mt-3">
              You may not copy, reproduce, republish, or distribute any content without our written consent, except where permitted by applicable law or under a specific license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">7. Limitation of Liability</h2>
            <p className="mb-3">CRMISA is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Any indirect, incidental, or consequential damages arising from your use of our services</li>
              <li>Technical issues beyond our control (e.g., internet outages, server downtime)</li>
              <li>The accuracy or completeness of course content, though we strive to keep it up to date</li>
            </ul>
            <p>
              Use of CRMISA services is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access at any time if you violate these Terms or engage in conduct that disrupts our learning environment.
            </p>
            <p className="mt-3">
              You may also terminate your account at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">9. Changes to Terms</h2>
            <p>
              CRMISA may update these Terms periodically. We will notify users of material changes via email or through our website. Continued use of our services after changes means you accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the courts in South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">11. Contact Us</h2>
            <p className="mb-3">If you have any questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-1">
              <li><strong>Email:</strong> <a href="mailto:info@crmisa.com" className="text-crmisa-navy font-semibold underline">info@crmisa.com</a></li>
              <li><strong>Website:</strong> <a href="https://www.crmisa.com" className="text-crmisa-navy font-semibold underline">www.crmisa.com</a></li>
            </ul>
          </section>

        </div>

      </div>
    </div>
  );
}
