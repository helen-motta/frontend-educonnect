import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Função para pegar o tema salvo no localStorage
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
  }
  // Se não tiver nada salvo, usa o tema 'light'
  return 'light';
};

// 2. Criar o Contexto
export const ThemeContext = createContext();

// 3. Criar o "Provedor" (o componente que vai gerenciar o tema)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // 4. A função que troca o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 5. O "Efeito Colateral": Atualiza o localStorage E o HTML
  useEffect(() => {
    // Salva a preferência no localStorage
    window.localStorage.setItem('theme', theme);
    
    // ATUALIZA O HTML: Esta é a mágica do Bootstrap!
    // Nós colocamos data-bs-theme="dark" ou data-bs-theme="light"
    // na tag <html> (document.documentElement)
    document.documentElement.setAttribute('data-bs-theme', theme);
    
  }, [theme]);

  // 6. Disponibiliza o tema e a função para os componentes "filhos"
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 7. Um "hook" customizado para facilitar o uso
export const useTheme = () => useContext(ThemeContext);