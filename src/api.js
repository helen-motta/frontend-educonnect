import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// 2. Cria o Interceptor: Ele roda ANTES de qualquer requisição sair
api.interceptors.request.use(async (config) => {
  // Busca o token que o seu AuthContext salvou
  const token = localStorage.getItem('@EduConnect:token');

  // Se o token existir, injeta no cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;