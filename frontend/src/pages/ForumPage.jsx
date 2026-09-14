import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  PlusCircle,
  MessageCircle,
  Eye,
  ThumbsUp,
  User,
  Clock,
  Filter,
  Send,
} from "lucide-react";
import { forumService } from "../services/forumService";
import { useAuth } from "../context/AuthContext";
import CreatePostModal from "../components/CreatePostModal";

export default function ForumPage() {
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
  const isLoggedIn = !!user;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickQuestion, setQuickQuestion] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "General", label: "General" },
    { id: "Import", label: "Import" },
    { id: "Export", label: "Export" },
    { id: "Customs", label: "Customs" },
    { id: "Logistics", label: "Logistics" },
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await forumService.getPosts(activeCategory, searchQuery);
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to load forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleQuickQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;

    if (!isLoggedIn) {
      openLogin();
      return;
    }

    try {
      await forumService.createPost({
        title: quickQuestion.trim(),
        category: activeCategory === "all" ? "General" : activeCategory,
        content: "",
      });
      setQuickQuestion("");
      fetchPosts();
    } catch (err) {
      console.error("Failed to submit quick post:", err);
    }
  };

  const handleModalSubmit = async (data) => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    await forumService.createPost(data);
    fetchPosts();
  };

  const handleLike = async (e, postId) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    try {
      await forumService.toggleLike(postId);
      fetchPosts();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-crmisa-accentNavy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-yellow-400"></div>
            <span className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-widest">
              Community Forum
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-4xl font-medium text-crmisa-navy tracking-tight leading-[1.1] max-w-2xl">
                Trade Discussions & Insights
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-xl">
                Ask questions, share export experiences, and get advice from customs experts and fellow entrepreneurs.
              </p>
            </div>

            <button
              onClick={() => {
                if (!isLoggedIn) openLogin();
                else setIsCreateModalOpen(true);
              }}
              className="shrink-0 flex items-center justify-center gap-2 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-crmisa-navy focus:outline-none focus:border-crmisa-navy transition-colors"
            />
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-crmisa-navy text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-crmisa-navy hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Ask Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-8 shadow-xs">
          <form onSubmit={handleQuickQuestionSubmit} className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder={
                isLoggedIn
                  ? "Have a trade question? Type it here and press enter..."
                  : "Log in to post a question or topic..."
              }
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-crmisa-navy placeholder:text-slate-400 focus:outline-none focus:border-crmisa-navy focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-crmisa-navy mb-1">No discussions found</h3>
            <p className="text-xs text-slate-500 mb-4">Be the first to start a conversation in this category.</p>
            <button
              onClick={() => {
                if (!isLoggedIn) openLogin();
                else setIsCreateModalOpen(true);
              }}
              className="px-5 py-2 bg-crmisa-navy text-white text-xs font-semibold rounded-lg hover:bg-crmisa-accentNavy transition-colors"
            >
              Start Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const repliesCount = post.replies?.length || 0;
              const likesCount = post.likes?.length || 0;
              const isLiked = isLoggedIn && post.likes?.includes(user?._id);

              return (
                <div
                  key={post._id}
                  onClick={() => navigate(`/forum/${post._id}`)}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 hover:border-slate-400 transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Meta Top Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {(post.authorName || post.author?.name || "A")[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-crmisa-navy">
                          {post.authorName || post.author?.name || "Student"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {post.category || "General"}
                        </span>
                      </div>

                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-lg font-bold text-crmisa-navy group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* Content Preview */}
                    {post.content && (
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {post.content}
                      </p>
                    )}
                  </div>

                  {/* Actions & Metrics Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MessageCircle className="w-4 h-4 text-slate-400" />
                        {repliesCount} {repliesCount === 1 ? "Reply" : "Replies"}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Eye className="w-4 h-4 text-slate-400" />
                        {post.views || 0} Views
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(e, post._id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          isLiked
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-slate-100 text-slate-500 hover:text-crmisa-navy"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-blue-600" : ""}`} />
                        <span>{likesCount}</span>
                      </button>
                      <span className="text-blue-600 font-semibold group-hover:underline">
                        View & Reply →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Creating New Discussion */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleModalSubmit}
      />
    </div>
  );
}
