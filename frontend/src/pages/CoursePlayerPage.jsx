import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  BookOpen,
  Users,
  Check,
  Play,
} from "lucide-react";
import api from "../lib/axios";
import CustomVideoPlayer from "../components/CustomVideoPlayer";

// ─── Video Detection ────────────────────────────────────────────────────────

const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([^#&?]{11})/);
  return m ? m[1] : null;
};

const isDirectVideo = (url) => {
  if (!url) return false;
  const l = url.toLowerCase();
  return (
    l.includes("res.cloudinary.com") ||
    l.includes(".mp4") ||
    l.includes(".webm") ||
    l.includes("/video/upload/")
  );
};

// Wraps CustomVideoPlayer for direct videos, or YouTube iframe
function VideoPlayer({ lesson }) {
  if (!lesson?.videoUrl) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
        <p className="text-sm text-slate-400">No video for this lesson</p>
      </div>
    );
  }

  const ytId = getYouTubeId(lesson.videoUrl);
  if (ytId) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          key={lesson._id}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideo(lesson.videoUrl)) {
    return (
      <CustomVideoPlayer
        key={lesson._id}
        src={lesson.videoUrl}
        title={lesson.title}
        autoPlay
      />
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl bg-slate-900 flex flex-col items-center justify-center gap-3">
      <Play className="w-12 h-12 text-white/30" />
      <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-sm">
        Open video link
      </a>
    </div>
  );
}

// ─── Course Content Sidebar ─────────────────────────────────────────────────

