import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import "./Login.css"; 
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import LoadingOverlay from './LoadingOverlay';

export default function Login() {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); 

  const [showModal, setShowModal] = useState(false); 
  const [resetEmail, setResetEmail] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const [toast, setToast] = useState({ show: false, message: '', type: 'danger' });

  const showNotification = (message, type = 'danger') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha })
      });
      const data = await response.json();
      if (response.ok) {
        login(data); 
        const token = response.data.token;
        localStorage.setItem('@App:token', token);
  
        localStorage.setToken(token);
        navigate("/Dashboard/Inicio");
      } else {
        showNotification(data.message || "Erro ao realizar login");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      showNotification("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Auth/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();
      showNotification(data.mensagem, 'success');
      handleCloseModal();
    } catch (error) {
      showNotification("Erro ao solicitar redefinição.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResetEmail('');
  };
  
  const handleShowModal = (e) => {
    e.preventDefault(); 
    setShowModal(true);
  };

  return (
    <>
    {loading && <LoadingOverlay />}

    <div className="wrapper d-flex align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f9f9fa" }}>

    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1055 }}>
    <div className={`toast align-items-center text-white bg-${toast.type} border-0 ${toast.show ? 'show' : 'hide'}`} role="alert">
      <div className="d-flex">
        <div className="toast-body">
          {toast.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })}></button>
      </div>
    </div>
  </div>
      <div className="container login-container">
        <div className="row bg-white shadow rounded-4" style={{ overflow: "hidden" }}>
          
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-5">
            <div style={{ width: "100%", maxWidth: "450px" }}>
              <h4 className="mb-4">Iniciar sessão</h4>
              
              <form onSubmit={handleLoginSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="floatingInput">E-mail</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="floatingPassword">Senha</label>
                </div>

                <button
                  type="submit" 
                  className="btn btn-custom-login w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Entrar"}
                </button>
              </form>
              
              <a 
                href="#" 
                className="d-block mt-3 link-custom-login"
                onClick={handleShowModal} 
              >
                Esqueci minha senha
              </a>
            </div>
          </div>

          <div className="col-md-6 d-none d-md-block p-0 position-relative right-side-login">

            <div className="img-container">

              <img src="/imagens/logo-educonnect.png" id="img-logo" alt="Logo" />

              <img src="/imagens/chapeu-5.png" className="chapeus" id="chapeu-1" alt="" />

              <img src="/imagens/chapeu-2.png" className="chapeus" id="chapeu-2" alt="" />

              <img src="/imagens/chapeu-6.png" className="chapeus" id="chapeu-3" alt="" />

              <img src="/imagens/chapeu-5.png" className="chapeus" id="chapeu-4" alt="" />

              <img src="/imagens/chapeu-4.png" className="chapeus" id="chapeu-5" alt="" />

              <img src="/imagens/chapeu-6.png" className="chapeus" id="chapeu-6" alt="" />

              <img src="/imagens/chapeu-7.png" className="chapeus" id="chapeu-7" alt="" />

              <img

                src="/imagens/pessoas.png"

                id="img-pessoas"

                alt="Pessoas estudando"

              />

            </div>

          </div>

        </div>

      </div>


      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content simple-modal">
                <form onSubmit={handleResetSubmit}>
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title w-100 text-center fw-medium">Redefinir senha</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body text-center">
                    <p className="text-muted mb-4">Informe seu e-mail cadastrado.</p>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="resetEmailInput"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="resetEmailInput">E-mail</label>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#d8f17b', color: '#222', border: 'none' }} onClick={handleResetSubmit}>Enviar link</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  </>
  );
}