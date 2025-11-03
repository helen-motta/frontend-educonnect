import React from 'react';
// Importe um novo CSS para esta página
import './Horarios.css';

export default function Horarios() {
  return (
    <div>

      {/* Usamos um .card para manter o estilo do dashboard */}
      <div className="card shadow-sm border-0">
        <div className="card-header border-0 pt-3 pb-0">
          <h5 className="mb-0">Horários</h5>
        </div>
        <div className="card-body p-0 p-md-3">
          
          {/* O wrapper .table-responsive é crucial para celulares */}
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle horarios-table">
              
              {/* Cabeçalho com os dias da semana */}
              <thead className="thead">
                <tr>
                  <th scope="col">Horário</th>
                  <th scope="col">Segunda-feira</th>
                  <th scope="col">Terça-feira</th>
                  <th scope="col">Quarta-feira</th>
                  <th scope="col">Quinta-feira</th>
                  <th scope="col">Sexta-feira</th>
                </tr>
              </thead>
              
              {/* Corpo com as aulas */}
              <tbody>
                <tr>
                  <th scope="row">08:00 - 09:50</th>
                  {/* Bloco de matéria (com classe de cor) */}
                  <td className="materia-calculo">
                    <strong>Cálculo I</strong>
                    <small className="d-block text-muted">Prof. Silva | B-203</small>
                  </td>
                  {/* Bloco de matéria (com classe de cor) */}
                  <td className="materia-fisica">
                    <strong>Física II</strong>
                    <small className="d-block text-muted">Prof. Ana | Lab. 03</small>
                  </td>
                  <td className="materia-calculo">
                    <strong>Cálculo I</strong>
                    <small className="d-block text-muted">Prof. Silva | B-203</small>
                  </td>
                  <td className="materia-fisica">
                    <strong>Física II</strong>
                    <small className="d-block text-muted">Prof. Ana | Lab. 03</small>
                  </td>
                  {/* Bloco vazio */}
                  <td className="table text-muted">---</td>
                </tr>

                <tr>
                  <th scope="row">10:00 - 11:50</th>
                  {/* Bloco de intervalo (usando colSpan) */}
                  <td className="table text-muted" colSpan="5">
                    Intervalo
                  </td>
                </tr>

                <tr>
                  <th scope="row">14:00 - 15:50</th>
                  <td className="table text-muted">---</td>
                  <td className="materia-programacao">
                    <strong>Programação I</strong>
                    <small className="d-block text-muted">Prof. Bia | Lab. 12</small>
                  </td>
                  <td className="table text-muted">---</td>
                  <td className="materia-programacao">
                    <strong>Programação I</strong>
                    <small className="d-block text-muted">Prof. Bia | Lab. 12</small>
                  </td>
                  <td className="table text-muted">---</td>
                </tr>

                <tr>
                  <th scope="row">16:00 - 17:50</th>
                  <td className="materia-algebra">
                    <strong>Álgebra Linear</strong>
                    <small className="d-block text-muted">Prof. Marcos | C-101</small>
                  </td>
                  <td className="table text-muted">---</td>
                  <td className="materia-algebra">
                    <strong>Álgebra Linear</strong>
                    <small className="d-block text-muted">Prof. Marcos | C-101</small>
                  </td>
                  <td className="table text-muted">---</td>
                  <td className="table text-muted">---</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}