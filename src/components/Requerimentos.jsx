import React from 'react';

export default function Requerimentos() {

  // Função 'placeholder' para simular o clique
  const handleGerarDocumento = (nomeDocumento) => {
    alert(`Iniciando a geração do documento: ${nomeDocumento}\n(Esta função será implementada no futuro)`);
  };

  // Função 'placeholder' para simular a abertura de um formulário
  const handleNovaSolicitacao = (nomeSolicitacao) => {
    alert(`Abrindo formulário para: ${nomeSolicitacao}\n(Esta função será implementada no futuro)`);
  };

  return (
    <>
      <h2 className="mb-4">Requerimentos e Documentos</h2>

      <div className="row g-4">

        {/* --- COLUNA DA ESQUERDA (Documentos de Download) --- */}
        <div className="col-lg-8">
          <h4 className="mb-3">Documentos para Download</h4>
          <p className="text-muted">Gere e baixe seus documentos acadêmicos mais comuns de forma instantânea.</p>
          
          <div className="row g-4">
            
            {/* Card 1: Comprovante de Matrícula */}
            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center p-4">
                  <i className="bi bi-file-earmark-person-fill fs-1 text-primary"></i>
                  <h5 className="card-title mt-3 mb-2">Comprovante de Matrícula</h5>
                  <p className="card-text small text-muted">Gere seu comprovante oficial de matrícula para o semestre atual.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleGerarDocumento('Comprovante de Matrícula')}
                  >
                    <i className="bi bi-download me-2"></i>Gerar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Boletim / Histórico */}
            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center p-4">
                  <i className="bi bi-file-earmark-bar-graph-fill fs-1 text-success"></i>
                  <h5 className="card-title mt-3 mb-2">Boletim / Histórico</h5>
                  <p className="card-text small text-muted">Baixe seu boletim com notas e frequências ou seu histórico escolar completo.</p>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleGerarDocumento('Boletim/Histórico')}
                  >
                    <i className="bi bi-download me-2"></i>Gerar PDF
                  </button>
                </div>
              </div>
            </div>
            
            {/* Card 3: Declaração Financeira (Exemplo) */}
            <div className="col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center p-4">
                  <i className="bi bi-file-earmark-ruled-fill fs-1 text-info"></i>
                  <h5 className="card-title mt-3 mb-2">Declaração Financeira</h5>
                  <p className="card-text small text-muted">Gere um comprovante de quitação ou status dos seus pagamentos.</p>
                  <button 
                    className="btn btn-info" 
                    onClick={() => handleGerarDocumento('Declaração Financeira')}
                  >
                    <i className="bi bi-download me-2"></i>Gerar PDF
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- COLUNA DA DIREITA (Solicitações Especiais) --- */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header py-3">
              <h5 className="mb-0">Abrir uma Solicitação</h5>
            </div>
            <div className="card-body">
              <p className="text-muted small">Precisa de algo mais específico? Abra um requerimento e acompanhe o status.</p>
              
              {/* Lista de links para os formulários */}
              <div className="list-group list-group-flush">
                <a 
                  href="#" 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={(e) => { e.preventDefault(); handleNovaSolicitacao('Trancamento de Matrícula'); }}
                >
                  Trancamento de Matrícula
                  <i className="bi bi-chevron-right"></i>
                </a>
                <a 
                  href="#" 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={(e) => { e.preventDefault(); handleNovaSolicitacao('Quebra de Pré-requisito'); }}
                >
                  Quebra de Pré-requisito
                  <i className="bi bi-chevron-right"></i>
                </a>
                <a 
                  href="#" 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={(e) => { e.preventDefault(); handleNovaSolicitacao('Aproveitamento de Estudos'); }}
                >
                  Aproveitamento de Estudos
                  <i className="bi bi-chevron-right"></i>
                </a>
                <a 
                  href="#" 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={(e) => { e.preventDefault(); handleNovaSolicitacao('Outras Solicitações'); }}
                >
                  Outras Solicitações
                  <i className="bi bi-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}