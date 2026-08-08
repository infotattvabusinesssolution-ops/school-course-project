import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  PlayCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
  Clock,
  Trash2,
} from "lucide-react";
import { courseService } from "../services/courseService";

export default function CoursePlayerPage({ courseId, setActivePage }) {
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Using courseService for now, as studentService isn't fully migrated
        // In a real app, you'd fetch student-specific progress here
        const res = await courseService.getCourseById(courseId);
        setCourse(res.data);

        if (
          res.data.modules &&
          res.data.modules.length > 0 &&
          res.data.modules[0].lessons.length > 0
        ) {
          setActiveLesson(res.data.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error("Failed to load course player:", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const getLessonSequence = () => {
    if (!course?.modules) return [];
    const sequence = [];
    course.modules.forEach((mod) => {
      mod.lessons.forEach((lesson) => sequence.push(lesson));
    });
    return sequence;
  };

  const sequence = getLessonSequence();
  const currentIndex = sequence.findIndex((l) => l._id === activeLesson?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sequence.length - 1;

  const goToNextLesson = () => {
    if (hasNext) setActiveLesson(sequence[currentIndex + 1]);
  };

  const goToPrevLesson = () => {
    if (hasPrev) setActiveLesson(sequence[currentIndex - 1]);
  };

  // Extract YouTube ID function
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url; // fallback to url if it's already an ID
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-4">Course not found.</p>
        <button
          onClick={() => setActivePage("dashboard")}
          className="px-4 py-2 bg-sky-500 rounded font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 h-screen flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setActivePage("dashboard")}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col border-l border-slate-200 pl-4 justify-center">
            <h1 className="text-sm md:text-base font-black text-slate-900 line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors md:hidden"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Video & Content */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {activeLesson ? (
            <>
              {/* Video Player */}
              <div className="w-full bg-black shrink-0 flex items-center justify-center relative shadow-2xl">
                <div className="w-full max-w-[1200px] aspect-video relative">
                  {activeLesson.videoUrl ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}?rel=0&modestbranding=1`}
                      title={activeLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-slate-500 text-center flex flex-col items-center justify-center h-full bg-slate-800">
                      <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-bold">Video not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Details */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                <div className="max-w-[1200px] mx-auto w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-1">
                        {activeLesson.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={goToPrevLesson}
                        disabled={!hasPrev}
                        className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 shadow-sm"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        onClick={goToNextLesson}
                        disabled={!hasNext}
                        className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all bg-crmisa-navy text-white hover:bg-crmisa-accentNavy disabled:opacity-50 shadow-md"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-slate-200 mb-6 space-x-6">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`pb-3 font-extrabold text-sm transition-colors border-b-2 ${activeTab === "overview" ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("qna")}
                      className={`pb-3 font-extrabold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === "qna" ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                      <MessageCircleQuestion className="w-4 h-4" /> Q&A Doubts
                    </button>
                  </div>

                  {activeTab === "overview" && (
                    <div className="prose prose-slate max-w-4xl text-slate-700">
                      <p>{course.description}</p>
                    </div>
                  )}

                  {activeTab === "qna" && (
                    <div className="max-w-4xl">
                      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8 text-center">
                        <MessageCircleQuestion className="w-10 h-10 text-sky-500 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                          Have a question?
                        </h3>
                        <p className="text-slate-600 text-sm mb-6">
                          Ask your instructor directly if you're stuck on a
                          concept.
                        </p>
                        <button className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-sky-400 transition-colors">
                          Ask a Doubt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
              <p>No lessons available.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar (Curriculum) */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 fixed md:static right-0 top-0 bottom-0 w-80 lg:w-[400px] bg-white border-l border-slate-200 z-20 transition-transform duration-300 flex flex-col shadow-2xl md:shadow-none`}
        >
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">
              Course Content
            </h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-500 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {course?.modules?.map((mod, modIdx) => (
              <div key={modIdx} className="border-b border-slate-100">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">
                    Section {modIdx + 1}
                  </h4>
                  <p className="font-extrabold text-slate-900">{mod.title}</p>
                </div>
                <div>
                  {mod.lessons?.map((lesson, lessonIdx) => {
                    const active = activeLesson?._id === lesson._id;
                    return (
                      <button
                        key={lessonIdx}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-4 flex gap-4 hover:bg-slate-50 transition-colors relative border-b border-slate-50 last:border-0 ${
                          active ? "bg-sky-50/50" : ""
                        }`}
                      >
                        {active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
                        )}
                        <div className="shrink-0 mt-0.5">
                          <PlayCircle
                            className={`w-5 h-5 ${active ? "text-sky-500" : "text-slate-300"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm leading-tight ${active ? "font-bold text-sky-900" : "font-semibold text-slate-700"}`}
                          >
                            {lessonIdx + 1}. {lesson.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10"
          ></div>
        )}
      </main>
    </div>
  );
}
