import React, { useState, useMemo } from 'react';

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---
const MOCK_USUARIOS_INICIAIS = [
  { id: 101, nome: 'Ana Silva', email: 'ana.silva@edu.com', matricula: 'RA123456', role: 'aluno', status: 'Ativo' },
  { id: 102, nome: 'Bruno Costa', email: 'bruno.costa@edu.com', matricula: 'RA123457', role: 'aluno', status: 'Inativo' },
  { id: 201, nome: 'Prof. Carlos Dias', email: 'carlos.dias@edu.com', matricula: 'PROF801', role: 'professor', status: 'Ativo' },
  { id: 103, nome: 'Daniel Moreira', email: 'daniel.m@edu.com', matricula: 'RA123460', role: 'aluno', status: 'Ativo' },
  { id: 202, nome: 'Prof. Ana Faria', email: 'ana.faria@edu.com', matricula: 'PROF802', role: 'professor', status: 'Ativo' },
];
// -----------------------------------------------------------------

export default function GerenciarUsuarios() {

  // --- STATES DO COMPONENTE ---
  const [usuarios, setUsuarios] = useState(MOCK_USUARIOS_INICIAIS);
  const [showModal, setShowModal] = useState(false); // Controla o modal
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroRole, setFiltroRole] = useState('todos'); // 'todos', 'aluno', 'professor'
  
  // State para o formulário do novo usuário
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    matricula: '',
    role: 'aluno', // Papel padrão
    senha: ''
  });

  // --- LÓGICA DE FILTRO (useMemo para performance) ---
  const usuariosFiltrados = useMemo(() => {
    let filtrados = usuarios;

    // 1. Filtra por Papel (Role)
    if (filtroRole !== 'todos') {
      filtrados = filtrados.filter(u => u.role === filtroRole);
    }

    // 2. Filtra por Busca (Nome ou E-mail)
    if (filtroBusca.length > 0) {
      filtrados = filtrados.filter(u =>
        u.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
        u.email.toLowerCase().includes(filtroBusca.toLowerCase())
      );
    }
    
    return filtrados;
  }, [usuarios, filtroBusca, filtroRole]);

  
  // --- HANDLERS (Ações) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleCadastrarUsuario = (e) => {
    e.preventDefault();
    // Validação simples
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.matricula || !novoUsuario.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    const usuarioParaAdicionar = {
      id: Date.now(), // ID único (simples)
      ...novoUsuario,
      status: 'Ativo' // Padrão
    };
    
    // Adiciona o novo usuário no topo da lista (simulando o BD)
    setUsuarios([usuarioParaAdicionar, ...usuarios]);
    
    // Fecha o modal e limpa o formulário
    setShowModal(false);
    setNovoUsuario({ nome: '', email: '', matricula: '', role: 'aluno', senha: '' });
  };

  const handleExcluirUsuario = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };


  // --- JSX (Renderização) ---
  return (
    <>
      <h2 className="mb-4">Gerenciar Usuários</h2>

      {/* --- 1. BARRA DE FILTROS E AÇÕES --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white p-3">
          <div className="row g-3 align-items-center">
            {/* Filtro de Busca */}
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nome ou e-mail..."
                value={filtroBusca}
                onChange={(e) => setFiltroBusca(e.target.value)}
              />
            </div>
            {/* Filtro de Papel */}
            <div className="col-md-4">
              <select 
                className="form-select"
                value={filtroRole}
                onChange={(e) => setFiltroRole(e.target.value)}
              >
                <option value="todos">Todos os Papéis</option>
                <option value="aluno">Apenas Alunos</option>
                <option value="professor">Apenas Professores</option>
              </select>
            </div>
            {/* Botão de Novo Usuário */}
            <div className="col-md-3 text-end">
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-person-plus-fill me-2"></i>Novo Usuário
              </button>
            </div>
          </div>
        </div>
        
        {/* --- 2. TABELA DE USUÁRIOS --- */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Usuário</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Matrícula/RA</th>
                  <th scope="col">Papel</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(user => (
                  <tr key={user.id}>
                    {/* Usuário (Nome) */}
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src="/imagens/usuario-generico.png" 
                          alt={user.nome} 
                          width="40" height="40" 
                          className="rounded-circle me-3"
                        />
                        <div>
                          <strong className="d-block">{user.nome}</strong>
                        </div>
                      </div>
                    </td>
                    {/* E-mail */}
                    <td>{user.email}</td>
                    {/* Matrícula/RA */}
                    <td>{user.matricula}</td>
                    {/* Papel (Badge) */}
                    <td>
                      <span className={`badge ${user.role === 'aluno' ? 'bg-primary-subtle text-primary-emphasis' : 'bg-success-subtle text-success-emphasis'}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Status (Badge) */}
                    <td>
                      <span className={`badge ${user.status === 'Ativo' ? 'bg-secondary-subtle text-secondary-emphasis' : 'bg-danger-subtle text-danger-emphasis'}`}>
                        {user.status}
                      </span>
                    </td>
                    {/* Ações */}
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        title="Editar"
                        onClick={() => alert('Função "Editar" será implementada aqui.')}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        title="Excluir"
                        onClick={() => handleExcluirUsuario(user.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuariosFiltrados.length === 0 && (
              <div className="text-center p-4 text-muted">Nenhum usuário encontrado.</div>
            )}
          </div>
        </div>
      </div>

      {/* --- 3. MODAL DE CADASTRO --- */}
      {/* Este é o modal do Bootstrap controlado pelo state 'showModal'.
        Usamos CSS inline para 'display: block' quando 'showModal' é true.
      */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleCadastrarUsuario}>
                  
                  <div className="modal-header">
                    <h5 className="modal-title">Cadastrar Novo Usuário</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  
                  <div className="modal-body">
                    <p className="text-muted small">Preencha os dados do novo usuário.</p>
                    
                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label">Nome Completo</label>
                      <input type="text" className="form-control" id="nome" name="nome" value={novoUsuario.nome} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">E-mail</label>
                      <input type="email" className="form-control" id="email" name="email" value={novoUsuario.email} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="row g-2">
                      <div className="col-md-5 mb-3">
                        <label htmlFor="role" className="form-label">Papel</label>
                        <select id="role" name="role" className="form-select" value={novoUsuario.role} onChange={handleInputChange}>
                          <option value="aluno">Aluno</option>
                          <option value="professor">Professor</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar Usuário</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
          {/* Backdrop (fundo escuro do modal) */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}