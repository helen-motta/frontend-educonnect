import React, { useEffect, useState } from 'react';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';

export default function Perfil() {
  const [profile, setProfile] = useState(null); const [error, setError] = useState('');
  useEffect(() => { portalService.getProfile().then(setProfile).catch((e) => setError(apiErrorMessage(e))); }, []);
  if (error) return <div className="alert alert-danger">{error}</div>; if (!profile) return <div>Carregando perfil...</div>;
  const address = [profile.endereco, profile.numero, profile.complemento, profile.bairro, `${profile.cidade} - ${profile.estado}`, profile.cep].filter(Boolean).join(', ');
  return <><h2 className="mb-4">Meu perfil</h2><div className="row g-4"><div className="col-lg-4"><div className="card shadow-sm border-0 text-center p-4"><img src={profile.fotoUrl || '/imagens/usuario-generico.png'} alt="Foto do usuário" width="150" height="150" className="rounded-circle mx-auto mb-3" /><h4>{profile.nome}</h4><p className="text-muted">{profile.papel} · {profile.registro}</p></div></div><div className="col-lg-8"><div className="card shadow-sm border-0 p-4"><h5>Contato</h5><dl className="row mb-0"><dt className="col-sm-3">E-mail</dt><dd className="col-sm-9">{profile.email}</dd><dt className="col-sm-3">Telefone</dt><dd className="col-sm-9">{profile.telefone || 'Não informado'}</dd><dt className="col-sm-3">Endereço</dt><dd className="col-sm-9">{address || 'Não informado'}</dd></dl></div></div></div></>;
}
