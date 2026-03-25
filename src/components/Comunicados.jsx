import React, { useState } from 'react';
import './Comunicados.css';

const MOCK_TURMAS = [
  { id: 't1', nome: 'Cálculo I - Turma A' },
  { id: 't2', nome: 'Física II - Turma B' },
];

const MOCK_COMUNICADOS_INICIAIS = [
  {
    id: 101,
    assunto: 'Aula de Segunda Trocada de Sala',
    mensagem: 'Pessoal, a aula de segunda-feira (20/11) será na sala B-105, não na B-102.',
    data: '18/11/2025',
    turmas: [{ id: 't1', nome: 'Cálculo I - Turma A' }]
  },
];

export default function Comunicados() {
  const [comunicados, setComunicados] = useState(MOCK_COMUNICADOS_INICIAIS);
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);

  // Alternar seleção de turmas de forma simples
  const toggleTurma = (id) => {
    setTurmasSelecionadas(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleEnviarComunicado = (e) => {
    e.preventDefault();
    if (!assunto || !mensagem || turmasSelecionadas.length === 0) return;

    const novoComunicado = {
      id: Date.now(),
      assunto,
      mensagem,
      data: new Date().toLocaleDateString(),
      turmas: turmasSelecionadas.map(id => MOCK_TURMAS.find(t => t.id === id))
    };

    setComunicados([novoComunicado, ...comunicados]);
    setAssunto(''); setMensagem(''); setTurmasSelecionadas([]);
  };

  const handleExcluir = (id) => {
    if (window.confirm('Excluir este comunicado permanentemente?')) {
      setComunicados(comunicados.filter(c => c.id !== id));
    }
  };

  return (
    <div className="comunicados-container animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold edu-dark-text">Comunicados</h2>
          <p className="text-muted">Informe suas turmas sobre avisos e atualizações.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* COLUNA: NOVO COMUNICADO */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm edu-card-form">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Nova Mensagem</h5>
              <form onSubmit={handleEnviarComunicado}>
                
                <div className="mb-4">
                  <label className="edu-label">Para quais turmas?</label>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {MOCK_TURMAS.map(turma => (
                      <div 
                        key={turma.id} 
                        className={`edu-selectable-chip ${turmasSelecionadas.includes(turma.id) ? 'active' : ''}`}
                        onClick={() => toggleTurma(turma.id)}
                      >
                        {turma.nome}
                        {turmasSelecionadas.includes(turma.id) && <i className="bi bi-check-lg ms-2"></i>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="edu-label">Assunto</label>
                  <input 
                    type="text" className="form-control edu-input" 
                    placeholder="Título do aviso"
                    value={assunto} onChange={(e) => setAssunto(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="edu-label">Mensagem</label>
                  <textarea 
                    className="form-control edu-input" rows="5"
                    placeholder="Escreva detalhadamente..."
                    value={mensagem} onChange={(e) => setMensagem(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-edu-primary w-100 py-3">
                  <i className="bi bi-megaphone-fill me-2"></i> Disparar Comunicado
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* COLUNA: HISTÓRICO */}
        <div className="col-lg-7">
          <h6 className="fw-bold mb-3 text-uppercase small text-muted">Histórico de Mensagens</h6>
          <div className="edu-feed">
            {comunicados.length === 0 ? (
              <div className="text-center p-5 bg-white rounded-4 shadow-sm">
                <i className="bi bi-chat-dots fs-1 text-muted opacity-25"></i>
                <p className="mt-3 text-muted">Nenhum comunicado enviado.</p>
              </div>
            ) : (
              comunicados.map(com => (
                <div key={com.id} className="card border-0 shadow-sm mb-3 edu-feed-item animate__animated animate__slideInUp">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center mb-3">
                        <div className="edu-avatar-prof me-3">
                          <i className="bi bi-person-workspace"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold m-0">{com.assunto}</h6>
                          <small className="text-muted">{com.data}</small>
                        </div>
                      </div>
                      <button className="btn btn-link text-danger p-0" onClick={() => handleExcluir(com.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                    
                    <p className="edu-msg-text text-secondary">{com.mensagem}</p>
                    
                    <div className="mt-3 d-flex flex-wrap gap-1">
                      {com.turmas.map(t => (
                        <span key={t.id} className="badge rounded-pill bg-light text-dark fw-normal border">
                          <i className="bi bi-people me-1"></i> {t.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}