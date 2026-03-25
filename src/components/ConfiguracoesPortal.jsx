import React, { useState } from 'react';

// --- MOCK DE DADOS (Simula as configs salvas no BD) ---
const MOCK_CONFIGS_INICIAIS = {
  featureDarkMode: true,
  featureCarteirinha: true,
  featureMatricula: true,
  featureFinanceiro: false,
};
// -----------------------------------------------------------------


export default function ConfiguracoesPortal() {
  
  // State para todos os campos do formulário
  const [config, setConfig] = useState(MOCK_CONFIGS_INICIAIS);

  // Handler para os switches (checkboxes)
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setConfig(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handler para salvar (simulação)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configurações Salvas:', config);
    alert('Configurações de Recursos salvas! (Simulação)');
  };


  // --- JSX (Renderização) ---
  return (
    <>
      <h2 className="mb-4">Configurações do Portal</h2>

      {/* --- Formulário principal --- */}
      <form onSubmit={handleSubmit}>

        {/* --- Card de Recursos (Feature Flags) --- */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0"><i className="bi bi-toggles me-2"></i>Recursos (Feature Flags)</h5>
          </div>
          <div className="card-body p-4">
            <p className="text-muted">Ative ou desative módulos inteiros do portal.</p>
            <div className="list-group">
              
              {/* Switch: Modo Noturno */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">Modo Noturno</strong>
                  <small>Permitir que usuários troquem para o tema escuro.</small>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input fs-4" type="checkbox" role="switch" id="featureDarkMode" name="featureDarkMode" checked={config.featureDarkMode} onChange={handleSwitchChange} />
                </div>
              </div>
              
              {/* Switch: Carteirinha */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">Carteirinha Virtual</strong>
                  <small>Ativar o menu "Carteirinha" para os alunos.</small>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input fs-4" type="checkbox" role="switch" id="featureCarteirinha" name="featureCarteirinha" checked={config.featureCarteirinha} onChange={handleSwitchChange} />
                </div>
              </div>
              
              {/* Switch: Matrícula */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">Módulo de Matrícula</strong>
                  <small>Ativar o menu "Matrícula" para os alunos.</small>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input fs-4" type="checkbox" role="switch" id="featureMatricula" name="featureMatricula" checked={config.featureMatricula} onChange={handleSwitchChange} />
                </div>
              </div>
              
              {/* Switch: Financeiro (Exemplo) */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">Módulo Financeiro</strong>
                  <small>Ativar o menu "Financeiro" (boletos, etc).</small>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input fs-4" type="checkbox" role="switch" id="featureFinanceiro" name="featureFinanceiro" checked={config.featureFinanceiro} onChange={handleSwitchChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Botão de Salvar --- */}
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            <i className="bi bi-save-fill me-2"></i>Salvar Configurações
          </button>
        </div>
      </form>
    </>
  );
}