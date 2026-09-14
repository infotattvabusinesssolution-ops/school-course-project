import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import api from '../lib/axios';
import ReactMarkdown from 'react-markdown';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <main className="flex-grow pt-32 pb-20 flex justify-center items-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">progress_activity</span>
        </main>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <main className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">article</span>
          <h1 className="text-2xl font-bold text-crmisa-accentNavy mb-4">{error || 'Blog not found'}</h1>
          <Link to="/blogs" className="text-blue-600 font-bold hover:underline flex items-center">
            <span className="material-symbols-outlined mr-1">arrow_back</span> Back to Blogs
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-grow pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/blogs" className="text-slate-500 hover:text-blue-600 font-medium flex items-center transition-colors w-fit">
              <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span> Back to all posts
            </Link>
          </div>

          <header className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-crmisa-navy tracking-tight mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center sm:justify-start text-slate-500 font-medium gap-4">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {blog.author && (
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[18px] mr-1">person</span>
                  {blog.author.name}
                </div>
              )}
            </div>
          </header>

          {blog.coverImage && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-md">
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
