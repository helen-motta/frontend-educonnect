// src/components/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Criar o Contexto
const AuthContext = createContext();

// 2. Criar o Provedor (o componente que vai gerenciar o estado)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 'user' será null ou um objeto {nome, role}
  const navigate = useNavigate();

  // 3. A LÓGICA DE LOGIN (Onde a mágica acontece)
  const login = (email) => {
    // LÓGICA MOCKADA (sem banco de dados)
    if (email === 'aluno@edu.com') {
      const userData = {
        nome: 'Aluno Genérico',
        role: 'aluno',
        fotoUrl: '/imagens/usuario-generico.png' 
      };
      setUser(userData);
      navigate('/dashboard/inicio'); // Redireciona para o dashboard
    } 
    else if (email === 'prof@edu.com') {
      const userData = {
        nome: 'Prof. Genérico',
        role: 'professor',
        fotoUrl: '/imagens/usuario-generico.png' // Pode ser outra foto
      };
      setUser(userData);
      navigate('/dashboard/inicio'); // Redireciona para o dashboard
    }
    else if (email === 'adm@edu.com') {
      const userData = {
        nome: 'Admin',
        role: 'admin',
        fotoUrl: '/imagens/usuario-generico.png'
      };
      setUser(userData);
      navigate('/dashboard/inicio'); // (Admin teria seu próprio dashboard)
    }
    else {
      // Se o login falhar
      alert('Credenciais inválidas. Use "aluno@edu.com", "prof@edu.com" ou "adm@edu.com" para testar.');
    }
  };

  // 4. A Lógica de Logout
  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  // 5. Disponibiliza o 'user', 'login', 'logout' para todo o App
  const value = {
    user,
    login,
    logout,
    // Adiciona um booleano para facilitar as checagens
    isAuthenticated: user !== null 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. Um "Hook" customizado para facilitar o uso
export const useAuth = () => {
  return useContext(AuthContext);
};