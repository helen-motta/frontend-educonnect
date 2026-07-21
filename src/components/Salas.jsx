import React, { useEffect, useState } from 'react';
import { portalService } from '../services/portalService';
import { apiErrorMessage } from '../services/api';

const days = ['', '', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
export default function Salas() {
  const [rooms, setRooms] = useState([]); const [error, setError] = useState('');
  useEffect(() => { portalService.getRooms().then(setRooms).catch((e) => setError(apiErrorMessage(e))); }, []);
  return <><h2 className="mb-4">Salas</h2>{error && <div className="alert alert-danger">{error}</div>}<div className="row g-3">{rooms.map((room) => <div className="col-md-6 col-xl-4" key={room.nome}><div className="card shadow-sm border-0 h-100"><div className="card-header bg-white"><h5>{room.nome}</h5></div><div className="list-group list-group-flush">{room.reservas.map((x) => <div className="list-group-item" key={`${x.turmaId}-${x.diaSemana}-${x.codigoSlot}`}><strong>{x.disciplina}</strong><small className="d-block text-muted">{days[x.diaSemana]} · {x.codigoSlot} · {x.turma}</small></div>)}</div></div></div>)}</div></>;
}
