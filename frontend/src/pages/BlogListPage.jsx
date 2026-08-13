import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data.data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-crmisa-navy tracking-tight mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Insights, news, and resources from the world of import, export, and international trade.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">progress_activity</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-lg">
              No blogs available at the moment. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <Link to={`/blogs/${blog._id}`} key={blog._id} className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden h-full">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {blog.coverImage ? (
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200 group-hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-6xl">article</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-slate-500 mb-3 font-medium">
                      <span className="material-symbols-outlined text-[16px] mr-1">calendar_today</span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h2 className="text-xl font-bold text-crmisa-navy mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                      {blog.content.substring(0, 150)}...
                    </p>
                    <div className="mt-auto flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                      Read More <span className="material-symbols-outlined text-[20px] ml-1">arrow_right_alt</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
