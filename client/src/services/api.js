import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8889';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const triggerImport = async (url) => {
  const response = await api.post('/imports/trigger', { url });
  return response.data;
};

export const fetchImportHistory = async (params) => {
  const response = await api.get('/imports/history', { params });
  return response.data;
};

export const fetchImportById = async (id) => {
  const response = await api.get(`/imports/${id}`);
  return response.data;
};

export const fetchJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const fetchJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const fetchJobStats = async () => {
  const response = await api.get('/jobs/stats');
  return response.data;
};

export default api;
