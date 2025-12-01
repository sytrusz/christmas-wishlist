import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Retrieve the encoded credentials saved during login
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Basic ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const token = btoa(`${username}:${password}`);
    try {
      await api.get('/users', {
        headers: { Authorization: `Basic ${token}` }
      });
      
      // If successful, save state
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('isAuthenticated', 'true');
      if (username === 'admin') {
        sessionStorage.setItem('isAdmin', 'true');
      }
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  },
  logout: () => {
    sessionStorage.clear();
    window.location.href = '/login';
  }
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getByCategory: (category) => api.get(`/users/category/${category}`),
  register: (data) => api.post('/users/register', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlists'),
  getBySlug: (slug) => api.get(`/wishlists/${slug}`),
  getByCategory: (category) => api.get(`/wishlists/category/${category}`),
  search: (name) => api.get('/wishlists/search', { params: { name } }),
  create: (data) => api.post('/wishlists', data),
  update: (slug, data) => api.put(`/wishlists/${slug}`, data),
  delete: (id) => api.delete(`/wishlists/${id}`),
};

export const itemAPI = {
  add: (slug, data) => api.post(`/wishlists/${slug}/items`, data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const settingsAPI = {
  getHeader: () => api.get('/settings/header'),
  updateHeader: (value) => api.put('/settings/header', { value }),
};

export default api;