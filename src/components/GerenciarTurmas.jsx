import React, { useState, useEffect, useMemo } from 'react';
import api from './../api';

const VALORES_INICIAIS_TURMA = {
  id: null,
  nomeTurma: '',
  disciplinaId: '',
  professorId: ''
};

export default function GerenciarTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState(VALORES_INICIAIS_TURMA);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const normalizarTurma = (turma) => ({
    id: turma.id ?? turma.Id,
    disciplinaId: turma.disciplinaId ?? turma.DisciplinaId ?? null,
    professorId: turma.professorId ?? turma.ProfessorId ?? null,
    nomeTurma: turma.nomeTurma ?? turma.NomeTurma ?? ''
  });

  const extrairLista = (resposta) => {
    if (Array.isArray(resposta?.data)) return resposta.data;
    if (Array.isArray(resposta?.data?.data)) return resposta.data.data;
    return [];
  };

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      const resTurmas = await api.get('/turmas');
      const turmasNormalizadas = extrairLista(resTurmas).map(normalizarTurma);
      console.log('Turmas carregadas do servidor:', turmasNormalizadas);
      setTurmas(turmasNormalizadas);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      showToast('Erro ao conectar com o servidor.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const turmasFiltradas = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return turmas;

    return turmas.filter((turma) => {
      const nome = turma.nomeTurma?.toLowerCase() || '';
      const disciplina = turma.disciplinaId?.toString() || '';
      const professor = turma.professorId?.toString() || '';

      return nome.includes(termo) || disciplina.includes(termo) || professor.includes(termo);
    });
  }, [turmas, filtro]);

  const indicadores = useMemo(() => {
    const semProfessor = turmas.filter((turma) => !turma.professorId).length;
    const semDisciplina = turmas.filter((turma) => !turma.disciplinaId).length;

    return {
      total: turmas.length,
      semProfessor,
      semDisciplina
    };
  }, [turmas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowModal = (turma = null) => {
    if (turma) {
      setIsEditing(true);
      setFormData({
        id: turma.id,
        nomeTurma: turma.nomeTurma || '',
        disciplinaId: turma.disciplinaId ?? '',
        professorId: turma.professorId ?? ''
      });
    } else {
      setIsEditing(false);
      setFormData(VALORES_INICIAIS_TURMA);
    }
    setShowModal(true);
  };

  const montarPayload = () => ({
    nomeTurma: formData.nomeTurma.trim(),
    disciplinaId: formData.disciplinaId === '' ? null : Number(formData.disciplinaId),
    professorId: formData.professorId === '' ? null : Number(formData.professorId)
  });

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = montarPayload();

      if (!payload.nomeTurma) {
        showToast('Informe o nome da turma.', 'danger');
        return;
      }

      if (
        (payload.disciplinaId !== null && payload.disciplinaId <= 0) ||
        (payload.professorId !== null && payload.professorId <= 0)
      ) {
        showToast('IDs de disciplina e professor devem ser maiores que zero.', 'danger');
        return;
      }

      if (isEditing) {
        await api.put(`/turmas/${formData.id}`, payload);
        showToast('Turma atualizada com sucesso.');
      } else {
        await api.post('/turmas', payload);
        showToast('Turma criada com sucesso.');
      }

      setShowModal(false);
      setFormData(VALORES_INICIAIS_TURMA);
      await carregarDadosIniciais();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      showToast('Erro ao salvar a turma.', 'danger');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta turma?')) return;

    try {
      await api.delete(`/turmas/${id}`);
      showToast('Turma excluida com sucesso.');
      await carregarDadosIniciais();
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      showToast('Erro ao excluir turma.', 'danger');
    }
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {toast.show && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show`} role="alert">
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast((prev) => ({ ...prev, show: false }))}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: '#1d1c2d' }}>Painel de Controle de Turmas</h2>
          <p className="text-muted mb-0">Gestao de turmas para coordenacao academica.</p>
        </div>
        <button className="btn btn-primary px-4 py-2" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>Criar Nova Turma
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Total de Turmas</small>
              <h3 className="fw-bold mb-0">{indicadores.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Sem Professor Vinculado</small>
              <h3 className="fw-bold mb-0 text-warning">{indicadores.semProfessor}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <small className="text-muted">Sem Disciplina Vinculada</small>
              <h3 className="fw-bold mb-0 text-danger">{indicadores.semDisciplina}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Filtrar por nome da turma, id da disciplina ou id do professor"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Nome da Turma</th>
                  <th>Disciplina (ID)</th>
                  <th>Professor (ID)</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5">Carregando dados do servidor...</td></tr>
                ) : turmasFiltradas.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">Nenhuma turma encontrada para o filtro informado.</td></tr>
                ) : (
                  turmasFiltradas.map((t) => (
                    <tr key={t.id ?? `${t.nomeTurma}-${t.disciplinaId}-${t.professorId}`}>
                      <td className="ps-4">
                        <span className="fw-bold">{t.nomeTurma || 'Sem nome'}</span>
                      </td>
                      <td>
                        {t.disciplinaId ? (
                          <span className="badge bg-primary-subtle text-primary">#{t.disciplinaId}</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">Nao vinculada</span>
                        )}
                      </td>
                      <td>
                        {t.professorId ? (
                          <span className="badge bg-success-subtle text-success">#{t.professorId}</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning">Sem professor</span>
                        )}
                      </td>
                      <td>
                        {!t.disciplinaId || !t.professorId ? (
                          <span className="badge bg-warning text-dark">Pendente de vinculacao</span>
                        ) : (
                          <span className="badge bg-success">Completa</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleShowModal(t)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(t.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleSalvar}>
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">{isEditing ? 'Editar Turma' : 'Nova Turma'}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nome da Turma</label>
                      <input type="text" name="nomeTurma" className="form-control" value={formData.nomeTurma} onChange={handleInputChange} required placeholder="Ex: Engenharia Noturno A" />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Disciplina ID</label>
                        <input
                          type="number"
                          name="disciplinaId"
                          className="form-control"
                          min="1"
                          value={formData.disciplinaId}
                          onChange={handleInputChange}
                          placeholder="Ex: 12"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Professor ID</label>
                        <input
                          type="number"
                          name="professorId"
                          className="form-control"
                          min="1"
                          value={formData.professorId}
                          onChange={handleInputChange}
                          placeholder="Ex: 45"
                        />
                      </div>
                    </div>
                    <p className="text-muted small mb-0">Disciplina e professor sao opcionais no cadastro inicial.</p>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary px-4" disabled={salvando}>
                      {salvando ? 'Salvando...' : 'Salvar Alteracoes'}
                    </button>
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