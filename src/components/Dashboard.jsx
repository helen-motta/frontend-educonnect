import React, { useState, useEffect, useRef } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import { Toast, ToastContainer } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";

import MenuAluno from "./MenuAluno";
import MenuProfessor from "./MenuProfessor";
import MenuAdm from "./MenuAdm";
import MenuCoordenador from "./MenuCoordenador";

const getTitulo = (role) => {
  switch (role) {
    case 4:
      return "Portal do Aluno";
    case 3:
      return "Portal do Professor";
    case 2:
      return "Painel do Coordenador";
    case 1:
      return "Painel de Administração";
    default:
      return "Dashboard";
  }
};

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const dropdownAreaRef = useRef(null);

  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Nova nota lançada",
      descricao: "Sua nota de Engenharia de Software (P1) foi publicada.",
      tempo: "5 min atrás",
      lida: false,
      tipo: "nota",
    },
    {
      id: 2,
      titulo: "Aviso: Mudança de sala",
      descricao: "Prof. Silva (Cálculo I): A aula de hoje será na sala B-105.",
      tempo: "1 hora atrás",
      lida: false,
      tipo: "aviso",
    },
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ titulo: "", msg: "" });

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  const marcarComoLida = (id) => {
    setNotificacoes(
      notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownAreaRef.current &&
        !dropdownAreaRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav className="d-flex flex-column p-3 sidebar">
        <img
          src="/imagens/logo-educonnect.png"
          alt="Logo"
          className="img-fluid sidebar-logo mb-3"
        />

        <hr />

        <ul className="nav nav-pills flex-column mb-auto">
          {user.usuario.idPerfil === 1 && <MenuAdm />}
          {user.usuario.idPerfil === 2 && <MenuCoordenador />}
          {user.usuario.idPerfil === 3 && <MenuProfessor />}
          {user.usuario.idPerfil === 4 && <MenuAluno />}
        </ul>
      </nav>

      <main className="flex-grow-1 p-4 main-content">
        <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <h3 className="mb-0">{getTitulo(user.usuario.idPerfil)}</h3>

          <div
            className="d-flex align-items-center position-relative"
            ref={dropdownAreaRef}
          >
            <button className="btn border-0 p-0 me-3" onClick={toggleTheme}>
              {theme === "light" ? (
                <i className="bi bi-moon-fill fs-4"></i>
              ) : (
                <i className="bi bi-sun-fill fs-4 text-warning"></i>
              )}
            </button>

            {user.usuario.idPerfil === 4 && (
              <>
                <div className="position-relative">
                  <button
                    className="btn border-0 p-0 position-relative shadow-none"
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      setUserOpen(false);
                    }}
                  >
                    <i className="bi bi-bell-fill fs-4"></i>

                    {naoLidasCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {naoLidasCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <ul
                      className="dropdown-menu dropdown-menu-end show shadow border-0 dropdown-notifications mt-2"
                      style={{
                        minWidth: "350px",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      <li>
                        <h6 className="dropdown-header d-flex justify-content-between align-items-center py-3">
                          Notificações
                          {naoLidasCount > 0 && (
                            <span className="badge bg-danger">
                              {naoLidasCount} novas
                            </span>
                          )}
                        </h6>
                      </li>

                      <li>
                        <hr className="dropdown-divider m-0" />
                      </li>

                      <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                        {notificacoes.length > 0 ? (
                          notificacoes.map((n) => (
                            <li
                              key={n.id}
                              onClick={() => marcarComoLida(n.id)}
                            >
                              <button
                                className={`dropdown-item py-3 ${
                                  !n.lida ? "bg-light-subtle" : ""
                                }`}
                                type="button"
                              >
                                <div className="d-flex justify-content-between align-items-start">
                                  <strong className="small">
                                    {n.titulo}
                                  </strong>

                                  {!n.lida && (
                                    <i
                                      className="bi bi-circle-fill text-primary"
                                      style={{ fontSize: "7px" }}
                                    ></i>
                                  )}
                                </div>

                                <div className="text-muted small text-wrap lh-sm my-1 text-start">
                                  {n.descricao}
                                </div>

                                <small
                                  className="text-muted d-block text-start"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {n.tempo}
                                </small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="p-4 text-center text-muted small">
                            Nenhuma notificação nova.
                          </li>
                        )}
                      </div>

                      <li>
                        <hr className="dropdown-divider m-0" />
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-center py-2 small fw-bold text-primary"
                          onClick={() =>
                            setNotificacoes(
                              notificacoes.map((n) => ({
                                ...n,
                                lida: true,
                              }))
                            )
                          }
                        >
                          Marcar todas como lidas
                        </button>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="vr mx-3"></div>
              </>
            )}

            <div className="position-relative">
              <button
                type="button"
                className="btn btn-link d-flex align-items-center text-decoration-none p-0 border-0 shadow-none text-dark"
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
              >
                <img
                  src={user.fotoUrl || "/imagens/usuario-generico.png"}
                  alt="Perfil"
                  width="38"
                  height="38"
                  className="rounded-circle me-2 border"
                />

                <div className="text-start">
                  <div className="fw-bold lh-1 small">teste</div>

                  <small
                    className="text-muted text-capitalize"
                    style={{ fontSize: "0.75rem" }}
                  >
                    teste
                  </small>
                </div>

                <i className="bi bi-chevron-down ms-2 small"></i>
              </button>

              {userOpen && (
                <ul className="dropdown-menu dropdown-menu-end show shadow border-0 mt-2"
                style={{ position: "absolute", right: 0 }}>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/dashboard/perfil"
                    >
                      <i className="bi bi-person me-2"></i>
                      Perfil
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/dashboard/configuracoes"
                    >
                      <i className="bi bi-gear me-2"></i>
                      Configurações
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sair
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </header>

        <Outlet />

        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={5000}
            autohide
            className="border-0 shadow"
          >
            <Toast.Header className="bg-primary text-white border-0">
              <i className="bi bi-info-circle me-2"></i>
              <strong className="me-auto">{toastContent.titulo}</strong>
            </Toast.Header>

            <Toast.Body
              className={
                theme === "dark" ? "bg-dark text-white" : "bg-white"
              }
            >
              {toastContent.msg}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </main>
    </div>
  );
}