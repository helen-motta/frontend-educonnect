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
                  <th scope="row">08:00 - 09:45</th>
                  <td className="materia-engenharia">
                    <strong>Engenharia de Software</strong>
                    <small className="d-block text-muted">Prof. Carlos | Sala 301</small>
                  </td>
                  <td className="materia-arquitetura">
                    <strong>Arquitetura de Software</strong>
                    <small className="d-block text-muted">Prof. Roberto | Sala 401</small>
                  </td>
                  <td className="materia-engenharia">
                    <strong>Engenharia de Software</strong>
                    <small className="d-block text-muted">Prof. Carlos | Sala 301</small>
                  </td>
                  <td className="materia-padroes">
                    <strong>Padrões de Projeto</strong>
                    <small className="d-block text-muted">Prof. Julia | Lab 02</small>
                  </td>
                  <td className="materia-banco">
                    <strong>---</strong>
                  </td>
                </tr>

                <tr>
                  <th scope="row">10:00 - 11:45</th>
                  <td className="materia-padroes">
                    <strong>Padrões de Projeto</strong>
                    <small className="d-block text-muted">Prof. Julia | Lab 02</small>
                  </td>
                  <td className="materia-qualidade">
                    <strong>Qualidade de Software</strong>
                    <small className="d-block text-muted">Prof. Fernanda | Sala 302</small>
                  </td>
                  <td className="materia-redes">
                    <strong>---</strong>
                  </td>
                  <td className="materia-qualidade">
                    <strong>Qualidade de Software</strong>
                    <small className="d-block text-muted">Prof. Fernanda | Sala 302</small>
                  </td>
                  <td className="materia-redes">
                    <strong>---</strong>
                  </td>
                </tr>

                <tr>
                  <th scope="row">11:45 - 13:00</th>
                  <td className="table text-muted" colSpan="5">
                    Intervalo para Almoço
                  </td>
                </tr>

                <tr>
                  <th scope="row">13:00 - 14:45</th>
                  <td className="materia-banco">
                    <strong>---</strong>
                  </td>
                  <td className="materia-sistemas">
                    <strong>---</strong>
                  </td>
                  <td className="materia-metodologia">
                    <strong>---</strong>
                  </td>
                  <td className="materia-sistemas">
                    <strong>---</strong>
                  </td>
                  <td className="materia-arquitetura">
                    <strong>Arquitetura de Software</strong>
                    <small className="d-block text-muted">Prof. Roberto | Sala 401</small>
                  </td>
                </tr>

                <tr>
                  <th scope="row">15:00 - 16:45</th>
                  <td className="table text-muted">---</td>
                  <td className="table text-muted">---</td>
                  <td className="materia-redes">
                    <strong>---</strong>
                  </td>
                  <td className="table text-muted">---</td>
                  <td className="materia-engenharia">
                    <strong>Engenharia de Software</strong>
                    <small className="d-block text-muted">Prof. Carlos | Sala 301</small>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}