import React from 'react';

// (Não precisa de CSS novo, as classes do Bootstrap e do Dashboard.css dão conta)

export default function NotasFrequencia() {
  return (
    <>
      <h2 className="mb-4">Notas e Frequência</h2>

      {/* O container principal do Acordeão. 
          O 'id' é importante para que só um item abra de cada vez.
      */}
      <div className="accordion" id="accordionNotasFrequencia">

        {/* --- ITEM 1: ENGENHARIA DE SOFTWARE (Inicia Aberto) --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Engenharia de Software - Prof. Carlos</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-success">8.5</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-success">95%</span>
                </span>
              </div>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionNotasFrequencia">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Detalhamento das Notas</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 1 (P1)
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Projeto ES
                      <span className="badge bg-primary rounded-pill fs-6">9.5</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Participação
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>2</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-success" style={{width: "95%"}}>
                      95% Presente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM 2: ARQUITETURA DE SOFTWARE --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Arquitetura de Software - Prof. Roberto</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-success">9.0</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-success">100%</span>
                </span>
              </div>
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionNotasFrequencia">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Detalhamento das Notas</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 1 (P1)
                      <span className="badge bg-primary rounded-pill fs-6">9.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Arquitetura v1
                      <span className="badge bg-primary rounded-pill fs-6">9.5</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Seminário
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>0</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-success" style={{width: "100%"}}>
                      100% Presente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM 3: PADRÕES DE PROJETO --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Padrões de Projeto - Prof. Julia</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-success">8.0</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-success">92%</span>
                </span>
              </div>
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionNotasFrequencia">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Detalhamento das Notas</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 1 (P1)
                      <span className="badge bg-primary rounded-pill fs-6">7.5</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Projeto Padrões
                      <span className="badge bg-primary rounded-pill fs-6">8.5</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Atividades Práticas
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>3</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="92" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-success" style={{width: "92%"}}>
                      92% Presente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM 4: QUALIDADE DE SOFTWARE --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingFour">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Qualidade de Software - Prof. Fernanda</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-success">7.5</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-warning text-dark">88%</span>
                </span>
              </div>
            </button>
          </h2>
          <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionNotasFrequencia">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Detalhamento das Notas</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 1 (P1)
                      <span className="badge bg-primary rounded-pill fs-6">7.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Testes Automatizados
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Trabalho Prático
                      <span className="badge bg-primary rounded-pill fs-6">7.5</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>5</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="88" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-warning" style={{width: "88%"}}>
                      88% Presente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}