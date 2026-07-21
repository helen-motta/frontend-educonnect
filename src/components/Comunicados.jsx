import React, { useEffect, useState } from 'react';
import './Comunicados.css';
import { apiErrorMessage } from '../services/api';
import { portalService } from '../services/portalService';

export default function Comunicados() {
  const [classes, setClasses] = useState([]); const [items, setItems] = useState([]); const [selected, setSelected] = useState([]);
  const [subject, setSubject] = useState(''); const [message, setMessage] = useState(''); const [feedback, setFeedback] = useState('');
  useEffect(() => { Promise.all([portalService.getClasses(), portalService.getNotices()]).then(([c, n]) => { setClasses(c); setItems(n); }).catch((e) => setFeedback(apiErrorMessage(e))); }, []);
  const send = async (event) => { event.preventDefault(); try { const created = await portalService.createNotice({ assunto: subject, mensagem: message, turmaIds: selected }); setItems((x) => [created, ...x]); setSubject(''); setMessage(''); setSelected([]); setFeedback('Comunicado enviado.'); } catch (e) { setFeedback(apiErrorMessage(e)); } };
  return <><h2>Comunicados</h2>{feedback && <div className="alert alert-info">{feedback}</div>}<div className="row g-4"><div className="col-lg-5"><form className="card shadow-sm border-0 p-4" onSubmit={send}><label className="form-label">Assunto</label><input className="form-control mb-3" value={subject} onChange={(e) => setSubject(e.target.value)} required /><label className="form-label">Mensagem</label><textarea className="form-control mb-3" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required />
    <label className="form-label">Turmas</label>{classes.map((x) => <label key={x.id} className="form-check"><input className="form-check-input" type="checkbox" checked={selected.includes(x.id)} onChange={() => setSelected((ids) => ids.includes(x.id) ? ids.filter((id) => id !== x.id) : [...ids, x.id])} /> {x.nomeTurma}</label>)}<button className="btn btn-primary mt-3" disabled={!selected.length}>Enviar</button></form></div>
    <div className="col-lg-7"><div className="card shadow-sm border-0"><div className="card-header bg-white"><h5>Histórico</h5></div>{items.map((x) => <div className="card-body border-bottom" key={x.id}><strong>{x.assunto}</strong><p>{x.mensagem}</p><small className="text-muted">{new Date(x.criadoEm).toLocaleString('pt-BR')} · {x.turmas.map((t) => t.nome).join(', ')}</small></div>)}</div></div></div></>;
}
