import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminGlossaryTab = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTerm, setCurrentTerm] = useState({ term: '', definition: '' });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await api.get('/glossary');
      setTerms(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load glossary terms');
      setLoading(false);
    }
  };

  const handleOpenModal = (termData = null) => {
    if (termData) {
      setCurrentTerm(termData);
      setIsEditMode(true);
    } else {
      setCurrentTerm({ term: '', definition: '' });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTerm({ term: '', definition: '' });
    setIsEditMode(false);
  };

  const handleSaveTerm = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/glossary/${currentTerm._id}`, currentTerm);
      } else {
        await api.post('/glossary', currentTerm);
      }
      fetchTerms();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save glossary term');
    }
  };

  const handleDeleteTerm = async (id) => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      try {
        await api.delete(`/glossary/${id}`);
        fetchTerms();
      } catch (err) {
        console.error(err);
        alert('Failed to delete term');
      }
    }
  };

  if (loading) return <div>Loading glossary...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Glossary Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add New Glossary</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="p-4 font-semibold text-slate-700 w-1/4">Term</th>
              <th className="p-4 font-semibold text-slate-700 w-2/4">Definition</th>
              <th className="p-4 font-semibold text-slate-700 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {terms.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-slate-500">No terms found.</td>
              </tr>
            ) : (
              terms.map((t) => (
                <tr key={t._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-medium">{t.term}</td>
                  <td className="p-4 text-slate-600">{t.definition}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(t)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(t._id)}
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
                {isEditMode ? 'Edit Term' : 'Add New Term'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSaveTerm} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Term</label>
                  <input
                    type="text"
                    required
                    value={currentTerm.term}
                    onChange={(e) => setCurrentTerm({ ...currentTerm, term: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    placeholder="E.g., Bill of Lading (BOL)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Definition</label>
                  <textarea
                    required
                    rows="4"
                    value={currentTerm.definition}
                    onChange={(e) => setCurrentTerm({ ...currentTerm, definition: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    placeholder="Enter the definition..."
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
                  {isEditMode ? 'Save Changes' : 'Add Term'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGlossaryTab;
