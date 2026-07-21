import React, { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const STORAGE_KEY = '@EduConnect:user';

const loadSession = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadSession);
  const navigate = useNavigate();

  const login = (session) => {
    setUser(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem('@EduConnect:token', session.token);
    navigate('/dashboard/inicio', { replace: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('@EduConnect:token');
    navigate('/login', { replace: true });
  };

  const updateProfile = (profile) => {
    const next = { ...user, usuario: { ...user?.usuario, ...profile } };
    setUser(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo(() => ({ user, login, logout, updateProfile, loading: false, isAuthenticated: Boolean(user?.token) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
