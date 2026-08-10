import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Clock,
  Send,
  User,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { forumService } from "../services/forumService";
import { useAuth } from "../context/AuthContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await forumService.getPostById(id);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to load discussion details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setSubmittingReply(true);
      const res = await forumService.addReply(id, replyText.trim());
      setPost(res.data);
      setReplyText("");
    } catch (err) {
      console.error("Failed to submit reply:", err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await forumService.toggleLike(id);
      fetchPost();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
    try {
      await forumService.deletePost(id);
      navigate("/forum");
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      const res = await forumService.deleteReply(id, replyId);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to delete reply:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-28 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Discussion Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The discussion topic you are looking for does not exist or was removed.</p>
        <Link to="/forum" className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg">
          Back to Forum
        </Link>
      </div>
    );
  }

  const isLiked = isLoggedIn && post.likes?.includes(user?._id);
  const likesCount = post.likes?.length || 0;
  const replies = post.replies || [];
  const isPostAdminOrAuthor = isLoggedIn && (user?.role === "ADMIN" || user?._id === (post.author?._id || post.author));

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => navigate("/forum")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discussions
        </button>

        {/* Main Post Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
          {/* Post Header */}
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {(post.authorName || post.author?.name || "A")[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {post.authorName || post.author?.name || "Student"}
                </h3>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1 rounded-md">
                {post.category || "General"}
              </span>
              {isPostAdminOrAuthor && (
                <button
                  onClick={handleDeletePost}
                  title="Delete discussion"
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Content */}
          {post.content && (
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6">
              {post.content}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                isLiked
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-blue-600" : ""}`} />
              <span>{likesCount} Likes</span>
            </button>

            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-slate-400" />
              {replies.length} Replies
            </span>
          </div>
        </div>

        {/* Replies List */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-slate-400" />
            Discussion Responses ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              No replies yet. Be the first to join the conversation!
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {replies.map((reply, idx) => {
                const isReplyAdminOrAuthor =
                  isLoggedIn &&
                  (user?.role === "ADMIN" ||
                    user?._id === (reply.author?._id || reply.author));

                return (
                  <div key={reply._id || idx} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] border border-slate-200">
                          {(reply.authorName || reply.author?.name || "R")[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">
                          {reply.authorName || reply.author?.name || "Student"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                        {isReplyAdminOrAuthor && (
                          <button
                            onClick={() => handleDeleteReply(reply._id)}
                            title="Delete reply"
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                      {reply.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Reply Form */}
          <div className="pt-6 border-t border-slate-200">
            {isLoggedIn ? (
              <form onSubmit={handleAddReply} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Leave a Reply
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your professional response or advice..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyText.trim()}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>{submittingReply ? "Posting..." : "Post Reply"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-700">Want to join this discussion?</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Log In to Reply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
