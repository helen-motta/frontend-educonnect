import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InicioRouter from './components/InicioRouter';
import Requerimentos from './components/Requerimentos';
import Matricula from './components/Matricula';
import Horarios from './components/Horarios';
import NotasFrequencia from './components/NotasFrequencia';
import Calendario from './components/Calendario';
import Carteirinha from './components/Carteirinha';
import MinhasTurmas from './components/MinhasTurmas';
import AtividadesTurma from './components/AtividadesTurma';
import Comunicados from './components/Comunicados';
import GerenciarUsuarios from './components/GerenciarUsuarios';
import GerenciarCursos from './components/GerenciarCursos';
import Inscricao from './components/Inscricao';
import LogsSistema from './components/LogsSistema';
import GerenciarTurmas from './components/GerenciarTurmas';
import GerenciarRequerimentos from './components/GerenciarRequerimentos';
import ConfiguracoesPortal from './components/ConfiguracoesPortal';
import Salas from './components/Salas';
import Perfil from './components/Perfil';
import ConfiguracoesPerfil from './components/ConfiguracoesPerfil';
import BoasVindas from './components/BoasVindas';
import RedefinirSenha from './components/RedefinirSenha';

import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

const PUBLIC_ROUTES = [
  { path: '/login', element: <Login /> },
  { path: '/redefinir-senha', element: <RedefinirSenha /> },
  { path: '/boas-vindas', element: <BoasVindas /> },
  { path: '/inscricao', element: <Inscricao /> },
];

const DASHBOARD_ROUTES = [
  { path: 'inicio', element: <InicioRouter /> },
  { path: 'perfil', element: <Perfil /> },
  { path: 'configuracoes', element: <ConfiguracoesPerfil /> },
  { path: 'requerimentos', element: <Requerimentos /> },
  { path: 'matricula', element: <Matricula /> },
  { path: 'horarios', element: <Horarios /> },
  { path: 'notasfrequencia', element: <NotasFrequencia /> },
  { path: 'calendario', element: <Calendario /> },
  { path: 'carteirinha', element: <Carteirinha /> },
  { path: 'minhas-turmas', element: <MinhasTurmas /> },
  { path: 'atividades-turma', element: <AtividadesTurma /> },
  { path: 'comunicados', element: <Comunicados /> },
  { path: 'salas', element: <Salas /> },
  { path: 'gerenciar-usuarios', element: <GerenciarUsuarios /> },
  { path: 'gerenciar-cursos', element: <GerenciarCursos /> },
  { path: 'logs', element: <LogsSistema /> },
  { path: 'gerenciar-turmas', element: <GerenciarTurmas /> },
  { path: 'gerenciar-requerimentos', element: <GerenciarRequerimentos /> },
  { path: 'configuracoes-portal', element: <ConfiguracoesPortal /> },
  { path: 'calendario-professor', element: <Calendario /> },
];

function App() {
  const protectedDashboard = (
    <PrivateRoute>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </PrivateRoute>
  );

  return (
    <ThemeProvider>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {PUBLIC_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route path="/dashboard" element={protectedDashboard}>
          {DASHBOARD_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
