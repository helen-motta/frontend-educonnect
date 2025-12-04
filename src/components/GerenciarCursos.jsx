import React, { useState, useEffect } from 'react';

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---
const MOCK_CURSOS_INICIAIS = [
  {
    id: 'c1',
    nome: 'Engenharia de Software',
    disciplinas: [
      { id: 'es101', codigo: 'CALC101', nome: 'Cálculo I', creditos: 4, ementa: 'Estudo de limites, derivadas e integrais.', semestre: 1, preRequisitos: [] },
      { id: 'es102', codigo: 'ALG101', nome: 'Álgebra Linear', creditos: 4, ementa: 'Vetores, matrizes e sistemas lineares.', semestre: 1, preRequisitos: [] },
      { id: 'es103', codigo: 'CALC102', nome: 'Cálculo II', creditos: 4, ementa: 'Derivadas parciais e integrais múltiplas.', semestre: 2, preRequisitos: ['es101'] }, // Pré-requisito: Cálculo I
      { id: 'es104', codigo: 'PROG101', nome: 'Programação I', creditos: 6, ementa: 'Lógica de programação e estruturas de dados.', semestre: 2, preRequisitos: ['es102'] }, // Pré-requisito: Álgebra
    ]
  },
  {
    id: 'c2',
    nome: 'Design Gráfico',
    disciplinas: [
      { id: 'dg101', codigo: 'TGP101', nome: 'Teoria Geral da Forma', creditos: 4, ementa: 'Estudo das formas e cores.', semestre: 1, preRequisitos: [] },
      { id: 'dg102', codigo: 'HIST101', nome: 'História da Arte', creditos: 2, ementa: 'Visão geral da história da arte.', semestre: 1, preRequisitos: [] },
    ]
  }
];
// -----------------------------------------------------------------

const VALORES_INICIAIS_FORM = {
  nome: '',
  codigo: '',
  creditos: 0,
  ementa: '',
  semestre: 1,
  preRequisitos: []
};

