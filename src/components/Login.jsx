import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import "./Login.css"; // Seu CSS
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const redirecionarParaDashboard = () => {
    console.log("Redirecionando...");
    navigate("/dashboard/inicio");
  };

  return (
    // O 'wrapper' que centraliza tudo na tela
    <div className="wrapper d-flex align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      
      {/* O 'login-container' vem do seu CSS e define a largura máxima de 900px
        em telas grandes, como definimos antes.
      */}
      <div className="container login-container">
        
        {/* Esta 'row' é o card principal.
          - 'shadow': Adiciona a sombra suave
          - 'rounded-4': Deixa as bordas bem arredondadas (como na imagem)
          - 'overflow: hidden': Garante que os filhos não "vazem" das bordas
        */}
        <div className="row bg-white shadow rounded-4" style={{ overflow: "hidden" }}>
          
          {/* LADO ESQUERDO (Formulário) */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-5">
            <div style={{ width: "100%", maxWidth: "450px" }}>
              
              <h4 className="mb-4">Iniciar sessão</h4>
              
              <form>
                {/* ATUALIZAÇÃO: Usando 'form-floating' do Bootstrap
                  para replicar o efeito da imagem.
                */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com" // Placeholder é necessário, mas não será visto
                    required
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
                  />
                  <label htmlFor="floatingPassword">Senha</label>
                </div>

                {/* ATUALIZAÇÃO: Usando classes customizadas para o estilo */}
                <button
                  type="button"
                  className="btn btn-custom-login w-100"
                  onClick={redirecionarParaDashboard}
                >
                  Entrar
                </button>
              </form>
              
              <a href="/esqueci-senha" className="d-block mt-3 link-custom-login">
                Esqueci minha senha
              </a>
            </div>
          </div>

          {/* LADO DIREITO (Imagens) */}
          {/* ATUALIZAÇÃO: Adicionamos a classe 'right-side-login' 
            para aplicar o fundo escuro e as imagens.
          */}
          <div className="col-md-6 d-none d-md-block p-0 position-relative right-side-login">
            {/* O 'img-container' do seu CSS cuida do resto */}
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
    </div>
  );
}