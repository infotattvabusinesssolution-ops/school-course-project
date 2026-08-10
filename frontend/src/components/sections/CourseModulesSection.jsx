import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, ChevronRight, BarChart } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function CourseModulesSection({ onOpenEnrol }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getPublishedCourses();
        setCourses((res.data.courses || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to load courses for section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 lg:py-24 bg-white flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-12 lg:py-24 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Course Modules
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
              Certificate program in<br />import and export management
            </h2>
            <button
              onClick={() => navigate('/courses')}
              className="shrink-0 flex items-center gap-2 border border-slate-900 text-slate-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-900 hover:text-white transition-colors mb-2"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Course Cards — exact same design as CoursesPage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <div
              key={course._id}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 100}
              className="bg-white border border-slate-200 flex flex-col h-full cursor-pointer hover:border-slate-400 transition-colors group"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-slate-100 shrink-0 border-b border-slate-200 overflow-hidden">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-slate-300" />
                  </div>
                )}


              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">

                {/* Meta */}
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

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span className="text-sm font-bold text-slate-900">
                    {course.averageRating ? course.averageRating.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">({course.totalEnrollments || 0})</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                  {course.description}
                </p>

                {/* Price + Enroll */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-slate-900">₹{course.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEnrol(course.title, course.price, course._id);
                    }}
                    className="bg-white border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1"
                  >
                    Enrol
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
