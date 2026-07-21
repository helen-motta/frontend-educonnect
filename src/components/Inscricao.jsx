import React, { useEffect, useState } from 'react';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';

const empty = { nomeCandidato: '', email: '', cursoId: '', turno: 'Noturno', cpf: '' };
export default function Inscricao() {
  const [courses, setCourses] = useState([]); const [form, setForm] = useState(empty); const [message, setMessage] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { portalService.getAvailableCourses().then(setCourses).catch((e) => setMessage(apiErrorMessage(e))); }, []);
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { await portalService.requestEnrollment({ ...form, cursoId: Number(form.cursoId) }); setMessage('Inscrição recebida e encaminhada para análise.'); setForm(empty); } catch (e) { setMessage(apiErrorMessage(e)); } finally { setSaving(false); } };
  return <div className="container py-5" style={{ maxWidth: 760 }}><h2>Inscrição no EduConnect</h2><p className="text-muted">Preencha os dados para iniciar sua matrícula.</p>{message && <div className="alert alert-info">{message}</div>}<form className="card shadow-sm border-0 p-4" onSubmit={submit}>
    <div className="row g-3"><Field label="Nome completo"><input className="form-control" value={form.nomeCandidato} onChange={(e) => setForm({ ...form, nomeCandidato: e.target.value })} required /></Field><Field label="E-mail"><input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field><Field label="CPF"><input className="form-control" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></Field><Field label="Curso"><select className="form-select" value={form.cursoId} onChange={(e) => setForm({ ...form, cursoId: e.target.value })} required><option value="">Selecione</option>{courses.map((x) => <option key={x.id} value={x.id}>{x.nome} ({x.codigo})</option>)}</select></Field><Field label="Turno"><select className="form-select" value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })}><option>Matutino</option><option>Vespertino</option><option>Noturno</option></select></Field></div><button className="btn btn-primary mt-4" disabled={saving}>{saving ? 'Enviando...' : 'Enviar inscrição'}</button>
  </form></div>;
}
const Field = ({ label, children }) => <div className="col-md-6"><label className="form-label">{label}</label>{children}</div>;
