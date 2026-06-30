import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rahat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rahat_token');
      localStorage.removeItem('rahat_user');
      // Redirect to login (avoid circular import by using window)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth service
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// User service
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadPhoto: (formData) => api.post('/users/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePhoto: () => api.delete('/users/profile/photo'),
};

// Hospital service
export const hospitalAPI = {
  getAll: (params) => api.get('/hospitals', { params }),
  getOne: (id) => api.get(`/hospitals/${id}`),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
};

// Pharmacy service
export const pharmacyAPI = {
  getAll: (params) => api.get('/pharmacies', { params }),
  getOne: (id) => api.get(`/pharmacies/${id}`),
  create: (data) => api.post('/pharmacies', data),
  update: (id, data) => api.put(`/pharmacies/${id}`, data),
  delete: (id) => api.delete(`/pharmacies/${id}`),
};

// Blood donation service
export const bloodAPI = {
  search: (params) => api.get('/blood/donors', { params }),
  register: (data) => api.post('/blood/register', data),
  getMyProfile: () => api.get('/blood/my-profile'),
  update: (data) => api.put('/blood/update', data),
  toggleAvailability: () => api.patch('/blood/availability'),
  markDonated: () => api.patch('/blood/donated'),
  unregister: () => api.delete('/blood/unregister'),
};

// Medical profile service
export const medicalAPI = {
  getProfile: () => api.get('/medical-profile'),
  update: (data) => api.put('/medical-profile', data),
  uploadDocuments: (formData) => api.post('/medical-profile/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteDocument: (docId) => api.delete(`/medical-profile/documents/${docId}`),
};

// Emergency contacts service
export const contactsAPI = {
  getAll: () => api.get('/emergency-contacts'),
  add: (data) => api.post('/emergency-contacts', data),
  update: (id, data) => api.put(`/emergency-contacts/${id}`, data),
  delete: (id) => api.delete(`/emergency-contacts/${id}`),
};

// SOS service
export const sosAPI = {
  create: (data) => api.post('/sos', data),
  getHistory: (params) => api.get('/sos/history', { params }),
  getActive: () => api.get('/sos/active'),
  updateStatus: (id, status) => api.patch(`/sos/${id}/status`, { status }),
};

// Admin service
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  getAllSOS: (params) => api.get('/admin/sos', { params }),
};
