import React, { useState, useEffect } from 'react';
// Importa o CSS com o nome correto
import './MinhasTurmas.css'; 

// --- MOCK ATUALIZADO ---
const MOCK_TURMAS = [
  { 
    id: 't2', 
    nome: 'Física II - Turma B', 
    horario: '19:00 - 20:50', 
    isTurmaAtual: true,
    atividades: [
      { id: 'p1', nome: 'Prova 1 (P1)' },
      { id: 't1', nome: 'Trabalho 1' },
    ],
    alunos: [
      { id: 201, nome: 'Daniel Moreira', ra: '123460', notas: { p1: 7.5, t1: 8.0 } },
      { id: 202, nome: 'Eduarda Faria', ra: '123461', notas: { p1: null, t1: 9.0 } },
      { id: 203, nome: 'Felipe Guedes', ra: '123462', notas: { p1: 6.0, t1: 6.5 } },
    ]
  },
  { 
    id: 't1', 
    nome: 'Cálculo I - Turma A', 
    horario: '21:00 - 22:50', 
    isTurmaAtual: false,
    atividades: [
      { id: 'p1', nome: 'Prova 1 (P1)' },
      { id: 'p2', nome: 'Prova 2 (P2)' },
    ],
    alunos: [
      { id: 101, nome: 'Ana Silva', ra: '123456', notas: { p1: 9.0, p2: 8.5 } },
      { id: 102, nome: 'Bruno Costa', ra: '123457', notas: { p1: 5.5, p2: 6.0 } },
    ]
  },
];
// -----------------------------------------------------------------

/**
 * Calcula a média simples das notas de um aluno (ignorando 'null')
 */
const calcularMedia = (notasObj) => {
  if (!notasObj) return 0;
  const notasLancadas = Object.values(notasObj).filter(nota => nota !== null);
  
  if (notasLancadas.length === 0) {
    return 0.0;
  }
  
  const soma = notasLancadas.reduce((acc, nota) => acc + parseFloat(nota), 0);
  const media = soma / notasLancadas.length;
  return media.toFixed(1);
};
// -----------------------------


