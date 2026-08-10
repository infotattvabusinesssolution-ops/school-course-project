import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, ShieldCheck, Award, Download } from "lucide-react";
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

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  if (!certificate) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Certificate Not Found</div>;

  const { student, course, issueDate } = certificate;
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
      filename:     `CRMISA-Certificate-${certificateId}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 font-sans">
      
      {/* Top Control Bar (Hidden on Print & PDF generation) */}
      <div className="w-full max-w-[1056px] flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-900 text-white gap-4 rounded-t-2xl shadow-xl print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Award className="w-5 h-5 text-amber-400" />
            <span>CRMISA Official Certificate</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Page Container Wrapper (Screen styling) */}
      <div className="w-full max-w-[1056px] shadow-2xl sm:rounded-b-2xl overflow-hidden print:shadow-none print:rounded-none print:m-0 print:w-full print:max-w-none">
        
        {/* Certificate Sheet Container (PDF bounds) */}
        <div ref={printRef} className="w-full aspect-[297/210] bg-white relative overflow-hidden">
          
          {/* BACKGROUND SHAPES (Using SVG to ensure html2pdf compatibility) */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Top Edge Dark Blue */}
          <polygon points="45,0 100,0 100,15 40,15" fill="#1e3a8a" />
          
          {/* Top Right Light Blue */}
          <polygon points="85,0 100,0 100,30 80,30" fill="#3b82f6" />
          
          {/* Bottom Left Dark Blue */}
          <polygon points="0,35 28,40 15,100 0,100" fill="#1e3a8a" />
          
          {/* Bottom Left Light Blue Accent */}
          <polygon points="18,65 25,66 20,100 13,100" fill="#3b82f6" />
          
          {/* Right Edge Dark Blue */}
          <polygon points="88,30 100,30 100,100 75,100" fill="#1e3a8a" />
        </svg>

        {/* LOGO AREA */}
        <div className="absolute top-[8%] left-[6%] flex items-center gap-3 z-20">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-full h-full" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-widest">CRMISA</span>
        </div>

        {/* BADGE */}
        <div className="absolute left-[24%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-500 relative z-10">
            <div className="w-[70px] h-[70px] sm:w-[88px] sm:h-[88px] border-2 border-dashed border-blue-400 rounded-full flex flex-col items-center justify-center text-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700 mb-0.5 sm:mb-1" />
              <span className="text-[8px] sm:text-[10px] font-black text-blue-900 leading-tight tracking-widest">BEST</span>
              <span className="text-[8px] sm:text-[10px] font-black text-blue-900 leading-tight tracking-widest">AWARD</span>
            </div>
          </div>
          {/* Ribbons */}
          <div className="flex gap-1.5 sm:gap-2 -mt-3 sm:-mt-4 relative z-0">
            <svg className="w-4 h-8 sm:w-6 sm:h-12 drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polygon points="0,0 100,0 100,100 50,80 0,100" fill="#2563eb" />
            </svg>
            <svg className="w-4 h-8 sm:w-6 sm:h-12 drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polygon points="0,0 100,0 100,100 50,80 0,100" fill="#2563eb" />
            </svg>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-[10%] pr-[8%] pl-[15%]">
          <h1 className="text-3xl sm:text-5xl font-serif text-blue-700 font-bold uppercase tracking-widest mb-1 sm:mb-2 text-center">CERTIFICATE</h1>
          <h2 className="text-base sm:text-xl font-serif text-slate-700 uppercase tracking-[0.2em] mb-6 sm:mb-12 text-center">Of Achievement</h2>
          
          <p className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 sm:mb-6 text-center">Proudly Presented To :</p>
          
          <h3 className="text-3xl sm:text-6xl font-serif text-blue-600 font-medium mb-4 sm:mb-8 text-center px-4">
            {studentName}
          </h3>
          
          <p className="text-[9px] sm:text-[11px] text-slate-500 max-w-xl text-center leading-relaxed mb-8 sm:mb-16 px-4 sm:px-10">
            This certificate is awarded to signify that the recipient has demonstrated exceptional dedication 
            and proficiency. By meeting all rigorous academic and practical requirements set forth by the 
            Centre for Regional Merchandise & International Shipping Academy (CRMISA), the individual has 
            proven their capability and commitment to professional excellence.
            <br/><br/>
            (This certifies the successful completion of: <strong className="text-slate-800">{courseTitle}</strong>)
          </p>
          
          {/* Footer Area with Signatures and QR */}
          <div className="flex items-end justify-between w-full max-w-2xl mt-auto pb-[6%] px-4 sm:px-0">
            <div className="text-center w-24 sm:w-40">
              <div className="border-b-2 border-slate-400 pb-2 mb-2 font-bold text-slate-800 text-xs sm:text-sm">{formattedDate}</div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Date</p>
            </div>
            
            <div className="flex flex-col items-center justify-center -mb-2 sm:-mb-4">
               <div className="p-1 sm:p-1.5 bg-white border border-slate-200 rounded shadow-sm">
                 <img src={qrCodeUrl} alt="QR" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
               </div>
               <p className="text-[6px] sm:text-[8px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">ID: {certificateId}</p>
            </div>

            <div className="text-center w-24 sm:w-40">
              <div className="border-b-2 border-slate-400 pb-2 mb-2 font-bold text-slate-800 italic font-serif text-sm sm:text-lg leading-none">Director</div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Signature</p>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
