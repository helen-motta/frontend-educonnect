import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5055/api',
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@EduConnect:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@EduConnect:user');
      localStorage.removeItem('@EduConnect:token');
    }
    return Promise.reject(error);
  },
);

export const apiErrorMessage = (error, fallback = 'Não foi possível concluir a operação.') =>
  error.response?.data?.message || error.response?.data?.title || fallback;

export default api;
