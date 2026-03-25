import React, { useState, useEffect, useCallback } from 'react';
import api from './../api';
import './GerenciarCursos.css';

const VALORES_INICIAIS_DISCIPLINA = { nome: '', codigo: '', carga_horaria: 0, ementa: '', semestre: 1, id_curso: null };
const VALORES_INICIAIS_CURSO = {
  nome: '',
  codigo: '',
  descricao: '',
  cargaHoraria: '',
  modalidade: 1,
  idCoordenador: '',
};

const MOCK_INSIGHTS = {
  reprovação: 18.5,
  media_notas: 7.2,
  taxa_evasao: 12.4,
  descontinuidade: [
    { motivo: 'Trancamento', qtd: 45, cor: '#ffc107' },
    { motivo: 'Reprovação por Nota', qtd: 30, cor: '#dc3545' },
    { motivo: 'Reprovação por Falta', qtd: 25, cor: '#6c757d' }
  ]
};

export default function GerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroNome, setFiltroNome] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [showModalCurso, setShowModalCurso] = useState(false);
  const [showModalInsights, setShowModalInsights] = useState(false);
  const [cursoSelecionadoInsights, setCursoSelecionadoInsights] = useState(null);
  const [cursoForm, setCursoForm] = useState(VALORES_INICIAIS_CURSO);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [salvandoCurso, setSalvandoCurso] = useState(false);

  const getCursoId = (curso) => curso?.id ?? curso?.Id;

  const carregarCursos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cursos', {
        params: { paginaNumero: paginaAtual, paginaTamanho: 10, nome: filtroNome || undefined }
      });
      setCursos(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }, [paginaAtual, filtroNome]);

  useEffect(() => { carregarCursos(); }, [carregarCursos]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const abrirNovoCurso = () => {
    setCursoEditando(null);
    setCursoForm(VALORES_INICIAIS_CURSO);
    setShowModalCurso(true);
  };

  const abrirEditarCurso = (curso) => {
    setCursoEditando(curso);
    setCursoForm({
      nome: curso.nome ?? '',
      codigo: curso.codigo ?? '',
      descricao: curso.descricao ?? '',
      cargaHoraria: curso.cargaHoraria ?? curso.carga_horaria ?? '',
      modalidade: curso.modalidade ?? curso.Modalidade ?? 1,
      idCoordenador: curso.idCoordenador ?? curso.IdCoordenador ?? '',
    });
    setShowModalCurso(true);
  };

  const handleCursoInputChange = (e) => {
    const { name, value } = e.target;
    setCursoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarCurso = async (e) => {
    e.preventDefault();
    setSalvandoCurso(true);

    try {
      const payload = {
        Nome: cursoForm.nome.trim(),
        Codigo: cursoForm.codigo.trim(),
        Descricao: cursoForm.descricao?.trim() || null,
        CargaHoraria: Number(cursoForm.cargaHoraria),
        Modalidade: Number(cursoForm.modalidade),
        IdCoordenador: Number(cursoForm.idCoordenador),
      };

      if (!payload.Nome || !payload.Codigo || payload.CargaHoraria <= 0 || payload.IdCoordenador <= 0) {
        showToast('Preencha os campos obrigatorios com valores validos.', 'danger');
        return;
      }

      const idCurso = getCursoId(cursoEditando);
      if (idCurso) {
        await api.put(`/cursos/${idCurso}`, payload);
        showToast('Curso atualizado com sucesso!');
      } else {
        await api.post('/cursos', payload);
        showToast('Curso cadastrado com sucesso!');
      }

      setShowModalCurso(false);
      setCursoEditando(null);
      setCursoForm(VALORES_INICIAIS_CURSO);
      await carregarCursos();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      showToast('Erro ao salvar curso.', 'danger');
    } finally {
      setSalvandoCurso(false);
    }
  };

  const handleExcluirCurso = async (curso) => {
    const idCurso = getCursoId(curso);
    if (!idCurso) {
      showToast('Nao foi possivel identificar o curso para exclusao.', 'danger');
      return;
    }

    const confirmado = window.confirm(`Tem certeza que deseja deletar o curso "${curso.nome}"?`);
    if (!confirmado) return;

    try {
      await api.delete(`/cursos/${idCurso}`);
      showToast('Curso deletado com sucesso!');
      await carregarCursos();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      showToast('Erro ao deletar curso.', 'danger');
    }
  };

  const handleOpenInsights = (curso) => {
    setCursoSelecionadoInsights(curso);
    setShowModalInsights(true);
  };

  return (
    <div className="admin-layout bg-light min-vh-100 p-4">
      {/* HEADER */}
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">Painel do Coordenador</h1>
          <p className="text-secondary mb-0">Monitoramento acadêmico e gestão de matriz curricular.</p>
        </div>
        <button className="btn btn-primary btn-lg shadow-sm px-4" onClick={abrirNovoCurso}>
          <i className="bi bi-plus-lg me-2"></i>Novo Curso
        </button>
      </header>

      {toast.show && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show`} role="alert">
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast((prev) => ({ ...prev, show: false }))}></button>
        </div>
      )}

      {/* CARDS KPIS */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="stat-card p-3 bg-white shadow-sm rounded-4 border-0">
            <div className="d-flex align-items-center">
              <div className="icon-box bg-primary-subtle text-primary rounded-3 p-3 me-3">
                <i className="bi bi-book-half fs-4"></i>
              </div>
              <div>
                <span className="d-block text-muted small fw-bold">CURSOS ATIVOS</span>
                <span className="h4 fw-bold mb-0">{cursos.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BUSCA */}
      <div className="search-bar card border-0 shadow-sm mb-4 rounded-4 p-2">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-0 ps-3">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input 
            type="text" 
            className="form-control border-0 shadow-none bg-transparent" 
            placeholder="Pesquisar curso..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
      </div>

      {/* ACORDEÃO */}
      <div className="accordion custom-accordion shadow-sm rounded-4 overflow-hidden" id="accordionCursos">
        {loading ? (
          <div className="text-center py-5 bg-white"><div className="spinner-grow text-primary"></div></div>
        ) : (
          cursos.map(curso => {
            const idCurso = getCursoId(curso);

            return (
            <div className="accordion-item border-0 border-bottom" key={idCurso ?? curso.codigo ?? curso.nome}>
              <div className="accordion-header d-flex align-items-center bg-white py-2 px-3">
                <button className="accordion-button collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idCurso}`}>
                  <div className="d-flex flex-column">
                    <span className="h5 fw-bold mb-0">{curso.nome}</span>
                    <span className="text-muted small">Cód: {curso.codigo}</span>
                  </div>
                </button>
                <div className="header-actions pe-3">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEditarCurso(curso);
                    }}
                  >
                    <i className="bi bi-pencil-square me-1"></i>Editar Curso
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExcluirCurso(curso);
                    }}
                  >
                    <i className="bi bi-trash3 me-1"></i>Deletar Curso
                  </button>
                  <button className="btn btn-insight btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3" onClick={(e) => { e.stopPropagation(); handleOpenInsights(curso); }}>
                    <i className="bi bi-graph-up-arrow text-warning"></i>
                    <span>Insights</span>
                  </button>
                </div>
              </div>

              <div id={`collapse-${idCurso}`} className="accordion-collapse collapse" data-bs-parent="#accordionCursos">
                <div className="accordion-body bg-light-subtle p-0">
                   {/* TABELA DE DISCIPLINAS */}
                   <table className="table table-hover align-middle mb-0 bg-white">
                    <thead className="table-light">
                      <tr className="small text-muted">
                        <th className="ps-4">DISCIPLINA</th>
                        <th>CARGA</th>
                        <th className="text-end pe-4">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curso.disciplinas?.map(disc => (
                        <tr key={disc.id}>
                          <td className="ps-4">
                            <span className="d-block fw-bold">{disc.nome}</span>
                            <span className="text-muted small">{disc.codigo}</span>
                          </td>
                          <td><span className="badge-soft-blue">{disc.cargaHoraria}h</span></td>
                          <td className="text-end pe-4">
                            <div className="btn-group-minimal">
                              <button className="btn btn-icon"><i className="bi bi-pencil-square"></i></button>
                              <button className="btn btn-icon text-danger"><i className="bi bi-trash3"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )})
        )}
      </div>

      {showModalCurso && (
        <div className="modal-custom-overlay">
          <div className="modal-custom-content shadow-lg rounded-4 overflow-hidden">
            <div className="modal-custom-header bg-primary text-white p-4">
              <div>
                <h4 className="fw-bold mb-1">{cursoEditando ? 'Editar Curso' : 'Novo Curso'}</h4>
                <p className="mb-0 opacity-75">Preencha as informacoes do curso.</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModalCurso(false)}></button>
            </div>

            <form onSubmit={handleSalvarCurso}>
              <div className="p-4 bg-light">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={cursoForm.nome}
                      onChange={handleCursoInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Codigo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codigo"
                      value={cursoForm.codigo}
                      onChange={handleCursoInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Descricao</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="descricao"
                      value={cursoForm.descricao}
                      onChange={handleCursoInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Carga Horaria</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      name="cargaHoraria"
                      value={cursoForm.cargaHoraria}
                      onChange={handleCursoInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Modalidade</label>
                    <select
                      className="form-select"
                      name="modalidade"
                      value={cursoForm.modalidade}
                      onChange={handleCursoInputChange}
                      required
                    >
                      <option value={1}>Presencial</option>
                      <option value={2}>EAD</option>
                      <option value={3}>Hibrido</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">ID do Coordenador</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      name="idCoordenador"
                      value={cursoForm.idCoordenador}
                      onChange={handleCursoInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModalCurso(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={salvandoCurso}>
                  {salvandoCurso ? 'Salvando...' : cursoEditando ? 'Salvar alteracoes' : 'Criar curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE INSIGHTS - CENTRALIZADO E SEM ALERTAS */}
      {showModalInsights && cursoSelecionadoInsights && (
        <div className="modal-custom-overlay">
          <div className="modal-custom-content shadow-lg rounded-4 overflow-hidden">
            <div className="modal-custom-header bg-dark text-white p-4">
              <div>
                <h4 className="fw-bold mb-1">Painel Acadêmico</h4>
                <p className="mb-0 opacity-75">{cursoSelecionadoInsights.nome}</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModalInsights(false)}></button>
            </div>
            
            <div className="p-4 bg-light">
              {/* KPIS EM LINHA */}
              <div className="row g-3 mb-4">
                <div className="col-4">
                  <div className="p-3 bg-white rounded-4 shadow-sm text-center border-bottom border-danger border-3">
                    <small className="text-muted fw-bold d-block mb-1">REPROVAÇÃO</small>
                    <h4 className="text-danger fw-bold mb-0">{MOCK_INSIGHTS.reprovação}%</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-white rounded-4 shadow-sm text-center border-bottom border-primary border-3">
                    <small className="text-muted fw-bold d-block mb-1">MÉDIA GLOBAL</small>
                    <h4 className="text-primary fw-bold mb-0">{MOCK_INSIGHTS.media_notas}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-white rounded-4 shadow-sm text-center border-bottom border-warning border-3">
                    <small className="text-muted fw-bold d-block mb-1">EVASÃO</small>
                    <h4 className="text-warning fw-bold mb-0">{MOCK_INSIGHTS.taxa_evasao}%</h4>
                  </div>
                </div>
              </div>

              {/* GRÁFICO DE DESCONTINUIDADE CENTRALIZADO */}
              <div className="card border-0 rounded-4 p-4 shadow-sm">
                <h6 className="fw-bold mb-4 text-center text-secondary uppercase">Razões de Descontinuidade do Curso</h6>
                <div className="px-md-5">
                  {MOCK_INSIGHTS.descontinuidade.map((item, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="d-flex justify-content-between small mb-2 fw-bold">
                        <span>{item.motivo}</span>
                        <span className="text-muted">{item.qtd}%</span>
                      </div>
                      <div className="progress rounded-pill" style={{height: '12px'}}>
                        <div className="progress-bar" style={{width: `${item.qtd}%`, backgroundColor: item.cor}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-3 border-top d-flex justify-content-center">
               <button className="btn btn-outline-secondary px-5 rounded-pill fw-bold" onClick={() => setShowModalInsights(false)}>
                 Fechar Relatório
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}