export default function GerenciarCursos() {

  // State principal com todos os dados
  const [cursos, setCursos] = useState(MOCK_CURSOS_INICIAIS);
  
  // States de controle do Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('nova'); // 'nova' ou 'editar'
  const [currentCursoId, setCurrentCursoId] = useState(null); // Qual curso estamos editando
  
  // State para o formulário (controlado)
  const [formData, setFormData] = useState(VALORES_INICIAIS_FORM);

  /**
   * Função helper para abrir o modal,
   * seja para uma nova disciplina ou para editar uma existente.
   */
  const handleShowModal = (tipo, cursoId, disciplina = null) => {
    setModalType(tipo);
    setCurrentCursoId(cursoId);
    
    if (tipo === 'editar' && disciplina) {
      // Se for editar, preenche o formulário com os dados da disciplina
      setFormData(disciplina);
    } else {
      // Se for nova, reseta o formulário
      setFormData(VALORES_INICIAIS_FORM);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(VALORES_INICIAIS_FORM);
    setCurrentCursoId(null);
  };

  // Handler genérico para os inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler específico para o <select multiple>
  const handleMultiSelectChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setFormData(prev => ({ ...prev, preRequisitos: values }));
  };

  /**
   * Lógica para salvar (Adicionar ou Editar)
   */
  const handleSalvarDisciplina = (e) => {
    e.preventDefault();

    if (modalType === 'nova') {
      // --- Lógica de ADICIONAR ---
      const novaDisciplina = { ...formData, id: `d${Date.now()}` };
      
      setCursos(prevCursos => 
        prevCursos.map(curso => {
          if (curso.id === currentCursoId) {
            return { ...curso, disciplinas: [...curso.disciplinas, novaDisciplina] };
          }
          return curso;
        })
      );
      
    } else {
      // --- Lógica de EDITAR ---
      setCursos(prevCursos =>
        prevCursos.map(curso => {
          if (curso.id === currentCursoId) {
            // Encontra e substitui a disciplina no array
            const disciplinasAtualizadas = curso.disciplinas.map(d => 
              d.id === formData.id ? formData : d
            );
            return { ...curso, disciplinas: disciplinasAtualizadas };
          }
          return curso;
        })
      );
    }
    
    handleCloseModal();
  };

  /**
   * Lógica para EXCLUIR uma disciplina
   */
  const handleExcluirDisciplina = (cursoId, disciplinaId) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina? Isso pode afetar pré-requisitos.')) {
      setCursos(prevCursos =>
        prevCursos.map(curso => {
          if (curso.id === cursoId) {
            // Filtra a disciplina fora do array
            const disciplinasAtualizadas = curso.disciplinas.filter(d => d.id !== disciplinaId);
            return { ...curso, disciplinas: disciplinasAtualizadas };
          }
          return curso;
        })
      );
    }
  };

  /**
   * Helper para mostrar os nomes dos pré-requisitos na tabela
   */
  const getPreRequisitoNomes = (disciplina, curso) => {
    if (!disciplina.preRequisitos || disciplina.preRequisitos.length === 0) {
      return <span className="text-muted">Nenhum</span>;
    }
    return disciplina.preRequisitos.map(reqId => {
      const req = curso.disciplinas.find(d => d.id === reqId);
      return (
        <span key={reqId} className="badge bg-secondary-subtle text-secondary-emphasis me-1">
          {req ? req.nome : 'ID Inválido'}
        </span>
      );
    });
  };

  // --- JSX (Renderização) ---
  return (
    <>
      <h2 className="mb-4">Gerenciar Cursos e Disciplinas</h2>

      <div className="alert alert-light">
        <i className="bi bi-info-circle-fill me-2"></i>
        Expanda um curso para ver e gerenciar suas disciplinas.
      </div>
      
      {/* (O botão de "+ Novo Curso" não foi implementado, mas ficaria aqui) */}

      {/* --- 1. ACORDEÃO (Mestre) --- */}
      <div className="accordion" id="accordionCursos">
        {cursos.map(curso => (
          <div className="accordion-item" key={curso.id}>
            
            {/* Cabeçalho do Acordeão */}
            <h2 className="accordion-header" id={`heading-${curso.id}`}>
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse-${curso.id}`} 
                aria-expanded="false" 
                aria-controls={`collapse-${curso.id}`}
              >
                <strong className="fs-5">{curso.nome}</strong>
              </button>
            </h2>
            
            {/* Corpo do Acordeão (Detalhe) */}
            <div 
              id={`collapse-${curso.id}`} 
              className="accordion-collapse collapse" 
              aria-labelledby={`heading-${curso.id}`} 
              data-bs-parent="#accordionCursos"
            >
              <div className="accordion-body">
                
                {/* Botão de Adicionar Disciplina */}
                <div className="text-end mb-3">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleShowModal('nova', curso.id)}
                  >
                    <i className="bi bi-plus-circle-fill me-2"></i>Adicionar Disciplina
                  </button>
                </div>

                {/* Tabela de Disciplinas */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Nome da Disciplina</th>
                        <th scope="col">Créditos</th>
                        <th scope="col">Semestre</th>
                        <th scope="col">Pré-requisitos</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curso.disciplinas.map(disciplina => (
                        <tr key={disciplina.id}>
                          <td><strong>{disciplina.codigo}</strong></td>
                          <td>{disciplina.nome}</td>
                          <td>{disciplina.creditos}</td>
                          <td>{disciplina.semestre}º</td>
                          <td>{getPreRequisitoNomes(disciplina, curso)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-secondary me-1"
                              title="Editar"
                              onClick={() => handleShowModal('editar', curso.id, disciplina)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              title="Excluir"
                              onClick={() => handleExcluirDisciplina(curso.id, disciplina.id)}
                            >
                              <i className="bi bi-trash-fill"></i>
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
        ))}
      </div>

      {/* --- 2. MODAL DE ADICIONAR/EDITAR DISCIPLINA --- */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSalvarDisciplina}>
                  
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {modalType === 'nova' ? 'Adicionar Nova Disciplina' : `Editar: ${formData.nome}`}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="row g-3">
                      {/* Coluna 1 */}
                      <div className="col-md-7">
                        <div className="mb-3">
                          <label htmlFor="nome" className="form-label">Nome da Disciplina</label>
                          <input type="text" className="form-control" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <div className="row g-2">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <input type="text" className="form-control" id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="creditos" className="form-label">Créditos</label>
                            <input type="number" className="form-control" id="creditos" name="creditos" value={formData.creditos} onChange={handleInputChange} required />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label htmlFor="semestre" className="form-label">Semestre</label>
                            <input type="number" className="form-control" id="semestre" name="semestre" value={formData.semestre} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="ementa" className="form-label">Ementa (Descrição)</label>
                          <textarea className="form-control" id="ementa" name="ementa" rows="4" value={formData.ementa} onChange={handleInputChange}></textarea>
                        </div>
                      </div>
                      
                      {/* Coluna 2 (Pré-requisitos) */}
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label htmlFor="preRequisitos" className="form-label">Pré-requisitos</label>
                          <select 
                            multiple
                            className="form-select" 
                            id="preRequisitos"
                            name="preRequisitos"
                            size="12"
                            value={formData.preRequisitos}
                            onChange={handleMultiSelectChange}
                          >
                            <option value="" disabled>Segure Ctrl (ou Cmd) para selecionar</option>
                            {/* Lista as disciplinas do curso, exceto ela mesma */}
                            {cursos.find(c => c.id === currentCursoId).disciplinas
                              .filter(d => d.id !== formData.id) // Não pode ser pré-requisito de si mesma
                              .map(d => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar Disciplina</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}