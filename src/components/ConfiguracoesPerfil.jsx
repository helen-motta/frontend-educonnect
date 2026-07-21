import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';
import './ConfiguracoesPerfil.css';

export default function ConfiguracoesPerfil() {
  const { updateProfile } = useAuth(); const [profile, setProfile] = useState(null); const [message, setMessage] = useState(''); const [photo, setPhoto] = useState(null);
  useEffect(() => { portalService.getProfile().then(setProfile).catch((e) => setMessage(apiErrorMessage(e))); }, []);
  const save = async () => { try { await portalService.savePreferences({ notificarTarefas: profile.notificarTarefas, notificarAvisos: profile.notificarAvisos, notificarNotas: profile.notificarNotas }); setMessage('Preferências salvas.'); } catch (e) { setMessage(apiErrorMessage(e)); } };
  const upload = async () => { if (!photo) return; try { const result = await portalService.uploadProfilePhoto(photo); setProfile({ ...profile, fotoUrl: result.fotoUrl }); updateProfile({ fotoUrl: result.fotoUrl }); setMessage('Foto atualizada no S3.'); } catch (e) { setMessage(apiErrorMessage(e)); } };
  if (!profile) return <div>{message || 'Carregando configurações...'}</div>;
  return <><h2 className="mb-4">Configurações do usuário</h2>{message && <div className="alert alert-info">{message}</div>}<div className="card shadow-sm border-0 mb-4 p-4"><h5>Foto de perfil</h5><div className="d-flex gap-3"><input className="form-control" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setPhoto(e.target.files?.[0])} /><button className="btn btn-primary" onClick={upload} disabled={!photo}>Enviar</button></div></div><div className="card shadow-sm border-0 p-4"><h5>Notificações por e-mail</h5>{[['notificarTarefas', 'Novas tarefas'], ['notificarAvisos', 'Avisos'], ['notificarNotas', 'Notas lançadas']].map(([key, label]) => <label className="form-check form-switch my-2" key={key}><input className="form-check-input" type="checkbox" checked={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })} /> {label}</label>)}<button className="btn btn-primary mt-3 align-self-start" onClick={save}>Salvar preferências</button></div></>;
}
