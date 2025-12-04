import React, { useState } from "react"; // 1. 'useState' foi importado
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import "./Login.css"; // Seu CSS
import { useAuth } from './AuthContext';

export default function Login() {
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // --- MUDANÇA 2: States para o Modal ---
  const [showModal, setShowModal] = useState(false); // Controla a visibilidade do modal
  const [resetEmail, setResetEmail] = useState(''); // Controla o e-mail no formulário do modal

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Por favor, insira um e-mail.');
      return;
    }
    login(email);
  };

  // --- MUDANÇA 3: Handlers para o Modal ---
  const handleCloseModal = () => {
    setShowModal(false);
    setResetEmail(''); // Limpa o e-mail ao fechar
  };
  
  // Previne o comportamento padrão do link '#' e abre o modal
  const handleShowModal = (e) => {
    e.preventDefault(); 
    setShowModal(true);
  };

  // Simula o envio do e-mail de reset
  const handleResetSubmit = (e) => {
    e.preventDefault();
    alert(`(Simulação) Um e-mail de redefinição de senha foi enviado para ${resetEmail}.`);
    handleCloseModal(); // Fecha o modal após o envio
  };
  // --- FIM DAS MUDANÇAS 3 ---

  return (
    // O 'wrapper' que centraliza tudo na tela
    <div className="wrapper d-flex align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f9f9fa" }}>
      
      <div className="container login-container">
        <div className="row bg-white shadow rounded-4" style={{ overflow: "hidden" }}>
          
          {/* LADO ESQUERDO (Formulário) */}
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
                  />
                  <label htmlFor="floatingPassword">Senha</label>
                </div>

                <button
                  type="submit" 
                  className="btn btn-custom-login w-100 btn-lg"
                >
                  Entrar
                </button>
              </form>
              
              {/* --- MUDANÇA 4: Link agora abre o modal --- */}
              <a 
                href="#" 
                className="d-block mt-3 link-custom-login"
                onClick={handleShowModal} // Chama a função para abrir o modal
              >
                Esqueci minha senha
              </a>
            </div>
          </div>

          {/* LADO DIREITO (Imagens) */}
          <div className="col-md-6 d-none d-md-block p-0 position-relative right-side-login">
            <div className="img-container">
              {/* ... (suas imagens) ... */}
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

      {/* --- MUDANÇA 5: O JSX DO MODAL --- */}
      {/* Mostrado condicionalmente com base no state 'showModal' */}
      {showModal && (
        <>
          {/* O Modal */}
<div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content simple-modal">

      <form onSubmit={handleResetSubmit}>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title w-100 text-center fw-medium">Redefinir senha</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseModal}
            aria-label="Fechar"
          ></button>
        </div>

        <div className="modal-body text-center">
          <p className="text-muted mb-4">
            Informe seu e-mail cadastrado para receber o link de redefinição.
          </p>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="resetEmailInput"
              placeholder="seu@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="resetEmailInput">E-mail</label>
          </div>
        </div>

        <div className="modal-footer border-0 d-flex justify-content-end pt-0">
          <button
            type="button"
            className="btn btn-light me-2"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: '#d8f17b', color: '#222', border: 'none' }}
            disabled={!resetEmail}
          >
            Enviar link
          </button>
        </div>
      </form>

    </div>
  </div>
</div>

          {/* O Fundo Escuro (Backdrop) */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {/* --- FIM DA MUDANÇA 5 --- */}
      
    </div>
  );
}