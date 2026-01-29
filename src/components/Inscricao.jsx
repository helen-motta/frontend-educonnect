import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import './Inscricao.css'; 

const MOCK_CURSOS_DISPONIVEIS = [
  { id: 'c1', nome: 'Engenharia de Software', turnos: ['Matutino', 'Noturno'] },
  { id: 'c2', nome: 'Direito', turnos: ['Matutino', 'Noturno'] },
  { id: 'c3', nome: 'Medicina', turnos: ['Integral'] },
  { id: 'c4', nome: 'Administração', turnos: ['Noturno'] },
  { id: 'c5', nome: 'Arquitetura e Urbanismo', turnos: ['Matutino'] }
];

const VALORES_INICIAIS_FORM = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  cursoId: '',
  turno: ''
};

export default function Inscricao() {
  const [formData, setFormData] = useState(VALORES_INICIAIS_FORM);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRealizarInscricao = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setMensagem({ 
        tipo: 'success', 
        texto: `Parabéns, ${formData.nome}! Sua pré-inscrição foi realizada com sucesso.` 
      });

      setFormData(VALORES_INICIAIS_FORM);
      setIsSubmitting(false);
      setTimeout(() => setMensagem({ tipo: '', texto: '' }), 5000);
    }, 1000);
  };

  const getTurnosDisponiveis = () => {
    const cursoSelecionado = MOCK_CURSOS_DISPONIVEIS.find(c => c.id === formData.cursoId);
    return cursoSelecionado ? cursoSelecionado.turnos : [];
  };

  return (
    <div className="welcome-wrapper pb-5">
      <div className="shape shape-top"></div>
      
      <nav className="navbar mb-4">
        <img className="logo" src="/imagens/logo-educonnect.png" alt="Logo EduConnect" style={{ cursor: 'pointer' }} onClick={() => window.location.href='/'} />
        <div className="nav-links">
          <a href="/">← Voltar ao Início</a>
        </div>
      </nav>

      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            
            <div className="card shadow border-0" style={{ borderRadius: '25px', overflow: 'hidden' }}>
              <div className="card-header text-white text-center py-4" style={{ backgroundColor: '#1d1c2dff', border: 'none' }}>
                <h2 className="mb-0 fw-bold">Vestibular EduConnect</h2>
                <p className="mb-0 opacity-75">Sua jornada acadêmica começa aqui</p>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                {mensagem.texto && (
                  <div className={`alert alert-${mensagem.tipo} border-0 shadow-sm mb-4`} role="alert">
                    {mensagem.texto}
                  </div>
                )}

                <form onSubmit={handleRealizarInscricao}>
                  <h5 className="mb-3 fw-bold" style={{ color: '#1d1c2dff' }}>Dados Pessoais</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">Nome Completo</label>
                      <input type="text" className="form-control custom-input" name="nome" value={formData.nome} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">CPF</label>
                      <input type="text" className="form-control custom-input" name="cpf" value={formData.cpf} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Data de Nascimento</label>
                      <input type="date" className="form-control custom-input" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <h5 className="mb-3 fw-bold" style={{ color: '#1d1c2dff' }}>Contato</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">E-mail</label>
                      <input type="email" className="form-control custom-input" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">WhatsApp</label>
                      <input type="tel" className="form-control custom-input" name="telefone" value={formData.telefone} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <h5 className="mb-3 fw-bold" style={{ color: '#1d1c2dff' }}>Curso</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Selecione o Curso</label>
                      <select className="form-select custom-input" name="cursoId" value={formData.cursoId} onChange={handleInputChange} required>
                        <option value="">Escolha...</option>
                        {MOCK_CURSOS_DISPONIVEIS.map(curso => (
                          <option key={curso.id} value={curso.id}>{curso.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Turno</label>
                      <select className="form-select custom-input" name="turno" value={formData.turno} onChange={handleInputChange} required disabled={!formData.cursoId}>
                        <option value="">Escolha...</option>
                        {getTurnosDisponiveis().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn-primary py-3" disabled={isSubmitting}>
                      {isSubmitting ? 'PROCESSANDO...' : 'CONFIRMAR INSCRIÇÃO'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}