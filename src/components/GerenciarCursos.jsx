import React, { useState, useEffect, useCallback } from 'react';
import api from './../api';

const VALORES_INICIAIS_DISCIPLINA = {
  nome: '',
  codigo: '',
  carga_horaria: 0,
  ementa: '',
  semestre: 1,
  id_curso: null
};

const VALORES_INICIAIS_CURSO = {
  nome: '',
  codigo: '',
  descricao: '',
  email_coordenador: ''
};

export default function GerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCodigo, setFiltroCodigo] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('nova'); 
  const [formData, setFormData] = useState(VALORES_INICIAIS_DISCIPLINA);
  const [currentCursoId, setCurrentCursoId] = useState(null);
  const [isVisualizando, setIsVisualizando] = useState(false);

  const [showModalCurso, setShowModalCurso] = useState(false);
  const [formDataCurso, setFormDataCurso] = useState(VALORES_INICIAIS_CURSO);

  const carregarCursos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cursos', {
        params: {
          paginaNumero: paginaAtual,
          paginaTamanho: 10,
          nome: filtroNome || undefined,
          codigo: filtroCodigo || undefined
        }
      });
      setCursos(response.data.data || []);
      console.log(response.data);
      setTotalPaginas(response.data.totalPaginas || 0);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }, [paginaAtual, filtroNome, filtroCodigo]);

  useEffect(() => {
    carregarCursos();
  }, [carregarCursos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'carga_horaria' || name === 'semestre' ? parseInt(value) || 0 : value 
    }));
  };

  const handleOpenModal = (tipo, cursoId, disciplina = null) => {
    setModalType(tipo);
    setCurrentCursoId(cursoId);
    setIsVisualizando(false);
    if (tipo === 'editar' && disciplina) {
      setFormData(disciplina);
    } else {
      setFormData({ ...VALORES_INICIAIS_DISCIPLINA, id_curso: cursoId });
    }
    setShowModal(true);
  };

  const handleVisualizarDisciplina = (disciplina) => {
    setModalType('visualizar');
    setFormData(disciplina);
    setIsVisualizando(true);
    setShowModal(true);
  };

  const handleSalvarDisciplina = async (e) => {
    e.preventDefault();
    if (isVisualizando) return;
    try {
      if (modalType === 'nova') {
        await api.post('/disciplinas', formData);
      } else {
        await api.put(`/disciplinas/${formData.id}`, formData);
      }
      setShowModal(false);
      carregarCursos();
    } catch (error) {
      alert("Erro ao salvar disciplina. Verifique os dados.");
    }
  };

  const handleExcluirDisciplina = async (id) => {
    if (window.confirm("Deseja realmente excluir esta disciplina?")) {
      try {
        await api.delete(`/disciplinas/${id}`);
        carregarCursos();
      } catch (error) {
        alert("Erro ao excluir disciplina.");
      }
    }
  };

  const handleInputChangeCurso = (e) => {
    const { name, value } = e.target;
    setFormDataCurso(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleOpenModalCurso = () => {
    setFormDataCurso(VALORES_INICIAIS_CURSO);
    setShowModalCurso(true);
  };

  const handleSalvarCurso = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cursos', formDataCurso);
      setShowModalCurso(false);
      carregarCursos();
    } catch (error) {
      alert("Erro ao salvar curso. Verifique os dados.");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciar Cursos e Grade Curricular</h2>
        <button className="btn btn-success" onClick={handleOpenModalCurso}>
          <i className="bi bi-plus-circle me-2"></i>Novo Curso
        </button>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-2">
          <div className="row g-2 align-items-end">
            <div className="col">
              <label className="form-label small fw-bold mb-1">Nome do Curso</label>
              <input type="text" className="form-control form-control-sm" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
            </div>
            <div className="col">
              <label className="form-label small fw-bold mb-1">Código</label>
              <input type="text" className="form-control form-control-sm" value={filtroCodigo} onChange={(e) => setFiltroCodigo(e.target.value)} />
            </div>
            <div className="col-md-auto d-flex gap-1">
              <button className="btn btn-primary btn-sm px-3" onClick={() => { setPaginaAtual(1); carregarCursos(); }}>
                <i className="bi bi-search"></i>
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => { setFiltroNome(''); setFiltroCodigo(''); }}>
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACORDEÃO DE CURSOS --- */}
      <div className="accordion shadow-sm" id="accordionCursos">
        {loading ? (
          <div className="text-center p-5">Carregando cursos...</div>
        ) : (
          cursos.map(curso => (
            <div className="accordion-item border-0 mb-2 shadow-sm" key={curso.id}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed bg-white text-dark" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${curso.id}`}>
                  <div className="d-flex justify-content-between w-100 align-items-center me-3">
                    <span>
                      <strong className="text-primary me-2">[{curso.codigo}]</strong> 
                      {curso.nome} 
                      <small className="text-muted ms-3">Coord: {curso.coordenador.nome}</small>
                    </span>
                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                      {curso.disciplinas?.length || 0} Disciplinas
                    </span>
                  </div>
                </button>
              </h2>
              
              <div id={`collapse-${curso.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionCursos">
                <div className="accordion-body bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold"><i className="bi bi-list-stars me-2"></i>Disciplinas do Curso</h6>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenModal('nova', curso.id)}>
                      <i className="bi bi-plus-lg me-1"></i> Adicionar Disciplina
                    </button>
                  </div>

                  <div className="table-responsive rounded bg-white shadow-sm">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr className="small">
                          <th>CÓDIGO</th>
                          <th>NOME</th>
                          <th>CARGA HORÁRIA</th>
                          <th>SEMESTRE</th>
                          <th className="text-end">AÇÕES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {curso.disciplinas?.map(disc => (
                          <tr key={disc.id}>
                            <td className="fw-bold text-secondary">{disc.codigo}</td>
                            <td>{disc.nome}</td>
                            <td>{disc.cargaHoraria}h</td>
                            <td>{disc.semestreIdeal}º</td>
                            <td className="text-end">
                              <button className="btn btn-link btn-sm p-0 me-3 text-info" onClick={() => handleVisualizarDisciplina(disc)} title="Visualizar">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-link btn-sm p-0 me-3" onClick={() => handleOpenModal('editar', curso.id, disc)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => handleExcluirDisciplina(disc.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL DISCIPLINA --- */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleSalvarDisciplina}>
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      {isVisualizando ? 'Detalhes da Disciplina' : (modalType === 'nova' ? 'Nova Disciplina' : 'Editar Disciplina')}
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Nome da Disciplina</label>
                      <input type="text" name="nome" className="form-control" value={formData.nome} onChange={handleInputChange} disabled={isVisualizando} required />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label small fw-bold">Código</label>
                        <input type="text" name="codigo" className="form-control" value={formData.codigo} onChange={handleInputChange} disabled={isVisualizando} required />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label small fw-bold">Carga H.</label>
                        <input type="number" name="carga_horaria" className="form-control" value={formData.cargaHoraria} onChange={handleInputChange} disabled={isVisualizando} required />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label small fw-bold">Semestre</label>
                        <input type="number" name="semestre" className="form-control" value={formData.semestreIdeal} onChange={handleInputChange} disabled={isVisualizando} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Ementa / Descrição</label>
                      <textarea name="ementa" className="form-control" rows="3" value={formData.ementa} onChange={handleInputChange} disabled={isVisualizando}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      {isVisualizando ? 'Fechar' : 'Cancelar'}
                    </button>
                    {!isVisualizando && <button type="submit" className="btn btn-primary">Salvar Alterações</button>}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* --- MODAL NOVO CURSO --- */}
      {showModalCurso && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={handleSalvarCurso}>
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">Novo Curso</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModalCurso(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Nome do Curso</label>
                      <input type="text" name="nome" className="form-control" value={formDataCurso.nome} onChange={handleInputChangeCurso} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Código</label>
                      <input type="text" name="codigo" className="form-control" value={formDataCurso.codigo} onChange={handleInputChangeCurso} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email do Coordenador</label>
                      <input type="email" name="email_coordenador" className="form-control" value={formDataCurso.email_coordenador} onChange={handleInputChangeCurso} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Descrição</label>
                      <textarea name="descricao" className="form-control" rows="3" value={formDataCurso.descricao} onChange={handleInputChangeCurso}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModalCurso(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar Curso</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}