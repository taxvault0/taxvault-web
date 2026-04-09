import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login/user';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Onboarding API
export const onboardingAPI = {
  save: (data) => api.put('/onboarding', data),
  get: () => api.get('/onboarding'),
};

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyMfa: (data) => api.post('/auth/verify-mfa', data),
  setupMfa: () => api.post('/auth/setup-mfa'),
  enableMfa: (data) => api.post('/auth/enable-mfa', data),
  disableMfa: () => api.post('/auth/disable-mfa'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getDashboard: (taxYear) => api.get('/users/dashboard', { params: { taxYear } }),
  getStats: () => api.get('/users/stats'),
};

// Receipt API
export const receiptAPI = {
  getReceipts: (params) => api.get('/receipts', { params }),
  getReceipt: (id) => api.get(`/receipts/${id}`),
  createReceipt: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        formData.append('receipt', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/receipts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateReceipt: (id, data) => api.put(`/receipts/${id}`, data),
  deleteReceipt: (id) => api.delete(`/receipts/${id}`),
  getCategories: () => api.get('/receipts/categories'),
  getSummary: (taxYear) => api.get('/receipts/summary', { params: { taxYear } }),
};

// Mileage API
export const mileageAPI = {
  getMileage: (taxYear) => api.get('/mileage', { params: { taxYear } }),
  addTrip: (data) => api.post('/mileage/trips', data),
  updateTrip: (tripId, data) => api.put(`/mileage/trips/${tripId}`, data),
  deleteTrip: (tripId) => api.delete(`/mileage/trips/${tripId}`),
  getSummary: (taxYear) => api.get('/mileage/summary', { params: { taxYear } }),
  updateSettings: (settings) => api.put('/mileage/settings', settings),
};

// Document API
export const documentAPI = {
  getDocuments: (params) => api.get('/documents', { params }),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'file') {
        formData.append('document', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  getTypes: () => api.get('/documents/types'),
};

// CA Registration API
export const caRegistrationAPI = {
  saveDraft: (data) => api.post('/ca-registration/save-draft', data),
  getDraft: () => api.get('/ca-registration/draft'),
};

// CA API
export const caAPI = {
  getClients: (params) => api.get('/ca/clients', { params }),
  getClient: (id) => api.get(`/ca/clients/${id}`),
  getClientDashboard: (id, taxYear) =>
    api.get(`/ca/clients/${id}/dashboard`, { params: { taxYear } }),
  getClientReceipts: (id, params) =>
    api.get(`/ca/clients/${id}/receipts`, { params }),
  getClientMileage: (id, taxYear) =>
    api.get(`/ca/clients/${id}/mileage`, { params: { taxYear } }),
  getClientDocuments: (id, params) =>
    api.get(`/ca/clients/${id}/documents`, { params }),
  requestDocument: (id, data) => api.post(`/ca/clients/${id}/request-document`, data),
  verifyDocument: (id, data) => api.post(`/ca/clients/${id}/verify-document`, data),
  getPendingReviews: () => api.get('/ca/pending-reviews'),
  getActivity: () => api.get('/ca/activity'),
  getInvitations: () => api.get('/ca/invitations'),
  acceptInvitation: (token) => api.post(`/ca/accept-invitation/${token}`),
};

// Reports API
export const reportAPI = {
  generateReport: (data) => api.post('/reports/generate', data),
  getReports: () => api.get('/reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  downloadReport: (id, format) =>
    api.get(`/reports/${id}/download`, {
      params: { format },
      responseType: 'blob',
    }),
};

export default api;