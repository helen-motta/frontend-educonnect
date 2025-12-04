import React, { useState, useMemo } from 'react';

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---

// 1. O Catálogo de Cursos/Disciplinas (Criado na tela anterior)
const MOCK_CURSOS_E_DISCIPLINAS = [
  {
    id: 'c1',
    nome: 'Engenharia de Software',
    disciplinas: [
      { id: 'es101', nome: 'Cálculo I' },
      { id: 'es102', nome: 'Álgebra Linear' },
      { id: 'es103', nome: 'Cálculo II' },
      { id: 'es104', nome: 'Programação I' },
    ]
  },
  {
    id: 'c2',
    nome: 'Design Gráfico',
    disciplinas: [
      { id: 'dg101', nome: 'Teoria Geral da Forma' },
      { id: 'dg102', nome: 'História da Arte' },
    ]
  }
];

// 2. A Lista de Professores (Criados na tela "Gerenciar Usuários")
const MOCK_PROFESSORES = [
  { id: 'p1', nome: 'Prof. Silva' },
  { id: 'p2', nome: 'Prof. Ana Faria' },
  { id: 'p3', nome: 'Prof. Carlos Dias' },
];

// 3. Os "Slots" de Horário disponíveis
const MOCK_HORARIOS_SLOTS = [
  'SEG 08:00-09:50',
  'SEG 10:00-11:50',
  'TER 08:00-09:50',
  'TER 10:00-11:50',
  'QUA 08:00-09:50',
  'QUA 10:00-11:50',
  'QUI 08:00-09:50',
  'QUI 10:00-11:50',
  'SEX 08:00-09:50',
  'SEX 10:00-11:50',
];

// 4. A Lista de Turmas já criadas (O STATE principal)
const MOCK_TURMAS_INICIAIS = [
  { id: 't1', disciplinaId: 'es101', nomeTurma: 'Turma A', professorId: 'p1', vagas: 50, sala: 'B-102', horarios: ['SEG 08:00-09:50', 'QUA 08:00-09:50'] },
  { id: 't2', disciplinaId: 'es102', nomeTurma: 'Turma A', professorId: 'p2', vagas: 40, sala: 'C-201', horarios: ['TER 10:00-11:50', 'QUI 10:00-11:50'] },
  { id: 't3', disciplinaId: 'es101', nomeTurma: 'Turma B (Noturno)', professorId: 'p1', vagas: 50, sala: 'B-103', horarios: ['SEG 19:00-20:50', 'QUA 19:00-20:50'] },
];

// 5. Estado inicial do formulário do modal
const VALORES_INICIAIS_FORM = {
  disciplinaId: '',
  nomeTurma: '',
  professorId: '',
  vagas: 40,
  sala: '',
  horarios: [] // Array de strings (dos checkboxes)
};
// -----------------------------------------------------------------

