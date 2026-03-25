import React, { useState, useEffect } from 'react';
import api from './../api';
import {
  MOCK_CORR,
  MOCK_ESTAT,
  MOCK_EVASAO_ALUNOS,
  MOCK_KAPLAN,
  MOCK_REG,
} from './minhasTurmas/mockData';
import TurmaActionCard from './minhasTurmas/TurmaActionCard';
import './MinhasTurmas.css'; 

export default function MinhasTurmas() {
  const [turmasApi, setTurmasApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false); // Novo state de loading para detalhes

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
        const response = await api.get(`/turmas/professor`, {
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
                <span className="text-muted">{turma.disciplina?.nome}</span>
              </div>
              <p className="mb-1">Horário: {turma.horariosFormatados?.join(' / ')}</p>
              <small>{turma.inscricoesTurmas?.length ?? 0} alunos matriculados</small>
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
        <TurmaActionCard
          iconClass="bi bi-calendar-check-fill"
          iconColorClass="text-success"
          title="Lançar Faltas"
          description="Fazer a chamada hoje."
          onClick={() => setView('lancar_faltas')}
        />
        <TurmaActionCard
          iconClass="bi bi-pencil-square"
          iconColorClass="text-primary"
          title="Lançar Notas"
          description="Editar o diário de notas."
          onClick={() => setView('lancar_notas')}
        />
        <TurmaActionCard
          iconClass="bi bi-bar-chart-fill"
          iconColorClass="text-info"
          title="Visão Geral"
          description="Ver a média atual."
          onClick={() => setView('visualizar_notas')}
        />
      </div>
    </>
  );

  // --- RENDER: LANÇAR FALTAS ---
  const renderLancarFaltas = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar
      </button>
      <h3 className="fw-bold mb-1">{turmaSelecionada.nomeTurma || turmaSelecionada.nome}</h3>
      <p className="text-muted mb-4">Registre a presença de hoje</p>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ALUNO</th>
                <th>RA</th>
                <th className="text-center">PRESENÇA</th>
              </tr>
            </thead>
            <tbody>
              {turmaSelecionada.alunos?.map(aluno => (
                <tr key={aluno.id}>
                  <td className="ps-4 fw-bold">{aluno.nome}</td>
                  <td className="text-muted">{aluno.ra}</td>
                  <td className="text-center">
                    <button
                      className={`btn btn-sm rounded-pill px-3 ${chamada[aluno.id] === 'presente' ? 'btn-success' : 'btn-outline-danger'}`}
                      onClick={() => handleToggleFalta(aluno.id)}
                    >
                      {chamada[aluno.id] === 'presente'
                        ? <><i className="bi bi-check-lg me-1"></i>Presente</>
                        : <><i className="bi bi-x-lg me-1"></i>Ausente</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-end">
        <button className="btn btn-success px-5 rounded-pill" onClick={handleSalvarChamada}>
          <i className="bi bi-check2-all me-2"></i>Salvar Chamada
        </button>
      </div>
    </>
  );

  // --- RENDER: LANÇAR NOTAS ---
  const renderLancarNotas = () => (
    <>
      <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
        <i className="bi bi-arrow-left me-1"></i>Voltar
      </button>
      <h3 className="fw-bold mb-1">{turmaSelecionada.nomeTurma || turmaSelecionada.nome}</h3>
      <p className="text-muted mb-4">Lançar notas por atividade</p>
      <div className="mb-3">
        {turmaSelecionada.atividades?.map(at => (
          <button
            key={at.id}
            className={`btn me-2 rounded-pill ${atividadeAtual === at.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleAtividadeChange(at.id)}
          >
            {at.nome}
          </button>
        ))}
      </div>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ALUNO</th>
                <th>RA</th>
                <th style={{ width: 160 }}>NOTA (0–10)</th>
              </tr>
            </thead>
            <tbody>
              {turmaSelecionada.alunos?.map(aluno => (
                <tr key={aluno.id}>
                  <td className="ps-4 fw-bold">{aluno.nome}</td>
                  <td className="text-muted">{aluno.ra}</td>
                  <td>
                    <input
                      type="number" min="0" max="10" step="0.1"
                      className="form-control form-control-sm"
                      value={notasEditaveis[aluno.id] ?? ''}
                      onChange={e => handleNotaChange(aluno.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-end">
        <button className="btn btn-primary px-5 rounded-pill" onClick={handleSalvarNotas}>
          <i className="bi bi-floppy me-2"></i>Salvar Notas
        </button>
      </div>
    </>
  );

  // --- RENDER: VISÃO GERAL (5 ANÁLISES MATEMÁTICAS) ---
  const renderVisualizarNotas = () => {
    // Helpers localizada dentro do render
    const corCorr = (v) => {
      if (v >= 0.8) return { bg: '#1a56db', color: '#fff' };
      if (v >= 0.6) return { bg: '#3f83f8', color: '#fff' };
      if (v >= 0.4) return { bg: '#76a9fa', color: '#1e3a8a' };
      if (v >= 0.2) return { bg: '#bfdbfe', color: '#1e3a8a' };
      if (v >= 0)   return { bg: '#eff6ff', color: '#374151' };
      return               { bg: '#fca5a5', color: '#7f1d1d' };
    };
    const riscoCor   = (p) => p >= 0.7 ? 'danger' : p >= 0.3 ? 'warning' : 'success';
    const riscoLabel = (p) => p >= 0.7 ? 'Alto'   : p >= 0.3 ? 'Moderado' : 'Baixo';

    // SVG — Regressão
    const W = 320, H = 200, PAD = 35;
    const xMin = 2, xMax = 10, yMin = 2, yMax = 11;
    const toX = x => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
    const toY = y => (H - PAD) - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

    // SVG — Kaplan-Meier
    const KW = 380, KH = 200, KPAD = 40;
    const kToX = i => KPAD + i * ((KW - KPAD * 2) / (MOCK_KAPLAN.length - 1));
    const kToY = t => (KH - KPAD) - ((t - 60) / 45) * (KH - KPAD * 2);

    return (
      <>
        <button className="btn btn-link mb-3 p-0" onClick={() => setView('selecionar_acao')}>
          <i className="bi bi-arrow-left me-1"></i>Voltar
        </button>
        <h3 className="fw-bold mb-1">{turmaSelecionada.nomeTurma || turmaSelecionada.nome}</h3>
        <p className="text-muted mb-4">Análise acadêmica avançada da turma</p>

        {/* ===== 1. ESTATÍSTICA DESCRITIVA ===== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-bar-chart-line me-2 text-primary"></i>1. Estatística Descritiva Expandida
            </h5>
            <p className="text-muted small mb-3">Medidas de tendência central e dispersão por atividade avaliativa</p>
            <div className="table-responsive mb-4">
              <table className="table table-borderless align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted" style={{ fontSize: 11 }}>
                    <th>ATIVIDADE</th><th>MÉDIA (μ)</th><th>MEDIANA</th><th>DP (σ)</th>
                    <th>CV</th><th>Q1</th><th>Q3</th><th>IQR</th><th>MÍN</th><th>MÁX</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(MOCK_ESTAT).map((s, i) => (
                    <tr key={i}>
                      <td className="fw-bold">{s.nome}</td>
                      <td><span className="badge bg-primary-subtle text-primary fw-bold">{s.media}</span></td>
                      <td>{s.mediana}</td>
                      <td>{s.dp}</td>
                      <td><span className={`badge ${s.cv > 25 ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>{s.cv}%</span></td>
                      <td>{s.q1}</td><td>{s.q3}</td>
                      <td className="fw-bold">{(s.q3 - s.q1).toFixed(1)}</td>
                      <td className="text-danger fw-bold">{s.min}</td>
                      <td className="text-success fw-bold">{s.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Box-plot visual */}
            {Object.values(MOCK_ESTAT).map((s, i) => (
              <div key={i} className="mb-3">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
                  <span className="fw-bold">{s.nome}</span>
                  <span className="text-muted">μ={s.media} · σ={s.dp}</span>
                </div>
                <div className="position-relative bg-light rounded-3" style={{ height: 24 }}>
                  <div className="position-absolute rounded" style={{
                    left: `${(s.q1 / 10) * 100}%`, width: `${((s.q3 - s.q1) / 10) * 100}%`,
                    height: '100%', background: '#3b82f6', opacity: 0.25,
                  }} />
                  <div className="position-absolute" style={{
                    left: `${(s.mediana / 10) * 100}%`, width: 3,
                    height: '100%', background: '#1d4ed8', borderRadius: 2,
                  }} />
                  <div className="position-absolute rounded-circle" style={{
                    left: `${(s.media / 10) * 100}%`, transform: 'translateX(-50%)',
                    width: 10, height: 10, top: 7, background: '#f59e0b',
                  }} />
                </div>
                <div className="d-flex justify-content-between mt-1" style={{ fontSize: 10, color: '#9ca3af' }}>
                  <span>{s.min}</span>
                  <span>Q1={s.q1}</span>
                  <span style={{ color: '#1d4ed8' }}>Med={s.mediana}</span>
                  <span>Q3={s.q3}</span>
                  <span>{s.max}</span>
                </div>
              </div>
            ))}
            <div className="d-flex gap-3 mt-2" style={{ fontSize: 11, color: '#6b7280' }}>
              <span><span className="d-inline-block me-1 rounded" style={{ width: 12, height: 12, background: '#3b82f6', opacity: 0.3 }}></span>IQR (Q1–Q3)</span>
              <span><span className="d-inline-block me-1" style={{ width: 3, height: 12, background: '#1d4ed8', verticalAlign: 'middle', display: 'inline-block' }}></span>Mediana</span>
              <span><span className="d-inline-block me-1 rounded-circle" style={{ width: 10, height: 10, background: '#f59e0b' }}></span>Média (μ)</span>
            </div>
          </div>
        </div>

        {/* ===== 2. CORRELAÇÃO MATRICIAL ===== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-grid-3x3-gap me-2 text-info"></i>2. Matriz de Correlação de Pearson
            </h5>
            <p className="text-muted small mb-3">Grau de relação linear entre atividades (−1 negativo · 0 neutro · +1 positivo)</p>
            <div className="d-flex justify-content-center mb-3">
              <table className="text-center small" style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}></th>
                    {MOCK_CORR.labels.map(l => (
                      <th key={l} className="text-muted fw-bold" style={{ width: 70, fontSize: 12 }}>{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CORR.matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="text-muted fw-bold text-end pe-2 small">{MOCK_CORR.labels[i]}</td>
                      {row.map((v, j) => {
                        const c = corCorr(v);
                        return (
                          <td key={j} style={{
                            background: c.bg, color: c.color,
                            padding: '10px 8px', borderRadius: 6,
                            fontWeight: i === j ? 700 : 500, fontSize: 13,
                          }}>
                            {v.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center gap-3" style={{ fontSize: 11 }}>
              <span><span className="d-inline-block me-1 rounded" style={{ width: 14, height: 14, background: '#1a56db', verticalAlign: 'middle' }}></span>Forte (≥0.8)</span>
              <span><span className="d-inline-block me-1 rounded" style={{ width: 14, height: 14, background: '#76a9fa', verticalAlign: 'middle' }}></span>Moderada (0.4–0.7)</span>
              <span><span className="d-inline-block me-1 rounded" style={{ width: 14, height: 14, background: '#bfdbfe', verticalAlign: 'middle' }}></span>Fraca (0.0–0.3)</span>
            </div>
          </div>
        </div>

        {/* ===== 3. REGRESSÃO LINEAR ===== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-bezier2 me-2 text-danger"></i>3. Regressão Linear — Previsão de Média Final
            </h5>
            <p className="text-muted small mb-3">
              Ŷ = {MOCK_REG.beta0} + {MOCK_REG.beta1}·(P1)&emsp;
              <span className="badge bg-primary-subtle text-primary fw-bold">R² = {MOCK_REG.r2}</span>
              &emsp;<span className="text-muted">({(MOCK_REG.r2 * 100).toFixed(0)}% da variância explicada por P1)</span>
            </p>
            <div className="d-flex justify-content-center">
              <svg width={W} height={H} style={{ overflow: 'visible', display: 'block' }}>
                {[4, 6, 8, 10].map(v => (
                  <g key={`h${v}`}>
                    <line x1={PAD} y1={toY(v)} x2={W - PAD + 10} y2={toY(v)} stroke="#e5e7eb" strokeWidth={1} />
                    <text x={PAD - 6} y={toY(v) + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{v}</text>
                  </g>
                ))}
                {[4, 6, 8, 10].map(v => (
                  <g key={`v${v}`}>
                    <line x1={toX(v)} y1={PAD - 10} x2={toX(v)} y2={H - PAD} stroke="#e5e7eb" strokeWidth={1} />
                    <text x={toX(v)} y={H - PAD + 14} textAnchor="middle" fontSize={10} fill="#9ca3af">{v}</text>
                  </g>
                ))}
                <line x1={PAD} y1={PAD - 10} x2={PAD} y2={H - PAD} stroke="#d1d5db" strokeWidth={1.5} />
                <line x1={PAD} y1={H - PAD} x2={W - PAD + 10} y2={H - PAD} stroke="#d1d5db" strokeWidth={1.5} />
                <text x={W / 2} y={H + 4} textAnchor="middle" fontSize={11} fill="#9ca3af">Nota P1</text>
                <text x={14} y={H / 2} textAnchor="middle" fontSize={11} fill="#9ca3af" transform={`rotate(-90,14,${H / 2})`}>Média Final</text>
                <line
                  x1={toX(2.5)} y1={toY(MOCK_REG.beta0 + MOCK_REG.beta1 * 2.5)}
                  x2={toX(9.5)} y2={toY(MOCK_REG.beta0 + MOCK_REG.beta1 * 9.5)}
                  stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3"
                />
                {MOCK_REG.pontos.map((p, i) => (
                  <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={5}
                    fill="#3b82f6" fillOpacity={0.75} stroke="#fff" strokeWidth={1.5} />
                ))}
              </svg>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-2" style={{ fontSize: 11, color: '#6b7280' }}>
              <span><span className="d-inline-block me-1 rounded-circle" style={{ width: 10, height: 10, background: '#3b82f6' }}></span>Aluno (P1, Média)</span>
              <span><span className="me-1" style={{ display: 'inline-block', width: 20, height: 2, background: '#ef4444', verticalAlign: 'middle' }}></span>Reta de regressão</span>
            </div>
          </div>
        </div>

        {/* ===== 4. PROBABILIDADE DE EVASÃO ===== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-person-x me-2 text-warning"></i>4. Probabilidade de Evasão — Modelo Logístico
            </h5>
            <p className="text-muted small mb-3">
              P(evasão) = 1 / (1 + e<sup>−z</sup>)&ensp;onde&ensp;z = β₀ + β₁·nota_média + β₂·faltas
            </p>
            <div className="row g-2 mb-4">
              {[['danger','Alto','≥ 70%'], ['warning','Moderado','30–69%'], ['success','Baixo','< 30%']].map(([cor, label, range]) => {
                const count = MOCK_EVASAO_ALUNOS.filter(a =>
                  cor === 'danger' ? a.p >= 0.7 : cor === 'warning' ? a.p >= 0.3 && a.p < 0.7 : a.p < 0.3
                ).length;
                return (
                  <div key={cor} className="col-4">
                    <div className={`p-3 rounded-4 bg-${cor}-subtle text-center`}>
                      <small className={`fw-bold text-${cor} d-block`}>{label.toUpperCase()}</small>
                      <div className={`display-6 fw-bold text-${cor} my-1`}>{count}</div>
                      <small className="text-muted">{range}</small>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0 small">
                <thead className="table-light">
                  <tr className="text-muted" style={{ fontSize: 11 }}>
                    <th>ALUNO</th><th>NOTA MÉD.</th><th>FALTAS</th><th>P(EVASÃO)</th><th>RISCO</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EVASAO_ALUNOS.map((aluno, i) => (
                    <tr key={i}>
                      <td>
                        <span className="fw-bold d-block">{aluno.nome}</span>
                        <span className="text-muted" style={{ fontSize: 11 }}>{aluno.ra}</span>
                      </td>
                      <td>{aluno.nota}</td>
                      <td>{aluno.faltas}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1 rounded-pill" style={{ height: 8 }}>
                            <div className={`progress-bar bg-${riscoCor(aluno.p)}`} style={{ width: `${aluno.p * 100}%` }}></div>
                          </div>
                          <span className="fw-bold" style={{ minWidth: 38, fontSize: 12 }}>{(aluno.p * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td><span className={`badge bg-${riscoCor(aluno.p)}-subtle text-${riscoCor(aluno.p)} fw-bold`}>{riscoLabel(aluno.p)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== 5. KAPLAN-MEIER ===== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-activity me-2 text-success"></i>5. Análise de Sobrevivência — Kaplan-Meier
            </h5>
            <p className="text-muted small mb-3">
              Taxa de permanência acumulada ao longo dos semestres (coorte atual)
            </p>
            <div className="d-flex justify-content-center mb-3">
              <svg width={KW} height={KH} style={{ overflow: 'visible', display: 'block' }}>
                {[65, 75, 88, 100].map(v => (
                  <g key={v}>
                    <line x1={KPAD} y1={kToY(v)} x2={KW - KPAD + 10} y2={kToY(v)} stroke="#e5e7eb" strokeWidth={1} />
                    <text x={KPAD - 6} y={kToY(v) + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{v}%</text>
                  </g>
                ))}
                {MOCK_KAPLAN.map((ponto, i) => {
                  const x    = kToX(i);
                  const y    = kToY(ponto.taxa);
                  const nx   = i < MOCK_KAPLAN.length - 1 ? kToX(i + 1) : null;
                  const ny   = nx ? kToY(MOCK_KAPLAN[i + 1].taxa) : null;
                  return (
                    <g key={i}>
                      {nx && <line x1={x}  y1={y}  x2={nx} y2={y}  stroke="#16a34a" strokeWidth={2.5} />}
                      {nx && <line x1={nx} y1={y}  x2={nx} y2={ny} stroke="#16a34a" strokeWidth={2.5} strokeDasharray="4,2" />}
                      <circle cx={x} cy={y} r={5} fill="#16a34a" stroke="#fff" strokeWidth={2} />
                      <text x={x} y={KH - KPAD + 16} textAnchor="middle" fontSize={10} fill="#6b7280">{ponto.sem}</text>
                      <text x={x} y={y - 9} textAnchor="middle" fontSize={10} fill="#15803d" fontWeight="bold">{ponto.taxa}%</text>
                    </g>
                  );
                })}
                <line x1={KPAD} y1={KPAD - 10} x2={KPAD} y2={KH - KPAD} stroke="#d1d5db" strokeWidth={1.5} />
                <line x1={KPAD} y1={KH - KPAD} x2={KW - KPAD + 10} y2={KH - KPAD} stroke="#d1d5db" strokeWidth={1.5} />
                <text x={KW / 2} y={KH + 4} textAnchor="middle" fontSize={11} fill="#9ca3af">Semestres</text>
                <text x={14} y={KH / 2} textAnchor="middle" fontSize={11} fill="#9ca3af" transform={`rotate(-90,14,${KH / 2})`}>% Permanência</text>
              </svg>
            </div>
            <div className="row g-2">
              {MOCK_KAPLAN.map((p, i) => (
                <div key={i} className="col">
                  <div className="text-center p-2 bg-light rounded-3">
                    <div className="small text-muted">{p.sem} Sem</div>
                    <div className="fw-bold" style={{ color: p.taxa >= 85 ? '#16a34a' : p.taxa >= 70 ? '#ca8a04' : '#dc2626' }}>
                      {p.taxa}%
                    </div>
                    {i > 0 && <div style={{ fontSize: 10, color: '#dc2626' }}>−{MOCK_KAPLAN[i - 1].taxa - p.taxa}%</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container-fluid py-4">
      {view === 'selecionar_turma'  && renderSelecionarTurma()}
      {view === 'selecionar_acao'   && renderSelecionarAcao()}
      {view === 'lancar_faltas'     && renderLancarFaltas()}
      {view === 'lancar_notas'      && renderLancarNotas()}
      {view === 'visualizar_notas'  && renderVisualizarNotas()}
    </div>
  );
}