import axios from 'axios';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sgs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sgs_token');
      localStorage.removeItem('sgs_user');
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register      : (data)   => api.post('/auth/register', data),
  login         : (data)   => api.post('/auth/login', data),
  getMe         : ()       => api.get('/auth/me'),
  updateProfile : (data)   => api.put('/auth/profile', data),
  changePassword: (data)   => api.put('/auth/change-password', data),
};

// ── Schemes ───────────────────────────────────────────────────────────────────
export const schemesAPI = {
  getAll     : (params) => api.get('/schemes', { params }),
  getFeatured: ()       => api.get('/schemes/featured'),
  getById    : (id)     => api.get(`/schemes/${id}`),
  getSaved   : ()       => api.get('/schemes/saved'),
  save       : (id)     => api.post(`/schemes/${id}/save`),
  unsave     : (id)     => api.delete(`/schemes/${id}/save`),
};

// ── Eligibility ───────────────────────────────────────────────────────────────
export const eligibilityAPI = {
  check: (profile) => api.post('/eligibility/check', { profile }),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll : ()         => api.get('/categories'),
  create : (data)     => api.post('/categories', data),
  update : (id, data) => api.put(`/categories/${id}`, data),
  delete : (id)       => api.delete(`/categories/${id}`),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  getSaved  : ()   => api.get('/users/saved-schemes'),
  save      : (id) => api.post(`/users/saved-schemes/${id}`),
  unsave    : (id) => api.delete(`/users/saved-schemes/${id}`),
};

// ── Admin ──────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats         : ()         => api.get('/admin/stats'),
  getUsers         : (params)   => api.get('/admin/users', { params }),
  toggleUser       : (id)       => api.patch(`/admin/users/${id}/toggle`),
  getSchemes       : (params)   => api.get('/admin/schemes', { params }),
  createScheme     : (data)     => api.post('/admin/schemes', data),
  updateScheme     : (id, data) => api.put(`/admin/schemes/${id}`, data),
  deleteScheme     : (id)       => api.delete(`/admin/schemes/${id}`),
  toggleScheme     : (id)       => api.patch(`/admin/schemes/${id}/toggle`),
};

export default api;