export default function MinhasTurmas() {
  
  // States que controlam o "Wizard"
  const [view, setView] = useState('selecionar_turma');
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  
  // States de Faltas e Notas
  const [chamada, setChamada] = useState({});
  const [atividadeAtual, setAtividadeAtual] = useState(''); 
  const [notasEditaveis, setNotasEditaveis] = useState({}); 

  // Carrega as notas da atividade selecionada no state
  const carregarNotasDaAtividade = (atividadeId, turma) => {
    const notasIniciais = {};
    turma.alunos.forEach(aluno => {
      // Garante que a estrutura de notas existe antes de tentar acessar
      if (aluno.notas) {
        notasIniciais[aluno.id] = aluno.notas[atividadeId] || null;
      } else {
        notasIniciais[aluno.id] = null;
      }
    });
    setNotasEditaveis(notasIniciais);
  };
  
  // Efeito para carregar dados quando a turma é selecionada
  useEffect(() => {
    if (turmaSelecionada && turmaSelecionada.atividades.length > 0) {
      const primeiraAtividade = turmaSelecionada.atividades[0].id;
      setAtividadeAtual(primeiraAtividade);
      carregarNotasDaAtividade(primeiraAtividade, turmaSelecionada);
    }
  }, [turmaSelecionada]);

  // Handler para selecionar a turma
  const handleTurmaSelect = (turma) => {
    setTurmaSelecionada(turma);
    // Inicializa a chamada
    const alunosState = {};
    turma.alunos.forEach(aluno => {
      alunosState[aluno.id] = 'presente';
    });
    setChamada(alunosState);
    setView('selecionar_acao');
  };
  
  // --- Handlers de Faltas ---
  const handleToggleFalta = (alunoId) => {
    setChamada(prevChamada => ({
      ...prevChamada,
      [alunoId]: prevChamada[alunoId] === 'presente' ? 'ausente' : 'presente'
    }));
  };
  
  const handleSalvarChamada = () => {
    const faltas = Object.keys(chamada).filter(id => chamada[id] === 'ausente').length;
    alert(`Chamada salva com ${faltas} falta(s)!\n(Simulação)`);
    setView('selecionar_acao');
  };
  
  // --- Handlers de Notas ---
  const handleAtividadeChange = (novaAtividadeId) => {
    setAtividadeAtual(novaAtividadeId);
    carregarNotasDaAtividade(novaAtividadeId, turmaSelecionada);
  };

  const handleNotaChange = (alunoId, nota) => {
    let notaValida = nota;
    if (nota !== "" && nota !== null) {
      const numNota = parseFloat(nota);
      if (numNota > 10) notaValida = 10;
      if (numNota < 0) notaValida = 0;
    }
    setNotasEditaveis(prevNotas => ({
      ...prevNotas,
      [alunoId]: notaValida
    }));
  };

  const handleSalvarNotas = () => {
    alert(`Notas salvas para a atividade: ${atividadeAtual}\n(Simulação)`);
    console.log("Estado final das notas:", notasEditaveis);
    setView('selecionar_acao');
  };


  // --- FUNÇÕES DE RENDERIZAÇÃO ---

  // Tela 1: Selecionar Turma
  const renderSelecionarTurma = () => (
    <>
      <h2 className="mb-4">Gerenciar Turma</h2>
      <h5 className="mb-3 text-muted">1. Selecione a Turma</h5>
      <div className="list-group">
        {MOCK_TURMAS.map(turma => (
          <button
            key={turma.id}
            type="button"
            className={`list-group-item list-group-item-action ${turma.isTurmaAtual ? 'list-group-item-primary' : ''}`}
            onClick={() => handleTurmaSelect(turma)}
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{turma.nome}</h5>
              {turma.isTurmaAtual && <span className="badge bg-primary">TURMA ATUAL</span>}
            </div>
            <p className="mb-1">Horário: {turma.horario}</p>
            <small>{turma.alunos.length} alunos inscritos.</small>
          </button>
        ))}
      </div>
    </>
  );

  // Tela 2: Selecionar Ação
  const renderSelecionarAcao = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_turma')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar (Trocar Turma)
      </button>
      <h2 className="mb-1">{turmaSelecionada.nome}</h2>
      <p className="text-muted fs-5">{turmaSelecionada.alunos.length} alunos</p>
      
      <h5 className="mb-3 text-muted mt-4">2. Escolha a Ação</h5>
      <div className="row g-3">
        {/* Card 1: Lançar Faltas */}
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('lancar_faltas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-calendar-check-fill display-4 text-success mb-3"></i>
              <h4 className="card-title">Lançar Faltas</h4>
              <p className="card-text text-muted">Fazer a chamada da aula de hoje.</p>
            </div>
          </div>
        </div>
        
        {/* Card 2: Lançar Notas */}
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('lancar_notas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-pencil-square display-4 text-primary mb-3"></i>
              <h4 className="card-title">Lançar Notas</h4>
              <p className="card-text text-muted">Editar o diário de notas da turma.</p>
            </div>
          </div>
        </div>

        {/* Card 3: Visão Geral */}
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('visualizar_notas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-bar-chart-fill display-4 text-info mb-3"></i>
              <h4 className="card-title">Visão Geral</h4>
              <p className="card-text text-muted">Ver a média atual da turma.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Tela 3a: Lançar Faltas
  const renderLancarFaltas = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar
      </button>
      <h2 className="mb-1">{turmaSelecionada.nome}</h2>
      <h5 className="mb-3 text-muted">Chamada do dia: {new Date().toLocaleDateString()}</h5>

      <div className="alert alert-light">
        <i className="bi bi-info-circle-fill me-2"></i>
        Todos os alunos começam como "Presente". Clique no aluno para marcar como "Ausente".
      </div>

      <div className="list-group list-chamada">
        {turmaSelecionada.alunos.map(aluno => {
          const status = chamada[aluno.id] || 'presente';
          return (
            <button
              key={aluno.id}
              type="button"
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${status === 'ausente' ? 'list-group-item-danger' : ''}`}
              onClick={() => handleToggleFalta(aluno.id)}
            >
              <div className="d-flex align-items-center">
                <img src="/imagens/usuario-generico.png" alt={aluno.nome} width="40" height="40" className="rounded-circle me-3"/>
                <div>
                  <h5 className="mb-0">{aluno.nome}</h5>
                  <small className="text-muted">RA: {aluno.ra}</small>
                </div>
              </div>
              
              {status === 'presente' ? (
                <span className="badge bg-success fs-6">Presente</span>
              ) : (
                <span className="badge bg-danger fs-6">Ausente</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg" onClick={handleSalvarChamada}>
          Salvar Chamada
        </button>
      </div>
    </>
  );

  // Tela 3b: Lançar Notas
  const renderLancarNotas = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar
      </button>
      <h2 className="mb-1">{turmaSelecionada.nome}</h2>
      <h5 className="mb-3 text-muted">Lançamento de Notas</h5>

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <label htmlFor="atividadeSelect" className="form-label fw-bold">
            Selecione a Atividade para Lançar:
          </label>
          <select
            id="atividadeSelect"
            className="form-select"
            value={atividadeAtual}
            onChange={(e) => handleAtividadeChange(e.target.value)}
          >
            {turmaSelecionada.atividades.map(atv => (
              <option key={atv.id} value={atv.id}>{atv.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Aluno</th>
                  <th scope="col">RA</th>
                  <th scope="col" style={{ width: '150px' }}>Nota (0-10)</th>
                </tr>
              </thead>
              <tbody>
                {turmaSelecionada.alunos.map(aluno => {
                  const nota = notasEditaveis[aluno.id] ?? '';
                  return (
                    <tr key={aluno.id}>
                      <td>
                        <img 
                          src="/imagens/usuario-generico.png" 
                          alt={aluno.nome} 
                          width="40" height="40" 
                          className="rounded-circle me-3"
                        />
                        {aluno.nome}
                      </td>
                      <td>{aluno.ra}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          max="10"
                          step="0.1"
                          placeholder="-"
                          value={nota}
                          onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer text-end">
          <button className="btn btn-success" onClick={handleSalvarNotas}>
            Salvar Notas
          </button>
        </div>
      </div>
    </>
  );
  
  // Tela 3c: Visão Geral das Notas
  const renderVisualizarNotas = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar
      </button>
      <h2 className="mb-1">{turmaSelecionada.nome}</h2>
      <h5 className="mb-3 text-muted">Visão Geral das Médias</h5>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Aluno</th>
                  <th scope="col">RA</th>
                  <th scope="col" style={{ width: '150px' }}>Média Atual</th>
                  <th scope="col">Status (Simulado)</th>
                </tr>
              </thead>
              <tbody>
                {turmaSelecionada.alunos.map(aluno => {
                  const media = calcularMedia(aluno.notas);
                  const status = media >= 7 ? 'Aprovado' : 'Reprovando';
                  const statusClass = media >= 7 ? 'text-success' : 'text-danger';

                  return (
                    <tr key={aluno.id}>
                      <td>
                        <img 
                          src="/imagens/usuario-generico.png" 
                          alt={aluno.nome} 
                          width="40" height="40" 
                          className="rounded-circle me-3"
                        />
                        {aluno.nome}
                      </td>
                      <td>{aluno.ra}</td>
                      <td>
                        <strong className={`fs-5 ${statusClass}`}>
                          {media}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${media >= 7 ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
  

  // --- PONTO DE ENTRADA PRINCIPAL (ATUALIZADO) ---
  return (
    <div className="container-fluid">
      {view === 'selecionar_turma' && renderSelecionarTurma()}
      {view === 'selecionar_acao' && renderSelecionarAcao()}
      {view === 'lancar_faltas' && renderLancarFaltas()}
      {view === 'lancar_notas' && renderLancarNotas()}
      {view === 'visualizar_notas' && renderVisualizarNotas()}
    </div>
  );
}