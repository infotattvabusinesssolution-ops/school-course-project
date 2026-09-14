import api from "../lib/axios";

export const forumService = {
  getPosts: async (category = "all", search = "") => {
    const params = {};
    if (category && category !== "all") params.category = category;
    if (search) params.search = search;
    const response = await api.get("/forum/posts", { params });
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/forum/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post("/forum/posts", postData);
    return response.data;
  },

  addReply: async (postId, text) => {
    const response = await api.post(`/forum/posts/${postId}/reply`, { text });
    return response.data;
  },

  toggleLike: async (postId) => {
    const response = await api.post(`/forum/posts/${postId}/like`);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/forum/posts/${postId}`);
    return response.data;
  },

  deleteReply: async (postId, replyId) => {
    const response = await api.delete(`/forum/posts/${postId}/replies/${replyId}`);
    return response.data;
  },
};
