import React from 'react';
import api from './../api';

export default function Requerimentos() {

  const handleGerarDocumento = async (tipoApi, nomeAmigavel) => {
    try {
      alert(`Gerando ${nomeAmigavel}... aguarde.`);
      
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
      console.error(error);
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
      alert("Solicitação enviada com sucesso! Acompanhe na aba de protocolos.");
    } catch (error) {
      alert("Erro ao abrir solicitação.");
    }
  };

  return (
    <>
      <h2 className="mb-4">Requerimentos e Documentos</h2>
      <div className="row g-4">
        
        <div className="col-lg-8">
            
            <div className="row g-4">
                <div className="col-md-6">
                    <button className="btn btn-primary" onClick={() => handleGerarDocumento('matricula', 'Comprovante_Matricula')}>
                        <i className="bi bi-download me-2"></i>Gerar PDF
                    </button>
                </div>

                <div className="col-md-6">
                    <button className="btn btn-success" onClick={() => handleGerarDocumento('historico', 'Historico_Escolar')}>
                        <i className="bi bi-download me-2"></i>Gerar PDF
                    </button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}