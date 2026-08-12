import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminBlogTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', content: '', coverImage: '', isPublished: true });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/courses/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentBlog({ ...currentBlog, coverImage: res.data.data.imageUrl });
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentBlog._id) {
        await api.put(`/blogs/${currentBlog._id}`, currentBlog);
      } else {
        await api.post('/blogs', currentBlog);
      }
      setIsEditing(false);
      setCurrentBlog({ title: '', content: '', coverImage: '', isPublished: true });
      fetchBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">{currentBlog._id ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input 
              type="text" 
              value={currentBlog.title} 
              onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cover Image</label>
            <div className="flex flex-col gap-3">
              {currentBlog.coverImage && (
                <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <img src={currentBlog.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setCurrentBlog({...currentBlog, coverImage: ''})}
                    className="absolute top-1 right-1 bg-white/80 text-red-600 rounded-full p-1 hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploadingImage && <span className="text-sm font-semibold text-blue-600 flex items-center gap-1"><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Uploading...</span>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Content (Markdown supported)</label>
            <textarea 
              value={currentBlog.content} 
              onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={currentBlog.isPublished}
              onChange={(e) => setCurrentBlog({...currentBlog, isPublished: e.target.checked})}
              id="isPublished"
            />
            <label htmlFor="isPublished" className="text-sm font-semibold">Publish immediately</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-headline-sm font-bold text-slate-900">Blog Posts</h2>
        <button 
          onClick={() => { setCurrentBlog({ title: '', content: '', coverImage: '', isPublished: true }); setIsEditing(true); }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span> Create Post
        </button>
      </div>
      
      {loading ? (
        <div className="py-20 flex justify-center">
          <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-white border border-slate-200 border-dashed">
          No blogs found. Create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map(blog => (
            <div 
              key={blog._id} 
              className="bg-white border border-slate-200 flex flex-col h-full hover:border-slate-400 transition-colors group shadow-sm hover:shadow-md"
            >
              {/* 4:3 Aspect Ratio Image Container */}
              <div className="relative w-full aspect-[4/3] bg-slate-100 shrink-0 border-b border-slate-200 overflow-hidden">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300">image</span>
                  </div>
                )}
                {/* Floating Status Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wide border border-white/50 shadow-sm text-slate-900">
                  {blog.isPublished ? 'PUBLISHED' : 'DRAFT'}
                </div>
              </div>
              
              {/* Content Container */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {blog.title}
                </h3>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}
                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1 ml-auto"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
