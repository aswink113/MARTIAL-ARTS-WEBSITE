import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if on portal routes
      if (window.location.pathname.startsWith('/portal') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/portal/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public Academy Services
export const getSettings = async () => {
  const response = await api.get('/settings/');
  return response.data;
};

export const getCourses = async (category = '') => {
  const params = category ? { category } : {};
  const response = await api.get('/courses/', { params });
  return response.data.results || response.data;
};

export const getCourseBySlug = async (slug) => {
  const response = await api.get(`/courses/${slug}/`);
  return response.data;
};

export const getInstructors = async (headOnly = false) => {
  const params = headOnly ? { head_coach: true } : {};
  const response = await api.get('/instructors/', { params });
  return response.data.results || response.data;
};

export const getSchedules = async (params = {}) => {
  const response = await api.get('/schedules/', { params });
  return response.data.results || response.data;
};

export const getFees = async (params = {}) => {
  const response = await api.get('/fees/', { params });
  return response.data.results || response.data;
};

export const getGallery = async (category = 'all') => {
  const params = category && category.toLowerCase() !== 'all' ? { category } : {};
  const response = await api.get('/gallery/', { params });
  return response.data.results || response.data;
};

export const getAchievements = async () => {
  const response = await api.get('/achievements/');
  return response.data.results || response.data;
};

export const submitAdmissionEnquiry = async (formData) => {
  const response = await api.post('/admission-enquiries/', formData);
  return response.data;
};

// ERP & Authentication Services
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('auth_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/erp/dashboard-stats/');
  return response.data;
};

export const getERPEnquiries = async (status = 'All', search = '') => {
  const params = {};
  if (status && status !== 'All') params.status = status;
  if (search) params.search = search;
  const response = await api.get('/erp/enquiries/', { params });
  return response.data.results || response.data;
};

export const updateERPEnquiry = async (id, data) => {
  const response = await api.patch(`/erp/enquiries/${id}/`, data);
  return response.data;
};

export const getERPStudents = async (params = {}) => {
  const response = await api.get('/erp/students/', { params });
  return response.data.results || response.data;
};

export const getNextStudentId = async () => {
  const response = await api.get('/erp/students/next_id/');
  return response.data;
};

export const createERPStudent = async (data) => {
  const response = await api.post('/erp/students/', data);
  return response.data;
};

export const updateERPStudent = async (id, data) => {
  const response = await api.patch(`/erp/students/${id}/`, data);
  return response.data;
};

export const deleteERPStudent = async (id) => {
  const response = await api.delete(`/erp/students/${id}/`);
  return response.data;
};

export const manageStudentCredentials = async (id, data) => {
  const response = await api.post(`/erp/students/${id}/manage_credentials/`, data);
  return response.data;
};

// Department Services
export const getDepartments = async () => {
  const response = await api.get('/erp/departments/');
  return response.data.results || response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post('/erp/departments/', data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/erp/departments/${id}/`);
  return response.data;
};

// Staff & Sensei Services
export const getStaffMembers = async () => {
  const response = await api.get('/erp/staff/');
  return response.data.results || response.data;
};

export const getNextStaffId = async () => {
  const response = await api.get('/erp/staff/next_id/');
  return response.data;
};

export const createStaffMember = async (data) => {
  const response = await api.post('/erp/staff/', data);
  return response.data;
};

export const updateStaffMember = async (id, data) => {
  const response = await api.patch(`/erp/staff/${id}/`, data);
  return response.data;
};

export const deleteStaffMember = async (id) => {
  const response = await api.delete(`/erp/staff/${id}/`);
  return response.data;
};

export const manageStaffCredentials = async (id, data) => {
  const response = await api.post(`/erp/staff/${id}/manage_credentials/`, data);
  return response.data;
};

// Manual Attendance Services (Staff & Students - Admin Excluded)
export const getStudentAttendance = async (params = {}) => {
  const queryParams = typeof params === 'string' ? (params ? { date: params } : {}) : params;
  const response = await api.get('/erp/attendance/', { params: queryParams });
  return response.data.results || response.data;
};

export const saveAttendance = async (records) => {
  const response = await api.post('/erp/attendance/', records);
  return response.data;
};

export const saveStudentAttendance = saveAttendance;

export const getStaffAttendance = async (params = {}) => {
  const queryParams = typeof params === 'string' ? (params ? { date: params } : {}) : params;
  const response = await api.get('/erp/staff-attendance/', { params: queryParams });
  return response.data.results || response.data;
};

export const saveStaffAttendance = async (records) => {
  const response = await api.post('/erp/staff-attendance/', records);
  return response.data;
};

// Punch & Workforce Attendance Services
export const getPunchStatus = async () => {
  const response = await api.get('/erp/punch/status/');
  return response.data;
};

export const togglePunch = async (remarks = '') => {
  const response = await api.post('/erp/punch/toggle/', { remarks });
  return response.data;
};

export const getWorkforceAttendance = async (date = '') => {
  const params = {};
  if (date) params.date = date;
  const response = await api.get('/erp/punch/workforce/', { params });
  return response.data;
};

// Fee Payments & Billing Services
export const getFeePayments = async (params = {}) => {
  const response = await api.get('/erp/payments/', { params });
  return response.data.results || response.data;
};

export const createFeePayment = async (data) => {
  const response = await api.post('/erp/payments/', data);
  return response.data;
};

// Belt & Rank Promotions Services
export const getBeltPromotions = async (params = {}) => {
  const response = await api.get('/erp/belt-promotions/', { params });
  return response.data.results || response.data;
};

export const createBeltPromotion = async (data) => {
  const response = await api.post('/erp/belt-promotions/', data);
  return response.data;
};

export default api;
