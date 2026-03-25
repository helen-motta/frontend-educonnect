import React, { useState, useMemo, useEffect } from 'react';
import api from './../api';
import "./GerenciarUsuarios.css"
import "./../App.css"

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const tamanhoPagina = 10;

  const [filtroBuscaNome, setFiltroBuscaNome] = useState('');
  const [filtroBuscaEmail, setFiltroBuscaEmail] = useState('');
  const [filtroRole, setFiltroRole] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroRegistro, setFiltroRegistro] = useState('');

  const initialState = {
    nome: '', email: '', idPerfil: 1, papel: 'aluno',
    registro: '', cpf: '', rg: '', telefone: '',
    cep: '', endereco: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', status: 'Ativo'
  };

  const [novoUsuario, setNovoUsuario] = useState(initialState);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [isEditando, setIsEditando] = useState(false);
  const [isVisualizando, setIsVisualizando] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

const carregarUsuarios = async () => {
  setLoading(true);
  try {
    const params = {
      paginaNumero: paginaAtual,
      paginaTamanho: tamanhoPagina,
      nome: filtroBuscaNome || undefined,
      email: filtroBuscaEmail || undefined,
      idPerfil: filtroRole !== 'todos' ? filtroRole : undefined,
      status: filtroStatus !== 'todos' ? filtroStatus : undefined,
      registro: filtroRegistro || undefined,
    };

    const response = await api.get('/usuarios', { params });
    
    // Agora 'usuarios' recebe o que veio filtrado do banco
    setUsuarios(response.data.data || []); 
    setTotalPaginas(response.data.totalPaginas || 0);
  } catch (error) {
    console.error("Erro ao carregar usuários", error);
    showToast('Erro ao carregar usuários da base de dados', 'danger');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    carregarUsuarios();
  }, [paginaAtual]);

  const usuariosFiltrados = useMemo(() => {
    let filtrados = [...usuarios];
    if (filtroRole !== 'todos') filtrados = filtrados.filter(u => u.role === filtroRole);
    if (filtroStatus !== 'todos') filtrados = filtrados.filter(u => u.status === filtroStatus);
    if (filtroBuscaNome) {
      const busca = filtroBuscaNome.toLowerCase();
      filtrados = filtrados.filter(u => u.nome?.toLowerCase().includes(busca));
    }
    if (filtroBuscaEmail) {
      const busca = filtroBuscaEmail.toLowerCase();
      filtrados = filtrados.filter(u => u.email?.toLowerCase().includes(busca));
    }
    if (filtroRegistro) {
      const busca = filtroRegistro;
      filtrados = filtrados.filter(u => u.registro?.toLowerCase().includes(busca));
    }
    return filtrados;
  }, [usuarios, filtroBuscaNome, filtroBuscaEmail, filtroRole, filtroStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleCadastrarUsuario = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Cadastrando usuário:', novoUsuario);
      const response = await api.post('/Usuarios', novoUsuario);
      if (response.status === 200 || response.status === 201) {
        carregarUsuarios(); 
        setShowModal(false);
        setNovoUsuario(initialState);
        showToast('Usuário cadastrado com sucesso!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Erro ao cadastrar', 'danger');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNovoUsuario({...usuario});
    setIsEditando(true);
    setIsVisualizando(false);
    setShowModal(true);
  };

  const handleVisualizarUsuario = (usuario) => {
    setNovoUsuario({...usuario});
    setIsVisualizando(true);
    setIsEditando(false);
    setShowModal(true);
  };

  const handleAtualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(`/usuarios/${usuarioEditando.id}`, novoUsuario);
      if (response.status === 204) {
        carregarUsuarios();
        setShowModal(false);
        setIsEditando(false);
        showToast('Usuário atualizado com sucesso!');
      }
    } catch (err) {
      showToast('Erro ao atualizar usuário', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDesativarUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja desativar este usuário?')) return;
    try {
      await api.put(`/usuarios/desativar/${id}`);
      carregarUsuarios();
      showToast('Usuário desativado com sucesso!');
    } catch (err) {
      showToast('Erro ao desativar usuário', 'danger');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciar Usuários</h2>
        <button className="btn btn-primary" onClick={() => {
            setNovoUsuario(initialState);
            setIsEditando(false);
            setIsVisualizando(false);
            setShowModal(true);
        }}>
          <i className="bi bi-person-plus-fill me-2"></i>Novo Usuário
        </button>
      </div>

      {toast.show && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show`} role="alert">
          {toast.message}
          <button type="button" className="btn-close" onClick={() => setToast({ ...toast, show: false })}></button>
        </div>
      )}
<div className="card shadow-sm border-0 mb-4">
  <div className="card-body py-2"> {/* py-2 reduz o preenchimento vertical para ficar mais slim */}
    <div className="row g-2 align-items-end"> {/* g-2 diminui o espaçamento entre colunas */}
      
      <div className="col">
        <label className="form-label small fw-bold mb-1">Nome</label>
        <input type="text" className="form-control form-control-sm" value={filtroBuscaNome} onChange={(e) => setFiltroBuscaNome(e.target.value)} />
      </div>

      <div className="col">
        <label className="form-label small fw-bold mb-1">E-mail</label>
        <input type="text" className="form-control form-control-sm" value={filtroBuscaEmail} onChange={(e) => setFiltroBuscaEmail(e.target.value)} />
      </div>

      <div className="col">
        <label className="form-label small fw-bold mb-1">Registro</label>
        <input type="text" className="form-control form-control-sm" value={filtroRegistro} onChange={(e) => setFiltroRegistro(e.target.value)} />
      </div>

      <div className="col-md-2">
        <label className="form-label small fw-bold mb-1">Papel</label>
        <select className="form-select form-select-sm" value={filtroRole} onChange={(e) => setFiltroRole(e.target.value)}>
          <option value={0}>Todos</option>
          <option value={1}>Admin</option>
          <option value={2}>Coord</option>
          <option value={3}>Prof</option>
          <option value={4}>Aluno</option>
        </select>
      </div>

      <div className="col-md-1">
        <label className="form-label small fw-bold mb-1">Status</label>
        <select className="form-select form-select-sm" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <div className="col-md-auto d-flex gap-1">
        <button 
          className="btn btn-primary btn-sm px-3" 
          onClick={() => { setPaginaAtual(1); carregarUsuarios(); }}
          disabled={loading}
          title="Buscar"
        >
          <i className="bi bi-search"></i>
        </button>
        <button 
          className="btn btn-outline-secondary btn-sm" 
          onClick={() => {
            setFiltroBuscaNome('');
            setFiltroBuscaEmail('');
            setFiltroRegistro('');
            setFiltroRole(0);
            setFiltroStatus('todos');
            setPaginaAtual(1);
            carregarUsuarios();
          }}
        >
          Limpar
        </button>
      </div>

    </div>
  </div>
</div>
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Usuário</th>
                  <th>Registro</th>
                  <th>E-mail</th>
                  <th>Papel</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan="6" className="text-center py-4">Carregando...</td></tr>
                ) : usuarios.map(user => (
                  <tr key={user.id}>
                    <td>{user.nome}</td>
                    <td>{user.registro}</td>
                    <td>{user.email}</td>
                    <td>{user.papel}</td>
                    <td>
                      <span className={`badge ${user.status === 'Ativo' ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm me-1" onClick={() => handleVisualizarUsuario(user)}><i className="bi bi-eye"></i></button>
                      <button className="btn btn-sm me-1" onClick={() => handleEditarUsuario(user)}><i className="bi bi-pencil"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

<div className="d-flex justify-content-between align-items-center mt-3">
  <span className="small text-muted">
    Mostrando página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
  </span>

  <nav>
    <ul className="pagination pagination-sm mb-0">
      <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
          disabled={loading}
        >
          &laquo;
        </button>
      </li>

      {[...Array(totalPaginas)].map((_, index) => {
        const numeroPagina = index + 1;
        return (
          <li 
            key={numeroPagina} 
            className={`page-item ${paginaAtual === numeroPagina ? 'active' : ''}`}
          >
            <button 
              className="page-link" 
              onClick={() => setPaginaAtual(numeroPagina)}
              disabled={loading}
            >
              {numeroPagina}
            </button>
          </li>
        );
      })}

      <li className={`page-item ${paginaAtual >= totalPaginas ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
          disabled={loading}
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</div>
{showModal && (
  <>
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <form onSubmit={isEditando ? handleAtualizarUsuario : handleCadastrarUsuario}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {isVisualizando ? 'Visualizar' : isEditando ? 'Editar' : 'Novo'} Usuário
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            
            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* SEÇÃO 1: DADOS PESSOAIS */}
              <h6 className="text-primary border-bottom pb-2 mb-3">Dados Pessoais</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-8">
                  <label className="form-label small fw-bold">Nome Completo</label>
                  <input name="nome" className="form-control" value={novoUsuario.nome || ''} onChange={handleInputChange} disabled={isVisualizando} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Telefone</label>
                  <input name="telefone" className="form-control" placeholder="(00) 00000-0000" value={novoUsuario.telefone || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">E-mail</label>
                  <input name="email" type="email" className="form-control" value={novoUsuario.email || ''} onChange={handleInputChange} disabled={isVisualizando} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">CPF</label>
                  <input name="cpf" className="form-control" placeholder="000.000.000-00" value={novoUsuario.cpf || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">RG</label>
                  <input name="rg" className="form-control" value={novoUsuario.rg || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-6">
{/* Verifique se existe uma <div className="row g-3"> envolvendo tudo isto */}
<div className="row g-3 mb-4">

    {/* Coluna do Papel */}
    <div className="col-md-8">
        <label className="form-label small fw-bold">Papel (Perfil)</label>
        <select 
            name="idPerfil" 
            className="form-select" 
            value={novoUsuario.idPerfil || 1} 
            onChange={handleInputChange} 
            disabled={isVisualizando}
            required
        >
            <option value={1}>Administrador</option>
            <option value={2}>Coordenador</option>
            <option value={3}>Professor</option>
            <option value={4}>Aluno</option>
        </select>
    </div>

    {/* Coluna do Status - Lado a Lado */}
    {/* d-flex e align-items-end garantem que o switch alinhe com a base do select */}
    <div className="col-md-4 d-flex align-items-end pb-2">
        <div className="form-check form-switch mb-0">
            <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="statusSwitch"
                name="status"
                checked={novoUsuario.status === 'Ativo'} 
                value={novoUsuario.status}
                onChange={(e) => {
                    const novoStatus = e.target.checked ? 'Ativo' : 'Inativo';
                    setNovoUsuario(prev => ({ ...prev, status: novoStatus }));
                }}
                disabled={isVisualizando}
            />
            <label className={`form-check-label fw-bold ms-2 ${novoUsuario.status === 'Ativo' ? 'text-success' : 'text-danger'}`} htmlFor="statusSwitch">
                {novoUsuario.status}
            </label>
        </div>
    </div>

</div>

</div>
              </div>

              <h6 className="text-primary border-bottom pb-2 mb-3">Endereço</h6>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label small fw-bold">CEP</label>
                  <input name="cep" className="form-control" placeholder="00000-000" value={novoUsuario.cep || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-7">
                  <label className="form-label small fw-bold">Logradouro (Rua/Av)</label>
                  <input name="endereco" className="form-control" value={novoUsuario.endereco || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-bold">Número</label>
                  <input name="numero" className="form-control" value={novoUsuario.numero || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Complemento</label>
                  <input name="complemento" className="form-control" placeholder="Apto, Bloco..." value={novoUsuario.complemento || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-7">
                  <label className="form-label small fw-bold">Bairro</label>
                  <input name="bairro" className="form-control" value={novoUsuario.bairro || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-bold">Cidade</label>
                  <input name="cidade" className="form-control" value={novoUsuario.cidade || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Estado (UF)</label>
                  <input name="estado" className="form-control" maxLength="2" placeholder="Ex: SP" value={novoUsuario.estado || ''} onChange={handleInputChange} disabled={isVisualizando} />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fechar</button>
              {!isVisualizando && (
                <button type="submit" className="btn btn-primary">
                  {isEditando ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </button>
              )}
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