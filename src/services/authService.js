import api from './api';

export const authenticate = async (email, senha) => (await api.post('/auth/login', { email, senha })).data;
export const requestPasswordReset = async (email) => (await api.post('/auth/esqueci-senha', { email })).data;
export const resetPassword = async (payload) => (await api.post('/auth/reset-senha', payload)).data;
