import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Award,
  ExternalLink,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import api from "../lib/axios";

export default function VerifyCertificatePage() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId) return;
      try {
        setLoading(true);
        const res = await api.get(`/certificates/verify/${certificateId}`);
        setCertificate(res.data.data);
      } catch (err) {
        console.error("Certificate verification error:", err);
        setError(
          "Invalid or unrecognized Certificate ID. Please double check the ID or QR code.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            Verifying Certificate Authenticity...
          </p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-crmisa-navy">
            Certificate Verification Failed
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              to="/"
              className="px-6 py-2.5 bg-crmisa-navy text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 hover:bg-crmisa-accentNavy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { student, course, issueDate } = certificate;
  const studentName = student?.name || "Student";
  const courseTitle = course?.title || "Course Program";
  const formattedDate = new Date(issueDate || Date.now()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Verification Success Header Banner */}
        <div className="bg-emerald-600 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Verified Authentic
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Official Certificate Verified
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Issued by CRMISA (Centre for Regional Merchandise & International
              Shipping Academy)
            </p>
          </div>
        </div>

        {/* Certificate Data Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Certificate ID
            </span>
            <span className="font-mono font-black text-sm text-crmisa-navy bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {certificateId}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Certificate Awarded To
                </p>
                <p className="text-xl font-black text-crmisa-navy">
                  {studentName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Course Completed
                </p>
                <p className="text-lg font-bold text-crmisa-navy leading-snug">
                  {courseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Date of Issuance
                </p>
                <p className="text-base font-bold text-crmisa-accentNavy">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Official Verification Statement */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-crmisa-navy">
              Platform Statement:{" "}
            </span>
            This official Certificate of Completion was generated and
            cryptographically verified by CRMISA upon 100% successful completion
            of all course modules, lectures, and compliance assessments.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/certificate/${certificateId}`)}
              className="flex-1 py-3 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View / Print Certificate Document</span>
            </button>

            <Link
              to="/courses"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-crmisa-accentNavy font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore All Courses</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
