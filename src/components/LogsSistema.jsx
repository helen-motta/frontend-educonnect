import React, { useState, useMemo } from 'react';

// --- MOCK DE DADOS (Simula logs reais de um backend) ---
const MOCK_LOGS_INICIAIS = [
  { id: 1, timestamp: '2023-11-25 10:30:00', usuario: 'admin@escola.com', tipo: 'CRUD', acao: 'DELETE', entidade: 'Usuário', detalhes: 'Usuário "João Silva" (ID: 101) excluído.', ip: '192.168.1.10' },
  { id: 3, timestamp: '2023-11-25 09:45:30', usuario: 'prof.ana@escola.com', tipo: 'ACADEMICO', acao: 'UPDATE', entidade: 'Notas', detalhes: 'Notas da P1 para "Cálculo I - Turma A" atualizadas.', ip: '10.0.0.5' },
  { id: 4, timestamp: '2023-11-25 09:40:00', usuario: 'aluno.maria@escola.com', tipo: 'REQUERIMENTO', acao: 'CREATE', entidade: 'Requerimento', detalhes: 'Requerimento de 2ª Via de Carteirinha solicitado.', ip: '172.16.0.2' },
  { id: 5, timestamp: '2023-11-24 18:00:00', usuario: 'SISTEMA', tipo: 'MATRICULA', acao: 'UPDATE', entidade: 'Período Matrícula', detalhes: 'Fase de matrícula "Todos os Alunos" iniciada.', ip: 'N/A' },
  { id: 6, timestamp: '2023-11-24 17:59:59', usuario: 'admin@escola.com', tipo: 'MATRICULA', acao: 'UPDATE', entidade: 'Período Matrícula', detalhes: 'Configuração de período de matrícula alterada.', ip: '192.168.1.10' },
  { id: 7, timestamp: '2023-11-24 14:10:20', usuario: 'admin@escola.com', tipo: 'CRUD', acao: 'CREATE', entidade: 'Disciplina', detalhes: 'Disciplina "Análise de Dados" criada no curso "Eng. Software".', ip: '192.168.1.10' },
  { id: 10, timestamp: '2023-11-22 11:00:00', usuario: 'prof.carlos@escola.com', tipo: 'ACADEMICO', acao: 'CREATE', entidade: 'Comunicado', detalhes: 'Comunicado "Aula Cancelada" enviado para "Física II - Turma B".', ip: '10.0.0.6' },
  { id: 12, timestamp: '2023-11-21 15:30:00', usuario: 'admin@escola.com', tipo: 'CONFIG', acao: 'UPDATE', entidade: 'Configurações', detalhes: 'Cor primária do tema alterada para #007bff.', ip: '192.168.1.10' },
  { id: 13, timestamp: '2023-11-21 14:00:00', usuario: 'admin@escola.com', tipo: 'CRUD', acao: 'CREATE', entidade: 'Usuário', detalhes: 'Novo professor "Dr. Roberto" (ID: 205) cadastrado.', ip: '192.168.1.10' },
];
// -----------------------------------------------------------------

