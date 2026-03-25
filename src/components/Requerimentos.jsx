import React, { useState, useRef } from 'react';
import api from './../api';
import './Requerimentos.css';

const TIPOS_REQUERIMENTO = [
  { id: 'trancamento', nome: 'Trancamento de Matrícula', icone: 'bi-pause-circle' },
  { id: 'quebra', nome: 'Quebra de Pré-requisito', icone: 'bi-diagram-3' },
  { id: 'aproveitamento', nome: 'Aproveitamento de Estudos', icone: 'bi-mortarboard' },
  { id: 'outros', nome: 'Outras Solicitações', icone: 'bi-chat-left-dots' },
];

const MOCK_SOLICITACOES = [
  { id: 101, tipo: 'Passe Escolar', data: '02/03/2024', status: 'Concluído', cor: 'success' },
  { id: 102, tipo: 'Trancamento de Matrícula', data: '04/03/2024', status: 'Em Análise', cor: 'warning' },
];

export default function Requerimentos() {
  const [abaAtiva, setAbaAtiva] = useState('novo');
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleNovaSolicitacao = async (e) => {
    e.preventDefault();
    setEnviando(true);
    // Simulação de envio
    setTimeout(() => {
      setEnviando(false);
      setAbaAtiva('acompanhar');
      setTipoSelecionado(null);
      setObservacao('');
      setArquivo(null);
    }, 1500);
  };

  return (
    <div className="req-container">
      <div className="req-header mb-5">
        <h2 className="fw-bold">Serviços Acadêmicos</h2>
        <p className="text-muted">Gerencie seus documentos e solicitações em um só lugar.</p>
      </div>

      {/* DOCUMENTOS RÁPIDOS - CLEAN CARDS */}
      <div className="row g-3 mb-5">
        {['Comprovante de Matrícula', 'Histórico Escolar'].map((doc, i) => (
          <div className="col-md-6" key={i}>
            <div className="doc-quick-card">
              <i className="bi bi-file-earmark-pdf text-muted fs-4"></i>
              <span className="flex-grow-1 ms-3 fw-medium">{doc}</span>
              <button className="btn-icon-download"><i className="bi bi-download"></i></button>
            </div>
          </div>
        ))}
      </div>

      {/* TABS NAVEGAÇÃO */}
      <div className="req-tabs mb-4">
        <button className={abaAtiva === 'novo' ? 'active' : ''} onClick={() => setAbaAtiva('novo')}>Novo Pedido</button>
        <button className={abaAtiva === 'acompanhar' ? 'active' : ''} onClick={() => setAbaAtiva('acompanhar')}>Meus Requerimentos</button>
      </div>

      {abaAtiva === 'novo' ? (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="type-selector-grid">
              {TIPOS_REQUERIMENTO.map((item) => (
                <div 
                  key={item.id} 
                  className={`type-card ${tipoSelecionado?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setTipoSelecionado(item)}
                >
                  <i className={`bi ${item.icone}`}></i>
                  <span>{item.nome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-8">
            {tipoSelecionado ? (
              <div className="form-clean-card animate__animated animate__fadeIn">
                <form onSubmit={handleNovaSolicitacao}>
                  <div className="mb-4">
                    <label className="form-label-clean">Descreva sua necessidade</label>
                    <textarea 
                      className="form-control-clean" 
                      rows="4" 
                      placeholder="Detalhes importantes para agilizar seu processo..."
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      required
                    />
                  </div>

                  {/* NOVO BOTÃO DE ANEXO CLEAN */}
                  <div className="mb-4">
                    <label className="form-label-clean">Anexar Comprovante (Opcional)</label>
                    <div className={`file-drop-zone ${arquivo ? 'file-selected' : ''}`} onClick={() => fileInputRef.current.click()}>
                      <input type="file" hidden ref={fileInputRef} onChange={(e) => setArquivo(e.target.files[0])} />
                      <div className="d-flex align-items-center justify-content-center w-100">
                        <i className={`bi ${arquivo ? 'bi-check2-circle' : 'bi-plus-lg'} me-2`}></i>
                        <span className="small">{arquivo ? arquivo.name : 'Selecionar arquivo'}</span>
                        {arquivo && <i className="bi bi-x ms-auto remove-file" onClick={(e) => { e.stopPropagation(); setArquivo(null); }}></i>}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-submit-edu" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="empty-state-card">
                <i className="bi bi-app-indicator"></i>
                <p>Selecione um tipo de requerimento ao lado.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card-table-clean animate__animated animate__fadeIn">
          <table className="table m-0">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Requerimento</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SOLICITACOES.map((req) => (
                <tr key={req.id}>
                  <td className="text-muted fw-bold">#{req.id}</td>
                  <td className="fw-medium">{req.tipo}</td>
                  <td className="text-muted">{req.data}</td>
                  <td><span className={`status-dot-badge ${req.cor}`}>{req.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}