import api from "../lib/axios";

const reviewService = {
  // Get all reviews for a course
  getCourseReviews: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
  },

  // Get logged-in user's review for a course
  getMyReview: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}/me`);
    return response.data;
  },

  // Submit or update a review
  submitReview: async (courseId, rating, comment) => {
    const response = await api.post(`/reviews/course/${courseId}`, {
      rating,
      comment,
    });
    return response.data;
  },
};

export default reviewService;
