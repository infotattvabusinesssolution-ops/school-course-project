import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { FileText, Image as ImageIcon, Film, CheckCircle2, ChevronLeft, Save, Send, Award } from 'lucide-react';

export default function AdminCreateCoursePage() {
  const { id: selectedCourseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Full Certification',
    level: 'beginner',
    price: 0,
    thumbnailUrl: '',
    pdfGuideUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (selectedCourseId) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await courseService.getCourseById(selectedCourseId);
          setFormData({
            title: response.data.title || '',
            subtitle: response.data.subtitle || '',
            description: response.data.description || '',
            category: response.data.category || 'Full Certification',
            level: response.data.level || 'beginner',
            price: response.data.price || 0,
            thumbnailUrl: response.data.thumbnailUrl || '',
            pdfGuideUrl: response.data.pdfGuideUrl || '',
            videoUrl: response.data.videoUrl || ''
          });
        } catch (err) {
          setError(err.message || "Failed to fetch course details");
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [selectedCourseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (publish = false) => {
    try {
      setLoading(true);
      setError('');
      
      const dataToSave = { ...formData, status: publish ? 'PUBLISHED' : 'DRAFT' };
      
      let createdCourseId = selectedCourseId;

      if (selectedCourseId) {
        await courseService.updateCourse(selectedCourseId, dataToSave);
        alert(`Course ${publish ? 'Published' : 'Updated'} Successfully!`);
      } else {
        const response = await courseService.createCourse(dataToSave);
        createdCourseId = response.data._id;
        alert(`Course Created Successfully!`);
      }
      
      if (publish) {
        localStorage.setItem("adminActiveTab", "6");
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError('');
      const response = await courseService.uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnailUrl: response.data.imageUrl }));
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingPdf(true);
      setError('');
      const response = await courseService.uploadPdf(file);
      setFormData(prev => ({ ...prev, pdfGuideUrl: response.data.pdfUrl }));
    } catch (err) {
      setError(err.message || 'Failed to upload PDF guide');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setError('');
      const response = await courseService.uploadVideo(file);
      setFormData(prev => ({ ...prev, videoUrl: response.data.videoUrl }));
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-crmisa-navy text-white h-20 w-full flex items-center px-4 md:px-8 z-50 sticky top-0 shadow-md">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-bold text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="ml-auto flex items-center gap-4">
          <button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-6 py-2 rounded-xl text-white font-bold border border-white hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold shadow-sm hover:bg-blue-400 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="w-full mb-8 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-crmisa-navy mb-2 tracking-tight">
            {selectedCourseId ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-slate-500 font-medium">
            Complete the details below to build your course resources.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 md:p-10 relative overflow-hidden border border-slate-100">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-12">
            
            {/* Section 1: Basic Info */}
            <div className="flex flex-col gap-6">
              <div className="border-b-2 border-crmisa-lightBlue pb-3">
                <h2 className="text-xl font-extrabold text-crmisa-navy uppercase tracking-wider">Core Identity</h2>
                <p className="text-slate-500 text-sm mt-1">Provide the title, subtitle, and description.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Course Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                  placeholder="e.g., Import & Export Masterclass" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Course Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                  placeholder="A brief summary of what students will achieve" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Course Description <span className="text-red-500">*</span></label>
                <textarea 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y" 
                  placeholder="Explain what your course covers..."
                ></textarea>
              </div>
            </div>

            {/* Section 2: Taxonomy & Pricing */}
            <div className="flex flex-col gap-6">
              <div className="border-b-2 border-crmisa-lightBlue pb-3">
                <h2 className="text-xl font-extrabold text-crmisa-navy uppercase tracking-wider">Categorization & Pricing</h2>
                <p className="text-slate-500 text-sm mt-1">Set the level, category, and price.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
                  <select 
                    name="category" 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="Full Certification">Full Certification</option>
                    <option value="Customs & Compliance">Customs & Compliance</option>
                    <option value="Finance & Costing">Finance & Costing</option>
                    <option value="Sourcing & Logistics">Sourcing & Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Level <span className="text-red-500">*</span></label>
                  <select 
                    name="level" 
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Price (R) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Media & Resources */}
            <div className="flex flex-col gap-6">
              <div className="border-b-2 border-crmisa-lightBlue pb-3">
                <h2 className="text-xl font-extrabold text-crmisa-navy uppercase tracking-wider">Media & Resources</h2>
                <p className="text-slate-500 text-sm mt-1">Upload course thumbnail, main video, and a downloadable PDF Guide.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Thumbnail Upload */}
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-full aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center relative">
                    {formData.thumbnailUrl ? (
                      <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">1920x1080 recommended</span>
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="text-sm font-bold text-blue-500 mt-2">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-crmisa-navy text-white font-bold rounded-xl hover:bg-crmisa-accentNavy transition-colors flex items-center justify-center gap-2 shadow-md w-full text-xs">
                    <ImageIcon className="w-4 h-4" />
                    {formData.thumbnailUrl ? 'Change Cover' : 'Upload Cover'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="text-xs text-slate-500 mt-3">JPEG, PNG (Max 5MB)</p>
                </div>

                {/* Main Video Upload */}
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-full aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center relative">
                    {formData.videoUrl ? (
                      <div className="text-green-600 flex flex-col items-center p-4">
                        <CheckCircle2 className="w-12 h-12 mb-2 text-green-500" />
                        <span className="font-bold">Video Ready</span>
                      </div>
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center p-4">
                        <Film className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">Add course video</span>
                      </div>
                    )}
                    {uploadingVideo && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="text-sm font-bold text-blue-500 mt-2">Uploading Video...</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-indigo-50 text-indigo-600 font-bold border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 w-full text-xs">
                    <Film className="w-4 h-4" />
                    {formData.videoUrl ? 'Change Video' : 'Upload Video'}
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                  <p className="text-xs text-slate-500 mt-3">MP4, WEBM (Max 100MB)</p>
                </div>

                {/* PDF Guide Upload */}
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-full aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center relative">
                    {formData.pdfGuideUrl ? (
                      <div className="text-green-600 flex flex-col items-center p-4">
                        <CheckCircle2 className="w-12 h-12 mb-2 text-green-500" />
                        <span className="font-bold">PDF Ready</span>
                        <a href={formData.pdfGuideUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1">Preview PDF</a>
                      </div>
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center p-4">
                        <FileText className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">Add PDF guide</span>
                      </div>
                    )}
                    {uploadingPdf && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="text-sm font-bold text-blue-500 mt-2">Uploading PDF...</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 font-bold border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 w-full text-xs">
                    <FileText className="w-4 h-4" />
                    {formData.pdfGuideUrl ? 'Change PDF' : 'Upload PDF'}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                  <p className="text-xs text-slate-500 mt-3">PDF files only (Max 20MB)</p>
                </div>

              </div>
            </div>

            {/* Certificate / Exam Info Message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10">
                <Award className="text-blue-600 w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="font-extrabold text-blue-900 text-lg">Configure Exam for Certificate</h3>
                <p className="text-blue-800/80 font-medium text-sm mt-1 max-w-2xl leading-relaxed">
                  After publishing, you will be automatically redirected to create an exam for this course. Students must pass the exam to claim their completion certificate.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
