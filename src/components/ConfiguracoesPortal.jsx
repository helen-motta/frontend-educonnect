import React, { useEffect, useState } from 'react';
import { apiErrorMessage } from '../services/api';
import { portalService } from '../services/portalService';

const initial = { featureDarkMode: false, featureCarteirinha: false, featureMatricula: false, featureFinanceiro: false };
const flags = [
  ['featureDarkMode', 'Modo noturno', 'Permitir que usuários alternem o tema.'],
  ['featureCarteirinha', 'Carteirinha virtual', 'Exibir a carteirinha para alunos.'],
  ['featureMatricula', 'Módulo de matrícula', 'Permitir solicitações de matrícula.'],
  ['featureFinanceiro', 'Módulo financeiro', 'Habilitar os recursos financeiros.'],
];

export default function ConfiguracoesPortal() {
  const [config, setConfig] = useState(initial); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  useEffect(() => { portalService.getPortalConfig().then(setConfig).catch((e) => setMessage(apiErrorMessage(e))).finally(() => setLoading(false)); }, []);
  const save = async (event) => { event.preventDefault(); try { setConfig(await portalService.savePortalConfig(config)); setMessage('Configurações salvas.'); } catch (e) { setMessage(apiErrorMessage(e)); } };
  if (loading) return <div className="p-4">Carregando configurações...</div>;
  return <><h2 className="mb-4">Configurações do Portal</h2>{message && <div className="alert alert-info">{message}</div>}
    <form onSubmit={save}><div className="card shadow-sm border-0"><div className="card-header bg-white py-3"><h5 className="mb-0">Recursos</h5></div>
      <div className="list-group list-group-flush">{flags.map(([key, title, description]) => <label key={key} className="list-group-item d-flex justify-content-between align-items-center py-3"><span><strong className="d-block">{title}</strong><small>{description}</small></span><input className="form-check-input fs-4" type="checkbox" checked={config[key]} onChange={(e) => setConfig((x) => ({ ...x, [key]: e.target.checked }))} /></label>)}</div>
    </div><div className="text-end mt-4"><button className="btn btn-primary btn-lg">Salvar configurações</button></div></form></>;
}
