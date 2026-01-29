import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inicio from './components/Inicio';
import InicioProfessor from './components/InicioProfessor';
import InicioAdm from './components/InicioAdm';
import Requerimentos from './components/Requerimentos';
import Matricula from './components/Matricula';
import Horarios from './components/Horarios';
import NotasFrequencia from './components/NotasFrequencia';
import Calendario from './components/Calendario';
import Carteirinha from './components/Carteirinha';
import MinhasTurmas from './components/MinhasTurmas';
import Comunicados from './components/Comunicados';
import GerenciarUsuarios from './components/GerenciarUsuarios';
import GerenciarCursos from './components/GerenciarCursos';
import Inscricao from './components/Inscricao';
import LogsSistema from './components/LogsSistema';
import GerenciarTurmas from './components/GerenciarTurmas';
import GerenciarRequerimentos from './components/GerenciarRequerimentos';
import ConfiguracoesPortal from './components/ConfiguracoesPortal';
import InicioCoordenador from './components/InicioCoordenador';
import CalendarioProfessor from './components/CalendarioProfessor';
import Perfil from './components/Perfil';
import ConfiguracoesPerfil from './components/ConfiguracoesPerfil';
import BoasVindas from './components/BoasVindas';
import RedefinirSenha from './components/RedefinirSenha';

import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';


function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="boas-vindas" element={<BoasVindas />} />
        <Route path="inscricao" element={<Inscricao />} />

        <Route path="/dashboard" element={<Dashboard />}>
          
          <Route index element={<Inicio />} /> 
          
          <Route path="inicio" element={<Inicio />} />
          <Route path="inicioprofessor" element={<InicioProfessor />} />
          <Route path="inicio-coordenador" element={<InicioCoordenador />} />
          <Route path="inicioadm" element={<InicioAdm />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracoes" element={<ConfiguracoesPerfil />} />
          <Route path="requerimentos" element={<Requerimentos />} />
          <Route path="matricula" element={<Matricula />} />
          <Route path="horarios" element={<Horarios />} />
          <Route path="notasfrequencia" element={<NotasFrequencia />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="carteirinha" element={<Carteirinha />} />
          <Route path="minhas-turmas" element={<MinhasTurmas />} />
          <Route path="comunicados" element={<Comunicados />} />
          <Route path="gerenciar-usuarios" element={<GerenciarUsuarios />} />
          <Route path="gerenciar-cursos" element={<GerenciarCursos />} />
          <Route path="logs" element={<LogsSistema />} />
          <Route path="gerenciar-turmas" element={<GerenciarTurmas />} />
          <Route path="gerenciar-requerimentos" element={<GerenciarRequerimentos />} />
          <Route path="configuracoes-portal" element={<ConfiguracoesPortal />} />
          <Route path="calendario-professor" element={<CalendarioProfessor />} />

        
        </Route>

        <Route path="*" element={<Navigate to="/boas-vindas" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;