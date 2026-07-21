import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';

export default function InicioProfessor() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { portalService.getProfessorDashboard().then(setData).catch((e) => setError(apiErrorMessage(e))); }, []);
  if (error) return <div className="alert alert-danger">{error}</div>; if (!data) return <div className="p-4">Carregando painel...</div>;
  const next = data.proximaAula;
  return <><div className="row g-4 mb-4"><div className="col-lg-7"><div className="card shadow-sm border-0 h-100"><div className="card-header bg-white py-3"><h5>Próxima aula</h5></div><div className="card-body p-4">
    {next ? <><span className="badge bg-primary-subtle text-primary-emphasis">{next.horario}</span><h3 className="mt-2">{next.disciplina}</h3><p className="text-muted">Sala {next.sala} · {next.totalAlunos} alunos</p><Link className="btn btn-primary" to="/dashboard/minhas-turmas">Gerenciar turma</Link></> : <p className="text-muted">Nenhuma aula cadastrada.</p>}
  </div></div></div><div className="col-lg-5"><ListCard title="Ações pendentes" items={data.acoesPendentes} render={(x) => <Link to={x.link}>{x.msg}</Link>} /></div></div>
  <div className="row g-4"><div className="col-lg-7"><ListCard title="Últimos comunicados" items={data.ultimosComunicados} render={(x) => <><strong>{x.assunto}</strong><small className="d-block text-muted">{x.turmas.map((t) => t.nome).join(', ')}</small></>} /></div>
  <div className="col-lg-5"><ListCard title="Próximas avaliações" items={data.proximasAvaliacoes} render={(x) => <><strong>{x.tipo}</strong><small className="d-block text-muted">{x.turma} · {new Date(x.data).toLocaleDateString('pt-BR')}</small></>} /></div></div></>;
}
const ListCard = ({ title, items = [], render }) => <div className="card shadow-sm border-0 h-100"><div className="card-header bg-white py-3"><h5 className="mb-0">{title}</h5></div><div className="list-group list-group-flush">{items.length ? items.map((x) => <div key={x.id} className="list-group-item">{render(x)}</div>) : <div className="p-4 text-muted">Nenhum item.</div>}</div></div>;