export default function GerenciarTurmas() {

  // --- STATES DO COMPONENTE ---
  const [turmas, setTurmas] = useState(MOCK_TURMAS_INICIAIS);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // true se for editar
  const [formData, setFormData] = useState(VALORES_INICIAIS_FORM);
  
  // States dos Filtros da Tabela
  const [filtroCurso, setFiltroCurso] = useState('todos');
  const [filtroProfessor, setFiltroProfessor] = useState('todos');

  // State para o dropdown dependente
  const [disciplinasDoCurso, setDisciplinasDoCurso] = useState([]);


  // --- HANDLERS DO MODAL ---
  const handleShowModal = (turmaParaEditar = null) => {
    if (turmaParaEditar) {
      // Modo Edição: Carrega o form com os dados da turma
      setIsEditing(true);
      
      // Encontra o curso da disciplina
      const cursoId = MOCK_CURSOS_E_DISCIPLINAS.find(c => 
        c.disciplinas.some(d => d.id === turmaParaEditar.disciplinaId)
      )?.id;
      
      // Carrega as disciplinas daquele curso no dropdown
      const disciplinas = MOCK_CURSOS_E_DISCIPLINAS.find(c => c.id === cursoId)?.disciplinas || [];
      setDisciplinasDoCurso(disciplinas);
      
      // Preenche o formulário
      setFormData({ ...turmaParaEditar, cursoId: cursoId }); // Adiciona cursoId ao form
    } else {
      // Modo Criação: Reseta tudo
      setIsEditing(false);
      setFormData(VALORES_INICIAIS_FORM);
      setDisciplinasDoCurso([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Handler para inputs simples
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler para o DROPDOWN DEPENDENTE (Curso -> Disciplina)
  const handleCursoChange = (e) => {
    const cursoId = e.target.value;
    const disciplinas = MOCK_CURSOS_E_DISCIPLINAS.find(c => c.id === cursoId)?.disciplinas || [];
    setDisciplinasDoCurso(disciplinas);
    
    // Atualiza o form e reseta a disciplina selecionada
    setFormData(prev => ({ ...prev, cursoId: cursoId, disciplinaId: '' }));
  };

  // Handler para os Checkboxes de Horário
  const handleHorarioChange = (e) => {
    const { value, checked } = e.target;
    let horariosAtuais = formData.horarios;

    if (checked) {
      // Adiciona o horário ao array
      horariosAtuais = [...horariosAtuais, value];
    } else {
      // Remove o horário do array
      horariosAtuais = horariosAtuais.filter(h => h !== value);
    }
    setFormData(prev => ({ ...prev, horarios: horariosAtuais }));
  };
  
  // Handler para Salvar (Criar ou Editar)
  const handleSalvarTurma = (e) => {
    e.preventDefault();
    if (!formData.disciplinaId || !formData.professorId || !formData.nomeTurma) {
      alert('Preencha Disciplina, Nome da Turma e Professor.');
      return;
    }
    
    if (isEditing) {
      // Lógica de ATUALIZAR
      setTurmas(turmas.map(t => t.id === formData.id ? { ...formData } : t));
    } else {
      // Lógica de CRIAR
      const novaTurma = { ...formData, id: `t${Date.now()}` };
      setTurmas([novaTurma, ...turmas]);
    }
    handleCloseModal();
  };

  const handleExcluirTurma = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      setTurmas(turmas.filter(t => t.id !== id));
    }
  };
  
  // --- LÓGICA DE FILTRAGEM ---
  const turmasFiltradas = useMemo(() => {
    return turmas
      .filter(t => filtroProfessor === 'todos' || t.professorId === filtroProfessor)
      .filter(t => {
        if (filtroCurso === 'todos') return true;
        // Verifica se a disciplina da turma (t.disciplinaId) pertence ao curso (filtroCurso)
        const curso = MOCK_CURSOS_E_DISCIPLINAS.find(c => c.id === filtroCurso);
        return curso.disciplinas.some(d => d.id === t.disciplinaId);
      });
  }, [turmas, filtroCurso, filtroProfessor]);

  // --- FUNÇÕES HELPER (para legibilidade da tabela) ---
  const getDisciplinaNome = (disciplinaId) => {
    for (const curso of MOCK_CURSOS_E_DISCIPLINAS) {
      const disc = curso.disciplinas.find(d => d.id === disciplinaId);
      if (disc) return disc.nome;
    }
    return 'N/A';
  };
  
  const getProfessorNome = (professorId) => {
    return MOCK_PROFESSORES.find(p => p.id === professorId)?.nome || 'N/A';
  };

  
  // --- JSX (Renderização) ---
  return (
    <>
      <h2 className="mb-4">Gerenciar Turmas do Semestre</h2>
      
      {/* --- 1. BARRA DE FILTROS E AÇÕES --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white p-3">
          <div className="row g-3 align-items-center">
            {/* Filtro por Curso */}
            <div className="col-md-4">
              <select className="form-select" value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
                <option value="todos">Filtrar por Curso (Todos)</option>
                {MOCK_CURSOS_E_DISCIPLINAS.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            {/* Filtro por Professor */}
            <div className="col-md-4">
              <select className="form-select" value={filtroProfessor} onChange={(e) => setFiltroProfessor(e.target.value)}>
                <option value="todos">Filtrar por Professor (Todos)</option>
                {MOCK_PROFESSORES.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            {/* Botão de Nova Turma */}
            <div className="col-md-4 text-end">
              <button 
                className="btn btn-primary"
                onClick={() => handleShowModal(null)}
              >
                <i className="bi bi-plus-circle-fill me-2"></i>Adicionar Turma
              </button>
            </div>
          </div>
        </div>
        
        {/* --- 2. TABELA DE TURMAS --- */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Turma</th>
                  <th scope="col">Disciplina</th>
                  <th scope="col">Professor</th>
                  <th scope="col">Vagas</th>
                  <th scope="col">Horários</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmasFiltradas.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-4 text-muted">Nenhuma turma encontrada.</td></tr>
                )}
                
                {turmasFiltradas.map(turma => (
                  <tr key={turma.id}>
                    <td><strong>{turma.nomeTurma}</strong><br/><small className="text-muted">Sala: {turma.sala}</small></td>
                    <td>{getDisciplinaNome(turma.disciplinaId)}</td>
                    <td>{getProfessorNome(turma.professorId)}</td>
                    <td>{turma.vagas}</td>
                    <td>
                      {turma.horarios.map(h => (
                        <span key={h} className="badge bg-secondary-subtle text-secondary-emphasis d-block mb-1">{h}</span>
                      ))}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        title="Editar"
                        onClick={() => handleShowModal(turma)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        title="Excluir Turma"
                        onClick={() => handleExcluirTurma(turma.id)}
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
      
      {/* --- 3. MODAL DE ADICIONAR/EDITAR TURMA --- */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSalvarTurma}>
                  <div className="modal-header">
                    <h5 className="modal-title">{isEditing ? 'Editar Turma' : 'Adicionar Nova Turma'}</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="row g-3">
                      {/* Coluna 1: Dados da Turma */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="cursoId" className="form-label">1. Curso</label>
                          <select id="cursoId" name="cursoId" className="form-select" value={formData.cursoId || ''} onChange={handleCursoChange} required>
                            <option value="" disabled>Selecione o curso...</option>
                            {MOCK_CURSOS_E_DISCIPLINAS.map(c => (
                              <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="disciplinaId" className="form-label">2. Disciplina</label>
                          <select id="disciplinaId" name="disciplinaId" className="form-select" value={formData.disciplinaId} onChange={handleInputChange} required disabled={disciplinasDoCurso.length === 0}>
                            <option value="" disabled>Selecione a disciplina...</option>
                            {disciplinasDoCurso.map(d => (
                              <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="professorId" className="form-label">3. Professor</label>
                          <select id="professorId" name="professorId" className="form-select" value={formData.professorId} onChange={handleInputChange} required>
                            <option value="" disabled>Selecione o professor...</option>
                            {MOCK_PROFESSORES.map(p => (
                              <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div className="row g-2">
                          <div className="col-md-7 mb-3">
                            <label htmlFor="nomeTurma" className="form-label">Nome da Turma</label>
                            <input type="text" className="form-control" id="nomeTurma" name="nomeTurma" value={formData.nomeTurma} onChange={handleInputChange} placeholder="Ex: Turma A" required />
                          </div>
                          <div className="col-md-5 mb-3">
                            <label htmlFor="vagas" className="form-label">Vagas</label>
                            <input type="number" className="form-control" id="vagas" name="vagas" value={formData.vagas} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sala" className="form-label">Sala/Local</label>
                            <input type="text" className="form-control" id="sala" name="sala" value={formData.sala} onChange={handleInputChange} placeholder="Ex: B-105" />
                        </div>
                      </div>
                      
                      {/* Coluna 2: Horários */}
                      <div className="col-md-6">
                        <label className="form-label">4. Horários</label>
                        <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {MOCK_HORARIOS_SLOTS.map(slot => (
                            <div className="form-check" key={slot}>
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={slot} 
                                id={slot}
                                checked={formData.horarios.includes(slot)}
                                onChange={handleHorarioChange}
                              />
                              <label className="form-check-label" htmlFor={slot}>
                                {slot}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar Turma</button>
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