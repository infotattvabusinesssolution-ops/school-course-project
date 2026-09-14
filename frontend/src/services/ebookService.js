import api from "../lib/axios";

export const ebookService = {
  getEbooks: async () => {
    const response = await api.get("/public/ebooks");
    return response.data;
  },

  getEbookById: async (id) => {
    const response = await api.get(`/public/ebooks/${id}`);
    return response.data;
  },

  createEbook: async (formData) => {
    const response = await api.post("/ebooks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEbook: async (id, formData) => {
    const response = await api.put(`/ebooks/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteEbook: async (id) => {
    const response = await api.delete(`/ebooks/${id}`);
    return response.data;
  },
};
