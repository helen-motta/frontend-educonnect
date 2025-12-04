import React from "react";
import { Outlet, NavLink, Navigate, Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useAuth } from './AuthContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import MenuAluno from './MenuAluno';
import MenuProfessor from './MenuProfessor';
import MenuAdm from './MenuAdm';
import MenuCoordenador from "./MenuCoordenador";

// (Opcional) Função helper para traduzir os papéis
const getTitulo = (role) => {
  switch (role) {
    case 'aluno':
      return 'Portal do Aluno';
    case 'professor':
      return 'Portal do Professor';
    case 'coordenador':
      return 'Painel do Coordenador';
    case 'admin':
      return 'Painel de Administração';
    default:
      return 'Dashboard';
  }
};

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      
      <nav className="d-flex flex-column p-3 sidebar">
        <img src="/imagens/logo-educonnect.png" alt="Logo" className="img-fluid sidebar-logo" />
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          {user.role === 'aluno' && <MenuAluno />}
          {user.role === 'professor' && <MenuProfessor />}
          {user.role === 'admin' && <MenuAdm />}
          {user.role === 'coordenador' && <MenuCoordenador />}
        </ul>
      </nav>

      <main className="flex-grow-1 p-4 main-content">
        <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="mb-0">{getTitulo(user.role)}</h3>
          </div>
          <div className="d-flex align-items-center">
            
            {/* Botão de Tema (Sempre visível) */}
            <button
              className="btn border-0 p-0 me-3"
              onClick={toggleTheme}
              title={
                theme === "light" ? "Ativar modo noturno" : "Ativar modo claro"
              }
            >
              {theme === "light" ? (
                <i className="bi bi-moon-fill fs-4"></i>
              ) : (
                <i className="bi bi-sun-fill fs-4 text-warning"></i>
              )}
            </button>

            {/* --- MUDANÇA AQUI: Sino e Divisor são condicionais --- */}
            {user.role === 'aluno' && (
              <>
                {/* Ícone de Notificações (Só para Aluno) */}
                <div className="dropdown">
                  <a
                    href="#"
                    className="text-decoration-none" 
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-bell-fill fs-4 position-relative">
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    </i>
                  </a>

                  {/* O menu dropdown de notificações */}
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm border-0 dropdown-notifications" // <-- Classe customizada
                  aria-labelledby="dropdownMenuLink"
                  style={{ minWidth: '380px' }} // <-- Largura aumentada
                >
                  {/* 1. Cabeçalho */}
                  <li>
                    <h6 className="dropdown-header">
                      Notificações
                      {/* MUDANÇA: Atualizado para 3 */}
                      <span className="badge bg-danger ms-2">3 novas</span>
                    </h6>
                  </li>
                  <li><hr className="dropdown-divider m-0" /></li>
                  
                  {/* 2. Corpo com Scroll (Div para limitar a altura) */}
                  <div className="dropdown-scroll-area">
                    
                    {/* Notificação 1 (Tarefa) */}
                    <li>
                      <a className="dropdown-item d-flex align-items-center py-3" href="#">
                        {/* ÍCONE REMOVIDO */}
                        <div className="flex-grow-1">
                          <strong>Nova tarefa adicionada</strong>
                          <div className="text-muted small">Cálculo I - Lista de Exercícios 2</div>
                          <small className="text-muted">10 min atrás</small>
                        </div>
                        {/* Ponto de "Não lido" */}
                        <i className="bi bi-circle-fill text-primary ms-auto" style={{fontSize: '8px'}}></i>
                      </a>
                    </li>

                    {/* Notificação 2 (Mudança de Sala) */}
                    <li>
                      <a className="dropdown-item d-flex align-items-center py-3" href="#">
                        {/* ÍCONE REMOVIDO */}
                        <div className="flex-grow-1">
                          <strong>Aviso: Mudança de sala</strong>
                          <div className="text-muted small">Prof. Silva (Cálculo I): A aula de hoje (13/11) será na sala B-105.</div>
                          <small className="text-muted">1 hora atrás</small>
                        </div>
                        <i className="bi bi-circle-fill text-primary ms-auto" style={{fontSize: '8px'}}></i>
                      </a>
                    </li>

                    {/* Notificação 3 (Aula Cancelada) */}
                    <li>
                      <a className="dropdown-item d-flex align-items-center py-3" href="#">
                        {/* ÍCONE REMOVIDO */}
                        <div className="flex-grow-1">
                          <strong>Aviso: Aula cancelada</strong>
                          <div className="text-muted small">Prof. Ana (Física II): A aula de amanhã (14/11) foi cancelada.</div>
                          <small className="text-muted">3 horas atrás</small>
                        </div>
                        <i className="bi bi-circle-fill text-primary ms-auto" style={{fontSize: '8px'}}></i>
                      </a>
                    </li>

                  </div> {/* Fim da Div de scroll */}

                  {/* 3. Rodapé */}
                  <li><hr className="dropdown-divider m-0" /></li>
                  <li>
                    <a className="dropdown-item text-center py-2 dropdown-footer-link" href="#">
                      Ver todas as notificações
                    </a>
                  </li>
                </ul>
                </div>

                {/* Divisor vertical (Só aparece se o sino estiver visível) */}
                <div className="vr mx-3"></div>
              </>
            )}
            {/* --- FIM DA MUDANÇA --- */}


            {/* Perfil do Usuário (Sempre visível) */}
            <div className="dropdown-usuario dropdown">
              <a
                href="#"
                className="d-flex align-items-center text-decoration-none dropdown-toggle"
                role="button"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.fotoUrl || "/imagens/usuario-generico.png"}
                  alt="Foto do usuário"
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                />
                <div className="dados-usuario d-none d-sm-block">
                  <strong>{user.nome}</strong>
                  <br />
                  <div className="fw-light text-capitalize">{user.role}</div>
                </div>
              </a>

              {/* O menu dropdown do usuário */}
              <ul
                className="dropdown-menu dropdown-menu-end shadow-sm border-0"
                aria-labelledby="dropdownUser"
              >
                <li>
                  <Link className="dropdown-item" to="/dashboard/perfil">
                    Perfil
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/dashboard/configuracoes">
                    Configurações
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    Sair
                  </a>
                </li>
              </ul>
            </div>
          </div>{" "}
          {/* Fim do wrapper da direita */}
        </header>
        
        <Outlet />
      </main>
    </div>
  );
}