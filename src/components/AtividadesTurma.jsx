import React, { useEffect, useMemo, useState } from 'react';
import './AtividadesTurma.css';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';

const emptyForm = { titulo: '', descricao: '', tipo: 'Trabalho', prazo: '', pontuacao: 10, status: 'aberta' };
const types = ['Trabalho', 'Exercício', 'Prova', 'Seminário', 'Projeto', 'Outro'];

export default function AtividadesTurma() {
  const [classes, setClasses] = useState([]); const [classId, setClassId] = useState(null); const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null); const [feedback, setFeedback] = useState(''); const [filter, setFilter] = useState(''); const [loading, setLoading] = useState(true);
  const load = () => portalService.getActivities().then((items) => { setClasses(items); setClassId((id) => id || items[0]?.id || null); }).catch((e) => setFeedback(apiErrorMessage(e))).finally(() => setLoading(false));
  useEffect(load, []);
  const selected = classes.find((x) => x.id === classId);
  const activities = useMemo(() => (selected?.atividades || []).filter((x) => !filter || x.titulo.toLowerCase().includes(filter.toLowerCase())), [filter, selected]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, turmaId: classId, prazo: new Date(`${form.prazo}T12:00:00`).toISOString(), pontuacao: Number(form.pontuacao) };
    try { editing ? await portalService.updateActivity(editing, payload) : await portalService.createActivity(payload); setForm(emptyForm); setEditing(null); setFeedback('Atividade salva.'); await load(); } catch (e) { setFeedback(apiErrorMessage(e)); }
  };
  const edit = (item) => { setEditing(item.id); setForm({ titulo: item.titulo, descricao: item.descricao, tipo: item.tipo, prazo: item.prazo.slice(0, 10), pontuacao: item.pontuacao, status: item.status }); };
  const remove = async (id) => { if (!window.confirm('Excluir esta atividade?')) return; try { await portalService.deleteActivity(id); await load(); } catch (e) { setFeedback(apiErrorMessage(e)); } };
  const grade = async (activityId, studentId, submission) => { const note = window.prompt('Nota', submission.nota ?? ''); if (note === null) return; const comment = window.prompt('Feedback', submission.feedback || '') ?? ''; try { await portalService.gradeSubmission(activityId, studentId, { nota: note === '' ? null : Number(note), feedback: comment }); setFeedback('Avaliação salva.'); await load(); } catch (e) { setFeedback(apiErrorMessage(e)); } };

  if (loading) return <div className="p-4">Carregando atividades...</div>;
  return <div className="container-fluid"><div className="d-flex justify-content-between align-items-center mb-4"><div><h2>Atividades das turmas</h2><p className="text-muted mb-0">Conteúdo persistido no backend.</p></div></div>{feedback && <div className="alert alert-info">{feedback}</div>}
    <div className="row g-4"><aside className="col-lg-3"><div className="list-group">{classes.map((x) => <button key={x.id} className={`list-group-item list-group-item-action ${classId === x.id ? 'active' : ''}`} onClick={() => setClassId(x.id)}><strong>{x.nome}</strong><small className="d-block">{x.codigo} · {x.totalAlunos} alunos</small></button>)}</div></aside>
    <main className="col-lg-9"><div className="card shadow-sm border-0 mb-4"><div className="card-header bg-white"><h5>{editing ? 'Editar atividade' : 'Nova atividade'}</h5></div><form className="card-body" onSubmit={submit}><div className="row g-3"><Field label="Título"><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /></Field><Field label="Tipo"><select className="form-select" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>{types.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Prazo"><input className="form-control" type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} required /></Field><Field label="Pontuação"><input className="form-control" type="number" min="1" max="100" value={form.pontuacao} onChange={(e) => setForm({ ...form, pontuacao: e.target.value })} required /></Field><div className="col-12"><label className="form-label">Descrição</label><textarea className="form-control" rows="3" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required /></div></div><button className="btn btn-primary mt-3">{editing ? 'Atualizar' : 'Criar'}</button>{editing && <button type="button" className="btn btn-link mt-3" onClick={() => { setEditing(null); setForm(emptyForm); }}>Cancelar</button>}</form></div>
    <input className="form-control mb-3" placeholder="Buscar atividade" value={filter} onChange={(e) => setFilter(e.target.value)} />{activities.map((item) => <div className="card shadow-sm border-0 mb-3" key={item.id}><div className="card-body"><div className="d-flex justify-content-between"><div><span className="badge bg-primary-subtle text-primary-emphasis">{item.tipo}</span><h5 className="mt-2">{item.titulo}</h5><p>{item.descricao}</p><small>Prazo: {new Date(item.prazo).toLocaleDateString('pt-BR')} · {item.pontuacao} pontos · {item.status}</small></div><div><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(item)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>Excluir</button></div></div>
      {item.entregas.length > 0 && <div className="mt-3 border-top pt-3"><strong>Entregas</strong>{item.entregas.map((submission) => { const student = selected.alunos.find((x) => x.id === submission.alunoId); return <div key={submission.id} className="d-flex justify-content-between align-items-center py-2"><span>{student?.nome || `Aluno ${submission.alunoId}`} · <a href={submission.url} target="_blank" rel="noreferrer">{submission.arquivo}</a></span><button className="btn btn-sm btn-outline-secondary" onClick={() => grade(item.id, submission.alunoId, submission)}>{submission.nota == null ? 'Avaliar' : `Nota ${submission.nota}`}</button></div>; })}</div>}
    </div></div>)}</main></div></div>;
}
const Field = ({ label, children }) => <div className="col-md-6"><label className="form-label">{label}</label>{children}</div>;
