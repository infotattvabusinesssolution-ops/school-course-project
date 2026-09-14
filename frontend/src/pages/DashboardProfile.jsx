import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { FileText, CheckCircle2, ChevronRight, X, Download, LogOut } from "lucide-react";

// ─── Invoice Modal ────────────────────────────────────────────────────────────
function InvoiceModal({ invoice, onClose }) {
  const handlePrint = () => {
    const content = document.getElementById('invoice-print-area').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 24px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 10px; }
        @media print { button { display: none; } }
      </style>
      </head><body>${content}</body></html>
    `);
    w.document.close();
    w.print();
  };

  if (!invoice) return null;
  const invoiceDate = new Date(invoice.paidAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-crmisa-navy" />
            <h2 className="font-bold text-crmisa-navy text-lg">Invoice {invoice.invoiceNumber}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-crmisa-navy text-white text-sm font-bold rounded-xl hover:bg-crmisa-accentNavy transition-colors">
              <Download className="w-4 h-4" /> Download / Print
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6" id="invoice-print-area">
          <div className="bg-crmisa-navy text-white p-6 rounded-t-xl flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-wider">CRMISA</h1>
              <p className="text-blue-200 text-sm mt-1">Academy of International Trade</p>
              <p className="text-blue-200 text-xs mt-1">admin@crmisa.co.za · crmisa.co.za</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Tax Invoice</p>
              <p className="text-xl font-black text-yellow-300">{invoice.invoiceNumber}</p>
              <p className="text-blue-200 text-sm mt-1">{invoiceDate}</p>
              <span className="inline-flex items-center gap-1 mt-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> PAID
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 border-x border-slate-200">
            <div>
              <p className="text-xs uppercase text-slate-400 tracking-widest font-bold mb-2">Billed To</p>
              <p className="font-bold text-slate-800">{invoice.student?.name || 'Student'}</p>
              <p className="text-slate-500 text-sm">{invoice.student?.email || ''}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400 tracking-widest font-bold mb-2">Issued By</p>
              <p className="font-bold text-crmisa-navy">CRMISA Academy</p>
              <p className="text-slate-500 text-sm">admin@crmisa.co.za</p>
            </div>
          </div>

          <div className="border-x border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-slate-500 font-bold">Item</th>
                  <th className="px-5 py-3 text-center text-xs uppercase tracking-wider text-slate-500 font-bold">Qty</th>
                  <th className="px-5 py-3 text-right text-xs uppercase tracking-wider text-slate-500 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                    </td>
                    <td className="px-5 py-4 text-center text-slate-600">{item.quantity || 1}</td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">ZAR {(item.unitPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-b-xl p-5 flex justify-between items-center">
            <span className="font-bold text-slate-600">Total Paid</span>
            <span className="text-2xl font-black text-emerald-600">ZAR {(invoice.totalAmount || 0).toFixed(2)}</span>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            For support: <span className="text-crmisa-navy font-semibold">admin@crmisa.co.za</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function DashboardProfile() {
  const { user, setUser, logout } = useAuth();

  // Profile fields
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Messages
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  // Invoices
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await api.get('/invoices/my');
        setInvoices(res.data.data || []);
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        setInvoicesLoading(false);
      }
    };
    loadInvoices();
  }, []);

  const showMsg = (setter, text, type) => {
    setter({ text, type });
    setTimeout(() => setter({ text: "", type: "" }), 4000);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showMsg(setProfileMsg, "Name is required", "error");
      return;
    }
    try {
      setIsSavingProfile(true);
      const res = await api.put("/users/profile", { name, phone });
      setUser({ ...user, name: res.data.data.name, phone: res.data.data.phone });
      showMsg(setProfileMsg, "Profile updated successfully!", "success");
    } catch (err) {
      showMsg(setProfileMsg, err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateProfilePhoto = async () => {
    if (!profilePhoto) return;
    try {
      setIsUploading(true);
      showMsg(setProfileMsg, "Uploading...", "info");
      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);
      const res = await api.put("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setUser({ ...user, avatar: res.data.data.avatar });
      showMsg(setProfileMsg, "Profile photo updated successfully.", "success");
      setProfilePhoto(null);
    } catch (err) {
      showMsg(setProfileMsg, err.response?.data?.message || "Failed to update photo", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) { showMsg(setPasswordMsg, "New passwords do not match", "error"); return; }
    if (!oldPassword || !newPassword) { showMsg(setPasswordMsg, "Please fill all password fields", "error"); return; }
    try {
      setIsUpdatingPassword(true);
      await api.put("/users/reset-password", { oldPassword, newPassword });
      showMsg(setPasswordMsg, "Password updated successfully!", "success");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      showMsg(setPasswordMsg, err.response?.data?.message || "Failed to reset password", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const MsgBox = ({ msg }) => msg.text ? (
    <div className={`p-3.5 rounded-xl text-sm font-semibold border ${
      msg.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' :
      msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
      'bg-slate-100 text-slate-700 border-slate-200'
    }`}>{msg.text}</div>
  ) : null;

  const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crmisa-navy focus:border-crmisa-navy outline-none text-sm transition-all bg-white";
  const labelCls = "block text-sm font-bold text-crmisa-navy mb-1.5";
  const TYPE_COLORS = {
    course: 'bg-blue-50 text-blue-700 border-blue-200',
    ebook: 'bg-purple-50 text-purple-700 border-purple-200',
    cart: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    reexam: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const TYPE_LABELS = { course: 'Course', ebook: 'E-book', cart: 'Cart', reexam: 'Re-exam' };

  return (
    <div className="max-w-4xl mx-auto space-y-10 font-sans pb-12 pt-0 sm:pt-4">

      {/* ── Personal Info ── */}
      <section className="space-y-6 pb-10 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-crmisa-navy">Personal Info</h3>
          <p className="text-sm text-slate-500 mt-1">Update your name, phone, and profile picture</p>
        </div>

        <MsgBox msg={profileMsg} />

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0">
            <img
              src={profilePhoto ? URL.createObjectURL(profilePhoto) : (user?.avatar && user.avatar.includes('http') && !user.avatar.includes('user-placeholder.png') ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=223e7c&color=fff&size=128`)}
              className="w-full h-full object-cover"
              alt="Avatar Preview"
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-crmisa-navy file:text-white hover:file:bg-crmisa-accentNavy cursor-pointer"
            />
            {profilePhoto && (
              <button
                onClick={handleUpdateProfilePhoto}
                disabled={isUploading}
                className="self-start px-5 py-2 bg-crmisa-navy text-white text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-crmisa-accentNavy transition-colors"
              >
                {isUploading ? "Uploading..." : "Save Photo"}
              </button>
            )}
          </div>
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your full name" />
          </div>
          <div>
            <label className={labelCls}>Phone Number <span className="text-slate-400 font-normal text-xs">(optional)</span></label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+27 XX XXX XXXX" />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" value={user?.email || ""} readOnly className={`${inputCls} bg-slate-50 text-slate-400 cursor-not-allowed`} />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="px-8 py-3 bg-crmisa-navy text-white text-sm font-bold rounded-xl hover:bg-crmisa-accentNavy transition-colors disabled:opacity-60"
        >
          {isSavingProfile ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* ── Security ── */}
      <section className="space-y-6 pb-10 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-crmisa-navy">Security</h3>
          <p className="text-sm text-slate-500 mt-1">Change your account password</p>
        </div>

        <MsgBox msg={passwordMsg} />

        <div className="space-y-4 max-w-md">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} />
          </div>
          <button
            onClick={handleResetPassword}
            disabled={isUpdatingPassword}
            className="w-full py-3 bg-crmisa-navy text-white text-sm font-bold rounded-xl hover:bg-crmisa-accentNavy transition-colors disabled:opacity-70"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </section>

      {/* ── Invoices ── */}
      <section className="space-y-5 pt-2">
        <div>
          <h3 className="text-xl font-black text-crmisa-navy">Billing History</h3>
          <p className="text-sm text-slate-500 mt-1">All your purchase invoices</p>
        </div>

        {invoicesLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-2 border-slate-200 border-t-crmisa-navy rounded-full animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-10 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-600">No invoices yet</p>
            <p className="text-slate-400 text-sm mt-1">Your purchase receipts will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all group"
                onClick={() => setSelectedInvoice(inv)}
              >
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-5 h-5 text-crmisa-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-crmisa-navy text-sm">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TYPE_COLORS[inv.type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {TYPE_LABELS[inv.type] || inv.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">
                    {new Date(inv.paidAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })} · {(inv.items || []).map(i => i.name).join(', ')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-crmisa-navy">ZAR {(inv.totalAmount || 0).toFixed(2)}</p>
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5 justify-end">
                    <CheckCircle2 className="w-3 h-3" /> Paid
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 shrink-0 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Sign Out (Mobile) ── */}
      <div className="md:hidden pt-4 pb-8">
        <button
          onClick={logout}
          className="w-full py-3.5 px-4 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
}
