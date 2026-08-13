import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminReferralTab() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    influencerName: '',
    referralCode: '',
    userDiscountPercentage: 10
  });

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/referrals');
      setReferrals(res.data.data || []);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/referrals', {
        ...formData,
        referralCode: formData.referralCode.toUpperCase()
      });
      setIsCreating(false);
      setFormData({ influencerName: '', referralCode: '', userDiscountPercentage: 10 });
      fetchReferrals();
    } catch (err) {
      console.error('Error creating referral:', err);
      alert(err.response?.data?.message || 'Failed to create referral code');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this referral code?')) return;
    try {
      await api.delete(`/referrals/${id}`);
      fetchReferrals();
    } catch (err) {
      console.error('Error deleting referral:', err);
      alert('Failed to delete referral code');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-crmisa-accentNavy">Influencer & Referral Management</h2>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {isCreating ? 'Cancel' : '+ Generate Referral Code'}
        </button>
      </div>
      
      {isCreating && (
        <div className="p-6 border-b border-slate-200 bg-blue-50/50">
          <h3 className="text-md font-bold text-crmisa-accentNavy mb-4">Generate New Referral Code</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Influencer / Partner Name</label>
              <input type="text" required value={formData.influencerName} onChange={e => setFormData({...formData, influencerName: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Referral Code</label>
              <input type="text" required value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. JOHN10" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount for User (%)</label>
              <input type="number" required min="1" max="100" value={formData.userDiscountPercentage} onChange={e => setFormData({...formData, userDiscountPercentage: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Save Referral Code</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading referrals...</div>
      ) : referrals.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No referral codes found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Influencer</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">User Discount</th>
                <th className="px-4 py-3 text-center">Total Uses</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map(referral => (
                <tr key={referral._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-crmisa-navy">{referral.influencerName}</td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">{referral.referralCode}</td>
                  <td className="px-4 py-3 text-slate-600">{referral.userDiscountPercentage}%</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                      {referral.totalUses} uses
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(referral._id)} className="text-red-600 hover:underline font-semibold">Delete</button>
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
