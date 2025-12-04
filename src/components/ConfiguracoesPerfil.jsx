import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import "./ConfiguracoesPerfil.css"; // Estilos modernos adicionais

export default function ConfiguracoesPerfil() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("notificacoes");
  const [notifConfig, setNotifConfig] = useState({
    notifTarefa: true,
    notifMudancaSala: true,
    notifCancelamento: false,
  });

  const handleNotifChange = (e) => {
    setNotifConfig((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleSalvarNotificacoes = () => {
    alert("Preferências de notificação salvas! (Simulação)");
  };

  return (
    <>
      <h2 className="fw-semibold mb-4">Configurações do Usuário</h2>

      {/* === Abas horizontais modernas === */}
      <div className="config-tabs mb-4">
        <button
          className={`config-tab ${activeTab === "notificacoes" ? "active" : ""}`}
          onClick={() => setActiveTab("notificacoes")}
        >
          Notificações
        </button>
      </div>

      <div className="card shadow-sm border-0">
        {/* === Aba: Notificações === */}
        {activeTab === "notificacoes" && (
          <div className="fade-in">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Preferências de Notificação</h5>
            </div>
            <div className="card-body p-0">
              <p className="p-4 text-muted">
                Escolha quais notificações você deseja receber por e-mail.
              </p>

              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Tarefa adicionada</strong>
                    <small className="d-block text-muted">
                      Envia alerta quando uma nova tarefa é publicada.
                    </small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="notifTarefa"
                      checked={notifConfig.notifTarefa}
                      onChange={handleNotifChange}
                    />
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Avisos</strong>
                    <small className="d-block text-muted">
                      Notifica sobre avisos adicionados pelos professores.
                    </small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="notifMudancaSala"
                      checked={notifConfig.notifMudancaSala}
                      onChange={handleNotifChange}
                    />
                  </div>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Notas</strong>
                    <small className="d-block text-muted">
                      Notifica quando notas são lançadas.
                    </small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="notifCancelamento"
                      checked={notifConfig.notifCancelamento}
                      onChange={handleNotifChange}
                    />
                  </div>
                </li>
              </ul>
            </div>
            <div className="card-footer bg-white text-end p-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSalvarNotificacoes}
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        )}

        {/* === Aba: Aparência === */}
        {activeTab === "aparencia" && (
          <div className="fade-in">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Aparência</h5>
            </div>
            <div className="card-body p-4">
              <h6>Tema do Portal</h6>
              <p className="text-muted">
                Escolha entre modo claro ou escuro para sua experiência.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className={`theme-card ${
                      theme === "light" ? "active" : ""
                    }`}
                    onClick={() => theme === "dark" && toggleTheme()}
                  >
                    <div className="emoji">🌞</div>
                    <h5>Claro</h5>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className={`theme-card ${
                      theme === "dark" ? "active" : ""
                    }`}
                    onClick={() => theme === "light" && toggleTheme()}
                  >
                    <div className="emoji">🌙</div>
                    <h5>Escuro</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
