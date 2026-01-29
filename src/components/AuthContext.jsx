import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('@EduConnect:user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userDataFromApi) => {
    
    setUser(userDataFromApi);

    localStorage.setItem('@EduConnect:user', JSON.stringify(userDataFromApi));
    localStorage.setItem('@EduConnect:token', userDataFromApi.token);

    const role = userDataFromApi.role?.toLowerCase() || userDataFromApi.user?.role?.toLowerCase();

    switch (role) {
      case 'aluno':
        navigate('/dashboard/inicio');
        break;
      case 'professor':
        navigate('/dashboard/inicioprofessor');
        break;
      case 'admin':
        navigate('/dashboard/inicioadm');
        break;
      case 'coordenador':
        navigate('/dashboard/inicio-coordenador');
        break;
      default:
        navigate('/dashboard/inicio'); // fallback
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@EduConnect:user');
    localStorage.removeItem('@EduConnect:token');
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: user !== null 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);