const LOG_TIPOS = ['Todos', 'CRUD', 'AUTH', 'ACADEMICO', 'REQUERIMENTO', 'MATRICULA', 'CONFIG', 'SISTEMA', 'BACKUP'];
const LOG_ACOES = ['Todas', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ENVIAR', 'INICIAR', 'ENCERRAR', 'EXECUTE'];

export default function LogsSistema() {

  const [logs, setLogs] = useState(MOCK_LOGS_INICIAIS);
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroAcao, setFiltroAcao] = useState('Todas');
  const [filtroDetalhes, setFiltroDetalhes] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const logsPorPagina = 10;

  // --- LÓGICA DE FILTRAGEM (useMemo para performance) ---
  const logsFiltrados = useMemo(() => {
    let logsProcessados = logs;

    if (filtroUsuario) {
      logsProcessados = logsProcessados.filter(log =>
        log.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())
      );
    }
    if (filtroTipo !== 'Todos') {
      logsProcessados = logsProcessados.filter(log => log.tipo === filtroTipo);
    }
    if (filtroAcao !== 'Todas') {
      logsProcessados = logsProcessados.filter(log => log.acao === filtroAcao);
    }
    if (filtroDetalhes) {
      logsProcessados = logsProcessados.filter(log =>
        log.detalhes.toLowerCase().includes(filtroDetalhes.toLowerCase()) ||
        log.entidade.toLowerCase().includes(filtroDetalhes.toLowerCase())
      );
    }
    
    // Ordena os logs do mais recente para o mais antigo
    return logsProcessados.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  }, [logs, filtroUsuario, filtroTipo, filtroAcao, filtroDetalhes]);

  // Lógica de Paginação
  const totalPaginas = Math.ceil(logsFiltrados.length / logsPorPagina);
  const indiceUltimoLog = paginaAtual * logsPorPagina;
  const indicePrimeiroLog = indiceUltimoLog - logsPorPagina;
  const logsAtuais = logsFiltrados.slice(indicePrimeiroLog, indiceUltimoLog);

  const handleMudarPagina = (numeroPagina) => {
    setPaginaAtual(numeroPagina);
  };

  // --- JSX (Renderização) ---
  return (
    <>
      <h2 className="mb-4">Logs do Sistema e Auditoria</h2>

      <div className="alert alert-info">
        <i className="bi bi-info-circle-fill me-2"></i>
        Aqui você pode monitorar todas as ações importantes do sistema.
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Filtros</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Filtro por Usuário */}
            <div className="col-md-3">
              <label htmlFor="filtroUsuario" className="form-label">Usuário</label>
              <input
                type="text"
                className="form-control"
                id="filtroUsuario"
                placeholder="E-mail ou ID do usuário"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              />
            </div>
            {/* Filtro por Tipo */}
            <div className="col-md-3">
              <label htmlFor="filtroTipo" className="form-label">Tipo de Log</label>
              <select
                className="form-select"
                id="filtroTipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                {LOG_TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            {/* Filtro por Ação */}
            <div className="col-md-3">
              <label htmlFor="filtroAcao" className="form-label">Ação</label>
              <select
                className="form-select"
                id="filtroAcao"
                value={filtroAcao}
                onChange={(e) => setFiltroAcao(e.target.value)}
              >
                {LOG_ACOES.map(acao => (
                  <option key={acao} value={acao}>{acao}</option>
                ))}
              </select>
            </div>
            {/* Filtro por Detalhes */}
            <div className="col-md-3">
              <label htmlFor="filtroDetalhes" className="form-label">Buscar nos Detalhes</label>
              <input
                type="text"
                className="form-control"
                id="filtroDetalhes"
                placeholder="Ex: "
                value={filtroDetalhes}
                onChange={(e) => setFiltroDetalhes(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- TABELA DE LOGS --- */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '180px' }}>Data/Hora</th>
                  <th scope="col" style={{ width: '150px' }}>Usuário</th>
                  <th scope="col" style={{ width: '100px' }}>Tipo</th>
                  <th scope="col" style={{ width: '100px' }}>Ação</th>
                  <th scope="col">Detalhes</th>
                  <th scope="col" style={{ width: '120px' }}>IP</th>
                </tr>
              </thead>
              <tbody>
                {logsAtuais.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">Nenhum log encontrado com os filtros aplicados.</td>
                  </tr>
                ) : (
                  logsAtuais.map(log => (
                    <tr key={log.id}>
                      <td><small>{log.timestamp}</small></td>
                      <td><strong>{log.usuario}</strong></td>
                      <td><span className="badge bg-secondary-subtle text-secondary-emphasis">{log.tipo}</span></td>
                      <td><span className="badge bg-primary-subtle text-primary-emphasis">{log.acao}</span></td>
                      <td>{log.detalhes}</td>
                      <td><small>{log.ip}</small></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* --- PAGINAÇÃO --- */}
        {totalPaginas > 1 && (
          <div className="card-footer bg-white d-flex justify-content-center">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handleMudarPagina(paginaAtual - 1)}>Anterior</button>
                </li>
                {[...Array(totalPaginas)].map((_, index) => (
                  <li key={index} className={`page-item ${paginaAtual === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handleMudarPagina(index + 1)}>{index + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handleMudarPagina(paginaAtual + 1)}>Próxima</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}