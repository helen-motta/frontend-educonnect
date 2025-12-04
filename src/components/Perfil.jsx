import React from 'react';
import { useAuth } from './AuthContext'; // Para buscar o usuário logado

/**
 * Componente interno para mostrar detalhes SÓ SE for Aluno
 */
const DetalhesAluno = ({ user }) => (
  <>
    <h5 className="mb-3">Informações Acadêmicas</h5>
    <ul className="list-group list-group-flush">
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Curso:</strong>
        <span>Engenharia de Software</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Matrícula (RA):</strong>
        <span>{user.ra || 'RA123456'}</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Período/Semestre:</strong>
        <span>5º Semestre</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Status:</strong>
        <span className="badge bg-success">Regular</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Média Geral (CR):</strong>
        <span>8.75</span>
      </li>
    </ul>
  </>
);

/**
 * Componente interno para mostrar detalhes SÓ SE for Professor
 */
const DetalhesProfessor = ({ user }) => (
  <>
    <h5 className="mb-3">Informações Profissionais</h5>
    <ul className="list-group list-group-flush">
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Departamento:</strong>
        <span>Departamento de Engenharia</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Matrícula (SIAPE):</strong>
        <span>{user.matricula || 'PROF901'}</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Titulação:</strong>
        <span>Doutorado (Ph.D.) em Ciência da Computação</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Sala:</strong>
        <span>B-201</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
        <strong className="text-muted">Currículo Lattes:</strong>
        <a href="#" target="_blank" rel="noopener noreferrer">Acessar Lattes</a>
      </li>
    </ul>
  </>
);

// (Poderíamos criar DetalhesAdmin e DetalhesCoordenador também)

/**
 * O Componente Principal da Página de Perfil
 */
export default function Perfil() {
  // 1. Busca o usuário logado do Contexto
  const { user } = useAuth();

  // (Mock de dados que não temos no 'user' do AuthContext)
  const mockDados = {
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores, 123, Bairro Centro, São Paulo - SP',
  };

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  // Define a cor do badge com base no papel
  const getRoleBadge = (role) => {
    switch (role) {
      case 'aluno': return 'bg-primary';
      case 'professor': return 'bg-success';
      case 'coordenador': return 'bg-info';
      case 'admin': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <>
      <h2 className="mb-4">Meu Perfil</h2>
      <div className="row g-4">
        
        {/* --- COLUNA DA ESQUERDA: CARTÃO DE IDENTIDADE --- */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center d-flex flex-column align-items-center">
              <img
                src={user.fotoUrl || "/imagens/usuario-generico.png"}
                alt="Foto do usuário"
                width="150"
                height="150"
                className="rounded-circle mb-3"
                style={{ border: '4px solid #fff' }}
              />
              <h4 className="mb-1">{user.nome}</h4>
              
              {/* Informação principal (RA ou Matrícula) */}
              {user.role === 'aluno' && (
                <p className="text-muted mb-2">RA: {user.ra || 'RA123456'}</p>
              )}
              {user.role === 'professor' && (
                <p className="text-muted mb-2">Matrícula: {user.matricula || 'PROF901'}</p>
              )}
              
              <span className={`badge ${getRoleBadge(user.role)} mb-3 text-capitalize`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA: DETALHES --- */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              
              {/* Renderização Condicional: Mostra os detalhes corretos para o papel */}
              {user.role === 'aluno' && <DetalhesAluno user={user} />}
              {user.role === 'professor' && <DetalhesProfessor user={user} />}
              {(user.role === 'admin' || user.role === 'coordenador') && (
                <p>Visão de perfil para Admin/Coordenador.</p>
              )}
              
              <hr />

              {/* Informações de Contato (Comuns a todos) */}
              <h5 className="mb-3 mt-4">Informações de Contato</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">E-mail:</strong>
                  <span>{user.email || 'email@edu.com'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">Telefone:</strong>
                  <span>{mockDados.telefone}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">Endereço:</strong>
                  <span className="text-end">{mockDados.endereco}</span>
                </li>
              </ul>
              
              <div className="alert alert-light mt-4 mb-0" role="alert">
                <i className="bi bi-info-circle-fill me-2"></i>
                Estas informações são apenas para visualização. Para alterar seus dados,
                por favor, abra um requerimento na Secretaria Acadêmica.
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}