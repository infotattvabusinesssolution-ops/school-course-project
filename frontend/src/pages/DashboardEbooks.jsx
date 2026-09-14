import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BookOpen, Download, LockKeyhole } from "lucide-react";

export default function DashboardEbooks() {
  const { purchasedEbooks } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-crmisa-navy flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-500" />
            My Digital Library
          </h2>
          <p className="text-sm text-slate-500 mt-1">Access and download your purchased handbooks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {purchasedEbooks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-slate-300 bg-slate-50 rounded-3xl">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-crmisa-navy mb-2">Your library is empty</h3>
            <p className="text-slate-500 mb-8 max-w-md text-center">
              You haven't purchased any digital handbooks yet. Explore our collection of premium trade and logistics guides.
            </p>
            <button 
              onClick={() => navigate("/ebook")} 
              className="px-8 py-3.5 bg-crmisa-navy text-white font-bold rounded-xl shadow-lg shadow-crmisa-navy/20 hover:bg-crmisa-accentNavy hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Browse E-Book Store
            </button>
          </div>
        ) : (
          purchasedEbooks.map((purchase) => {
            const book = purchase.ebook || {};
            const purchasedDate = new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            });

            return (
              <div 
                key={purchase._id} 
                className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
              >
                {/* Decorative Header Banner */}
                <div className="h-24 bg-gradient-to-r from-crmisa-navy to-crmisa-accentNavy w-full absolute top-0 left-0 z-0 opacity-10"></div>
                
                <div className="p-6 relative z-10 flex-1 flex flex-col">
                  <div className="flex gap-5 items-start mb-6">
                    <div className="relative shrink-0 shadow-lg rounded-xl overflow-hidden group-hover:-translate-y-1 transition-transform duration-300">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-24 h-32 object-cover" 
                        />
                      ) : (
                        <div className="w-24 h-32 bg-slate-800 text-white font-bold text-lg flex items-center justify-center">
                          PDF
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                    </div>
                    
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                        <LockKeyhole className="w-3 h-3" /> Unlocked
                      </div>
                      <h3 className="font-bold text-lg text-crmisa-navy leading-tight line-clamp-3">
                        {book.title || "Trade E-Book"}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Purchased {purchasedDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Amount Paid</span>
                      <span className="font-black text-crmisa-navy text-lg">R{purchase.amountPaid || book.price}</span>
                    </div>
                    
                    {book.pdfUrl ? (
                      <a 
                        href={book.pdfUrl} 
                        download 
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    ) : (
                      <div className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs border border-slate-200">
                        Processing PDF
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
