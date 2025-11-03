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

        {/* --- ITEM 1: CÁLCULO I (Inicia Aberto) --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              
              {/* Conteúdo do Cabeçalho: Resumo Rápido */}
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Cálculo I</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-success">8.5</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-success">90%</span>
                </span>
              </div>

            </button>
          </h2>
          {/* 'show': Faz este item começar aberto */}
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionNotasFrequencia">
            <div className="accordion-body">
              <div className="row">
                
                {/* Coluna 1: Detalhes das Notas */}
                <div className="col-md-6">
                  <h5>Detalhamento das Notas</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 1 (P1)
                      <span className="badge bg-primary rounded-pill fs-6">8.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Trabalho 1
                      <span className="badge bg-primary rounded-pill fs-6">10.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Prova 2 (P2)
                      <span className="badge bg-primary rounded-pill fs-6">7.5</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Trabalho 2
                      <span className="badge bg-primary rounded-pill fs-6">9.0</span>
                    </li>
                  </ul>
                </div>

                {/* Coluna 2: Detalhes da Frequência */}
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>4</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  
                  {/* Barra de Progresso da Frequência */}
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-success" style={{width: "90%"}}>
                      90% Presente
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM 2: FÍSICA II (Inicia Fechado) --- */}
        <div className="accordion-item shadow-sm border-0 mb-3">
          <h2 className="accordion-header" id="headingTwo">
            {/* 'collapsed': Indica que começa fechado */}
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              
              {/* Conteúdo do Cabeçalho: Resumo Rápido */}
              <div className="d-flex justify-content-between w-100 pe-3">
                <strong className="fs-5">Física II</strong>
                <span className="fs-5">
                  Média: <span className="badge bg-warning text-dark">5.5</span>
                </span>
                <span className="fs-5">
                  Frequência: <span className="badge bg-danger">70%</span>
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
                      <span className="badge bg-danger rounded-pill fs-6">4.0</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Trabalho 1
                      <span className="badge bg-primary rounded-pill fs-6">7.0</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Frequência</h5>
                  <p className="mb-1">Total de Faltas: <strong>12</strong></p>
                  <p className="text-muted small">Limite de faltas permitido: 20 (25%)</p>
                  
                  <div className="progress" style={{height: "25px"}} role="progressbar" aria-label="Frequência" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar bg-danger" style={{width: "70%"}}>
                      70% Presente (Atenção!)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM 3: PROGRAMAÇÃO I (Inicia Fechado) --- */}
        {/* (Adicione mais itens aqui...) */}

      </div>
    </>
  );
}