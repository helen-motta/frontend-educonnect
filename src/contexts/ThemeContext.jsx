import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => { document.documentElement.dataset.bsTheme = theme; localStorage.setItem('theme', theme); }, [theme]);
  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((x) => x === 'light' ? 'dark' : 'light') }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
