import React, { useState, useMemo } from 'react';

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---

// 1. Alunos (para buscar nomes)
const MOCK_ALUNOS = {
  '101': { nome: 'Ana Silva', ra: 'RA123456' },
  '102': { nome: 'Bruno Costa', ra: 'RA123457' },
};

// 2. Os Requerimentos Solicitados
const MOCK_REQUERIMENTOS_INICIAIS = [
  { 
    id: 'req501', 
    alunoId: '101', 
    tipo: 'Aproveitamento de Matéria', 
    data: '10/11/2025', 
    status: 'Pendente',
    justificativa: 'Já cursei Cálculo I em outra instituição. Segue anexa a ementa e o histórico.',
    anexos: [
      { nome: 'historico_externo.pdf', url: '#' },
      { nome: 'ementa_calculo_externo.pdf', url: '#' }
    ],
    parecer: ''
  },
  { 
    id: 'req502', 
    alunoId: '102', 
    tipo: 'Quebra de Pré-requisito', 
    data: '08/11/2025', 
    status: 'Pendente',
    justificativa: 'Gostaria de cursar "Cálculo II" junto com "Cálculo I", pois tenho facilidade com a matéria.',
    anexos: [],
    parecer: ''
  },
  { 
    id: 'req499', 
    alunoId: '101', 
    tipo: 'Ajuste de Matrícula (Fora do Prazo)', 
    data: '01/11/2025', 
    status: 'Concluído (Aceito)',
    justificativa: '...',
    anexos: [],
    parecer: 'Ajuste de matrícula aprovado e realizado no sistema.'
  },
];
// -----------------------------------------------------------------

