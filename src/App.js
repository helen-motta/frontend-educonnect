// No seu App.js ou index.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importe seus componentes de página
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inicio from './components/Inicio';
import Requerimentos from './components/Requerimentos';
import Matricula from './components/Matricula';
import Horarios from './components/Horarios';
import NotasFrequencia from './components/NotasFrequencia';
import Calendario from './components/Calendario';
import Carteirinha from './components/Carteirinha';
import { ThemeProvider } from './components/ThemeContext';


function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          
          <Route index element={<Inicio />} /> 
          
          <Route path="inicio" element={<Inicio />} />
          <Route path="requerimentos" element={<Requerimentos />} />
          <Route path="matricula" element={<Matricula />} />
          <Route path="horarios" element={<Horarios />} />
          <Route path="notasfrequencia" element={<NotasFrequencia />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="carteirinha" element={<Carteirinha />} />
        
        </Route>

        {/* Rota Padrão: Redireciona para /login se não achar nada */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;