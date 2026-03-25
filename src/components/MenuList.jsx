import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuList({ items }) {
  return (
    <>
      {items.map((item) => (
        <li key={item.to} className="nav-item mb-2">
          <NavLink className="nav-link" to={item.to} end={item.end}>
            <i className={item.iconClass}></i>
            {item.label}
          </NavLink>
        </li>
      ))}
    </>
  );
}
