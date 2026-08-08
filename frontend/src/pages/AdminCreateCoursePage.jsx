import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { CheckIcon, BookOpenIcon } from '../components/icons/Icons';

export default function AdminCreateCoursePage({ setActivePage, selectedCourseId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'import-export',
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
            category: response.data.category || 'import-export',
            level: response.data.level || 'beginner',
            price: response.data.price || 0,
            modules: response.data.modules || [],
            thumbnailUrl: response.data.thumbnailUrl || ''
          });
        } catch (err) {
          console.error("Failed to fetch course", err);
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
      const dataToSave = { ...formData, status: publish ? 'PUBLISHED' : 'DRAFT' };
      
      if (selectedCourseId) {
        await courseService.updateCourse(selectedCourseId, dataToSave);
        alert(`Course ${publish ? 'Published' : 'Updated'} Successfully!`);
      } else {
        await courseService.createCourse(dataToSave);
        alert(`Course Created Successfully!`);
      }
      setActivePage('admin-dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  // Simple curriculum builder
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: 'New Module', lessons: [] }]
    }));
  };

  const addLesson = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons.push({ title: 'New Lesson', videoUrl: '', duration: 0 });
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const updateModuleTitle = (index, title) => {
    const newModules = [...formData.modules];
    newModules[index].title = title;
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const updateLesson = (modIndex, lesIndex, field, value) => {
    const newModules = [...formData.modules];
    newModules[modIndex].lessons[lesIndex][field] = value;
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-14 animate-fade-in text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={() => setActivePage('admin-dashboard')} className="text-sm font-bold text-sky-600 hover:text-sky-700 mb-2 flex items-center gap-1">
              &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-slate-900">
              {selectedCourseId ? 'Edit Course' : 'Create New Course'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave(false)} 
              disabled={loading}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm shadow-sm hover:bg-slate-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={() => handleSave(true)} 
              disabled={loading}
              className="px-6 py-2.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-bold rounded-xl text-sm shadow-md transition-colors"
            >
              Publish Course
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Course Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                placeholder="e.g. Import & Export Masterclass"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Subtitle</label>
              <input 
                type="text" name="subtitle" value={formData.subtitle} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Price (R)</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Level</label>
                <select 
                  name="level" value={formData.level} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Builder */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900">Curriculum Builder</h2>
            <button 
              onClick={addModule}
              className="px-4 py-2 bg-sky-50 text-sky-600 font-bold text-xs rounded-lg hover:bg-sky-100 transition-colors"
            >
              + Add Module
            </button>
          </div>

          <div className="space-y-6">
            {formData.modules.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
                No modules yet. Click "Add Module" to start building your curriculum.
              </div>
            ) : (
              formData.modules.map((module, mIdx) => (
                <div key={mIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                    <input 
                      type="text" 
                      value={module.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                      className="bg-transparent font-bold text-slate-800 focus:outline-none w-full"
                    />
                    <button onClick={() => addLesson(mIdx)} className="text-xs font-bold text-sky-600 shrink-0 ml-4 hover:underline">
                      + Add Lesson
                    </button>
                  </div>
                  <div className="p-4 space-y-3 bg-white">
                    {module.lessons.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">No lessons in this module.</p>
                    ) : (
                      module.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <BookOpenIcon className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
                          <input 
                            type="text" placeholder="Lesson Title"
                            value={lesson.title}
                            onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm w-full"
                          />
                          <input 
                            type="text" placeholder="Video URL (e.g. YouTube ID)"
                            value={lesson.videoUrl}
                            onChange={(e) => updateLesson(mIdx, lIdx, 'videoUrl', e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm w-full"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
