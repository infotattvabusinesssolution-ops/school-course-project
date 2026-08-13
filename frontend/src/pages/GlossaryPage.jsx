import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await api.get('/glossary');
        if (Array.isArray(res.data)) {
          setTerms(res.data);
        } else {
          console.error('API did not return an array:', res.data);
          setTerms([]);
        }
      } catch (err) {
        console.error('Error fetching glossary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const filteredTerms = terms.filter((t) => 
    t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-[130px] md:pt-[140px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 font-display">Glossary of Terms</h1>
          <p className="text-lg text-slate-600 mb-8">Understand key industry terms and definitions.</p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 sm:text-lg transition-all shadow-sm hover:shadow-md"
              placeholder="Search for a term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {filteredTerms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                No terms found matching "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTerms.map((t) => (
                  <div key={t._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-navy-900 mb-3 text-crmisa-navy">
                      {t.term}
                    </h3>
                    <div className="text-slate-600 leading-relaxed flex-grow">
                      {t.definition}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
