import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminNewsletterTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/newsletter');
      setSubscribers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      alert('Failed to remove subscriber');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Newsletter Subscribers</h2>
        <div className="text-sm font-semibold text-slate-500">{subscribers.length} total</div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No subscribers yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date Subscribed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map(sub => (
                <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{sub.name || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{sub.email}</td>
                  <td className="px-4 py-3 text-slate-600">{sub.phone || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(sub.subscribedAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:underline font-semibold">Remove</button>
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
