import React, { useState, useMemo } from 'react';
// Precisamos do CSS customizado
import './Matricula.css'; 

// --- MUDANÇA CRUCIAL: ESTRUTURA DE DADOS ---
// O 'horario' não é mais um texto, mas um array de 'slots'
// Isso é essencial para renderizar no grid e checar conflitos
const MOCK_MATERIAS_DISPONIVEIS = [
  { id: 1, nome: 'Cálculo I', professor: 'Prof. Silva', vagasOcupadas: 45, vagasTotal: 50, concorrida: true, creditos: 4, 
    slots: [
      { dia: 'SEG', horario: '08:00 - 09:50' },
      { dia: 'QUA', horario: '08:00 - 09:50' }
    ]},
  { id: 2, nome: 'Álgebra Linear', professor: 'Prof. Marcos', vagasOcupadas: 20, vagasTotal: 50, concorrida: false, creditos: 4,
    slots: [
      { dia: 'TER', horario: '10:00 - 11:50' },
      { dia: 'QUI', horario: '10:00 - 11:50' }
    ]},
  { id: 3, nome: 'Física II (Conflito)', professor: 'Prof. Ana', vagasOcupadas: 30, vagasTotal: 50, concorrida: false, creditos: 4,
    slots: [
      { dia: 'SEG', horario: '08:00 - 09:50' }, // Conflito com Cálculo I
      { dia: 'QUA', horario: '10:00 - 11:50' }
    ]},
  { id: 4, nome: 'Programação I (Lotada)', professor: 'Prof. Bia', vagasOcupadas: 50, vagasTotal: 50, concorrida: true, creditos: 6,
    slots: [
      { dia: 'TER', horario: '14:00 - 15:50' },
      { dia: 'QUI', horario: '14:00 - 15:50' }
    ]},
  { id: 5, nome: 'Introdução à Filosofia', professor: 'Prof. Guedes', vagasOcupadas: 15, vagasTotal: 60, concorrida: false, creditos: 2,
    slots: [
      { dia: 'SEX', horario: '10:00 - 11:50' }
    ]},
];

// Constantes para construir o grid
const DIAS_DA_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
const HORARIOS_SLOTS = [
  '08:00 - 09:50',
  '10:00 - 11:50',
  '14:00 - 15:50',
  '16:00 - 17:50'
];
// -----------------------------------------------------------------


