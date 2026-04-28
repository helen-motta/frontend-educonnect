import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';

const LOG_TIPOS = ['Todos', 'CRUD', 'AUTH', 'ACADEMICO', 'REQUERIMENTO', 'MATRICULA', 'CONFIG', 'SISTEMA', 'BACKUP'];
const LOG_ACOES = ['Todas', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ENVIAR', 'INICIAR', 'ENCERRAR', 'EXECUTE'];

const mapearLog = (log, idx) => {
  const msg = log.msg ?? log.detalhes ?? 'Atividade registrada.';
  const rawTimestamp = log.dataHora;
  const timestamp = typeof rawTimestamp === 'string'
    ? rawTimestamp
    : new Date(rawTimestamp).toLocaleString('pt-BR');

    console.log('Log original:', log);
    console.log('Log mapeado:', { timestamp, msg });

  return {
    id: log.id,
    timestamp,
    usuario: log.usuario,
    acao: log.acao,
    detalhes: msg,
    ip: log.ip,
  };
};

const extrairListaPaginada = (data) => {
  if (Array.isArray(data)) return data;

  return data?.data
    ?? data?.Data
    ?? data?.itens
    ?? data?.Itens
    ?? data?.items
    ?? data?.Items
    ?? [];
};

const extrairTotalPaginas = (data, fallbackTotalItens = 0, paginaTamanho = 10) => {
  const valor = data?.totalPaginas
    ?? data?.TotalPaginas
    ?? data?.totalPages
    ?? data?.TotalPages;

  if (typeof valor === 'number' && valor > 0) return valor;

  const totalItens = data?.totalItens
    ?? data?.TotalItens
    ?? data?.totalRegistros
    ?? data?.TotalRegistros
    ?? fallbackTotalItens;

  return Math.max(1, Math.ceil((Number(totalItens) || 0) / paginaTamanho));
};

export default function LogsSistema() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroAcao, setFiltroAcao] = useState('Todas');
  const [filtroDetalhes, setFiltroDetalhes] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const logsPorPagina = 10;
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    let ativo = true;

    const carregarLogs = async () => {
      setLoading(true);
      setErro('');

      try {
        const params = {
          PaginaNumero: paginaAtual,
          PaginaTamanho: logsPorPagina,
          Usuario: filtroUsuario.trim() || undefined,
          Tipo: filtroTipo !== 'Todos' ? filtroTipo : undefined,
          Acao: filtroAcao !== 'Todas' ? filtroAcao : undefined,
          DataInicio: filtroDataInicio ? new Date(`${filtroDataInicio}T00:00:00`).toISOString() : undefined,
          DataFim: filtroDataFim ? new Date(`${filtroDataFim}T23:59:59`).toISOString() : undefined,
        };

        const response = await api.get('/audit/logs', { params });
        const data = response?.data ?? {};
        const dadosLogs = extrairListaPaginada(data);
        const total = extrairTotalPaginas(data, dadosLogs.length, logsPorPagina);

        if (!ativo) return;

        setLogs(dadosLogs.map(mapearLog));
        setTotalPaginas(total);
      } catch (err) {
        if (!ativo) return;
        setErro('Nao foi possivel carregar os logs de auditoria.');
        setLogs([]);
        setTotalPaginas(1);
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    carregarLogs();

    return () => {
      ativo = false;
    };
  }, [paginaAtual, filtroUsuario, filtroTipo, filtroAcao, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroUsuario, filtroTipo, filtroAcao, filtroDataInicio, filtroDataFim]);

  const logsExibidos = useMemo(() => {
    let logsProcessados = logs;

    // Filtro local complementar para detalhes (aplica somente na página atual).
    if (filtroDetalhes) {
      logsProcessados = logsProcessados.filter(log =>
        log.detalhes.toLowerCase().includes(filtroDetalhes.toLowerCase()) ||
        log.entidade.toLowerCase().includes(filtroDetalhes.toLowerCase())
      );
    }

    return logsProcessados;

  }, [logs, filtroDetalhes]);

  const paginasParaRender = useMemo(() => {
    return Array.from({ length: totalPaginas }, (_, index) => index + 1);
  }, [totalPaginas]);

  const handleMudarPagina = (numeroPagina) => {
    if (numeroPagina < 1 || numeroPagina > totalPaginas) return;
    setPaginaAtual(numeroPagina);
  };

  return (
    <>
      <h2 className="mb-4">Logs do Sistema e Auditoria</h2>

      {erro && <div className="alert alert-warning">{erro}</div>}

      <div className="alert alert-info">
        <i className="bi bi-info-circle-fill me-2"></i>
        Aqui você pode monitorar todas as ações importantes do sistema.
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Filtros</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
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
            <div className="col-md-2">
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
            <div className="col-md-2">
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
            <div className="col-md-2">
              <label htmlFor="filtroDataInicio" className="form-label">Data início</label>
              <input
                type="date"
                className="form-control"
                id="filtroDataInicio"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="filtroDataFim" className="form-label">Data fim</label>
              <input
                type="date"
                className="form-control"
                id="filtroDataFim"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
              />
            </div>
            <div className="col-md-2">
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

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '180px' }}>Data/Hora</th>
                  <th scope="col" style={{ width: '150px' }}>Id Usuário</th>
                  <th scope="col" style={{ width: '100px' }}>Ação</th>
                  <th scope="col">Detalhes</th>
                  <th scope="col" style={{ width: '120px' }}>IP</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">Carregando logs de auditoria...</td>
                  </tr>
                ) : logsExibidos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">Nenhum log encontrado com os filtros aplicados.</td>
                  </tr>
                ) : (
                  logsExibidos.map(log => (
                    <tr key={log.id}>
                      <td><small>{log.timestamp}</small></td>
                      <td><strong>{log.usuario}</strong></td>
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
        
        {totalPaginas > 1 && (
          <div className="card-footer bg-white d-flex justify-content-center">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handleMudarPagina(paginaAtual - 1)}>Anterior</button>
                </li>
                {paginasParaRender.map((pagina) => (
                  <li key={pagina} className={`page-item ${paginaAtual === pagina ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handleMudarPagina(pagina)}>{pagina}</button>
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