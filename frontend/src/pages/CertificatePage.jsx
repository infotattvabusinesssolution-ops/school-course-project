import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, CheckCircle2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import api from "../lib/axios";

export default function CertificatePage() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificates/verify/${certificateId}`);
        setCertificate(res.data.data);
      } catch (err) {
        console.error("Error fetching certificate:", err);
      } finally {
        setLoading(false);
      }
    };
    if (certificateId) fetchCertificate();
  }, [certificateId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-slate-500">Loading Certificate...</div>;
  if (!certificate) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">Certificate Not Found</div>;

  const { student, course, issueDate, examScore } = certificate;
  const studentName = student?.name || "Valued Student";
  const courseTitle = course?.title || "Professional Training Program";
  const formattedDate = new Date(issueDate || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const verificationUrl = `${window.location.origin}/verify-certificate/${certificateId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = printRef.current;
    if (!element) return;
    
    const opt = {
      margin:       0,
      filename:     `Certificate-${studentName.replace(/\s+/g, '-')}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true, 
        backgroundColor: '#ffffff',
        windowWidth: 1122, 
        width: 1122        
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 font-sans selection:bg-red-100">
      
      {/* Load Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-cursive { font-family: 'Great Vibes', cursive; }
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}} />

      {/* Top Control Bar */}
      <div className="w-full max-w-[1122px] flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border border-slate-200 text-crmisa-accentNavy gap-4 rounded-t-2xl shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-crmisa-accentNavy hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-red-800">
            <CheckCircle2 className="w-5 h-5" />
            <span>Verified Certificate</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={handleDownloadPdf} className="flex-1 sm:flex-none justify-center px-5 py-2.5 bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center px-5 py-2.5 bg-[#5e0a17] hover:bg-[#4a0812] text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1122px] shadow-2xl sm:rounded-b-2xl overflow-x-auto print:shadow-none print:rounded-none print:m-0 print:w-full print:max-w-none bg-white">
        
        {/* Certificate Sheet Container */}
        <div ref={printRef} className="w-[1122px] h-[793px] shrink-0 bg-[#fffdfa] relative overflow-hidden flex items-center justify-center p-12 mx-auto">
          
          {/* Subtle Sparkle Background Layer (Converted to Inline SVG) */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20 pointer-events-none z-0">
            <defs>
              <pattern id="sparkles" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1.5" fill="#d4af37" opacity="0.8"/>
                <circle cx="20" cy="80" r="2" fill="#d4af37" opacity="0.5"/>
                <circle cx="80" cy="20" r="1.2" fill="#d4af37" opacity="0.9"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#sparkles)" />
          </svg>


          {/* Inner Geometric Gold Border */}
          <div className="absolute inset-10 border-2 border-[#d4af37] z-10 pointer-events-none">
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#d4af37]"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#d4af37]"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#d4af37]"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#d4af37]"></div>
          </div>
          <div className="absolute inset-[44px] border-[0.5px] border-[#d4af37] z-10 pointer-events-none opacity-50"></div>
          
          {/* Gold Starburst Badge */}
          <div className="absolute top-16 left-16 z-20 print:top-16 print:left-16 w-32 h-40">
            <img src="/batch.png" alt="Gold Badge" className="absolute inset-0 w-full h-full object-contain drop-shadow-xl" />
            
            <div className="absolute top-0 left-0 w-full h-full text-center" style={{ paddingTop: '32%' }}>
              <div className="text-[9px] font-bold text-[#713f12] uppercase tracking-widest mb-0 leading-none" style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.6)" }}>Score</div>
              <div className="text-2xl font-black text-[#422006] leading-none mt-1" style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.6)" }}>
                {examScore !== null && examScore !== undefined ? `${examScore}%` : "100%"}
              </div>
            </div>
          </div>
          
          {/* CONTENT AREA */}
          <div className="relative z-20 w-full h-full flex flex-col items-center py-8 justify-between">
            
            {/* Title Section */}
            <div className="flex flex-col items-center text-center mt-6">
              <h1 className="text-6xl font-playfair text-[#5e0a17] font-bold uppercase tracking-wide mb-1 drop-shadow-sm" style={{textShadow: "1px 1px 0px rgba(0,0,0,0.1)"}}>
                CERTIFICATE
              </h1>
              <h2 className="text-2xl font-playfair text-crmisa-accentNavy uppercase tracking-[0.2em] mb-10">
                Of Achievement
              </h2>
              
              <p className="text-lg font-playfair font-bold text-crmisa-accentNavy mb-6">
                This Certificate Is Proudly Presented To
              </p>
            </div>
            
            {/* Student Name */}
            <div className="flex flex-col items-center text-center w-full max-w-4xl px-4">
              <h3 className="text-7xl font-cursive text-[#5e0a17] mb-10 py-2">
                {studentName}
              </h3>
              
              <p className="text-lg font-playfair text-slate-700 leading-relaxed max-w-3xl mb-4 text-center">
                This certificate is given to <strong className="font-bold">{studentName}</strong> for their successful completion of the <strong className="font-bold">{courseTitle}</strong> program. It proves that they are highly competent and have demonstrated exceptional dedication in their field.
              </p>
            </div>
            
            {/* Footer Area with Date, Logo, QR, and Signature */}
            <div className="flex items-end justify-between w-full px-16 mt-auto">
              
              <div className="flex flex-col items-center justify-center -mb-4 z-10 relative">
                 <div className="p-1.5 bg-white border-2 border-[#d4af37] rounded-sm shadow-sm mb-2">
                   <img src={qrCodeUrl} alt="QR Code for Verification" className="w-20 h-20 object-contain" />
                 </div>
                 <p className="text-[12px] text-crmisa-navy font-mono mt-1 font-bold tracking-wider">ID: {certificateId}</p>
                 <p className="text-[14px] text-crmisa-navy font-playfair font-bold mt-1">Issued: {formattedDate}</p>
              </div>

              <div className="text-center w-56 pb-2 z-10 relative">
                <div className="border-b-[1.5px] border-slate-800 pb-1 mb-1 mt-12 font-playfair text-3xl font-bold uppercase tracking-wider text-[#5e0a17] text-base">
                  CRMISA
                </div>
                <p className="text-[12px] text-slate-700 font-playfair font-italic">Authorized Signature</p>
              </div>

              <div className="flex flex-col items-center justify-center -mb-4">
                 <img src="/image.png" alt="Platform Logo" className="h-24 object-contain" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}