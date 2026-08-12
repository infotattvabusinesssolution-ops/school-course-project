import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, ChevronRight, BarChart } from 'lucide-react';
import { courseService } from '../../services/courseService';

import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function CourseModulesSection({ onOpenEnrol }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [allCourses, setAllCourses] = useState([]);
  const [enrollmentsMap, setEnrollmentsMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  // Helper to shuffle array
  const getShuffledCourses = (courseList) => {
    if (!courseList || courseList.length === 0) return [];
    return [...courseList].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getPublishedCourses();
        const availableCourses = res.data.courses || [];
        setAllCourses(getShuffledCourses(availableCourses));
        
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
            console.error("Failed to load student enrollments for section:", err);
          }
        }
      } catch (error) {
        console.error("Failed to load courses for section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Automatic shuffle every 10 minutes (600000 ms)
  useEffect(() => {
    if (allCourses.length > 0) {
      const interval = setInterval(() => {
        setAllCourses(prev => getShuffledCourses(prev));
      }, 600000);
      return () => clearInterval(interval);
    }
  }, [allCourses]);

  if (loading) {
    return (
      <section className="py-12 lg:py-24 bg-white flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </section>
    );
  }

  if (allCourses.length === 0) return null;

  // Render a single card
  const renderCard = (course, isMobileTopCard = false) => {
    const enrollment = enrollmentsMap.get(course._id);
    const isEnrolled = !!enrollment;
    const isCompleted = enrollment?.isCompleted;

    return (
      <div 
        key={course._id}
        className={`${isMobileTopCard ? 'col-span-2' : 'col-span-1'} w-full md:w-[350px] lg:w-[400px] shrink-0 bg-white border border-slate-200 flex flex-col h-full cursor-pointer hover:border-slate-300 transition-all duration-300 group shadow-sm hover:shadow-xl overflow-hidden`}
        onClick={() => navigate(`/courses/${course._id}`)}
      >
        {/* 4:3 Aspect Ratio Image Container */}
        <div className="relative w-full aspect-[4/3] bg-slate-100 shrink-0 border-b border-slate-200 overflow-hidden">
          {(course.thumbnailUrl || course.defaultThumbnailUrl) ? (
            <img 
              src={course.thumbnailUrl || course.defaultThumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <BookOpen className="w-10 h-10 opacity-50" />
              <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">No Thumbnail</span>
            </div>
          )}
          {/* Floating Category Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
              {course.category}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-6 flex flex-col flex-1">
          {/* Meta info */}
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-slate-500 mb-2 sm:mb-3 uppercase tracking-wider">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BarChart className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <span>{course.modules?.length || 0} Modules</span>
            </div>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          {course.subtitle && (
            <p className="hidden sm:block text-sm font-semibold text-slate-700 mb-3 line-clamp-1">
              {course.subtitle}
            </p>
          )}
          
          <div className="flex items-center gap-1 mb-2 sm:mb-4 text-amber-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            <span className="text-xs sm:text-sm font-bold text-slate-900">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
            <span className="text-xs sm:text-sm text-slate-500 ml-1">({course.reviewCount || 0})</span>
          </div>

          <p className="hidden sm:block text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
            {course.description}
          </p>
          
          <p className="sm:hidden text-xs text-slate-600 line-clamp-2 mb-3 flex-1">
            {course.description}
          </p>

          {/* Footer Actions */}
          <div className="pt-3 sm:pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
            <span className="text-lg sm:text-2xl font-bold text-slate-900">R{course.price}</span>
            
            {isCompleted ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/course-player/${course._id}?tab=review`);
                }}
                className="bg-amber-100 border border-amber-200 text-amber-800 hover:bg-amber-200 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-bold transition-colors flex items-center gap-1 shadow-sm"
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span>Review</span>
              </button>
            ) : isEnrolled ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/course-player/${course._id}`);
                }}
                className="bg-slate-900 text-white hover:bg-slate-800 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenEnrol) onOpenEnrol(course.title, `R${course.price}`, course._id);
                }}
                className="bg-white border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <span>Enrol</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 lg:py-24 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Course Modules
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
              Certificate program in<br />import and export management
            </h2>
            <div className="hidden md:flex gap-2">
               {/* Decorative scroll hint for desktop */}
               <span className="text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2">
                 Swipe to explore <ChevronRight className="w-4 h-4" />
               </span>
            </div>
          </div>
        </div>

        {/* MOBILE GRID LAYOUT: 1 full-width on top, 2 columns below */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {allCourses.slice(0, 3).map((course, idx) => renderCard(course, idx === 0))}
        </div>

        {/* DESKTOP HORIZONTAL SCROLL LAYOUT */}
        <div className="hidden md:flex gap-8 overflow-x-auto pb-8 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {allCourses.map((course) => (
             <div key={course._id} className="snap-start h-full">
               {renderCard(course, false)}
             </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="mt-4 md:mt-8 flex items-center justify-center">
          <button
            onClick={() => navigate('/courses')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-900 bg-slate-900 text-white px-8 py-3 font-semibold hover:bg-slate-800 transition-colors"
          >
            View All Courses
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
