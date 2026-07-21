import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './GerenciarCursos.css';

const VALORES_INICIAIS_DISCIPLINA = {
  id_curso: null,
  nome: '',
  codigo: '',
  ementa: '',
  carga_horaria: '',
  creditos: '',
  semestre: 1,
};

const VALORES_INICIAIS_CURSO = {
  nome: '',
  codigo: '',
  descricao: '',
  cargaHoraria: '',
  modalidade: 1,
  idCoordenador: '',
};

const themeColors = {
  darkBlue: '#333', 
  green: '#c9e067',
};

export default function GerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroNome, setFiltroNome] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [showModalCurso, setShowModalCurso] = useState(false);
  const [showModalDisciplina, setShowModalDisciplina] = useState(false);
  const [showModalInsights, setShowModalInsights] = useState(false);
  const [cursoSelecionadoInsights, setCursoSelecionadoInsights] = useState(null);
  const [cursoSelecionadoDisciplina, setCursoSelecionadoDisciplina] = useState(null);
  const [cursoForm, setCursoForm] = useState(VALORES_INICIAIS_CURSO);
  const [disciplinaForm, setDisciplinaForm] = useState(VALORES_INICIAIS_DISCIPLINA);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [salvandoCurso, setSalvandoCurso] = useState(false);
  const [salvandoDisciplina, setSalvandoDisciplina] = useState(false);

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
        showToast('Preencha os campos obrigatórios com valores válidos.', 'danger');
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
      showToast('Não foi possível identificar o curso para exclusão.', 'danger');
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

  const abrirNovaDisciplina = (curso) => {
    const idCurso = getCursoId(curso);
    if (!idCurso) {
      showToast('Não foi possível identificar o curso para cadastrar disciplina.', 'danger');
      return;
    }

    setCursoSelecionadoDisciplina(curso);
    setDisciplinaForm({ ...VALORES_INICIAIS_DISCIPLINA, id_curso: idCurso });
    setShowModalDisciplina(true);
  };

  const handleDisciplinaInputChange = (e) => {
    const { name, value } = e.target;
    setDisciplinaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarDisciplina = async (e) => {
    e.preventDefault();
    setSalvandoDisciplina(true);

    try {
      const payload = {
        id_curso: Number(disciplinaForm.id_curso),
        nome: disciplinaForm.nome.trim(),
        codigo: disciplinaForm.codigo.trim(),
        ementa: disciplinaForm.ementa?.trim() || null,
        carga_horaria: Number(disciplinaForm.carga_horaria),
        creditos: disciplinaForm.creditos === '' ? null : Number(disciplinaForm.creditos),
        semestre: Number(disciplinaForm.semestre),
      };

      if (!payload.id_curso || !payload.nome || !payload.codigo || payload.carga_horaria <= 0 || payload.semestre <= 0) {
        showToast('Preencha os campos obrigatórios da disciplina com valores válidos.', 'danger');
        return;
      }

      if (payload.creditos !== null && payload.creditos <= 0) {
        showToast('Créditos deve ser maior que zero quando informado.', 'danger');
        return;
      }

      await api.post('/disciplinas', payload);
      showToast('Disciplina cadastrada com sucesso!');

      setShowModalDisciplina(false);
      setCursoSelecionadoDisciplina(null);
      setDisciplinaForm(VALORES_INICIAIS_DISCIPLINA);
      await carregarCursos();
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
      showToast('Erro ao salvar disciplina.', 'danger');
    } finally {
      setSalvandoDisciplina(false);
    }
  };

  return (
    <div className="admin-layout bg-light min-vh-100 p-4">
      {/* HEADER */}
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">Painel do Coordenador</h1>
          <p className="text-secondary mb-0">Monitoramento acadêmico e gestão de matriz curricular.</p>
        </div>
        <button 
          className="btn text-white btn-lg shadow-sm px-4 d-flex align-items-center gap-2" 
          style={{ backgroundColor: themeColors.darkBlue }} 
          onClick={abrirNovoCurso}
        >
          <i className="bi bi-plus-lg"></i> Novo Curso
        </button>
      </header>

      {toast.show && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show shadow-sm`} role="alert">
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast((prev) => ({ ...prev, show: false }))}></button>
        </div>
      )}

      {/* CARDS KPIS */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="stat-card p-3 bg-white shadow-sm rounded-4 border-0 d-flex align-items-center">
            <div className="icon-box rounded-3 p-3 me-3 text-white" style={{ backgroundColor: themeColors.darkBlue }}>
              <i className="bi bi-book-half fs-4"></i>
            </div>
            <div>
              <span className="d-block text-muted small fw-bold">CURSOS ATIVOS</span>
              <span className="h4 fw-bold mb-0 text-dark">{cursos.length}</span>
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
            placeholder="Pesquisar curso pelo nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
      </div>

      {/* ACORDEÃO DE CURSOS */}
      <div className="accordion custom-accordion shadow-sm rounded-4 overflow-hidden" id="accordionCursos">
        {loading ? (
          <div className="text-center py-5 bg-white">
            <div className="spinner-grow" style={{ color: themeColors.darkBlue }}></div>
          </div>
        ) : (
          cursos.map(curso => {
            const idCurso = getCursoId(curso);

            return (
            <div className="accordion-item border-0 border-bottom" key={idCurso ?? curso.codigo ?? curso.nome}>
              <div className="accordion-header d-flex justify-content-between align-items-center bg-white py-3 px-4">
                
                {/* Lado Esquerdo: Info do Curso e Toggle do Acordeão */}
                <button className="accordion-button collapsed shadow-none w-auto p-0 bg-transparent flex-grow-1" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idCurso}`}>
                  <div className="d-flex flex-column text-start">
                    <span className="h5 fw-bold mb-0 text-dark">{curso.nome}</span>
                    <span className="text-muted small">Cód: {curso.codigo}</span>
                  </div>
                </button>

                {/* Lado Direito: Ações Melhoradas (Foco e Ícones) */}
                <div className="header-actions d-flex align-items-center gap-2 z-3 position-relative ms-3">
                  
                  {/* Botões Principais em Destaque */}
                  <button 
                    className="btn btn-sm text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                    style={{ backgroundColor: themeColors.darkBlue }}
                    onClick={(e) => { e.stopPropagation(); handleOpenInsights(curso); }}
                    title="Ver Insights"
                  >
                    <i className="bi bi-graph-up-arrow"></i>
                    <span className="d-none d-md-inline">Insights</span>
                  </button>

                  <button
                    className="btn btn-success btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm"
                    style={{ backgroundColor: themeColors.green, borderColor: themeColors.green }}
                    onClick={(e) => { e.stopPropagation(); abrirNovaDisciplina(curso); }}
                  >
                    <i className="bi bi-plus-circle"></i>
                    <span className="d-none d-md-inline">Disciplina</span>
                  </button>

                  {/* Divisor Visual */}
                  <div className="vr mx-1 text-muted opacity-25"></div>

                  {/* Ações Secundárias (Apenas Ícones) */}
                  <button
                    className="btn btn-light btn-sm rounded-circle p-2 text-secondary hover-primary"
                    onClick={(e) => { e.stopPropagation(); abrirEditarCurso(curso); }}
                    title="Editar Curso"
                  >
                    <i className="bi bi-pencil-square fs-6"></i>
                  </button>
                  
                  <button
                    className="btn btn-light btn-sm rounded-circle p-2 text-secondary hover-danger"
                    onClick={(e) => { e.stopPropagation(); handleExcluirCurso(curso); }}
                    title="Excluir Curso"
                  >
                    <i className="bi bi-trash3 fs-6"></i>
                  </button>
                </div>
              </div>

              {/* Corpo do Acordeão (Tabela de Disciplinas) */}
              <div id={`collapse-${idCurso}`} className="accordion-collapse collapse" data-bs-parent="#accordionCursos">
                <div className="accordion-body bg-light-subtle p-0 border-top">
                   <table className="table table-hover align-middle mb-0 bg-white">
                    <thead className="table-light">
                      <tr className="small text-muted fw-bold">
                        <th className="ps-4 py-3">DISCIPLINA</th>
                        <th>CARGA HORÁRIA</th>
                        <th className="text-end pe-4">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curso.disciplinas?.length > 0 ? curso.disciplinas.map(disc => (
                        <tr key={disc.id}>
                          <td className="ps-4">
                            <span className="d-block fw-bold text-dark">{disc.nome}</span>
                            <span className="text-muted small">Cód: {disc.codigo}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1 rounded-3">
                              <i className="bi bi-clock me-1 text-muted"></i> {disc.cargaHoraria}h
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="btn-group-minimal">
                              <button className="btn btn-sm btn-link text-secondary"><i className="bi bi-pencil-square"></i></button>
                              <button className="btn btn-sm btn-link text-danger"><i className="bi bi-trash3"></i></button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-muted small">
                            Nenhuma disciplina cadastrada neste curso.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )})
        )}
      </div>

      {/* MODAL NOVO/EDITAR CURSO (Tema Azul Escuro) */}
      {showModalCurso && (
        <div className="modal-custom-overlay">
          <div className="modal-custom-content shadow-lg rounded-4 overflow-hidden border-0">
            <div className="modal-custom-header text-white p-4" style={{ backgroundColor: themeColors.darkBlue }}>
              <div>
                <h4 className="fw-bold mb-1">{cursoEditando ? 'Editar Curso' : 'Novo Curso'}</h4>
                <p className="mb-0 opacity-75">Preencha as informações gerais do curso.</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModalCurso(false)}></button>
            </div>

            <form onSubmit={handleSalvarCurso}>
              <div className="p-4 bg-white">
                <div className="row g-3">
                  {/* ... Campos do form de curso (mantidos idênticos ao seu código) ... */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Nome do Curso</label>
                    <input type="text" className="form-control" name="nome" value={cursoForm.nome} onChange={handleCursoInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Código</label>
                    <input type="text" className="form-control" name="codigo" value={cursoForm.codigo} onChange={handleCursoInputChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold text-secondary small">Descrição</label>
                    <textarea className="form-control" rows="2" name="descricao" value={cursoForm.descricao} onChange={handleCursoInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">Carga Horária</label>
                    <input type="number" min="1" className="form-control" name="cargaHoraria" value={cursoForm.cargaHoraria} onChange={handleCursoInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">Modalidade</label>
                    <select className="form-select" name="modalidade" value={cursoForm.modalidade} onChange={handleCursoInputChange} required>
                      <option value={1}>Presencial</option>
                      <option value={2}>EAD</option>
                      <option value={3}>Híbrido</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">ID Coordenador</label>
                    <input type="number" min="1" className="form-control" name="idCoordenador" value={cursoForm.idCoordenador} onChange={handleCursoInputChange} required />
                  </div>
                </div>
              </div>

              <div className="bg-light p-3 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light border text-secondary fw-bold" onClick={() => setShowModalCurso(false)}>Cancelar</button>
                <button type="submit" className="btn text-white fw-bold px-4" style={{ backgroundColor: themeColors.darkBlue }} disabled={salvandoCurso}>
                  {salvandoCurso ? 'Salvando...' : cursoEditando ? 'Salvar alterações' : 'Criar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVA DISCIPLINA (Tema Verde) */}
      {showModalDisciplina && (
        <div className="modal-custom-overlay">
          <div className="modal-custom-content shadow-lg rounded-4 overflow-hidden border-0">
            <div className="modal-custom-header text-white p-4" style={{ backgroundColor: themeColors.green }}>
              <div>
                <h4 className="fw-bold mb-1">Nova Disciplina</h4>
                <p className="mb-0 opacity-75">
                  {cursoSelecionadoDisciplina?.nome ? `Vinculada ao curso: ${cursoSelecionadoDisciplina.nome}` : 'Preencha os dados da disciplina.'}
                </p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModalDisciplina(false)}></button>
            </div>

            <form onSubmit={handleSalvarDisciplina}>
              <div className="p-4 bg-white">
                <div className="row g-3">
                  {/* ... Campos do form de disciplina ... */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Nome</label>
                    <input type="text" className="form-control" name="nome" value={disciplinaForm.nome} onChange={handleDisciplinaInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-secondary small">Código</label>
                    <input type="text" className="form-control" name="codigo" value={disciplinaForm.codigo} onChange={handleDisciplinaInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">Carga Horária</label>
                    <input type="number" min="1" className="form-control" name="carga_horaria" value={disciplinaForm.carga_horaria} onChange={handleDisciplinaInputChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">Créditos</label>
                    <input type="number" min="1" className="form-control" name="creditos" value={disciplinaForm.creditos} onChange={handleDisciplinaInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold text-secondary small">Semestre</label>
                    <input type="number" min="1" className="form-control" name="semestre" value={disciplinaForm.semestre} onChange={handleDisciplinaInputChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold text-secondary small">Ementa</label>
                    <textarea className="form-control" rows="2" name="ementa" value={disciplinaForm.ementa} onChange={handleDisciplinaInputChange} />
                  </div>
                </div>
              </div>

              <div className="bg-light p-3 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light border text-secondary fw-bold" onClick={() => setShowModalDisciplina(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success fw-bold px-4" disabled={salvandoDisciplina}>
                  {salvandoDisciplina ? 'Salvando...' : 'Adicionar Disciplina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE INSIGHTS */}
      {showModalInsights && cursoSelecionadoInsights && (
        <div className="modal-custom-overlay">
          <div className="modal-custom-content shadow-lg rounded-4 overflow-hidden border-0">
            <div className="modal-custom-header text-white p-4" style={{ backgroundColor: themeColors.darkBlue }}>
              <div>
                <h4 className="fw-bold mb-1">Painel Acadêmico</h4>
                <p className="mb-0 opacity-75">{cursoSelecionadoInsights.nome}</p>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowModalInsights(false)}></button>
            </div>
            
            <div className="p-4 bg-light">
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="p-3 bg-white rounded-4 shadow-sm text-center border-bottom border-primary border-3">
                    <small className="text-muted fw-bold d-block mb-1">CARGA HORÁRIA</small>
                    <h4 className="text-primary fw-bold mb-0">{cursoSelecionadoInsights.cargaHoraria}h</h4>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-white rounded-4 shadow-sm text-center border-bottom border-primary border-3">
                    <small className="text-muted fw-bold d-block mb-1">DISCIPLINAS</small>
                    <h4 className="text-primary fw-bold mb-0">{cursoSelecionadoInsights.disciplinas?.length || 0}</h4>
                  </div>
                </div>
              </div>

              <div className="card border-0 rounded-4 p-4 shadow-sm">
                <h6 className="fw-bold mb-3 text-secondary text-uppercase">Dados cadastrados</h6>
                <p className="mb-2"><strong>Código:</strong> {cursoSelecionadoInsights.codigo}</p>
                <p className="mb-0"><strong>Descrição:</strong> {cursoSelecionadoInsights.descricao || 'Não informada'}</p>
                <small className="text-muted mt-3">Indicadores de reprovação e evasão serão exibidos quando houver histórico acadêmico suficiente.</small>
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
