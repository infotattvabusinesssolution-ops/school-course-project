import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { downloadPdf } from "../utils/downloadHelper";

export default function DashboardEbooks() {
  const { purchasedEbooks } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchasedEbooks.length === 0 ? (
        <div className="col-span-full text-center py-20 border border-slate-200 bg-white rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Purchased E-Books</h3>
          <p className="text-slate-500 mb-6 text-sm">You haven't purchased any digital handbooks yet.</p>
          <button onClick={() => navigate("/ebooks")} className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl transition-colors hover:bg-slate-800">
            Browse E-Book Store
          </button>
        </div>
      ) : (
        purchasedEbooks.map((purchase) => {
          const book = purchase.ebook || {};
          return (
            <div key={purchase._id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex gap-4 items-start">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-22 bg-slate-900 text-white font-bold text-xs flex items-center justify-center rounded-lg p-2 text-center flex-shrink-0">PDF</div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Unlocked</span>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{book.title || "Trade E-Book"}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Purchased: {new Date(purchase.purchasedAt || purchase.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500">Paid: <span className="font-black text-slate-900">R{purchase.amountPaid || book.price}</span></div>
                {book.pdfUrl ? (
                  <a href={book.pdfUrl} download className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5">
                    Download PDF
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold italic">PDF Processing</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
