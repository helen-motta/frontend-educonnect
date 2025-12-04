import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuAluno() {
  return (
    <>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/inicio" end>
          <i className="bi bi-house-door-fill me-2"></i>Início
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/horarios">
          <i className="bi bi-clock-fill me-2"></i>Horários
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/calendario">
          <i className="bi bi-calendar-week-fill me-2"></i>Calendário
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/notasfrequencia">
          <i className="bi bi-bar-chart-fill me-2"></i>Notas e frequência
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/matricula">
          <i className="bi bi-pencil-square me-2"></i>Matrícula
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/requerimentos">
          <i className="bi bi-file-earmark-text-fill me-2"></i>Requerimentos
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/carteirinha">
          <i className="bi bi-person-badge-fill me-2"></i>Carteirinha
        </NavLink>
      </li>
    </>
  );
}