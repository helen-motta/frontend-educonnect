import React from 'react';
import api from './../api';
import './Requerimentos.css';

export default function Requerimentos() {

  const handleGerarDocumento = async (tipoApi, nomeAmigavel) => {
    try {
      const response = await api.get(`/documentos/gerar-pdf/${tipoApi}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nomeAmigavel}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erro ao gerar documento.");
    }
  };

  const handleNovaSolicitacao = async (nomeSolicitacao) => {
    if(!window.confirm(`Deseja abrir um protocolo para: ${nomeSolicitacao}?`)) return;
    try {
      await api.post('/requerimentos', {
        tipo: nomeSolicitacao,
        observacao: "Solicitado via Portal do Aluno"
      });
      alert("Solicitação enviada com sucesso!");
    } catch (error) {
      alert("Erro ao abrir solicitação.");
    }
  };

  return (
    <div className="requerimentos-wrapper">
      <h2 className="titulo-pagina">Requerimentos e Documentos</h2>
      
      <div className="secao-documentos">
        <h4 className="subtitulo">Documentos para Download</h4>
        <p className="descricao-secao">Gere e baixe seus documentos acadêmicos mais comuns de forma instantânea.</p>
        
        <div className="row g-4 mt-2">
          <div className="col-md-5">
            <div className="card-download">
              <div className="icon-container blue">
                <i className="bi bi-file-earmark-person-fill"></i>
              </div>
              <h5>Comprovante de Matrícula</h5>
              <p>Gere seu comprovante oficial de matrícula para o semestre atual.</p>
              <button className="btn-gerar" onClick={() => handleGerarDocumento('matricula', 'Matricula')}>
                <i className="bi bi-download me-2"></i> Gerar PDF
              </button>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card-download">
              <div className="icon-container green">
                <i className="bi bi-file-earmark-bar-graph-fill"></i>
              </div>
              <h5>Boletim / Histórico</h5>
              <p>Baixe seu boletim com notas e frequências ou seu histórico escolar completo.</p>
              <button className="btn-gerar" onClick={() => handleGerarDocumento('historico', 'Historico')}>
                <i className="bi bi-download me-2"></i> Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="secao-solicitacoes mt-5">
        <div className="card-solicitacoes shadow-sm">
          <h4 className="subtitulo-solicitacao">Abrir uma Solicitação</h4>
          <p className="descricao-secao">Precisa de algo mais específico? Abra um requerimento e acompanhe o status.</p>
          
          <div className="list-group list-group-flush mt-3">
            <button className="item-solicitacao" onClick={() => handleNovaSolicitacao('Trancamento de Matrícula')}>
              Trancamento de Matrícula <i className="bi bi-chevron-right"></i>
            </button>
            <button className="item-solicitacao" onClick={() => handleNovaSolicitacao('Quebra de Pré-requisito')}>
              Quebra de Pré-requisito <i className="bi bi-chevron-right"></i>
            </button>
            <button className="item-solicitacao" onClick={() => handleNovaSolicitacao('Aproveitamento de Estudos')}>
              Aproveitamento de Estudos <i className="bi bi-chevron-right"></i>
            </button>
            <button className="item-solicitacao" onClick={() => handleNovaSolicitacao('Outras Solicitações')}>
              Outras Solicitações <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}