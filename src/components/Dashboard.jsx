import React from "react";
// 1. Importe o Outlet e o NavLink
import { Outlet, NavLink } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useTheme } from "./ThemeContext";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav className="d-flex flex-column p-3 sidebar">
        <img src="/imagens/logo-educonnect.png" alt="Logo" />
        <hr />

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/inicio" end>
              <i className="bi bi-house-door-fill me-2"></i>
              Início
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/horarios">
              <i className="bi bi-clock-fill me-2"></i>
              Horários
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/calendario">
              <i className="bi bi-calendar-week-fill me-2"></i>
              Calendário
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/notasfrequencia">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Notas e frequência
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/matricula">
              <i className="bi bi-pencil-square me-2"></i>
              Matrícula
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/requerimentos">
              <i className="bi bi-file-earmark-text-fill me-2"></i>
              Requerimentos
            </NavLink>
          </li>

          <li className="nav-item mb-2">
            <NavLink className="nav-link" to="/dashboard/carteirinha">
              <i className="bi bi-person-badge-fill me-2"></i>
              Carteirinha
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="flex-grow-1 p-4 main-content">
        <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="mb-0"></h3>
          </div>
          <div className="d-flex align-items-center">
            {/* 3. ADICIONE O BOTÃO DE TEMA */}
            <button
              className="btn border-0 p-0 me-3"
              onClick={toggleTheme}
              title={
                theme === "light" ? "Ativar modo noturno" : "Ativar modo claro"
              }
            >
              {/* O ícone muda baseado no tema! */}
              {theme === "light" ? (
                <i className="bi bi-moon-fill fs-4"></i>
              ) : (
                <i className="bi bi-sun-fill fs-4 text-warning"></i>
              )}
            </button>

            {/* Ícone de Notificações */}
            <div className="dropdown">
              <a
                href="#"
                className="btn-notificacoes"
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
                className="dropdown-menu dropdown-menu-end shadow-sm border-0"
                aria-labelledby="dropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Nova tarefa adicionada
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Pagamento recebido
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Ver todas as notificações
                  </a>
                </li>
              </ul>
            </div>

            {/* Divisor vertical (opcional, para espaçar) */}
            <div className="mx-3"></div>

            {/* 2. Perfil do Usuário (com Dropdown) */}
            <div className="dropdown-usuario dropdown">
              <a
                href="#"
                className="d-flex align-items-center dropdown-toggle"
                role="button"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* Imagem de Perfil (Placeholder) */}
                <img
                  src="/imagens/usuario-generico.png" // Use um placeholder por enquanto
                  alt="Foto do usuário"
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                />
                {/* Nome do Usuário */}
                <div className="dados-usuario d-none d-sm-block">
                  {" "}
                  {/* Esconde o nome em telas pequenas */}
                  <strong>Nome Usuário</strong>
                  <br />
                  <div class="fw-light">Aluno</div>
                </div>
              </a>

              {/* O menu dropdown do usuário */}
              <ul
                className="dropdown-menu dropdown-menu-end shadow-sm border-0"
                aria-labelledby="dropdownUser"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Perfil
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Configurações
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="/login">
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