function CourseSidebar({ course, activeLesson, completedLessons, onSelect }) {
  const [openModules, setOpenModules] = useState(new Set([course?.modules?.[0]?._id]));

  const toggle = (id) => {
    setOpenModules((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div>
      {course?.modules?.map((mod, mIdx) => {
        const isOpen = openModules.has(mod._id);
        const totalSecs = mod.lessons?.reduce((a, l) => a + (l.duration || 0), 0) ?? 0;
        const modMins = Math.round(totalSecs / 60);

        return (
          <div key={mod._id} className="border-b border-slate-100 last:border-0">
            <button
              onClick={() => toggle(mod._id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {String(mIdx + 1).padStart(2, "0")}: {mod.title}
                </p>
                {modMins > 0 && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {modMins >= 60 ? `${Math.floor(modMins / 60)}h ${modMins % 60}min` : `${modMins}min`}
                  </p>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="pb-1">
                {mod.lessons?.map((lesson) => {
                  const active = activeLesson?._id === lesson._id;
                  const done = completedLessons.has(lesson._id?.toString());
                  const mins = lesson.duration ? Math.ceil(lesson.duration / 60) : null;

                  return (
                    <button
                      key={lesson._id}
                      onClick={() => onSelect(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${
                        active ? "bg-blue-50 border-l-blue-500" : "hover:bg-slate-50 border-l-transparent"
                      }`}
                    >
                      <div className="shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${active ? "border-blue-500" : "border-slate-300"}`}>
                            {active && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                          </div>
                        )}
                      </div>
                      <p className={`text-xs leading-snug flex-1 min-w-0 ${active ? "font-semibold text-blue-800" : "font-medium text-slate-700"}`}>
                        {lesson.title}
                      </p>
                      {mins && (
                        <span className="text-[10px] text-slate-400 shrink-0">{mins}m</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CoursePlayerPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("content");
  const [infoTab, setInfoTab] = useState("Overview");
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/courses/${courseId}/player`);
        const { course: c, progress } = res.data.data;
        setCourse(c);
        if (progress?.lessonProgress) {
          setCompletedLessons(
            new Set(
              progress.lessonProgress
                .filter((lp) => lp.isCompleted)
                .map((lp) => lp.lesson?.toString())
            )
          );
        }
        const firstLesson = c?.modules?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch (err) {
        setError(err.response?.status === 403 ? "not-enrolled" : "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const flatLessons = course?.modules?.flatMap((m) => m.lessons ?? []) ?? [];
  const idx = flatLessons.findIndex((l) => l._id === activeLesson?._id);
  const totalLessons = flatLessons.length;
  const completedCount = completedLessons.size;
  const totalDurationSecs = flatLessons.reduce((a, l) => a + (l.duration || 0), 0);
  const totalHours = Math.floor(totalDurationSecs / 3600);
  const totalMins = Math.floor((totalDurationSecs % 3600) / 60);

  // ── States ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading course…</p>
        </div>
      </div>
    );
  }

  if (error === "not-enrolled") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-xs">You need to enroll to access this course.</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">
          View Course
        </button>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">Dashboard</button>
      </div>
    );
  }

  const activeModule = course.modules?.find((m) => m.lessons?.some((l) => l._id === activeLesson?._id));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-3 flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => navigate("/courses")} className="hover:text-slate-900 transition-colors">Courses</button>
        <span>/</span>
        <span className="text-slate-400">{course.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{course.title}</span>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* ════ LEFT — video only ════ */}
          <div className="flex-1 min-w-0">

            {/* Back + lesson title */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium truncate">{activeModule?.title ?? course.category}</p>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {activeLesson?.title ?? course.title}
                </h1>
              </div>
            </div>

            {/* Video */}
            <VideoPlayer lesson={activeLesson} />

            {/* Prev / Next */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => idx > 0 && setActiveLesson(flatLessons[idx - 1])}
                disabled={idx <= 0}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-slate-400 font-medium">{idx + 1} / {totalLessons}</span>
              <button
                onClick={() => idx < flatLessons.length - 1 && setActiveLesson(flatLessons[idx + 1])}
                disabled={idx >= flatLessons.length - 1}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="hidden lg:flex flex-col w-[300px] xl:w-[330px] shrink-0 sticky top-6 max-h-[calc(100vh-5rem)] bg-white border border-slate-200 rounded-xl overflow-hidden">

            {/* Sidebar top-level tabs: Content | Overview */}
            <div className="flex border-b border-slate-200 shrink-0">
              {[
                { id: "content", label: "Content" },
                { id: "info", label: "Overview" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSidebarTab(id)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                    sidebarTab === id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                  {sidebarTab === id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content tab ── */}
            {sidebarTab === "content" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{completedCount}/{totalLessons}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: totalLessons ? `${(completedCount / totalLessons) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CourseSidebar
                    course={course}
                    activeLesson={activeLesson}
                    completedLessons={completedLessons}
                    onSelect={setActiveLesson}
                  />
                </div>
              </div>
            )}

            {/* ── Info tab ── */}
            {sidebarTab === "info" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Sub-tabs: Overview / Author / FAQ / Announcements */}
                <div className="flex gap-1 px-3 py-2 border-b border-slate-100 shrink-0 overflow-x-auto">
                  {["Overview", "Author", "FAQ", "Announcements"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setInfoTab(tab)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
                        infoTab === tab
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

                  {infoTab === "Overview" && (
                    <>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1.5">About</h3>
                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <BookOpen className="w-3 h-3 text-slate-400" /> {totalLessons} lessons
                        </span>
                        {(totalHours > 0 || totalMins > 0) && (
                          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {totalHours > 0 && `${totalHours}h `}{totalMins > 0 && `${totalMins}min`}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {course.averageRating?.toFixed(1) ?? "5.0"}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          <Users className="w-3 h-3 text-slate-400" /> {course.totalEnrollments ?? 0}
                        </span>
                      </div>
                      {course.whatYouWillLearn?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">What You'll Learn</h3>
                          <ul className="space-y-1.5">
                            {course.whatYouWillLearn.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <div className="w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-px">
                                  <Check className="w-2 h-2 text-blue-500" />
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {course.requirements?.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1.5">Requirements</h3>
                          <ul className="space-y-1">
                            {course.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-slate-600">
                                <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {infoTab === "Author" && (
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <span className="text-base font-bold text-slate-500">
                          {(course.admin?.name ?? "A")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{course.admin?.name ?? "Instructor"}</h3>
                        <p className="text-slate-400 mb-1.5">{course.admin?.email}</p>
                        <p className="text-slate-600 leading-relaxed">
                          Expert instructor with deep knowledge in {course.category}.
                        </p>
                      </div>
                    </div>
                  )}

                  {infoTab === "FAQ" && (
                    <div className="space-y-2.5">
                      {[
                        { q: "How long do I have access?", a: course.validityPeriod ? `${course.validityPeriod} months.` : "Lifetime access." },
                        { q: "Is there a certificate?", a: "Yes, upon completing all lessons." },
                        { q: "Mobile accessible?", a: "Yes, fully responsive." },
                      ].map((faq, i) => (
                        <div key={i} className="border border-slate-100 rounded-lg p-3">
                          <h4 className="font-semibold text-slate-900 mb-1">{faq.q}</h4>
                          <p className="text-slate-500">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {infoTab === "Announcements" && (
                    <div className="text-center py-8 text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No announcements yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: curriculum + info below video */}
        <div className="lg:hidden mt-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <CourseSidebar
              course={course}
              activeLesson={activeLesson}
              completedLessons={completedLessons}
              onSelect={setActiveLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
