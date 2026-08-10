import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '../components/icons/Icons';
import { PlayCircle, Check, Users, BarChart, ArrowLeft, Video, Award, Clock, Star } from 'lucide-react';
import { courseService } from '../services/courseService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function CourseDetailsPage({ onOpenEnrol, initialModuleId = null }) {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState(initialModuleId);
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (user) {
        try {
          const res = await api.get('/student/courses');
          const enrolledCourses = res.data.data;
          const currentEnrollment = enrolledCourses.find(e => e.course && e.course._id === courseId);
          if (currentEnrollment) {
            setIsEnrolled(true);
            setIsCompleted(currentEnrollment.status === 'COMPLETED' || currentEnrollment.completionPercentage >= 100);
          }
        } catch (err) {
          console.error("Failed to check enrollment:", err);
        }
      }
    };
    fetchEnrollmentStatus();
  }, [user, courseId]);

  const handleLessonClick = async (lessonId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isEnrolled) {
      navigate(`/course-player/${courseId}?lessonId=${lessonId}`);
    } else {
      onOpenEnrol(course.title, course.price, courseId);
    }
  };

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        setLoading(true);
        if (!courseId) return;
        const res = await courseService.getPublicCourseDetails(courseId);
        setCourse(res.data);
        if (res.data?.modules?.length > 0 && initialModuleId === null) {
          setExpandedModule(res.data.modules[0]._id);
        }

        const reviewRes = await reviewService.getCourseReviews(courseId);
        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error("Failed to load course details or reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndReviews();
  }, [courseId, initialModuleId]);

  const toggleAccordion = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  if (loading) {
    return (
      <div className="py-32 bg-white min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-32 bg-white min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-6">The course you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium">
          Browse Courses
        </button>
      </div>
    );
  }

  // Calculate total lessons and duration
  const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
  const totalDurationSeconds = course.modules?.reduce((acc, mod) => {
    return acc + (mod.lessons?.reduce((lAcc, l) => lAcc + (l.duration || 0), 0) || 0);
  }, 0) || 0;
  
  const totalHours = Math.floor(totalDurationSeconds / 3600);
  const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);

  return (
    <div className="bg-white min-h-screen font-sans pb-24 text-slate-800">
      
      {/* Light Hero Section - No dark colors */}
      <div className="pt-28 pb-10 lg:pt-32 lg:pb-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {course.title}
                </h1>
                <div className="flex items-center gap-3 mt-1 sm:mt-0">
                  <span className="text-blue-700 font-semibold text-sm uppercase tracking-wide bg-blue-50 px-2.5 py-1 rounded-md">
                    {course.category}
                  </span>
                  {course.category === 'Full Certification' && (
                    <span className="flex items-center text-amber-700 font-semibold text-sm uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-md">
                      <Award className="w-4 h-4 mr-1" /> Flagship
                    </span>
                  )}
                </div>
              </div>
              
              {course.subtitle && (
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed mb-4">
                  {course.subtitle}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-md">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-bold text-slate-900">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
                  <span>({course.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-md">
                  <Users className="w-4 h-4" />
                  <span>{course.totalEnrollments || 0} Students</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-md">
                  <BarChart className="w-4 h-4" />
                  <span className="capitalize">{course.level || 'All Levels'}</span>
                </div>
              </div>
            </div>
            
            {/* Right Mobile Thumbnail (No card, flat) */}
            <div className="lg:hidden w-full aspect-video bg-slate-200">
               {course.thumbnailUrl ? (
                 <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400">
                   <Video className="w-12 h-12" />
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Completely Flat */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Course Details) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* About This Course */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Course</h2>
              <div className="text-slate-600 leading-relaxed text-base sm:text-lg">
                <p>{course.description}</p>
              </div>
            </section>

            {/* What you'll learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum - Simple Flat Accordion */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Course Curriculum</h2>
                <p className="text-slate-500 mt-2">
                  {course.modules?.length || 0} sections • {totalLessons} lessons • {totalHours > 0 ? `${totalHours}h ` : ''}{totalMinutes}m total length
                </p>
              </div>

              <div className="border border-slate-200">
                {(!course.modules || course.modules.length === 0) ? (
                  <div className="p-8 text-center text-slate-500">
                    Curriculum is being updated. Please check back later.
                  </div>
                ) : (
                  course.modules.map((mod, index) => {
                    const isExpanded = expandedModule === mod._id;
                    return (
                      <div key={mod._id} className="border-b border-slate-200 last:border-b-0">
                        <button
                          onClick={() => toggleAccordion(mod._id)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180 text-slate-900' : 'text-slate-500'}`} />
                            <span className="font-semibold text-slate-900 text-lg">Section {index + 1}: {mod.title}</span>
                          </div>
                          <div className="hidden sm:block text-sm text-slate-500">
                            {mod.lessons?.length || 0} lectures
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden bg-white">
                            {(!mod.lessons || mod.lessons.length === 0) ? (
                              <div className="p-4 px-6 text-sm text-slate-500">No lessons available in this section.</div>
                            ) : (
                              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mod.lessons.map((lesson, lIdx) => (
                                  <div 
                                    key={lesson._id || lIdx} 
                                    onClick={() => handleLessonClick(lesson._id)}
                                    className="border border-slate-200 p-4 rounded-lg flex items-start gap-4 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer group"
                                  >
                                    <div className="shrink-0">
                                      {lesson.thumbnailUrl ? (
                                        <div className="w-20 h-14 rounded overflow-hidden relative group-hover:shadow-sm transition-shadow bg-slate-100 border border-slate-200">
                                          <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-6 h-6 text-white" />
                                          </div>
                                        </div>
                                      ) : (
                                        <PlayCircle className="w-8 h-8 text-slate-300 group-hover:text-blue-600 transition-colors mt-1" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                                        {lesson.title}
                                      </h5>
                                      {lesson.duration > 0 && (
                                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Student Reviews Section */}
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Student Reviews</h2>
              
              <div className="flex items-center gap-4 mb-8 bg-slate-50 p-6 border border-slate-200 rounded-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold text-slate-900">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</div>
                  <div className="flex items-center justify-center gap-1 my-2 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(course.averageRating || 0) ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">Course Rating</div>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-slate-200 bg-slate-50">
                  No reviews yet. Be the first to review this course after you complete it!
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          {review.student?.avatar ? (
                            <img src={review.student.avatar} alt={review.student?.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-blue-700 font-bold text-lg">
                              {review.student?.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{review.student?.name || 'Anonymous User'}</h4>
                            <span className="text-xs text-slate-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-current' : 'text-slate-300'}`} />
                            ))}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Flat Sticky Sidebar) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="border border-slate-200 bg-white">
              
              {/* Desktop Thumbnail */}
              <div className="hidden lg:block w-full aspect-video bg-slate-100">
                 {course.thumbnailUrl ? (
                   <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <Video className="w-12 h-12" />
                   </div>
                 )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹{course.price}</span>
                </div>

                {isCompleted ? (
                  <button
                    onClick={() => navigate(`/course-player/${courseId}?tab=review`)}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5 fill-current" /> Review Course
                  </button>
                ) : isEnrolled ? (
                  <button
                    onClick={() => navigate(`/course-player/${courseId}`)}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors mb-4"
                  >
                    Start Learning
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenEnrol(course.title, course.price, courseId)}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg transition-colors mb-4"
                  >
                    Enroll Now
                  </button>
                )}
                <p className="text-center text-sm text-slate-500 mb-8">30-Day Money-Back Guarantee</p>

                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 mb-4">This course includes:</h4>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Video className="w-5 h-5 text-slate-400" />
                    <span>{totalHours > 0 ? `${totalHours} hours ` : ''}{totalMinutes} mins on-demand video</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span>{course.validityPeriod ? `${course.validityPeriod} Months access` : 'Full lifetime access'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Award className="w-5 h-5 text-slate-400" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Sticky Bottom Bar (Flat) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4 z-50">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-900">₹{course.price}</span>
        </div>
        {isCompleted ? (
          <button
            onClick={() => navigate(`/course-player/${courseId}?tab=review`)}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-center flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 fill-current" /> Review Course
          </button>
        ) : isEnrolled ? (
          <button
            onClick={() => navigate(`/course-player/${courseId}`)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center"
          >
            Start Learning
          </button>
        ) : (
          <button
            onClick={() => onOpenEnrol(course.title, `₹${course.price}`, courseId)}
            className="flex-1 py-3 bg-slate-900 text-white font-semibold text-center"
          >
            Enroll Now
          </button>
        )}
      </div>

    </div>
  );
}
