import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import './BoasVindas.css';

const BoasVindas = () => {
  return (
    <div className="welcome-wrapper">
      <div className="shape shape-top"></div>
      <div className="shape shape-bottom"></div>

      <nav className="navbar">
        <img className="logo" src="/imagens/logo-educonnect.png" alt="Logo EduConnect" />
        <div className="nav-links">
          <a href="#home">Início</a>
          <a href="#about">Sobre</a>
          <a href="#contact">Contato</a>
        </div>
      </nav>

      <main className="hero-container" id="home">
        <div className="hero-content">
          <h1>Plataforma online para sua educação</h1>
          <p>
            Transforme seu futuro com a EduConnect. Acesse conteúdos exclusivos, 
            conecte-se com mentores e gerencie sua jornada acadêmica em um só lugar.
          </p>
          <div className="hero-buttons">
            <button className="btn-inscricao" onClick={() => window.location.href='/inscricao'}>
              INSCREVER-SE
            </button>
            <button className="btn-aluno" onClick={() => window.location.href='/login'}>
              JÁ SOU ALUNO
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="image-circle">
            <img 
              src="/imagens/boas-vindas.png" 
              alt="Estudante graduada" 
              className="main-illustration"
            />
          </div>
          <div className="notification-badge">
            <span className="badge-icon">🚀</span>
            <span className="badge-text">Conecte-se!</span>
          </div>
        </div>
      </main>

      {/* SEÇÃO SOBRE (MOCK DATA) */}
      <section className="info-section" id="about">
        <h2>Sobre a EduConnect</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎓 Para Alunos</h3>
            <p>Acompanhe suas notas, frequência e materiais de aula em tempo real. Estude de onde quiser.</p>
          </div>
          <div className="feature-card">
            <h3>📝 Para Professores</h3>
            <p>Lançamento de notas simplificado, gestão de pautas e comunicação direta com a turma.</p>
          </div>
          <div className="feature-card">
            <h3>🏛️ Gestão Acadêmica</h3>
            <p>Controle administrativo completo, desde a matrícula até a emissão de diplomas digitais.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO */}
      <section className="info-section contact-section" id="contact">
        <h2>Fale Conosco</h2>
        <div className="contact-container">
          <p>Dúvidas sobre o sistema ou suporte técnico?</p>
          <p><strong>E-mail:</strong> suporte@educonnect.com.br</p>
          <p><strong>Telefone:</strong> (11) 4002-8922</p>
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-whatsapp"></i>
          </div>
        </div>
      </section>

      <footer className="simple-footer">
        <p>&copy; 2026 EduConnect - Gestão Educacional Inteligente</p>
      </footer>
    </div>
  );
};

export default BoasVindas;