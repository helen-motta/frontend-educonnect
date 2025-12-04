import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuAdm() {
  return (
    <>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/inicioadm" end>
          <i className="bi bi-house-door-fill me-2"></i>Início
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/gerenciar-usuarios">
          <i className="bi bi-people-fill"></i> Usuários
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/logs">
          <i className="bi bi-megaphone-fill me-2"></i>Logs do sistema
        </NavLink>
      </li>
        <li className="nav-item mb-2">
        <NavLink className="nav-link" to="/dashboard/configuracoes-portal">
          <i className="bi bi-gear-fill me-2"></i>Configurações do Portal
        </NavLink>
      </li>
    </>
  );
}