import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminCouponTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    maxUses: 100
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', {
        ...formData,
        code: formData.code.toUpperCase()
      });
      setIsCreating(false);
      setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', maxUses: 100 });
      fetchCoupons();
    } catch (err) {
      console.error('Error creating coupon:', err);
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-crmisa-accentNavy">Coupons Management</h2>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {isCreating ? 'Cancel' : '+ Create Coupon'}
        </button>
      </div>
      
      {isCreating && (
        <div className="p-6 border-b border-slate-200 bg-blue-50/50">
          <h3 className="text-md font-bold text-crmisa-accentNavy mb-4">Create New Coupon</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Coupon Code</label>
              <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. SUMMER25" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Type</label>
              <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (R)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Value</label>
              <input type="number" required min="1" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. 25" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
              <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Max Uses</label>
              <input type="number" required min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Save Coupon</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No coupons found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-crmisa-navy">{coupon.code}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `R ${coupon.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{coupon.currentUses} / {coupon.maxUses}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
