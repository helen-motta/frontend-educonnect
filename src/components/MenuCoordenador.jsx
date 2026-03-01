import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuCoordenador() {
  return (
    <>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/inicio" end>
          <i className="bi bi-house-door-fill me-2"></i>Início
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/gerenciar-cursos">
          <i className="bi bi-journal-bookmark-fill me-2"></i> Cursos e Disciplinas
        </NavLink>
      </li>
        <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/gerenciar-requerimentos">
          <i className="bi bi-megaphone-fill me-2"></i>Requerimentos
        </NavLink>
      </li>
        <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/gerenciar-turmas">
          <i className="bi bi-person-video3"></i> Turmas
        </NavLink>
      </li>
    </>
  );
}