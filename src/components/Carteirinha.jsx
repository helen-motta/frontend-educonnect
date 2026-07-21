import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';
import './Carteirinha.css';

export default function Carteirinha() {
  const [profile, setProfile] = useState(null); const [error, setError] = useState(''); const cardRef = useRef(null);
  useEffect(() => { portalService.getProfile().then(setProfile).catch((e) => setError(apiErrorMessage(e))); }, []);
  const download = async () => { const canvas = await html2canvas(cardRef.current, { scale: 2 }); const link = document.createElement('a'); link.download = `carteirinha-${profile.registro}.png`; link.href = canvas.toDataURL('image/png'); link.click(); };
  if (error) return <div className="alert alert-danger">{error}</div>; if (!profile) return <div>Carregando carteirinha...</div>;
  return <><h2 className="mb-4">Carteirinha virtual</h2><div ref={cardRef} className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: 520 }}><div className="d-flex gap-4 align-items-center"><img className="rounded-circle" width="110" height="110" src={profile.fotoUrl || '/imagens/usuario-generico.png'} alt="Foto do aluno" /><div><h4>{profile.nome}</h4><p className="mb-1">Registro: {profile.registro}</p><p className="mb-0">EduConnect · {new Date().getFullYear()}</p></div><QRCodeSVG className="ms-auto" value={`educonnect:aluno:${profile.id}:${profile.registro}`} size={92} /></div></div><div className="text-center mt-3"><button className="btn btn-primary" onClick={download}>Baixar carteirinha</button></div></>;
}
