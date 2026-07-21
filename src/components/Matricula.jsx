import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiErrorMessage } from '../services/api';
import { portalService } from '../services/portalService';

export default function Matricula() {
  const { user } = useAuth(); const profile = user?.usuario;
  const [courses, setCourses] = useState([]); const [courseId, setCourseId] = useState(''); const [shift, setShift] = useState('Noturno'); const [message, setMessage] = useState('');
  useEffect(() => { portalService.getAvailableCourses().then(setCourses).catch((e) => setMessage(apiErrorMessage(e))); }, []);
  const submit = async (event) => { event.preventDefault(); try { await portalService.requestEnrollment({ cursoId: Number(courseId), nomeCandidato: profile.nome, email: profile.email, cpf: profile.cpf || '', turno: shift }); setMessage('Solicitação de matrícula enviada.'); } catch (e) { setMessage(apiErrorMessage(e)); } };
  return <><h2 className="mb-4">Matrícula</h2>{message && <div className="alert alert-info">{message}</div>}<form className="card shadow-sm border-0 p-4" onSubmit={submit}><label className="form-label">Curso</label><select className="form-select mb-3" value={courseId} onChange={(e) => setCourseId(e.target.value)} required><option value="">Selecione um curso</option>{courses.map((x) => <option key={x.id} value={x.id}>{x.nome} · {x.cargaHoraria}h</option>)}</select><label className="form-label">Turno preferido</label><select className="form-select mb-4" value={shift} onChange={(e) => setShift(e.target.value)}><option>Matutino</option><option>Vespertino</option><option>Noturno</option></select><button className="btn btn-primary">Solicitar matrícula</button></form></>;
}
