import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiErrorMessage } from '../services/api';
import { portalService } from '../services/portalService';

export default function InicioCoordenador() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { portalService.getCoordinatorDashboard().then(setData).catch((e) => setError(apiErrorMessage(e))); }, []);
  if (error) return <div className="alert alert-danger">{error}</div>; if (!data) return <div className="p-4">Carregando painel...</div>;
  const stats = data.statsGerais;
  return <><h2 className="mb-4">Dashboard do Coordenador</h2><div className="row g-4 mb-4"><div className="col-lg-6"><Feed title={`Requerimentos (${data.requerimentosPendentes.length})`} items={data.requerimentosPendentes} render={(x) => <Link to="/dashboard/gerenciar-requerimentos"><strong>{x.tipo}</strong><small className="d-block">Solicitante: {x.aluno}</small></Link>} /></div>
    <div className="col-lg-6"><Feed title="Alertas acadêmicos" items={data.alertasAcademicos} render={(x) => <Link to={x.link}>{x.msg}</Link>} /></div></div>
    <div className="card shadow-sm border-0"><div className="card-header bg-white py-3"><h5>Resumo acadêmico</h5></div><div className="card-body row g-3">{[['Cursos ativos', stats.totalCursos, '/dashboard/gerenciar-cursos'], ['Disciplinas', stats.totalDisciplinas, '/dashboard/gerenciar-cursos'], ['Turmas abertas', stats.totalTurmasAbertas, '/dashboard/gerenciar-turmas']].map(([label, value, to]) => <div className="col-md-4" key={label}><Link to={to} className="text-decoration-none"><div className="card bg-light border-0 text-center p-4"><h3>{value}</h3><span>{label}</span></div></Link></div>)}</div></div></>;
}
const Feed = ({ title, items, render }) => <div className="card shadow-sm border-0 h-100"><div className="card-header bg-white py-3"><h5>{title}</h5></div><div className="list-group list-group-flush">{items.length ? items.map((x) => <div key={x.id} className="list-group-item">{render(x)}</div>) : <div className="p-4 text-muted">Nenhum item.</div>}</div></div>;
