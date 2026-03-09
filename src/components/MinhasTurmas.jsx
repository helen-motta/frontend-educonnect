import React, { useState, useEffect } from 'react';
import api from './../api';
import './MinhasTurmas.css'; 

const calcularMedia = (notasObj) => {
  if (!notasObj) return 0;
  const notasLancadas = Object.values(notasObj).filter(nota => nota !== null);
  if (notasLancadas.length === 0) return 0.0;
  const soma = notasLancadas.reduce((acc, nota) => acc + parseFloat(nota), 0);
  return (soma / notasLancadas.length).toFixed(1);
};

export default function MinhasTurmas() {
  const [turmasApi, setTurmasApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false); // Novo state de loading para detalhes
  const professorLogadoId = 2;

  const [view, setView] = useState('selecionar_turma');
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [chamada, setChamada] = useState({});
  const [atividadeAtual, setAtividadeAtual] = useState(''); 
  const [notasEditaveis, setNotasEditaveis] = useState({}); 

  // --- BUSCA LISTA DE TURMAS (INICIAL) ---
  useEffect(() => {
    const buscarTurmas = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/turmas`, {
          params: { professorId: professorLogadoId }
        });
        setTurmasApi(response.data);
        console.log("Turmas carregadas 1:", response.data);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    };
    buscarTurmas();
  }, []);

  // --- CARREGA NOTAS QUANDO MUDAR ATIVIDADE ---
  const carregarNotasDaAtividade = (atividadeId, turma) => {
    const notasIniciais = {};
    turma.alunos.forEach(aluno => {
      notasIniciais[aluno.id] = (aluno.notas && aluno.notas[atividadeId]) || null;
    });
    setNotasEditaveis(notasIniciais);
  };

  useEffect(() => {
    if (turmaSelecionada && turmaSelecionada.atividades?.length > 0) {
      const primeiraAtividade = turmaSelecionada.atividades[0].id;
      setAtividadeAtual(primeiraAtividade);
      carregarNotasDaAtividade(primeiraAtividade, turmaSelecionada);
    }
  }, [turmaSelecionada]);

  // --- HANDLER PARA EXPANDIR TURMA (BUSCA PELO ID) ---
const handleTurmaSelect = async (turmaSimplificada) => {
  try {
    setLoadingDetalhes(true);
    const response = await api.get(`/turmas/${turmaSimplificada.id}`);
    const data = response.data;

    // Normalizando os dados: Se o C# mandar 'inscricoesTurma', 
    // mapeamos para o formato que o seu componente espera ('alunos')
    const turmaFormatada = {
      ...data,
      nome: data.nomeTurma || data.nome,
      // Se vier como inscricoesTurma, extraímos os dados do aluno e notas
      alunos: (data.inscricoesTurmas || data.inscricoesTurma || []).map(ins => ({
        id: ins.alunoId,
        nome: ins.nomeAluno || (ins.aluno ? ins.aluno.nome : "Aluno"),
        ra: ins.raAluno || (ins.aluno ? ins.aluno.ra : ""),
        notas: {
          p1: ins.p1,
          p2: ins.p2,
          t1: ins.trabalho
        }
      })),
      // Atividades fixas caso o banco ainda não retorne
      atividades: data.atividades || [
        { id: 'p1', nome: 'Prova 1 (P1)' },
        { id: 'p2', nome: 'Prova 2 (P2)' },
        { id: 't1', nome: 'Trabalho (T1)' },
      ]
    };

    setTurmaSelecionada(turmaFormatada);

    const alunosState = {};
    turmaFormatada.alunos.forEach(aluno => {
      alunosState[aluno.id] = 'presente';
    });
    
    setChamada(alunosState);
    setView('selecionar_acao');
    
  } catch (error) {
    console.error("Erro detalhado:", error);
    alert("Erro ao carregar. Verifique o console.");
  } finally {
    setLoadingDetalhes(false);
  }
};

  // --- HANDLERS DE INTERAÇÃO ---
  const handleToggleFalta = (alunoId) => {
    setChamada(prev => ({...prev, [alunoId]: prev[alunoId] === 'presente' ? 'ausente' : 'presente'}));
  };

  const handleSalvarChamada = () => {
    alert(`Chamada da turma ${turmaSelecionada.id} salva com sucesso!`);
    setView('selecionar_acao');
  };

  const handleAtividadeChange = (id) => {
    setAtividadeAtual(id);
    carregarNotasDaAtividade(id, turmaSelecionada);
  };

  const handleNotaChange = (alunoId, nota) => {
    let v = nota;
    if (v !== "" && v !== null) { v = Math.max(0, Math.min(10, parseFloat(v))); }
    setNotasEditaveis(prev => ({ ...prev, [alunoId]: v }));
  };

  const handleSalvarNotas = () => {
    alert(`Notas da atividade ${atividadeAtual} enviadas!`);
    setView('selecionar_acao');
  };

  // --- TELAS (MANTENDO DESIGN ORIGINAL) ---

  const renderSelecionarTurma = () => (
    <>
      <h2 className="mb-4">Gerenciar Turma</h2>
      <h5 className="mb-3 text-muted">1. Selecione a Turma</h5>
      {loadingDetalhes && <div className="alert alert-info">Buscando dados da turma...</div>}
      <div className="list-group">
        {loading ? (
          <div className="text-center p-4">Carregando suas turmas...</div>
        ) : (
          turmasApi.map(turma => (
            <button
              key={turma.id}
              type="button"
              disabled={loadingDetalhes}
              className="list-group-item list-group-item-action"
              onClick={() => handleTurmaSelect(turma)}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{turma.nomeTurma}</h5>
                <span className="text-muted">{turma.disciplina.nome}</span>
              </div>
              <p className="mb-1">Horário: {turma.horariosFormatados?.join(' / ')}</p>
              <small>{turma.inscricoesTurmas.length || 0} alunos matriculados</small>
            </button>
          ))
        )}
      </div>
    </>
  );

  const renderSelecionarAcao = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_turma')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar (Trocar Turma)
      </button>
      <h2 className="mb-1">{turmaSelecionada.nomeTurma || turmaSelecionada.nome}</h2>
      <p className="text-muted fs-5">{(turmaSelecionada.inscricoesTurma?.length || 0)} alunos</p>
      
      <h5 className="mb-3 text-muted mt-4">2. Escolha a Ação</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('lancar_faltas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-calendar-check-fill display-4 text-success mb-3"></i>
              <h4 className="card-title">Lançar Faltas</h4>
              <p className="card-text text-muted">Fazer a chamada hoje.</p>
            </div>
          </div>
        </div>
        {/* Outros cards mantidos exatamente iguais... */}
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('lancar_notas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-pencil-square display-4 text-primary mb-3"></i>
              <h4 className="card-title">Lançar Notas</h4>
              <p className="card-text text-muted">Editar o diário de notas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-acao shadow-sm h-100" onClick={() => setView('visualizar_notas')}>
            <div className="card-body text-center p-4">
              <i className="bi bi-bar-chart-fill display-4 text-info mb-3"></i>
              <h4 className="card-title">Visão Geral</h4>
              <p className="card-text text-muted">Ver a média atual.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Renderizações de Faltas/Notas seguem usando turmaSelecionada.alunos (agora vindos da API)
  // ... (renderLancarFaltas, renderLancarNotas, renderVisualizarNotas permanecem iguais ao seu código original)

  return (
    <div className="container-fluid py-4">
      {view === 'selecionar_turma' && renderSelecionarTurma()}
      {view === 'selecionar_acao' && renderSelecionarAcao()}
      {view === 'lancar_faltas' && typeof renderLancarFaltas === 'function' && renderLancarFaltas()}
      {view === 'lancar_notas' && typeof renderLancarNotas === 'function' && renderLancarNotas()}
      {view === 'visualizar_notas' && typeof renderVisualizarNotas === 'function' && renderVisualizarNotas()}
    </div>
  );
}