export default function GerenciarRequerimentos() {

  // --- STATES DO COMPONENTE ---
  const [view, setView] = useState('lista'); // 'lista' ou 'revisar'
  const [requerimentos, setRequerimentos] = useState(MOCK_REQUERIMENTOS_INICIAIS);
  const [reqSelecionado, setReqSelecionado] = useState(null); // O requerimento sendo revisado
  
  // States dos Filtros
  const [filtroStatus, setFiltroStatus] = useState('Pendente'); // Default: mostrar o que precisa de ação
  
  // States do Formulário de Parecer
  const [novoStatus, setNovoStatus] = useState('');
  const [textoParecer, setTextoParecer] = useState('');

  // --- LÓGICA DE FILTRAGEM ---
  const requerimentosFiltrados = useMemo(() => {
    return requerimentos.filter(r => {
      if (filtroStatus === 'Todos') return true;
      return r.status === filtroStatus;
    });
  }, [requerimentos, filtroStatus]);


  // --- HANDLERS ---
  
  /**
   * Passo 1: Coordenador clica em [Revisar] na tabela
   */
  const handleRevisar = (reqId) => {
    const req = requerimentos.find(r => r.id === reqId);
    setReqSelecionado(req);
    
    // Preenche o formulário com os dados atuais
    setNovoStatus(req.status);
    setTextoParecer(req.parecer || '');
    
    setView('revisar');
  };
  
  /**
   * Passo 2: Coordenador salva o parecer
   */
  const handleSalvarParecer = (e) => {
    e.preventDefault();
    if (!novoStatus || !textoParecer) {
      alert('Por favor, selecione um novo status e escreva um parecer.');
      return;
    }
    
    // Atualiza o "banco de dados" (o state principal)
    setRequerimentos(requerimentos.map(r => 
      r.id === reqSelecionado.id 
        ? { ...r, status: novoStatus, parecer: textoParecer } 
        : r
    ));
    
    alert('Parecer salvo e aluno notificado (Simulação)!');
    
    // Volta para a lista
    setView('lista');
    setReqSelecionado(null);
  };
  
  const getAlunoNome = (alunoId) => MOCK_ALUNOS[alunoId]?.nome || 'Aluno Desconhecido';
  
  
  // --- FUNÇÕES DE RENDERIZAÇÃO ---

  // Tela 1: Lista/Triagem (A Caixa de Entrada)
  const renderListaRequerimentos = () => (
    <>
      <h2 className="mb-4">Requerimentos Acadêmicos</h2>

      {/* --- 1. BARRA DE FILTROS --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label htmlFor="filtroStatus" className="form-label">Filtrar por Status</label>
              <select 
                id="filtroStatus" 
                className="form-select"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="Pendente">Pendentes (Precisa de Ação)</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Concluído (Aceito)">Concluídos (Aceitos)</option>
                <option value="Concluído (Recusado)">Concluídos (Recusados)</option>
                <option value="Todos">Ver Todos</option>
              </select>
            </div>
            {/* (Aqui poderiam entrar outros filtros, como "Tipo" ou "Aluno") */}
          </div>
        </div>
      </div>

      {/* --- 2. TABELA DE REQUERIMENTOS --- */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Aluno</th>
                  <th scope="col">Tipo de Solicitação</th>
                  <th scope="col">Data</th>
                  <th scope="col">Ação</th>
                </tr>
              </thead>
              <tbody>
                {requerimentosFiltrados.length === 0 && (
                  <tr><td colSpan="5" className="text-center p-4 text-muted">Nenhum requerimento encontrado.</td></tr>
                )}
                
                {requerimentosFiltrados.map(req => (
                  <tr key={req.id}>
                    {/* Status (Badge) */}
                    <td>
                      <span className={`badge ${
                        req.status === 'Pendente' ? 'bg-warning text-dark' :
                        req.status.includes('Aceito') ? 'bg-success' :
                        req.status.includes('Recusado') ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {/* Aluno */}
                    <td>
                      <strong>{getAlunoNome(req.alunoId)}</strong>
                      <br/><small className="text-muted">RA: {MOCK_ALUNOS[req.alunoId]?.ra}</small>
                    </td>
                    {/* Tipo */}
                    <td>{req.tipo}</td>
                    {/* Data */}
                    <td>{req.data}</td>
                    {/* Ação */}
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleRevisar(req.id)}
                      >
                        <i className="bi bi-search me-1"></i> Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  // Tela 2: Revisão e Parecer
  const renderRevisarRequerimento = () => (
    <>
      {/* --- Navegação --- */}
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('lista')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar para a Caixa de Entrada
      </button>
      <h2 className="mb-1">Revisar Requerimento</h2>
      <p className="text-muted fs-5">De: {getAlunoNome(reqSelecionado.alunoId)}</p>
      
      <div className="row g-4">
        {/* Coluna 1: Dados da Solicitação (Read-Only) */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Solicitação do Aluno</h5>
            </div>
            <div className="card-body">
              <p><strong>Tipo:</strong> {reqSelecionado.tipo}</p>
              <p><strong>Data:</strong> {reqSelecionado.data}</p>
              
              <p className="fw-bold mb-1">Justificativa do Aluno:</p>
              <p className="p-3 bg-light rounded">{reqSelecionado.justificativa}</p>
              
              {reqSelecionado.anexos.length > 0 && (
                <>
                  <p className="fw-bold mb-1">Documentos Anexos:</p>
                  <div className="list-group">
                    {reqSelecionado.anexos.map(anexo => (
                      <a 
                        key={anexo.nome} 
                        href={anexo.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="list-group-item list-group-item-action"
                      >
                        <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>
                        {anexo.nome}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Coluna 2: Painel de Ação (Formulário do Coordenador) */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Parecer do Coordenador</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSalvarParecer}>
                <div className="mb-3">
                  <label htmlFor="novoStatus" className="form-label fw-bold">1. Mudar Status para:</label>
                  <select 
                    id="novoStatus" 
                    className="form-select"
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value)}
                    required
                  >
                    <option value="Pendente">Pendente (Salvar rascunho)</option>
                    <option value="Em Análise">Em Análise (Aluno será notificado)</option>
                    <option value="Concluído (Aceito)">Concluído (Aceito)</option>
                    <option value="Concluído (Recusado)">Concluído (Recusado)</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="textoParecer" className="form-label fw-bold">2. Parecer / Despacho (Visível para o aluno)</label>
                  <textarea 
                    id="textoParecer" 
                    className="form-control" 
                    rows="8"
                    placeholder="Escreva sua análise e decisão aqui..."
                    value={textoParecer}
                    onChange={(e) => setTextoParecer(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="text-end">
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-check-circle-fill me-2"></i>Salvar e Enviar Parecer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );


  // --- PONTO DE ENTRADA PRINCIPAL ---
  return (
    <div className="container-fluid">
      {view === 'lista' && renderListaRequerimentos()}
      {view === 'revisar' && renderRevisarRequerimento()}
    </div>
  );
}