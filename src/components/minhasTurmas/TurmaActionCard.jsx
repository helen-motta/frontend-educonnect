import React from 'react';

export default function TurmaActionCard({ iconClass, iconColorClass, title, description, onClick }) {
  return (
    <div className="col-md-4">
      <div
        className="card card-acao shadow-sm h-100"
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="card-body text-center p-4">
          <i className={`${iconClass} display-4 ${iconColorClass} mb-3`}></i>
          <h4 className="card-title">{title}</h4>
          <p className="card-text text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
