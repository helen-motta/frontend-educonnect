import React from 'react';

export default function Inicio() {
  return (
    <>
      <h2 className="mb-4">Olá, Helena! 👋</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title">Sua próxima aula</h5>
              <p className="card-text fs-3 fw-bold">Cálculo I</p>
              <p className="card-text">14:00 - 15:50 | Sala B-203</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title">Próximas entregas</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Trabalho de Física - Amanhã</li>
                <li className="list-group-item">Prova de Álgebra - Quarta-feira</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Avisos</h5>
              <p className="card-text">Prof. Silva (Cálculo I): A aula de sexta-feira foi cancelada.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
      </div>
    </>
  );
}