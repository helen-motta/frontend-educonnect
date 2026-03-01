import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuProfessor() {
  return (
    <>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/inicio" end>
          <i className="bi bi-house-door-fill me-2"></i>Início
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/minhas-turmas">
          <i className="bi bi-people-fill me-2"></i>Minhas Turmas
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/comunicados">
          <i className="bi bi-megaphone-fill me-2"></i>Comunicados
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/calendario-professor">
          <i className="bi bi-calendar-fill me-2"></i>Calendário
        </NavLink>
      </li>
    </>
  );
}