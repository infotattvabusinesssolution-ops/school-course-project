import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminRssTab = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFeed, setCurrentFeed] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await api.get('/feeds');
      setFeeds(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load feeds');
      setLoading(false);
    }
  };

  const handleOpenModal = (feed = null) => {
    if (feed) {
      setCurrentFeed(feed);
      setIsEditMode(true);
    } else {
      setCurrentFeed({ title: '', description: '', url: '' });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFeed({ title: '', description: '', url: '' });
    setIsEditMode(false);
  };

  const handleSaveFeed = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/feeds/${currentFeed._id}`, currentFeed);
      } else {
        await api.post('/feeds', currentFeed);
      }
      fetchFeeds();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save feed');
    }
  };

  const handleDeleteFeed = async (id) => {
    if (window.confirm('Are you sure you want to delete this feed?')) {
      try {
        await api.delete(`/feeds/${id}`);
        fetchFeeds();
      } catch (err) {
        console.error(err);
        alert('Failed to delete feed');
      }
    }
  };

  if (loading) return <div>Loading feeds...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">RSS Feeds Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add New RSS Feed</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Title</th>
              <th className="p-4 font-semibold text-slate-700">URL</th>
              <th className="p-4 font-semibold text-slate-700">Description</th>
              <th className="p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeds.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">No feeds found.</td>
              </tr>
            ) : (
              feeds.map((feed) => (
                <tr key={feed._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-medium">{feed.title}</td>
                  <td className="p-4 text-slate-600">
                    <a href={feed.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {feed.url.substring(0, 50)}{feed.url.length > 50 ? '...' : ''}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate" title={feed.description}>
                    {feed.description}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(feed)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteFeed(feed._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Edit RSS Feed' : 'Add New RSS Feed'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSaveFeed} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={currentFeed.title}
                    onChange={(e) => setCurrentFeed({ ...currentFeed, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    placeholder="E.g., World Trade Organization News"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL (Must include http/https)</label>
                  <input
                    type="url"
                    required
                    value={currentFeed.url}
                    onChange={(e) => setCurrentFeed({ ...currentFeed, url: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    placeholder="https://example.com/feed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={currentFeed.description}
                    onChange={(e) => setCurrentFeed({ ...currentFeed, description: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    placeholder="Brief description of this feed..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
                >
                  {isEditMode ? 'Save Changes' : 'Add Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRssTab;
