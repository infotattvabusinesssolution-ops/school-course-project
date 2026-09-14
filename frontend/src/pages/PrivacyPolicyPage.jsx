import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal & Transparency</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-crmisa-navy tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: August 10, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <p>
              CRMISA ("we", "our", or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.crmisa.com, register for our courses, or interact with our services.
            </p>
            <p className="mt-3">
              Please read this policy carefully to understand our views and practices regarding your personal data and how we will treat it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you interact with CRMISA, we may collect the following types of information:</p>
            
            <h3 className="font-semibold text-crmisa-navy mt-4 mb-2">a. Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Date of birth</li>
              <li>Payment and billing information</li>
              <li>Educational background</li>
            </ul>

            <h3 className="font-semibold text-crmisa-navy mt-4 mb-2">b. Non-Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited and time spent</li>
              <li>Referral source</li>
            </ul>

            <h3 className="font-semibold text-crmisa-navy mt-4 mb-2">c. Course Activity</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enrollment data</li>
              <li>Course progress</li>
              <li>Quiz scores and assessments</li>
              <li>Communications within the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register and manage your account</li>
              <li>To provide access to courses and materials</li>
              <li>To process payments and send receipts</li>
              <li>To send administrative and course-related emails</li>
              <li>To personalize your learning experience</li>
              <li>To analyze and improve our services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">3. Sharing Your Information</h2>
            <p className="mb-3">We do not sell or rent your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers (e.g. payment processors, hosting providers)</li>
              <li>Academic partners (if applicable and only with your consent)</li>
              <li>Legal authorities when required by law or in connection with legal proceedings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data. These include secure servers, encryption, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">5. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Access the personal data we hold about you</li>
              <li>Request corrections to your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at <a href="mailto:support@crmisa.com" className="text-crmisa-navy font-semibold underline">support@crmisa.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">6. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance user experience, analyze traffic, and improve our services. You can modify your browser settings to refuse cookies, but this may limit functionality.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those websites.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">8. Children’s Privacy</h2>
            <p>
              CRMISA does not knowingly collect personal information from children under the age of 13 without parental consent. If we learn we have collected such data, we will take steps to delete it promptly.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated “Effective Date.” We encourage you to review it regularly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-crmisa-navy mb-3">10. Contact Us</h2>
            <p className="mb-3">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
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
