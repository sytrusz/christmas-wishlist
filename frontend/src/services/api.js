import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  getAll: () => api.get('/users'),
  getByCategory: (category) => api.get(`/users/category/${category}`),
  register: (data) => api.post('/users/register', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlists'),
  getByCategory: (category) => api.get(`/wishlists/category/${category}`),
  getBySlug: (slug) => api.get(`/wishlists/${slug}`),
  search: (name) => api.get(`/wishlists/search?name=${name}`),
  create: (data) => api.post('/wishlists', data),
  update: (slug, data) => api.put(`/wishlists/${slug}`, data),
  delete: (slug) => api.delete(`/wishlists/${slug}`),
  addItem: (slug, item) => api.post(`/wishlists/${slug}/items`, item),
  updateItem: (itemId, item) => api.put(`/items/${itemId}`, item),
  deleteItem: (itemId) => api.delete(`/items/${itemId}`),
};

export default api;