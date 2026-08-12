import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, ImageIcon, BookOpen, Users } from 'lucide-react';
import api from '../../lib/axios';

export default function AdminCourseTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: '',
    price: 0,
    status: 'DRAFT',
    bannerUrl: '',
    thumbnailUrl: ''
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/admin');
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      subtitle: course.subtitle || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || '',
      price: course.price || 0,
      status: course.status || 'DRAFT',
      bannerUrl: course.bannerUrl || '',
      thumbnailUrl: course.thumbnailUrl || ''
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const fd = new FormData();
      fd.append('image', file);
      
      const res = await api.post('/courses/upload-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.data && res.data.data.imageUrl) {
         setFormData(prev => ({
           ...prev,
           [field]: res.data.data.imageUrl
         }));
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${editingCourse._id}`, formData);
      setIsEditModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error("Failed to update course:", err);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) {
        console.error("Failed to delete course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (c.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage, edit, and publish your courses.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrollments</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No courses found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                          {(course.thumbnailUrl || course.defaultThumbnailUrl) ? (
                            <img src={course.thumbnailUrl || course.defaultThumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{course.title}</div>
                          <div className="text-xs text-slate-500 mt-1">{course.category} • {course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      R{course.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{course.totalEnrollments || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(course)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Course"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-white shadow-xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Edit Course
                </h3>
                <p className="text-sm text-slate-500 mt-1">Update course metadata, pricing, and imagery.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <span className="sr-only">Close modal</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="editCourseForm" onSubmit={handleUpdateCourse} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Course Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Course Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Classification & Pricing */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Classification & Pricing</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                      >
                        <option value="Full Certification">Full Certification</option>
                        <option value="Customs & Compliance">Customs & Compliance</option>
                        <option value="Finance & Costing">Finance & Costing</option>
                        <option value="Sourcing & Logistics">Sourcing & Logistics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Price (R)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Media Links */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Media Paths</h4>
                  
                  <div className="space-y-4">
                    {/* Thumbnail Upload */}
                    <div className="space-y-2 border border-slate-200 p-4 rounded-md">
                      <label className="text-sm font-bold text-slate-900">Thumbnail Image (4:3 Card Image)</label>
                      <div className="flex items-center gap-4">
                         <div className="w-24 aspect-[4/3] bg-slate-100 shrink-0 border border-slate-200">
                           {formData.thumbnailUrl ? (
                             <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                           ) : editingCourse?.defaultThumbnailUrl ? (
                             <img src={editingCourse.defaultThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-70" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-slate-300" /></div>
                           )}
                         </div>
                         <div className="flex flex-col gap-2 w-full">
                           <div className="flex gap-2 items-center">
                             <input type="file" id="thumbnail-upload" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnailUrl')} disabled={uploadingMedia} />
                             <label htmlFor="thumbnail-upload" className={`cursor-pointer px-4 py-1.5 bg-slate-100 border border-slate-300 text-sm font-medium hover:bg-slate-200 transition-colors ${uploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
                               {uploadingMedia ? 'Uploading...' : 'Upload New'}
                             </label>
                             {formData.thumbnailUrl && (
                               <button type="button" onClick={() => setFormData({...formData, thumbnailUrl: ''})} className="px-4 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors">
                                 Remove
                               </button>
                             )}
                           </div>
                           <p className="text-xs text-slate-500">
                             {formData.thumbnailUrl ? "Custom image uploaded." : (editingCourse?.defaultThumbnailUrl ? "Using default folder image." : "No image set.")}
                           </p>
                         </div>
                      </div>
                    </div>
                    
                    {/* Banner Upload */}
                    <div className="space-y-2 border border-slate-200 p-4 rounded-md">
                      <label className="text-sm font-bold text-slate-900">Banner Image (16:9 Details Header)</label>
                      <div className="flex items-center gap-4">
                         <div className="w-32 aspect-[16/9] bg-slate-100 shrink-0 border border-slate-200">
                           {formData.bannerUrl ? (
                             <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                           ) : editingCourse?.defaultBannerUrl ? (
                             <img src={editingCourse.defaultBannerUrl} alt="Banner" className="w-full h-full object-cover opacity-70" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-300" /></div>
                           )}
                         </div>
                         <div className="flex flex-col gap-2 w-full">
                           <div className="flex gap-2 items-center">
                             <input type="file" id="banner-upload" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'bannerUrl')} disabled={uploadingMedia} />
                             <label htmlFor="banner-upload" className={`cursor-pointer px-4 py-1.5 bg-slate-100 border border-slate-300 text-sm font-medium hover:bg-slate-200 transition-colors ${uploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
                               {uploadingMedia ? 'Uploading...' : 'Upload New'}
                             </label>
                             {formData.bannerUrl && (
                               <button type="button" onClick={() => setFormData({...formData, bannerUrl: ''})} className="px-4 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors">
                                 Remove
                               </button>
                             )}
                           </div>
                           <p className="text-xs text-slate-500">
                             {formData.bannerUrl ? "Custom image uploaded." : (editingCourse?.defaultBannerUrl ? "Using default folder image." : "No image set.")}
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Visibility</h4>
                  
                  <div className="space-y-1.5 max-w-xs">
                    <label className="text-sm font-medium text-slate-700">Course Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors text-sm font-medium"
                    >
                      <option value="DRAFT">DRAFT (Hidden)</option>
                      <option value="PUBLISHED">PUBLISHED (Visible)</option>
                    </select>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="editCourseForm"
                className="px-6 py-2 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
