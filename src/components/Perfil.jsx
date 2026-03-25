import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Para buscar o usuário logado
import api from './../api'; // Importe sua configuração do axios


export const getPerfil = async () => {
    const response = await api.get('/perfil');
    console.log('Resposta do backend (perfil):', response.data);
    return response.data;
};

export default function Perfil() {
  const { user } = useAuth();

  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };
    fetchPerfil();
  }, []);

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  const enderecoCompleto = perfil ? `${perfil.endereco}, ${perfil.numero}${perfil.complemento ? ', ' + perfil.complemento : ''}, ${perfil.bairro}, ${perfil.cidade} - ${perfil.estado}, CEP: ${perfil.cep}` : 'Endereço não disponível';

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
              <h4 className="mb-1">{perfil?.nome || user.nome}</h4>
              
              {user.role === 'aluno' && (
                <p className="text-muted mb-2">RA: {perfil?.registro || user.ra || 'RA123456'}</p>
              )}
              {user.role === 'professor' && (
                <p className="text-muted mb-2">Matrícula: {perfil?.registro || user.matricula || 'PROF901'}</p>
              )}
              
              <span className={`badge ${getRoleBadge(user.role)} mb-3 text-capitalize`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              
              <h5 className="mb-3">Informações de Contato</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">E-mail:</strong>
                  <span>{perfil?.email || user.email || 'email@edu.com'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">Telefone:</strong>
                  <span>{perfil?.telefone || '(11) 98765-4321'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <strong className="text-muted">Endereço:</strong>
                  <span className="text-end">{enderecoCompleto}</span>
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