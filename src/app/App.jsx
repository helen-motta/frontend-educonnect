import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../App.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import InicioRouter from '../components/InicioRouter';
import Requerimentos from '../components/Requerimentos';
import Matricula from '../components/Matricula';
import Horarios from '../components/Horarios';
import NotasFrequencia from '../components/NotasFrequencia';
import Calendario from '../components/Calendario';
import Carteirinha from '../components/Carteirinha';
import MinhasTurmas from '../components/MinhasTurmas';
import AtividadesTurma from '../components/AtividadesTurma';
import Comunicados from '../components/Comunicados';
import GerenciarUsuarios from '../components/GerenciarUsuarios';
import GerenciarCursos from '../components/GerenciarCursos';
import Inscricao from '../components/Inscricao';
import LogsSistema from '../components/LogsSistema';
import GerenciarTurmas from '../components/GerenciarTurmas';
import GerenciarRequerimentos from '../components/GerenciarRequerimentos';
import ConfiguracoesPortal from '../components/ConfiguracoesPortal';
import Salas from '../components/Salas';
import Perfil from '../components/Perfil';
import ConfiguracoesPerfil from '../components/ConfiguracoesPerfil';
import BoasVindas from '../components/BoasVindas';
import RedefinirSenha from '../components/RedefinirSenha';

const dashboardRoutes = [
  ['inicio', <InicioRouter />], ['perfil', <Perfil />], ['configuracoes', <ConfiguracoesPerfil />],
  ['requerimentos', <Requerimentos />], ['matricula', <Matricula />], ['horarios', <Horarios />],
  ['notasfrequencia', <NotasFrequencia />], ['calendario', <Calendario />], ['carteirinha', <Carteirinha />],
  ['minhas-turmas', <MinhasTurmas />], ['atividades-turma', <AtividadesTurma />], ['comunicados', <Comunicados />],
  ['salas', <Salas />], ['gerenciar-usuarios', <GerenciarUsuarios />], ['gerenciar-cursos', <GerenciarCursos />],
  ['logs', <LogsSistema />], ['gerenciar-turmas', <GerenciarTurmas />], ['gerenciar-requerimentos', <GerenciarRequerimentos />],
  ['configuracoes-portal', <ConfiguracoesPortal />], ['calendario-professor', <Calendario />],
];

export default function App() {
  return <ThemeProvider><BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<Login />} /><Route path="/redefinir-senha" element={<RedefinirSenha />} />
    <Route path="/boas-vindas" element={<BoasVindas />} /><Route path="/inscricao" element={<Inscricao />} />
    <Route path="/dashboard" element={<PrivateRoute><ErrorBoundary><Dashboard /></ErrorBoundary></PrivateRoute>}>
      {dashboardRoutes.map(([path, element]) => <Route key={path} path={path} element={element} />)}
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></AuthProvider></BrowserRouter></ThemeProvider>;
}
