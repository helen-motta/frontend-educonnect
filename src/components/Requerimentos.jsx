import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { apiErrorMessage } from '../services/api';
import './Requerimentos.css';

const types = ['Aproveitamento de disciplina', 'Ajuste de matrícula', 'Trancamento de matrícula', 'Declaração acadêmica'];
export default function Requerimentos() {
  const { user } = useAuth(); const userId = user?.usuario?.id;
  const [items, setItems] = useState([]); const [type, setType] = useState(types[0]); const [note, setNote] = useState(''); const [message, setMessage] = useState('');
  const load = useCallback(() => api.get(`/requerimentos/usuario/${userId}`).then((r) => setItems(r.data)).catch((e) => setMessage(apiErrorMessage(e))), [userId]);
  useEffect(() => { if (userId) load(); }, [load, userId]);
  const submit = async (event) => { event.preventDefault(); try { await api.post('/requerimentos', { tipo: type, observacao: note }, { params: { idUsuario: userId } }); setNote(''); setMessage('Requerimento criado.'); load(); } catch (e) { setMessage(apiErrorMessage(e)); } };
  return <><h2 className="mb-4">Requerimentos</h2>{message && <div className="alert alert-info">{message}</div>}<div className="row g-4"><div className="col-lg-5"><form className="card shadow-sm border-0 p-4" onSubmit={submit}><label className="form-label">Tipo</label><select className="form-select mb-3" value={type} onChange={(e) => setType(e.target.value)}>{types.map((x) => <option key={x}>{x}</option>)}</select><label className="form-label">Observação</label><textarea className="form-control mb-3" rows="5" value={note} onChange={(e) => setNote(e.target.value)} /><button className="btn btn-primary">Abrir requerimento</button></form></div><div className="col-lg-7"><div className="card shadow-sm border-0"><div className="card-header bg-white"><h5>Histórico</h5></div>{items.map((x) => <div key={x.id} className="card-body border-bottom"><div className="d-flex justify-content-between"><strong>{x.tipoSolicitacao}</strong><span className="badge bg-secondary">{x.status}</span></div><small className="text-muted">{new Date(x.dataAbertura).toLocaleDateString('pt-BR')}</small>{x.observacao && <p className="mb-0 mt-2">{x.observacao}</p>}</div>)}</div></div></div></>;
}
