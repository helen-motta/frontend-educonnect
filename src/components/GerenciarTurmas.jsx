import React, { useState, useEffect, useMemo } from 'react';
import api from './../api';

export default function GerenciarTurmas() {
  // --- ESTADOS ---
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]); // Para o select do modal
  const [disciplinas, setDisciplinas] = useState([]); // Disciplinas mapeadas do endpoint
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // O ID do professor logado (Vindo do seu sistema de login/JWT)
  const professorLogadoId = 1; 

  const [formData, setFormData] = useState({
    id: null,
    disciplinaId: '',
    cursoId: '',
    nomeTurma: '',
    professorId: professorLogadoId,
    vagas: 40,
    sala: '',
    horarios: [] // IDs dos slots ou strings conforme seu back
  });

  // --- BUSCA DE DADOS (API) ---

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      
      // 1. Busca turmas filtradas pelo professor logado (Use Case do Back)
      const resTurmas = await api.get(`$/turmas`, {
        params: { professorId: professorLogadoId }
      });

      // 2. Busca cursos para preencher o Modal de criação
      const resCursos = await api.get(`$/cursos`);

      // 3. Busca disciplinas do professor com todos os detalhes
      const resDisciplinas = await api.get('/turmas/professor');

      setTurmas(resTurmas.data);
      setCursos(resCursos.data);
      
      // Mapeia as disciplinas do endpoint para o componente
      const disciplinasFormatadas = resDisciplinas.data.map(turma => ({
        id: turma.id,
        nome: `${turma.nomeTurma} - ${turma.disciplinaNome}`,
        disciplinaNome: turma.disciplinaNome,
        nomeTurma: turma.nomeTurma,
        horariosFormatados: turma.horariosFormatados || [],
        quantidadeInscritos: turma.quantidadeInscritos,
        vagas: turma.vagas
      }));
      
      setDisciplinas(disciplinasFormatadas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao conectar com o servidor C#.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShowModal = (turma = null) => {
    if (turma) {
      setIsEditing(true);
      setFormData({
        ...turma,
        vagas: turma.vagasTotais // Mapeia o nome do DTO para o form
      });
    } else {
      setIsEditing(false);
      setFormData({
        disciplinaId: '',
        nomeTurma: '',
        professorId: professorLogadoId,
        vagas: 40,
        sala: '',
        horarios: []
      });
    }
    setShowModal(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`$/turmas/${formData.id}`, formData);
      } else {
        await api.post(`$/turmas`, formData);
      }
      setShowModal(false);
      carregarDadosIniciais(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao salvar a turma.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta turma?")) return;
    try {
      await api.delete(`$/turmas/${id}`);
      carregarDadosIniciais();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  // --- RENDERIZAÇÃO ---

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: '#1d1c2d' }}>Gerenciar Minhas Turmas</h2>
          <p className="text-muted">Painel exclusivo do Professor</p>
        </div>
        <button className="btn btn-primary px-4 py-2" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>Criar Nova Turma
        </button>
      </div>

      {/* TABELA */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Turma / Sala</th>
                  <th>Disciplina</th>
                  <th>Vagas (Ocupadas/Total)</th>
                  <th>Horários</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5">Carregando dados do servidor...</td></tr>
                ) : turmas.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">Nenhuma turma vinculada ao seu usuário.</td></tr>
                ) : (
                  turmas.map(t => (
                    <tr key={t.id}>
                      <td className="ps-4">
                        <span className="fw-bold d-block">{t.nomeTurma}</span>
                        <small className="text-muted"><i className="bi bi-geo-alt me-1"></i>{t.sala || 'Sem sala'}</small>
                      </td>
                      <td>{t.disciplinaNome}</td>
                      <td>
                        <div className="d-flex align-items-center">
                           <span className="badge rounded-pill bg-primary-subtle text-primary me-2">
                            {t.vagasOcupadas} / {t.vagasTotais}
                           </span>
                        </div>
                      </td>
                      <td>
                        {t.horariosFormatados?.map((h, i) => (
                          <span key={i} className="badge bg-secondary-subtle text-secondary-emphasis me-1" style={{fontSize: '0.7rem'}}>{h}</span>
                        ))}
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

      {/* MODAL (Bootstrap Nativo via State) */}
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
                        <label className="form-label">Vagas Totais</label>
                        <input type="number" name="vagas" className="form-control" value={formData.vagas} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sala</label>
                        <input type="text" name="sala" className="form-control" value={formData.sala} onChange={handleInputChange} placeholder="Ex: Lab 04" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Disciplina</label>
                      <select name="disciplinaId" className="form-select" value={formData.disciplinaId} onChange={handleInputChange} required>
                        <option value="">Selecione...</option>
                        {disciplinas.map(disc => (
                          <option key={disc.id} value={disc.id}>
                            {disc.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary px-4">Salvar Alterações</button>
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