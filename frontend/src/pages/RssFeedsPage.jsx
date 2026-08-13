import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function RssFeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await api.get('/feeds');
        if (Array.isArray(res.data)) {
          setFeeds(res.data);
        } else {
          console.error('API did not return an array:', res.data);
          setFeeds([]);
        }
      } catch (err) {
        console.error('Error fetching feeds:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-[130px] md:pt-[140px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 font-display">Trade & Export News</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Stay up to date with the latest global economic trends, developing country trade issues, and supply chain analysis.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
          </div>
        ) : feeds.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No feeds available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feeds.map((feed) => (
              <div key={feed._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-slate-100">
                <div className="aspect-video w-full bg-slate-100">
                  <iframe 
                    src={feed.url} 
                    title={feed.title}
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{feed.title}</h3>
                  <p className="text-slate-600 mb-4 flex-grow">{feed.description}</p>
                  <a 
                    href={feed.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mt-auto group"
                  >
                    View Source 
                    <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
