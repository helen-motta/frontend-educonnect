import React, { useState } from 'react';

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---

// 1. As turmas do professor (para o <select>)
const MOCK_TURMAS = [
  { id: 't1', nome: 'Cálculo I - Turma A' },
  { id: 't2', nome: 'Física II - Turma B' },
  { id: 't3', nome: 'Programação I - Turma C' },
];

// 2. O histórico de comunicados (para a lista)
const MOCK_COMUNICADOS_INICIAIS = [
  {
    id: 101,
    assunto: 'Aula de Segunda Trocada de Sala',
    mensagem: 'Pessoal, a aula de segunda-feira (20/11) será na sala B-105, não na B-102.',
    data: '18/11/2025',
    turmas: [{ id: 't1', nome: 'Cálculo I - Turma A' }]
  },
  {
    id: 100,
    assunto: 'Prazo da P1 Estendido',
    mensagem: 'O prazo de entrega da P1 foi estendido para a próxima sexta-feira, sem falta.',
    data: '15/11/2025',
    turmas: [
      { id: 't1', nome: 'Cálculo I - Turma A' },
      { id: 't2', nome: 'Física II - Turma B' }
    ]
  }
];
// -----------------------------------------------------------------


export default function Comunicados() {

  // State para o "banco de dados" de comunicados
  const [comunicados, setComunicados] = useState(MOCK_COMUNICADOS_INICIAIS);

  // States para controlar o formulário de novo comunicado
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);

  /**
   * Handler para o <select multiple>
   * (É um pouco diferente de um select normal)
   */
  const handleTurmaSelect = (e) => {
    // Pega todos os <option> selecionados
    const options = [...e.target.selectedOptions];
    // Pega o 'value' (o id) de cada option
    const values = options.map(option => option.value);
    setTurmasSelecionadas(values);
  };

  /**
   * Handler para ENVIAR o novo comunicado
   */
  const handleEnviarComunicado = (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // 1. Validação (simples)
    if (!assunto || !mensagem || turmasSelecionadas.length === 0) {
      alert('Por favor, preencha o assunto, a mensagem e selecione ao menos uma turma.');
      return;
    }

    // 2. "Traduzir" os IDs das turmas em nomes (para o mock)
    const turmasInfo = turmasSelecionadas.map(id => {
      const turma = MOCK_TURMAS.find(t => t.id === id);
      return { id: turma.id, nome: turma.nome };
    });

    // 3. Criar o novo objeto de comunicado
    const novoComunicado = {
      id: Date.now(), // ID único (simples)
      assunto: assunto,
      mensagem: mensagem,
      data: new Date().toLocaleDateString(),
      turmas: turmasInfo
    };

    // 4. Adicionar o novo comunicado ao topo da lista (nosso "BD")
    setComunicados([novoComunicado, ...comunicados]);

    // 5. Limpar o formulário
    setAssunto('');
    setMensagem('');
    setTurmasSelecionadas([]);
    
    alert('Comunicado enviado com sucesso!');
  };

  /**
   * Handler para EXCLUIR um comunicado
   */
  const handleExcluirComunicado = (idParaExcluir) => {
    if (window.confirm('Tem certeza que deseja excluir este comunicado?')) {
      // Filtra a lista, removendo o item com o ID correspondente
      setComunicados(comunicados.filter(c => c.id !== idParaExcluir));
    }
  };


  return (
    <>
      <h2 className="mb-4">Gerenciar Comunicados</h2>

      {/* --- 1. FORMULÁRIO DE ENVIO --- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Enviar Novo Comunicado</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleEnviarComunicado}>
            
            {/* Seletor de Turmas (Múltiplo) */}
            <div className="mb-3">
              <label htmlFor="turmaSelect" className="form-label fw-bold">
                Para quais turmas?
              </label>
              <select 
                multiple // Permite selecionar mais de um
                className="form-select" 
                id="turmaSelect" 
                size="4" // Mostra 4 opções de altura
                value={turmasSelecionadas}
                onChange={handleTurmaSelect}
              >
                <option value="" disabled>Segure Ctrl (ou Cmd) para selecionar várias</option>
                {MOCK_TURMAS.map(turma => (
                  <option key={turma.id} value={turma.id}>{turma.nome}</option>
                ))}
              </select>
            </div>
            
            {/* Assunto */}
            <div className="mb-3">
              <label htmlFor="assunto" className="form-label fw-bold">Assunto</label>
              <input 
                type="text" 
                className="form-control" 
                id="assunto"
                placeholder="Ex: Aula de Terça Cancelada"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
              />
            </div>

            {/* Mensagem */}
            <div className="mb-3">
              <label htmlFor="mensagem" className="form-label fw-bold">Mensagem</label>
              <textarea 
                className="form-control" 
                id="mensagem" 
                rows="4"
                placeholder="Escreva seu comunicado aqui..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-send-fill me-2"></i>Enviar Comunicado
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- 2. HISTÓRICO DE ENVIOS --- */}
      <h4 className="mb-3">Histórico de Envios</h4>
      <div className="list-group">
        
        {/* Caso esteja vazio */}
        {comunicados.length === 0 && (
          <div className="alert alert-light text-center">
            Nenhum comunicado enviado ainda.
          </div>
        )}

        {/* Lista de comunicados */}
        {comunicados.map(com => (
          <div key={com.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{com.assunto}</h5>
                <small className="text-muted">{com.data}</small>
              </div>
              <p className="mb-1">{com.mensagem}</p>
              {/* Badges das turmas */}
              <div className="mt-2">
                <strong>Para:</strong>
                {com.turmas.map(t => (
                  <span key={t.id} className="badge bg-secondary-subtle text-secondary-emphasis ms-1">
                    {t.nome}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Botão de Excluir */}
            <button 
              className="btn btn-sm btn-outline-danger border-0"
              title="Excluir comunicado"
              onClick={() => handleExcluirComunicado(com.id)}
            >
              <i className="bi bi-trash-fill fs-5"></i>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}