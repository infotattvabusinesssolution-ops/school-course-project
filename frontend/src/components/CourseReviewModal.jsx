import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Star } from "lucide-react";
import reviewService from "../services/reviewService";

export default function CourseReviewModal({
  isOpen,
  onClose,
  courseId,
  existingReview = null,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      } else {
        setRating(0);
        setComment("");
      }
      setError("");
    }
  }, [isOpen, existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      const res = await reviewService.submitReview(courseId, rating, comment);
      if (res.success) {
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingReview ? "Update Your Review" : "Leave a Review"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-sm font-bold text-slate-700">How would you rate this course?</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-transform hover:scale-110 ${
                  star <= rating ? "text-amber-400" : "text-slate-200"
                }`}
              >
                <Star className="w-10 h-10 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">Write your review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you thought about the course content, instructor, etc..."
            className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !rating || !comment.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : existingReview
              ? "Update Review"
              : "Submit Review"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
