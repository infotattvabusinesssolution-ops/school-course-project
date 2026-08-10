import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';

export default function AdminCreateCoursePage() {
  const { id: selectedCourseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLessonIdx, setUploadingLessonIdx] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Full Certification',
    level: 'beginner',
    price: 0,
    modules: [],
    thumbnailUrl: ''
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
            modules: response.data.modules || [],
            thumbnailUrl: response.data.thumbnailUrl || ''
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
      
      // Clean up empty modules/lessons before saving and add the required 'order' fields
      const cleanedModules = formData.modules.map((m, mIdx) => ({
        ...m,
        order: mIdx + 1,
        lessons: m.lessons.filter(l => l.title.trim() !== '').map((l, lIdx) => ({
          ...l,
          order: lIdx + 1
        }))
      })).filter(m => m.title.trim() !== '');

      const dataToSave = { ...formData, modules: cleanedModules, status: publish ? 'PUBLISHED' : 'DRAFT' };
      
      if (selectedCourseId) {
        await courseService.updateCourse(selectedCourseId, dataToSave);
        alert(`Course ${publish ? 'Published' : 'Updated'} Successfully!`);
      } else {
        await courseService.createCourse(dataToSave);
        alert(`Course Created Successfully!`);
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

  const handleVideoUpload = async (e, mIdx, lIdx) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLessonIdx(`${mIdx}-${lIdx}`);
      setError('');
      const response = await courseService.uploadVideo(file);
      
      const updated = [...formData.modules];
      updated[mIdx].lessons[lIdx].videoUrl = response.data.videoUrl;
      setFormData(prev => ({ ...prev, modules: updated }));
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploadingLessonIdx(null);
    }
  };

  const handleLessonImageUpload = async (e, mIdx, lIdx) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLessonIdx(`img-${mIdx}-${lIdx}`);
      setError('');
      const response = await courseService.uploadImage(file);
      
      const updated = [...formData.modules];
      updated[mIdx].lessons[lIdx].thumbnailUrl = response.data.imageUrl;
      setFormData(prev => ({ ...prev, modules: updated }));
    } catch (err) {
      setError(err.message || 'Failed to upload lesson thumbnail');
    } finally {
      setUploadingLessonIdx(null);
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', lessons: [] }]
    }));
  };

  const updateModule = (mIdx, field, value) => {
    const updated = [...formData.modules];
    updated[mIdx][field] = value;
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  const removeModule = (mIdx) => {
    const updated = formData.modules.filter((_, idx) => idx !== mIdx);
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  const addLesson = (mIdx) => {
    const updated = [...formData.modules];
    updated[mIdx].lessons.push({ title: '', videoUrl: '', thumbnailUrl: '', duration: 0, isFreePreview: false });
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  const updateLesson = (mIdx, lIdx, field, value) => {
    const updated = [...formData.modules];
    updated[mIdx].lessons[lIdx][field] = value;
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  const removeLesson = (mIdx, lIdx) => {
    const updated = [...formData.modules];
    updated[mIdx].lessons = updated[mIdx].lessons.filter((_, idx) => idx !== lIdx);
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant h-20 w-full flex items-center px-4 md:px-8 z-50 sticky top-0">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-bold"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>
        <div className="ml-auto flex items-center gap-4">
          <button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-6 py-2 rounded-xl text-primary font-bold border border-primary hover:bg-primary-container/20 transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">publish</span>
            Publish
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="w-full mb-8">
          <h1 className="text-display-lg-mobile md:text-headline-md font-bold text-on-background mb-2">
            {selectedCourseId ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Complete the details below to build your course curriculum.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-6 md:p-8 relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error-container text-error rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-10">
            
            {/* Section 1: Basic Info */}
            <div className="flex flex-col gap-6 border-b border-outline-variant/20 pb-8">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface mb-2">Core Identity</h2>
                <p className="text-body-sm text-on-surface-variant">Provide the title, subtitle, and description.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold text-on-surface">Course Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-0 transition-all shadow-sm" 
                  placeholder="e.g., Import & Export Masterclass" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold text-on-surface">Course Subtitle</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-0 transition-all shadow-sm" 
                  placeholder="A brief summary of what students will achieve" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold text-on-surface">Course Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-0 resize-y min-h-[150px] bg-surface-container-lowest" 
                  placeholder="Explain what your course covers..."
                ></textarea>
              </div>
            </div>

            {/* Section 2: Taxonomy & Pricing */}
            <div className="flex flex-col gap-6 border-b border-outline-variant/20 pb-8">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface mb-2">Categorization & Pricing</h2>
                <p className="text-body-sm text-on-surface-variant">Set the level, category, and price.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-label-md font-bold text-on-surface">Category *</label>
                  <select 
                    name="category" 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary transition-all shadow-sm"
                  >
                    <option value="Full Certification">Full Certification</option>
                    <option value="Customs & Compliance">Customs & Compliance</option>
                    <option value="Finance & Costing">Finance & Costing</option>
                    <option value="Sourcing & Logistics">Sourcing & Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-md font-bold text-on-surface">Level *</label>
                  <select 
                    name="level" 
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary transition-all shadow-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-md font-bold text-on-surface">Price (R) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary transition-all shadow-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Media */}
            <div className="flex flex-col gap-6 border-b border-outline-variant/20 pb-8">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface mb-2">Course Image</h2>
                <p className="text-body-sm text-on-surface-variant">Upload a thumbnail for the course catalog.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-1/2 aspect-video bg-surface-container rounded-xl overflow-hidden border-2 border-dashed border-outline-variant flex flex-col items-center justify-center relative">
                  {formData.thumbnailUrl ? (
                    <img src={formData.thumbnailUrl} alt="Course Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-on-surface-variant p-4 text-center">
                      <span className="material-symbols-outlined text-[48px] text-outline">image</span>
                      <p className="text-body-sm">1920x1080 recommended</p>
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-surface-container/80 flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-label-md font-bold text-primary mt-2">Uploading...</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <label className="cursor-pointer px-4 py-2 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:bg-[#5ce8ab] transition-colors flex items-center justify-center gap-2 shadow-sm text-center">
                    <span className="material-symbols-outlined">upload_file</span>
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <div className="text-body-sm text-on-surface-variant max-w-xs">
                    File must be a JPEG, PNG, or WEBP, and less than 5MB.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Curriculum Builder */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-headline-sm font-bold text-on-surface mb-2">Curriculum Builder</h2>
                  <p className="text-body-sm text-on-surface-variant">Structure your course into modules and add lessons.</p>
                </div>
                <button 
                  onClick={addModule}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-bold hover:bg-[#adc6ff] transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Module
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                {formData.modules.map((module, mIdx) => (
                  <div key={mIdx} className="bg-surface border border-outline-variant/60 rounded-xl p-5 shadow-sm">
                    {/* Module Header */}
                    <div className="flex items-center gap-4 mb-5">
                      <span className="font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-md text-sm">Module {mIdx + 1}</span>
                      <input 
                        type="text" 
                        value={module.title}
                        onChange={(e) => updateModule(mIdx, 'title', e.target.value)}
                        placeholder="Module Title (e.g., Introduction)"
                        className="flex-grow bg-transparent border-b-2 border-outline-variant/50 px-2 py-1 font-bold text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                      <button 
                        onClick={() => removeModule(mIdx)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors bg-surface-container rounded-lg"
                        title="Delete Module"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                    {/* Lessons List */}
                    <div className="pl-2 sm:pl-8 flex flex-col gap-4">
                      {module.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 relative group">
                          <button 
                            onClick={() => removeLesson(mIdx, lIdx)}
                            className="absolute top-3 right-3 p-1.5 text-on-surface-variant hover:bg-error-container hover:text-error transition-all rounded-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>

                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="flex flex-col gap-3 flex-grow pr-8 w-full sm:w-auto">
                              <input 
                                type="text" 
                                value={lesson.title}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                                placeholder="Lesson Title"
                                className="font-bold bg-surface border border-outline-variant/50 px-3 py-2 rounded-lg focus:border-primary focus:outline-none w-full"
                              />
                              <label className="flex items-center gap-2 cursor-pointer w-max">
                                <input 
                                  type="checkbox"
                                  checked={lesson.isFreePreview}
                                  onChange={(e) => updateLesson(mIdx, lIdx, 'isFreePreview', e.target.checked)}
                                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
                                />
                                <span className="text-body-sm font-medium text-on-surface-variant">Free Preview</span>
                              </label>
                            </div>
                            
                            <div className="w-full sm:w-auto flex flex-col gap-2 mt-3 sm:mt-0">
                              {/* Video Upload */}
                              {lesson.videoUrl ? (
                                <div className="flex items-center justify-between gap-2 bg-secondary-container/20 text-secondary border border-secondary-container px-3 py-2 rounded-lg w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span className="text-body-sm font-bold">Video Ready</span>
                                  </div>
                                  <label className="cursor-pointer text-[12px] underline hover:text-primary transition-colors ml-2 shrink-0">
                                    Change
                                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(e, mIdx, lIdx)} />
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  {uploadingLessonIdx === `${mIdx}-${lIdx}` ? (
                                    <div className="flex items-center justify-center gap-2 bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-primary w-full">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                      <span className="text-body-sm font-bold">Uploading...</span>
                                    </div>
                                  ) : (
                                    <label className="flex items-center justify-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-on-surface-variant font-medium w-full">
                                      <span className="material-symbols-outlined text-[16px]">movie</span>
                                      <span className="text-body-sm">Upload Video</span>
                                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(e, mIdx, lIdx)} />
                                    </label>
                                  )}
                                </div>
                              )}

                              {/* Thumbnail Upload */}
                              {lesson.thumbnailUrl ? (
                                <div className="flex items-center justify-between gap-2 bg-primary-container/20 text-primary border border-primary-container px-3 py-2 rounded-lg w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">image</span>
                                    <span className="text-body-sm font-bold truncate max-w-[80px]">Thumb Ready</span>
                                  </div>
                                  <label className="cursor-pointer text-[12px] underline hover:text-primary transition-colors ml-2 shrink-0">
                                    Change
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLessonImageUpload(e, mIdx, lIdx)} />
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  {uploadingLessonIdx === `img-${mIdx}-${lIdx}` ? (
                                    <div className="flex items-center justify-center gap-2 bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-primary w-full">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                      <span className="text-body-sm font-bold">Uploading...</span>
                                    </div>
                                  ) : (
                                    <label className="flex items-center justify-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors text-on-surface-variant font-medium w-full">
                                      <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                                      <span className="text-body-sm">Thumbnail</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLessonImageUpload(e, mIdx, lIdx)} />
                                    </label>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button 
                        onClick={() => addLesson(mIdx)}
                        className="flex items-center justify-center gap-2 self-start px-4 py-2 border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary/5 rounded-lg transition-colors mt-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add Lesson
                      </button>
                    </div>
                  </div>
                ))}

                {formData.modules.length === 0 && (
                  <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-4">account_tree</span>
                    <h3 className="font-bold text-on-surface text-headline-sm mb-2">Curriculum is empty</h3>
                    <p className="text-on-surface-variant text-body-lg">Build out your course by adding modules and lessons.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
