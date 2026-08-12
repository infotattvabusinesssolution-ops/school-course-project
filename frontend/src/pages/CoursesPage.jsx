import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, ChevronRight, Check, BarChart } from 'lucide-react';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';

export default function CoursesPage({ onOpenEnrol, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, addToCart } = useCart();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentsMap, setEnrollmentsMap] = useState(new Map());
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getPublishedCourses();
        setCourses(res.data.courses || []);

        if (user) {
          try {
            const enrollRes = await api.get('/student/courses');
            const map = new Map();
            (enrollRes.data.data || []).forEach(e => {
              const cId = e.course?._id || e.course;
              map.set(cId, {
                isEnrolled: true,
                isCompleted: e.status === "COMPLETED" || e.completionPercentage === 100
              });
            });
            setEnrollmentsMap(map);
          } catch (err) {
            console.error("Failed to load student enrollments:", err);
          }
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ["All", "Full Certification", "Customs & Compliance", "Finance & Costing", "Sourcing & Logistics", "other"];
  const levels = ["All", "beginner", "intermediate", "advanced"];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
      const matchesSearch = (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                            (c.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchesCat && matchesLevel && matchesSearch;
    });
  }, [courses, selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      
      {/* Page Header (Flat, Light) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Explore Our Courses
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Master international trade, logistics, and supply chain management with our industry-leading certification programs.
          </p>
        </div>
        
        {/* Top Action Bar: Search & Filter Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-200 pb-6">
          {/* Search */}
          <div className="relative w-full sm:w-96 border border-slate-300 bg-white">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-slate-900 focus:ring-0 outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Filter Button & Dropdown */}
          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-medium text-sm transition-colors hover:bg-slate-800"
            >
              <Filter className="w-4 h-4" />
              Filters {(selectedCategory !== 'All' || selectedLevel !== 'All') && '(Active)'}
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white border border-slate-200 z-50 shadow-sm">
                <div className="p-4 space-y-6">
                  
                  {/* Category Selection */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                            selectedCategory === cat 
                              ? 'bg-slate-100 text-slate-900 font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{cat === 'other' ? 'Other' : cat}</span>
                          {selectedCategory === cat && <Check className="w-4 h-4 text-slate-900" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Level Selection */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skill Level</h3>
                    <div className="space-y-1">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm capitalize transition-colors ${
                            selectedLevel === lvl 
                              ? 'bg-slate-100 text-slate-900 font-semibold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{lvl}</span>
                          {selectedLevel === lvl && <Check className="w-4 h-4 text-slate-900" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  {(selectedCategory !== 'All' || selectedLevel !== 'All') && (
                    <div className="pt-2">
                      <button
                        onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); }}
                        className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-slate-50 p-12 text-center border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
            <Search className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No courses found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); setSearchQuery(''); setIsFilterOpen(false); }}
              className="px-6 py-2 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
            >
              Reset All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const enrollment = enrollmentsMap.get(course._id);
              const isEnrolled = !!enrollment;
              const isCompleted = enrollment?.isCompleted;

              return (
              <div 
                key={course._id}
                className="bg-white border border-slate-200 flex flex-col h-full cursor-pointer hover:border-slate-400 transition-colors group shadow-sm hover:shadow-md"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                {/* 4:3 Aspect Ratio Image Container */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 shrink-0 border-b border-slate-200 overflow-hidden">
                  {(course.thumbnailUrl || course.defaultThumbnailUrl) ? (
                    <img 
                      src={course.thumbnailUrl || course.defaultThumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  {/* Floating Level Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-slate-900 uppercase tracking-wide border border-white/50 shadow-sm">
                    {course.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <BarChart className="w-4 h-4 text-slate-400" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{course.modules?.length || 0} Modules</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  {course.subtitle && (
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      {course.subtitle}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-slate-900">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
                    <span className="text-sm text-slate-500 ml-1">({course.reviewCount || 0})</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Footer Actions */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-slate-900">R{course.price}</span>
                    
                    {isCompleted ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course-player/${course._id}?tab=review`);
                        }}
                        className="bg-amber-100 border border-amber-200 text-amber-800 hover:bg-amber-200 px-4 py-2 text-sm font-bold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        <span>Review</span>
                      </button>
                    ) : isEnrolled ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course-player/${course._id}`);
                        }}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenEnrol) onOpenEnrol(course.title, `R${course.price}`, course._id);
                          }}
                          className="bg-white border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Enrol</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const inCart = cartItems.some(item => item.id === course._id && item.type === 'course');
                            if (!inCart) {
                              addToCart({ id: course._id, type: 'course', title: course.title, price: course.price, image: course.thumbnailUrl || course.defaultThumbnailUrl });
                            } else {
                              navigate('/cart');
                            }
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 text-sm font-semibold transition-colors border border-slate-300 flex items-center justify-center"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {cartItems.some(item => item.id === course._id && item.type === 'course') ? 'shopping_bag' : 'add_shopping_cart'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
