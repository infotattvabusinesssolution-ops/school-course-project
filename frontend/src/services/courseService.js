import api from "../utils/api";

const API_URL = "/courses";

export const courseService = {
  // Create a new draft course
  createCourse: async (courseData) => {
    try {
      const response = await api.post(API_URL, courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Get all published courses (Public)
  getPublishedCourses: async () => {
    try {
      const response = await api.get("/public/courses");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching published courses",
        error.response?.data || error,
      );
      throw error.response?.data || error;
    }
  },

  // Get a public course details
  getPublicCourseDetails: async (id) => {
    try {
      const response = await api.get(`/public/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching public course details",
        error.response?.data || error,
      );
      throw error.response?.data || error;
    }
  },

  // Get all courses for logged in admin
  getAdminCourses: async () => {
    try {
      const response = await api.get(`${API_URL}/admin`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching admin courses",
        error.response?.data || error,
      );
      throw error.response?.data || error;
    }
  },

  // Get a course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Update course details
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error updating course", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting course", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Upload course thumbnail
  uploadCourseThumbnail: async (id, formData) => {
    try {
      const response = await api.post(`${API_URL}/${id}/thumbnail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading thumbnail", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    const response = await api.post("/courses/upload-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload an image without a course ID (for creation)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/courses/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload a PDF guide
  uploadPdf: async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);
    const response = await api.post("/courses/upload-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