export default function Matricula() {
  const [periodoAberto, setPeriodoAberto] = useState(true);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState(MOCK_MATERIAS_DISPONIVEIS);
  const [carrinho, setCarrinho] = useState([]);

  /**
   * (ATUALIZADO) Lógica de Conflito de Horário.
   * Agora checa todos os 'slots' da nova matéria contra todos os 'slots' do carrinho.
   */
  const handleSelecionarMateria = (idMateria) => {
    const materia = materiasDisponiveis.find(m => m.id === idMateria);
    if (carrinho.some(c => c.id === idMateria)) return; // Já está no carrinho

    let temConflito = false;
    // Loop 1: Para cada slot da nova matéria...
    for (const slot of materia.slots) {
      // Loop 2: ...cheque se ele existe em algum item do carrinho.
      for (const item of carrinho) {
        if (item.slots.some(s => s.dia === slot.dia && s.horario === slot.horario)) {
          temConflito = true;
          break;
        }
      }
      if (temConflito) break;
    }

    const novoItem = {
      ...materia,
      conflito: temConflito,
      status: materia.concorrida ? 'ranking' : 'confirmada'
    };
    setCarrinho([...carrinho, novoItem]);
  };

  /**
   * (ATUALIZADO) Lógica de Remoção.
   * Precisa re-checar os conflitos do carrinho após remover um item.
   */
  const handleRemoverMateria = (idMateria) => {
    const novoCarrinho = carrinho.filter(m => m.id !== idMateria);

    const carrinhoAtualizado = novoCarrinho.map(item => {
      let conflito = false;
      for (const slot of item.slots) {
        for (const outroItem of novoCarrinho) {
          if (item.id === outroItem.id) continue; // Não checar contra si mesmo
          if (outroItem.slots.some(s => s.dia === slot.dia && s.horario === slot.horario)) {
            conflito = true;
            break;
          }
        }
        if (conflito) break;
      }
      return { ...item, conflito };
    });
    setCarrinho(carrinhoAtualizado);
  };

  /**
   * (NOVO) Helper para encontrar as matérias de um slot específico do grid
   */
  const findMaterias = (dia, horario) => {
    return materiasDisponiveis.filter(m => 
      m.slots.some(s => s.dia === dia && s.horario === horario)
    );
  };

  const totalCreditos = useMemo(() => {
    return carrinho.reduce((total, item) => total + item.creditos, 0);
  }, [carrinho]);

  
  // 1. Estado: Período Fechado (Igual)
  if (!periodoAberto) {
    return (
      <div className="alert alert-warning text-center" role="alert">
        {/* ... (mesmo código de período fechado) ... */}
      </div>
    );
  }

  // 2. Estado: Período Aberto (Layout Atualizado)
  return (
    <>
      <h2 className="mb-4">Período de Matrícula</h2>
      
      <div className="row g-4">

        {/* --- COLUNA DA ESQUERDA (NOVO GRID DE HORÁRIOS) --- */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-bordered text-center matricula-grid">
                
                {/* Cabeçalho (Dias da Semana) */}
                <thead>
                  <tr>
                    <th style={{width: "10%"}}>Horário</th>
                    {DIAS_DA_SEMANA.map(dia => (
                      <th key={dia}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                
                {/* Corpo (Slots de Horário) */}
                <tbody>
                  {HORARIOS_SLOTS.map(horario => (
                    <tr key={horario}>
                      {/* Célula do Horário */}
                      <th scope="row">{horario}</th>
                      
                      {/* Células de Matérias */}
                      {DIAS_DA_SEMANA.map(dia => {
                        const materiasDoSlot = findMaterias(dia, horario);
                        return (
                          <td key={dia}>
                            {materiasDoSlot.map(materia => {
                              const estaNoCarrinho = carrinho.some(c => c.id === materia.id);
                              const estaLotada = materia.vagasOcupadas >= materia.vagasTotal;
                              
                              return (
                                // O "Card" da Matéria dentro da célula
                                <div 
                                  key={materia.id}
                                  className={`materia-card ${estaNoCarrinho ? 'selecionada' : ''} ${estaLotada ? 'lotada' : ''}`}
                                  onClick={() => !estaLotada && !estaNoCarrinho ? handleSelecionarMateria(materia.id) : null}
                                  title={estaLotada ? 'Matéria Lotada' : (estaNoCarrinho ? 'Já selecionada' : `Selecionar ${materia.nome}`)}
                                >
                                  <strong>{materia.nome}</strong>
                                  <small className="d-block">{materia.professor}</small>
                                  <span className="badge bg-secondary mt-1">
                                    {materia.vagasOcupadas}/{materia.vagasTotal} vagas
                                  </span>
                                </div>
                              );
                            })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA (Carrinho de Matrícula) --- */}
        {/* Este JSX é EXATAMENTE o mesmo da versão anterior! */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-cart">
            <div className="card-header py-3">
              <h5 className="mb-0">Minha Pré-Matrícula</h5>
            </div>
            <ul className="list-group list-group-flush">
              {carrinho.length === 0 && (
                <li className="list-group-item text-center text-muted p-4">
                  Clique em um bloco na grade para adicionar.
                </li>
              )}
              {carrinho.map(item => (
                <li className={`list-group-item d-flex justify-content-between align-items-center ${item.conflito ? 'list-group-item-danger' : ''}`} key={item.id}>
                  <div>
                    <div className="fw-bold">{item.nome}</div>
                    <small className="text-muted">{item.creditos} créditos</small>
                    <div className="mt-1">
                      {item.conflito && (
                        <span className="badge bg-danger">CONFLITO DE HORÁRIO</span>
                      )}
                      {item.status === 'ranking' && !item.conflito && (
                        <span className="badge bg-warning text-dark">EM FILA (Ranking)</span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => handleRemoverMateria(item.id)}
                    title="Remover matéria"
                  >
                    <i className="bi bi-x-circle-fill fs-5"></i>
                  </button>
                </li>
              ))}
            </ul>
            <div className="card-footer p-3">
              <h5 className="mb-3">Total de Créditos: {totalCreditos}</h5>
              <button className="btn btn-success w-100 btn-lg">
                Confirmar Matrícula
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}