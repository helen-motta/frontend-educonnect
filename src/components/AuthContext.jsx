import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('@EduConnect:user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userDataFromApi) => {
    setUser(userDataFromApi);

    localStorage.setItem('@EduConnect:user', JSON.stringify(userDataFromApi));
    localStorage.setItem('@EduConnect:token', userDataFromApi.token);

    navigate('/dashboard/inicio');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@EduConnect:user');
    localStorage.removeItem('@EduConnect:token');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user !== null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
