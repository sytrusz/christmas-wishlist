import axios from 'axios';

// Inactivity timeout: 30 minutes
export const SESSION_TIMEOUT_MINUTES = 30;
export const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000;

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const existingAuth = config.headers?.['Authorization'] || config.headers?.Authorization;
      if (!existingAuth) {
        // Check if session has expired due to inactivity
        if (authAPI.isSessionExpired()) {
          authAPI.logout('timeout');
          return Promise.reject(new Error('Session timed out'));
        }

        const token = sessionStorage.getItem('auth_token');
        if (token) {
          config.headers['Authorization'] = `Basic ${token}`;
          authAPI.recordActivity();
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      if (!sessionStorage.getItem('is_logging_in')) {
        authAPI.logout('timeout');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  recordActivity: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_last_activity', Date.now().toString());
    }
  },

  isSessionExpired: (): boolean => {
    if (typeof window === 'undefined') return false;
    const isAuth = sessionStorage.getItem('isAuthenticated');
    if (!isAuth) return false;
    const lastActivityStr = sessionStorage.getItem('session_last_activity');
    if (!lastActivityStr) return false;
    const lastActivity = parseInt(lastActivityStr, 10);
    if (isNaN(lastActivity)) return false;
    return Date.now() - lastActivity > SESSION_TIMEOUT_MS;
  },

  login: async (username: string, password: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('session_last_activity');
      sessionStorage.setItem('is_logging_in', 'true');
    }
    const token = btoa(`${username}:${password}`);
    try {
      await api.get('/users', {
        headers: { Authorization: `Basic ${token}` },
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('session_last_activity', Date.now().toString());
        if (username === 'admin') {
          sessionStorage.setItem('isAdmin', 'true');
        } else {
          sessionStorage.removeItem('isAdmin');
        }
      }
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('is_logging_in');
      }
    }
  },

  logout: (reason?: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      if (reason === 'timeout') {
        window.location.href = '/login?reason=timeout';
      } else {
        window.location.href = '/login';
      }
    }
  },
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getByCategory: (category: string) => api.get(`/users/category/${category}`),
  register: (data: { fullName: string; category: string }) => api.post('/users/register', data),
  update: (id: number | string, data: { fullName?: string; category?: string }) =>
    api.put(`/users/${id}`, data),
  delete: (id: number | string) => api.delete(`/users/${id}`),
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlists'),
  getBySlug: (slug: string) => api.get(`/wishlists/${slug}`),
  getByCategory: (category: string) => api.get(`/wishlists/category/${category}`),
  search: (name: string) => api.get('/wishlists/search', { params: { name } }),
  create: (data: any) => api.post('/wishlists', data),
  update: (slug: string, data: any) => api.put(`/wishlists/${slug}`, data),
  delete: (id: number | string) => api.delete(`/wishlists/${id}`),
};

export const itemAPI = {
  add: (slug: string, data: any) => api.post(`/wishlists/${slug}/items`, data),
  update: (id: number | string, data: any) => api.put(`/items/${id}`, data),
  delete: (id: number | string) => api.delete(`/items/${id}`),
};

export const settingsAPI = {
  getHeader: () => api.get('/settings/header'),
  updateHeader: (value: string) => api.put('/settings/header', { value }),
  getConfig: () => api.get('/settings'),
  updateConfig: (data: any) => api.put('/settings', data),
};

export const uploadAPI = {
  uploadImage: (file: File, type?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
