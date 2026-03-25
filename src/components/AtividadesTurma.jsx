import React, { useState, useMemo } from 'react';
import './AtividadesTurma.css';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_TURMAS = [
  { id: 1, nome: 'Engenharia de Software', codigo: 'ES-2024-1', semestre: '2024.1', totalAlunos: 32 },
  { id: 2, nome: 'Cálculo I',              codigo: 'CA-2024-1', semestre: '2024.1', totalAlunos: 28 },
  { id: 3, nome: 'Banco de Dados II',      codigo: 'BD-2024-2', semestre: '2024.2', totalAlunos: 24 },
];

let proximoId = 10;

const MOCK_ATIVIDADES_INICIAIS = {
  1: [
    { id: 1, titulo: 'Trabalho: Levantamento de Requisitos', descricao: 'Realizar o levantamento de requisitos de um sistema real. Entregar documento de requisitos em formato ABNT.', tipo: 'Trabalho', prazo: '2026-03-28', pontuacao: 10, status: 'aberta' },
    { id: 2, titulo: 'Exercício: Diagrama de Casos de Uso', descricao: 'Elaborar o diagrama de casos de uso para o sistema escolhido na atividade anterior.', tipo: 'Exercício', prazo: '2026-04-05', pontuacao: 5, status: 'aberta' },
    { id: 3, titulo: 'Prova: Fundamentos de Engenharia de Software', descricao: 'Avaliação sobre os conceitos fundamentais da disciplina: modelos de processo, requisitos e projeto.', tipo: 'Prova', prazo: '2026-03-15', pontuacao: 10, status: 'encerrada' },
  ],
  2: [
    { id: 4, titulo: 'Lista de Exercícios 1 – Limites', descricao: 'Exercícios das páginas 45 a 52 do livro de Stewart (8ª edição). Mostrar todos os cálculos.', tipo: 'Exercício', prazo: '2026-03-22', pontuacao: 5, status: 'encerrada' },
    { id: 5, titulo: 'Lista de Exercícios 2 – Derivadas', descricao: 'Exercícios sobre derivadas elementares e regra da cadeia. Entregar manuscrito.', tipo: 'Exercício', prazo: '2026-04-10', pontuacao: 5, status: 'aberta' },
  ],
  3: [
    { id: 6, titulo: 'P1 – Projeto de Banco de Dados Relacional', descricao: 'Entregar o MER e o modelo relacional normalizados até a 3FN com justificativas.', tipo: 'Prova', prazo: '2026-04-01', pontuacao: 10, status: 'aberta' },
    { id: 7, titulo: 'Seminário: NoSQL vs SQL', descricao: 'Apresentação em grupo (4 a 5 integrantes) comparando bancos de dados relacionais e não-relacionais. 15 minutos.', tipo: 'Seminário', prazo: '2026-04-20', pontuacao: 8, status: 'aberta' },
    { id: 8, titulo: 'Exercício: Consultas SQL com JOINs', descricao: 'Resolver os 12 exercícios de consulta disponíveis no portal com o banco de dados fornecido.', tipo: 'Exercício', prazo: '2026-03-10', pontuacao: 4, status: 'encerrada' },
  ],
};

const TIPOS = ['Trabalho', 'Exercício', 'Prova', 'Seminário', 'Projeto', 'Outro'];

const TIPO_CONFIG = {
  Trabalho: {
    cor: 'primary',
    icone: 'bi-file-earmark-text-fill',
    badgeClass: 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
  },
  Exercício: {
    cor: 'success',
    icone: 'bi-pencil-square',
    badgeClass: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
  Prova: {
    cor: 'danger',
    icone: 'bi-journal-bookmark-fill',
    badgeClass: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
  },
  Seminário: {
    cor: 'warning',
    icone: 'bi-mic-fill',
    badgeClass: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  },
  Projeto: {
    cor: 'info',
    icone: 'bi-kanban-fill',
    badgeClass: 'bg-info-subtle text-info-emphasis border border-info-subtle',
  },
  Outro: {
    cor: 'secondary',
    icone: 'bi-three-dots',
    badgeClass: 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle',
  },
};

const formatarData = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const formatarDataHora = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const diasRestantes = (prazo) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diff = new Date(prazo + 'T00:00:00') - hoje;
  return Math.ceil(diff / 86400000);
};

const FORM_VAZIO = { titulo: '', descricao: '', tipo: 'Trabalho', prazo: '', pontuacao: 10, status: 'aberta' };

// ─── MOCK: ALUNOS ─────────────────────────────────────────────────────────────
const MOCK_ALUNOS = {
  1: [
    { id: 101, nome: 'Ana Clara Souza',     matricula: '2021001', avatar: 'AC' },
    { id: 102, nome: 'Bruno Mendes',        matricula: '2021002', avatar: 'BM' },
    { id: 103, nome: 'Carla Nunes',         matricula: '2021003', avatar: 'CN' },
    { id: 104, nome: 'Diego Ferreira',      matricula: '2021004', avatar: 'DF' },
    { id: 105, nome: 'Eduarda Lima',        matricula: '2021005', avatar: 'EL' },
    { id: 106, nome: 'Felipe Costa',        matricula: '2021006', avatar: 'FC' },
    { id: 107, nome: 'Gabriela Ramos',      matricula: '2021007', avatar: 'GR' },
    { id: 108, nome: 'Henrique Alves',      matricula: '2021008', avatar: 'HA' },
  ],
  2: [
    { id: 201, nome: 'Isabela Martins',     matricula: '2022001', avatar: 'IM' },
    { id: 202, nome: 'João Pedro Silva',    matricula: '2022002', avatar: 'JP' },
    { id: 203, nome: 'Karen Oliveira',      matricula: '2022003', avatar: 'KO' },
    { id: 204, nome: 'Lucas Barbosa',       matricula: '2022004', avatar: 'LB' },
    { id: 205, nome: 'Mariana Torres',      matricula: '2022005', avatar: 'MT' },
    { id: 206, nome: 'Nicolas Rocha',       matricula: '2022006', avatar: 'NR' },
  ],
  3: [
    { id: 301, nome: 'Olivia Santos',       matricula: '2023001', avatar: 'OS' },
    { id: 302, nome: 'Pedro Henrique Cruz', matricula: '2023002', avatar: 'PH' },
    { id: 303, nome: 'Quésia Andrade',      matricula: '2023003', avatar: 'QA' },
    { id: 304, nome: 'Rafael Melo',         matricula: '2023004', avatar: 'RM' },
    { id: 305, nome: 'Sabrina Pinto',       matricula: '2023005', avatar: 'SP' },
    { id: 306, nome: 'Thiago Cardoso',      matricula: '2023006', avatar: 'TC' },
  ],
};

// ─── MOCK: ENVIOS ─────────────────────────────────────────────────────────────
// { [atividadeId]: { [alunoId]: { arquivo, tipo, enviadoEm, nota, feedback } } }
const MOCK_ENVIOS_INICIAIS = {
  1: {
    101: { arquivo: 'requisitos_ana.pdf',    tipo: 'pdf',   enviadoEm: '2026-03-25T14:32:00', nota: null, feedback: '' },
    102: { arquivo: 'trabalho_bruno.pdf',    tipo: 'pdf',   enviadoEm: '2026-03-26T09:10:00', nota: 8.5,  feedback: 'Bom trabalho, mas faltou detalhar os requisitos não-funcionais.' },
    103: { arquivo: 'carla_req.png',         tipo: 'image', enviadoEm: '2026-03-24T18:55:00', nota: null, feedback: '' },
    105: { arquivo: 'eduarda_lrq.pdf',       tipo: 'pdf',   enviadoEm: '2026-03-27T22:01:00', nota: 9.0,  feedback: 'Excelente! Documento bem estruturado.' },
    107: { arquivo: 'gabriela_trab.png',     tipo: 'image', enviadoEm: '2026-03-28T07:45:00', nota: null, feedback: '' },
  },
  2: {
    101: { arquivo: 'casos_uso_ana.pdf',     tipo: 'pdf',   enviadoEm: '2026-04-03T20:10:00', nota: null, feedback: '' },
    103: { arquivo: 'diagrama_carla.png',    tipo: 'image', enviadoEm: '2026-04-02T11:30:00', nota: null, feedback: '' },
    104: { arquivo: 'diego_casos.pdf',       tipo: 'pdf',   enviadoEm: '2026-04-04T16:00:00', nota: 7.0,  feedback: 'Diagrama correto, melhorar nomenclatura.' },
  },
  3: {
    101: { arquivo: 'prova_ana.pdf',         tipo: 'pdf',   enviadoEm: '2026-03-10T10:05:00', nota: 9.5,  feedback: '' },
    102: { arquivo: 'prova_bruno.png',       tipo: 'image', enviadoEm: '2026-03-10T09:50:00', nota: 7.0,  feedback: '' },
    103: { arquivo: 'prova_carla.pdf',       tipo: 'pdf',   enviadoEm: '2026-03-10T10:30:00', nota: 8.0,  feedback: '' },
    104: { arquivo: 'prova_diego.pdf',       tipo: 'pdf',   enviadoEm: '2026-03-10T10:15:00', nota: 6.5,  feedback: '' },
    105: { arquivo: 'prova_eduarda.png',     tipo: 'image', enviadoEm: '2026-03-10T09:45:00', nota: 9.0,  feedback: '' },
    106: { arquivo: 'prova_felipe.pdf',      tipo: 'pdf',   enviadoEm: '2026-03-10T10:55:00', nota: null, feedback: '' },
    108: { arquivo: 'prova_henrique.pdf',    tipo: 'pdf',   enviadoEm: '2026-03-10T11:10:00', nota: 8.5,  feedback: '' },
  },
  4: {
    201: { arquivo: 'lista1_isabela.pdf',    tipo: 'pdf',   enviadoEm: '2026-03-20T14:20:00', nota: 5.0,  feedback: 'Alguns erros nos limites laterais.' },
    202: { arquivo: 'lista1_joao.pdf',       tipo: 'pdf',   enviadoEm: '2026-03-21T10:00:00', nota: 4.5,  feedback: '' },
    203: { arquivo: 'lista1_karen.png',      tipo: 'image', enviadoEm: '2026-03-19T18:00:00', nota: 4.0,  feedback: '' },
    204: { arquivo: 'lista1_lucas.pdf',      tipo: 'pdf',   enviadoEm: '2026-03-22T07:30:00', nota: null, feedback: '' },
    205: { arquivo: 'lista1_mariana.pdf',    tipo: 'pdf',   enviadoEm: '2026-03-21T22:10:00', nota: 5.0,  feedback: '' },
  },
  5: {},
  6: {
    301: { arquivo: 'bd_olivia.pdf',         tipo: 'pdf',   enviadoEm: '2026-03-31T15:00:00', nota: null, feedback: '' },
    303: { arquivo: 'bd_quesia.png',         tipo: 'image', enviadoEm: '2026-03-30T09:40:00', nota: null, feedback: '' },
    305: { arquivo: 'bd_sabrina.pdf',        tipo: 'pdf',   enviadoEm: '2026-03-28T19:22:00', nota: null, feedback: '' },
  },
  7: {},
  8: {
    301: { arquivo: 'sql_olivia.pdf',        tipo: 'pdf',   enviadoEm: '2026-03-09T14:00:00', nota: 4.0,  feedback: '' },
    302: { arquivo: 'sql_pedro.pdf',         tipo: 'pdf',   enviadoEm: '2026-03-09T16:30:00', nota: 3.5,  feedback: '' },
    303: { arquivo: 'sql_quesia.png',        tipo: 'image', enviadoEm: '2026-03-08T20:00:00', nota: 4.0,  feedback: '' },
    304: { arquivo: 'sql_rafael.pdf',        tipo: 'pdf',   enviadoEm: '2026-03-10T08:55:00', nota: null, feedback: '' },
    306: { arquivo: 'sql_thiago.pdf',        tipo: 'pdf',   enviadoEm: '2026-03-09T23:45:00', nota: 3.0,  feedback: '' },
  },
};

// URL mockada – em produção viria da API
const MOCK_PREVIEW_URL = {
  pdf:   'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf',
  image: 'https://placehold.co/900x1200/e2e8f0/475569?text=Envio+do+Aluno',
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AtividadesTurma() {
  const [turmas]                        = useState(MOCK_TURMAS);
  const [atividades, setAtividades]     = useState(MOCK_ATIVIDADES_INICIAIS);
  const [turmaSel, setTurmaSel]         = useState(MOCK_TURMAS[0]);
  const [filtroTipo, setFiltroTipo]     = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [busca, setBusca]               = useState('');

  // Modal criar/editar
  const [modalAberto, setModalAberto]           = useState(false);
  const [modoEdicao, setModoEdicao]             = useState(false);
  const [atividadeEditando, setAtividadeEditando] = useState(null);
  const [form, setForm]                         = useState(FORM_VAZIO);
  const [erros, setErros]                       = useState({});

  // Confirm delete + toast
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]                 = useState(null);

  // Envios & notas
  const [envios, setEnvios]                         = useState(MOCK_ENVIOS_INICIAIS);
  const [modalEnvios, setModalEnvios]               = useState(null);
  const [filtroEnvio, setFiltroEnvio]               = useState('todos');
  const [notaEditando, setNotaEditando]             = useState({});
  const [feedbackEditando, setFeedbackEditando]     = useState({});

  // Preview de arquivo inline
  const [previewArquivo, setPreviewArquivo] = useState(null);

  // ── Dados filtrados ──────────────────────────────────────────────────────────
  const atividadesDaTurma = useMemo(() => {
    return (atividades[turmaSel?.id] || []).filter((a) => {
      const matchTipo   = !filtroTipo   || a.tipo === filtroTipo;
      const matchStatus = !filtroStatus || a.status === filtroStatus;
      const matchBusca  = !busca        || a.titulo.toLowerCase().includes(busca.toLowerCase());
      return matchTipo && matchStatus && matchBusca;
    });
  }, [atividades, turmaSel, filtroTipo, filtroStatus, busca]);

  const stats = useMemo(() => {
    const lista = atividades[turmaSel?.id] || [];
    return {
      total:      lista.length,
      abertas:    lista.filter((a) => a.status === 'aberta').length,
      encerradas: lista.filter((a) => a.status === 'encerrada').length,
    };
  }, [atividades, turmaSel]);

  const alunosDaTurmaAtual = useMemo(
    () => MOCK_ALUNOS[turmaSel?.id] || [],
    [turmaSel]
  );

  // Envios: dados derivados
  const resumoEnvios = useMemo(() => {
    if (!modalEnvios) return {};
    const alunos    = MOCK_ALUNOS[turmaSel?.id] || [];
    const envAv     = envios[modalEnvios.id] || {};
    const enviaram  = alunos.filter((a) => envAv[a.id]);
    const avaliados = enviaram.filter((a) => envAv[a.id].nota !== null);
    return { total: alunos.length, enviaram: enviaram.length, avaliados: avaliados.length };
  }, [modalEnvios, envios, turmaSel]);

  const alunosComEnvio = useMemo(() => {
    if (!modalEnvios) return [];
    const enviosDaAtiv = envios[modalEnvios.id] || {};
    const alunos = MOCK_ALUNOS[turmaSel?.id] || [];
    return alunos
      .map((a) => ({ ...a, envio: enviosDaAtiv[a.id] || null }))
      .filter((a) => {
        if (filtroEnvio === 'enviaram')  return !!a.envio;
        if (filtroEnvio === 'pendentes') return !a.envio;
        if (filtroEnvio === 'avaliados') return a.envio && a.envio.nota !== null;
        return true;
      });
  }, [modalEnvios, envios, filtroEnvio, turmaSel]);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const mostrarToast = (tipo, msg) => {
    setToast({ tipo, msg });
    setTimeout(() => setToast(null), 3200);
  };

  // ── Validação ────────────────────────────────────────────────────────────────
  const validar = () => {
    const e = {};
    if (!form.titulo.trim())               e.titulo    = 'O título é obrigatório.';
    if (form.titulo.trim().length > 120)   e.titulo    = 'Máximo de 120 caracteres.';
    if (!form.prazo)                       e.prazo     = 'Defina um prazo.';
    if (!form.descricao.trim())            e.descricao = 'Adicione uma descrição.';
    if (form.pontuacao <= 0 || form.pontuacao > 100) e.pontuacao = 'Pontuação entre 1 e 100.';
    return e;
  };

  // ── CRUD atividades ──────────────────────────────────────────────────────────
  const abrirCriar = () => {
    setModoEdicao(false);
    setAtividadeEditando(null);
    setForm(FORM_VAZIO);
    setErros({});
    setModalAberto(true);
  };

  const abrirEditar = (atividade) => {
    setModoEdicao(true);
    setAtividadeEditando(atividade);
    setForm({ ...atividade });
    setErros({});
    setModalAberto(true);
  };

  const fecharModal = () => { setModalAberto(false); setErros({}); };

  const salvar = () => {
    const e = validar();
    if (Object.keys(e).length) { setErros(e); return; }
    setAtividades((prev) => {
      const lista = prev[turmaSel.id] || [];
      if (modoEdicao) {
        return { ...prev, [turmaSel.id]: lista.map((a) => a.id === atividadeEditando.id ? { ...form, id: a.id } : a) };
      }
      return { ...prev, [turmaSel.id]: [{ ...form, id: proximoId++ }, ...lista] };
    });
    fecharModal();
    mostrarToast('success', modoEdicao ? 'Atividade atualizada com sucesso!' : 'Atividade cadastrada com sucesso!');
  };

  const confirmarDelete = (atividade) => setConfirmDelete(atividade);

  const executarDelete = () => {
    setAtividades((prev) => ({
      ...prev,
      [turmaSel.id]: (prev[turmaSel.id] || []).filter((a) => a.id !== confirmDelete.id),
    }));
    setConfirmDelete(null);
    mostrarToast('danger', 'Atividade excluída.');
  };

  const alternarStatus = (atividade) => {
    const novoStatus = atividade.status === 'aberta' ? 'encerrada' : 'aberta';
    setAtividades((prev) => ({
      ...prev,
      [turmaSel.id]: (prev[turmaSel.id] || []).map((a) =>
        a.id === atividade.id ? { ...a, status: novoStatus } : a
      ),
    }));
    mostrarToast('info', `Atividade ${novoStatus === 'aberta' ? 'reaberta' : 'encerrada'}.`);
  };

  const onChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (erros[field]) setErros((e) => { const c = { ...e }; delete c[field]; return c; });
  };

  // ── Envios / Notas ───────────────────────────────────────────────────────────
  const abrirEnvios = (atividade) => {
    setModalEnvios(atividade);
    setFiltroEnvio('todos');
    setPreviewArquivo(null);
    const enviosAtiv = envios[atividade.id] || {};
    const notasIni = {};
    const feedIni  = {};
    Object.entries(enviosAtiv).forEach(([aid, env]) => {
      notasIni[aid] = env.nota !== null ? String(env.nota) : '';
      feedIni[aid]  = env.feedback || '';
    });
    setNotaEditando(notasIni);
    setFeedbackEditando(feedIni);
  };

  const fecharEnvios = () => { setModalEnvios(null); setPreviewArquivo(null); };

  const salvarNota = (atividadeId, alunoId) => {
    const notaStr = (notaEditando[alunoId] ?? '').toString().replace(',', '.');
    const nota    = notaStr === '' ? null : parseFloat(notaStr);
    if (nota !== null && (isNaN(nota) || nota < 0)) {
      mostrarToast('danger', 'Nota inválida. Informe um número ≥ 0.');
      return;
    }
    setEnvios((prev) => ({
      ...prev,
      [atividadeId]: {
        ...prev[atividadeId],
        [alunoId]: {
          ...prev[atividadeId][alunoId],
          nota,
          feedback: feedbackEditando[alunoId] || '',
        },
      },
    }));
    mostrarToast('success', 'Nota salva com sucesso!');
  };

  const abrirPreview = (envio) => {
    setPreviewArquivo({ nome: envio.arquivo, tipo: envio.tipo, url: MOCK_PREVIEW_URL[envio.tipo] });
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="at-page">

      {/* Toast */}
      {toast && (
        <div className={`at-toast at-toast--${toast.tipo}`}>
          <i className={`bi ${toast.tipo === 'success' ? 'bi-check-circle-fill' : toast.tipo === 'danger' ? 'bi-trash3-fill' : 'bi-info-circle-fill'} me-2`}></i>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="at-header">
        <div>
          <h1 className="at-header__title">Atividades das Turmas</h1>
          <p className="at-header__sub">Gerencie trabalhos, exercícios e avaliações para suas turmas.</p>
        </div>
        <button className="btn btn-primary at-btn-new" onClick={abrirCriar}>
          <i className="bi bi-plus-lg me-2"></i>Nova Atividade
        </button>
      </header>

      <div className="at-layout">

        {/* Sidebar de turmas */}
        <aside className="at-sidebar">
          <p className="at-sidebar__label">MINHAS TURMAS</p>
          {turmas.map((t) => (
            <button
              key={t.id}
              className={`at-turma-item ${turmaSel?.id === t.id ? 'at-turma-item--ativo' : ''}`}
              onClick={() => { setTurmaSel(t); setBusca(''); setFiltroTipo(''); setFiltroStatus(''); }}
            >
              <div className="at-turma-item__nome">{t.nome}</div>
              <div className="at-turma-item__meta">
                <span>{t.semestre}</span>
                <span className="at-turma-item__badge">{(atividades[t.id] || []).length} ativ.</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Conteúdo principal */}
        <main className="at-main">

          {/* Stats */}
          <div className="at-stats">
            <div className="at-stat">
              <span className="at-stat__val">{stats.total}</span>
              <span className="at-stat__lbl">Total</span>
            </div>
            <div className="at-stat at-stat--open">
              <span className="at-stat__val">{stats.abertas}</span>
              <span className="at-stat__lbl">Abertas</span>
            </div>
            <div className="at-stat at-stat--closed">
              <span className="at-stat__val">{stats.encerradas}</span>
              <span className="at-stat__lbl">Encerradas</span>
            </div>
            <div className="at-stat__turma-info">
              <span className="at-stat__turma-nome">{turmaSel?.nome}</span>
              <span className="at-stat__turma-meta">{turmaSel?.codigo} · {turmaSel?.totalAlunos} alunos</span>
            </div>
          </div>

          {/* Filtros */}
          <div className="at-filters">
            <div className="at-search-wrap">
              <i className="bi bi-search at-search-icon"></i>
              <input
                className="at-search"
                placeholder="Buscar atividade…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button className="at-search-clear" onClick={() => setBusca('')}>
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
            <select className="at-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="at-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Qualquer status</option>
              <option value="aberta">Abertas</option>
              <option value="encerrada">Encerradas</option>
            </select>
          </div>

          {/* Lista */}
          {atividadesDaTurma.length === 0 ? (
            <div className="at-empty">
              <i className="bi bi-inbox at-empty__icon"></i>
              <p className="at-empty__msg">Nenhuma atividade encontrada.</p>
              <button className="btn btn-outline-primary" onClick={abrirCriar}>
                <i className="bi bi-plus-lg me-2"></i>Criar Primeira Atividade
              </button>
            </div>
          ) : (
            <div className="at-list">
              {atividadesDaTurma.map((ativ) => {
                const cfg     = TIPO_CONFIG[ativ.tipo] || TIPO_CONFIG['Outro'];
                const dias    = ativ.status === 'aberta' ? diasRestantes(ativ.prazo) : null;
                const urgente = dias !== null && dias <= 3;
                const vencida = dias !== null && dias < 0;

                const envsAtiv  = envios[ativ.id] || {};
                const qtdEnviou = Object.keys(envsAtiv).length;
                const qtdAval   = Object.values(envsAtiv).filter((e) => e.nota !== null).length;
                const qtdTotal  = alunosDaTurmaAtual.length;

                return (
                  <article
                    key={ativ.id}
                    className={`at-card ${ativ.status === 'encerrada' ? 'at-card--closed' : ''} ${urgente && !vencida ? 'at-card--urgent' : ''}`}
                  >
                    <div className={`at-card__stripe at-card__stripe--${cfg.cor}`}></div>

                    <div className="at-card__body">
                      <div className="at-card__top">
                        <div className="at-card__badges">
                          <span className={`badge at-badge--tipo ${cfg.badgeClass}`}>
                            <i className={`bi ${cfg.icone} me-1`}></i>{ativ.tipo}
                          </span>
                          {ativ.status === 'encerrada'
                            ? <span className="badge at-badge--status bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle">Encerrada</span>
                            : vencida
                              ? <span className="badge at-badge--status bg-danger-subtle text-danger-emphasis border border-danger-subtle"><i className="bi bi-exclamation-triangle-fill me-1"></i>Vencida</span>
                              : urgente
                                ? <span className="badge at-badge--status bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i className="bi bi-clock-fill me-1"></i>Urgente</span>
                                : <span className="badge at-badge--status bg-success-subtle text-success-emphasis border border-success-subtle">Aberta</span>
                          }
                        </div>

                        <div className="at-card__actions">
                          <button
                            className="at-action-btn at-action-btn--envios"
                            title="Ver envios e atribuir notas"
                            onClick={() => abrirEnvios(ativ)}
                          >
                            <i className="bi bi-people-fill"></i>
                            {qtdEnviou > 0 && <span className="at-action-badge">{qtdEnviou}</span>}
                          </button>
                          <button
                            className="at-action-btn at-action-btn--toggle"
                            title={ativ.status === 'aberta' ? 'Encerrar atividade' : 'Reabrir atividade'}
                            onClick={() => alternarStatus(ativ)}
                          >
                            <i className={`bi ${ativ.status === 'aberta' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                          </button>
                          <button className="at-action-btn at-action-btn--edit" title="Editar" onClick={() => abrirEditar(ativ)}>
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="at-action-btn at-action-btn--delete" title="Excluir" onClick={() => confirmarDelete(ativ)}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </div>

                      <h3 className="at-card__titulo">{ativ.titulo}</h3>
                      <p className="at-card__desc">{ativ.descricao}</p>

                      <div className="at-card__footer">
                        <span className="at-card__meta">
                          <i className="bi bi-calendar-event me-1"></i>
                          Prazo: <strong>{formatarData(ativ.prazo)}</strong>
                        </span>
                        {dias !== null && (
                          <span className={`at-card__meta ${vencida ? 'text-danger' : urgente ? 'text-warning' : 'text-muted'}`}>
                            {vencida
                              ? `Venceu há ${Math.abs(dias)} dia(s)`
                              : dias === 0
                                ? 'Vence hoje!'
                                : `${dias} dia(s) restante(s)`}
                          </span>
                        )}
                        <span className="at-card__meta">
                          <i className="bi bi-trophy-fill me-1 text-warning"></i>
                          {ativ.pontuacao} pts
                        </span>
                        <button className="at-card__envios-btn" onClick={() => abrirEnvios(ativ)}>
                          <i className="bi bi-people-fill me-1"></i>
                          {qtdEnviou}/{qtdTotal} enviaram · {qtdAval} avaliado{qtdAval !== 1 ? 's' : ''}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ══ Modal: Criar / Editar Atividade ══════════════════════════════════ */}
      {modalAberto && (
        <div className="at-modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharModal()}>
          <div className="at-modal" role="dialog" aria-modal="true">
            <div className="at-modal__header">
              <div>
                <h2 className="at-modal__title">{modoEdicao ? 'Editar Atividade' : 'Nova Atividade'}</h2>
                <p className="at-modal__sub">{turmaSel?.nome}</p>
              </div>
              <button className="at-modal__close" onClick={fecharModal} aria-label="Fechar">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="at-modal__body">
              <div className="at-field">
                <label className="at-label" htmlFor="at-titulo">Título *</label>
                <input
                  id="at-titulo"
                  className={`at-input ${erros.titulo ? 'at-input--erro' : ''}`}
                  placeholder="Ex: Trabalho sobre Padrões de Projeto"
                  value={form.titulo}
                  onChange={(e) => onChange('titulo', e.target.value)}
                  maxLength={120}
                />
                {erros.titulo && <span className="at-error">{erros.titulo}</span>}
                <span className="at-char-count">{form.titulo.length}/120</span>
              </div>

              <div className="at-row-3">
                <div className="at-field">
                  <label className="at-label" htmlFor="at-tipo">Tipo *</label>
                  <select id="at-tipo" className="at-input" value={form.tipo} onChange={(e) => onChange('tipo', e.target.value)}>
                    {TIPOS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="at-field">
                  <label className="at-label" htmlFor="at-pontuacao">Pontuação *</label>
                  <input
                    id="at-pontuacao"
                    type="number"
                    min={1}
                    max={100}
                    className={`at-input ${erros.pontuacao ? 'at-input--erro' : ''}`}
                    value={form.pontuacao}
                    onChange={(e) => onChange('pontuacao', Number(e.target.value))}
                  />
                  {erros.pontuacao && <span className="at-error">{erros.pontuacao}</span>}
                </div>
                <div className="at-field">
                  <label className="at-label" htmlFor="at-prazo">Prazo de Entrega *</label>
                  <input
                    id="at-prazo"
                    type="date"
                    className={`at-input ${erros.prazo ? 'at-input--erro' : ''}`}
                    value={form.prazo}
                    onChange={(e) => onChange('prazo', e.target.value)}
                  />
                  {erros.prazo && <span className="at-error">{erros.prazo}</span>}
                </div>
              </div>

              <div className="at-field">
                <label className="at-label" htmlFor="at-desc">Descrição / Instruções *</label>
                <textarea
                  id="at-desc"
                  rows={5}
                  className={`at-input at-textarea ${erros.descricao ? 'at-input--erro' : ''}`}
                  placeholder="Descreva os objetivos, critérios de avaliação, formato de entrega…"
                  value={form.descricao}
                  onChange={(e) => onChange('descricao', e.target.value)}
                />
                {erros.descricao && <span className="at-error">{erros.descricao}</span>}
              </div>

              <div className="at-field">
                <label className="at-label">Status</label>
                <div className="at-status-toggle">
                  {['aberta', 'encerrada'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`at-status-btn ${form.status === s ? `at-status-btn--${s}` : ''}`}
                      onClick={() => onChange('status', s)}
                    >
                      <i className={`bi ${s === 'aberta' ? 'bi-unlock-fill' : 'bi-lock-fill'} me-2`}></i>
                      {s === 'aberta' ? 'Aberta (visível aos alunos)' : 'Encerrada'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="at-modal__footer">
              <button className="btn btn-outline-secondary px-4" onClick={fecharModal}>Cancelar</button>
              <button className="btn btn-primary px-5" onClick={salvar}>
                <i className={`bi ${modoEdicao ? 'bi-check2-circle' : 'bi-plus-lg'} me-2`}></i>
                {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Atividade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Confirmar Exclusão ═════════════════════════════════════════ */}
      {confirmDelete && (
        <div className="at-modal-overlay">
          <div className="at-modal at-modal--sm" role="alertdialog" aria-modal="true">
            <div className="at-confirm__icon">
              <i className="bi bi-exclamation-triangle-fill text-danger"></i>
            </div>
            <h3 className="at-confirm__title">Excluir Atividade?</h3>
            <p className="at-confirm__msg">
              Tem certeza que deseja excluir <strong>"{confirmDelete.titulo}"</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="at-confirm__actions">
              <button className="btn btn-outline-secondary px-4" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger px-4" onClick={executarDelete}>
                <i className="bi bi-trash3-fill me-2"></i>Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Envios e Notas ═════════════════════════════════════════════ */}
      {modalEnvios && !previewArquivo && (
        <div className="at-modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharEnvios()}>
          <div className="at-modal at-modal--wide" role="dialog" aria-modal="true">

            <div className="at-modal__header">
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 className="at-modal__title">
                  <i className="bi bi-people-fill me-2"></i>Envios da Atividade
                </h2>
                <p className="at-modal__sub at-modal__sub--truncate" title={modalEnvios.titulo}>
                  {modalEnvios.titulo}
                </p>
              </div>
              <button className="at-modal__close" onClick={fecharEnvios} aria-label="Fechar">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Mini dashboard de envios */}
            <div className="at-envios-resumo">
              <div className="at-envios-stat">
                <span className="at-envios-stat__val">{resumoEnvios.total}</span>
                <span className="at-envios-stat__lbl">Alunos</span>
              </div>
              <div className="at-envios-stat at-envios-stat--sent">
                <span className="at-envios-stat__val">{resumoEnvios.enviaram}</span>
                <span className="at-envios-stat__lbl">Enviaram</span>
              </div>
              <div className="at-envios-stat at-envios-stat--pending">
                <span className="at-envios-stat__val">{resumoEnvios.total - resumoEnvios.enviaram}</span>
                <span className="at-envios-stat__lbl">Pendentes</span>
              </div>
              <div className="at-envios-stat at-envios-stat--graded">
                <span className="at-envios-stat__val">{resumoEnvios.avaliados}</span>
                <span className="at-envios-stat__lbl">Avaliados</span>
              </div>
              <div className="at-envios-stat at-envios-stat--max">
                <span className="at-envios-stat__val">{modalEnvios.pontuacao} pts</span>
                <span className="at-envios-stat__lbl">Pontuação máx.</span>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="at-envios-progress-wrap">
              <div className="at-envios-progress">
                {resumoEnvios.total > 0 && (
                  <>
                    <div
                      className="at-envios-progress__bar at-envios-progress__bar--graded"
                      style={{ width: `${(resumoEnvios.avaliados / resumoEnvios.total) * 100}%` }}
                    ></div>
                    <div
                      className="at-envios-progress__bar at-envios-progress__bar--sent"
                      style={{ width: `${((resumoEnvios.enviaram - resumoEnvios.avaliados) / resumoEnvios.total) * 100}%` }}
                    ></div>
                  </>
                )}
              </div>
              <span className="at-envios-progress__label">
                {resumoEnvios.total > 0
                  ? `${Math.round((resumoEnvios.avaliados / resumoEnvios.total) * 100)}% avaliados`
                  : '—'}
              </span>
            </div>

            {/* Tabs filtro */}
            <div className="at-envios-filtros">
              {[
                { v: 'todos',     l: 'Todos' },
                { v: 'enviaram',  l: `Enviaram (${resumoEnvios.enviaram})` },
                { v: 'pendentes', l: `Pendentes (${(resumoEnvios.total || 0) - (resumoEnvios.enviaram || 0)})` },
                { v: 'avaliados', l: `Avaliados (${resumoEnvios.avaliados})` },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  className={`at-envios-tab ${filtroEnvio === v ? 'at-envios-tab--ativo' : ''}`}
                  onClick={() => setFiltroEnvio(v)}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Lista de alunos */}
            <div className="at-modal__body at-envios-body">
              {alunosComEnvio.length === 0 ? (
                <div className="at-empty" style={{ padding: '2rem' }}>
                  <i className="bi bi-inbox at-empty__icon"></i>
                  <p className="at-empty__msg">Nenhum aluno nesta categoria.</p>
                </div>
              ) : (
                <div className="at-envios-lista">
                  {alunosComEnvio.map((aluno) => {
                    const temEnvio = !!aluno.envio;
                    const avaliado = temEnvio && aluno.envio.nota !== null;
                    const notaVal  = notaEditando[aluno.id] !== undefined
                      ? notaEditando[aluno.id]
                      : (avaliado ? String(aluno.envio.nota) : '');
                    const feedVal  = feedbackEditando[aluno.id] !== undefined
                      ? feedbackEditando[aluno.id]
                      : (temEnvio ? aluno.envio.feedback : '');
                    const notaNum  = parseFloat(notaVal);
                    const reprovado = !isNaN(notaNum) && notaNum < (modalEnvios.pontuacao * 0.6);

                    return (
                      <div key={aluno.id} className={`at-envio-row ${!temEnvio ? 'at-envio-row--pendente' : ''} ${avaliado ? 'at-envio-row--avaliado' : ''}`}>

                        {/* Avatar + nome */}
                        <div className="at-envio-aluno">
                          <div className={`at-avatar ${avaliado ? (reprovado ? 'at-avatar--rep' : 'at-avatar--ok') : ''}`}>
                            {aluno.avatar}
                          </div>
                          <div>
                            <div className="at-envio-aluno__nome">{aluno.nome}</div>
                            <div className="at-envio-aluno__mat">{aluno.matricula}</div>
                          </div>
                        </div>

                        {/* Arquivo + data */}
                        <div className="at-envio-arquivo">
                          {temEnvio ? (
                            <>
                              <button
                                className="at-arquivo-btn"
                                onClick={() => abrirPreview(aluno.envio)}
                                title="Visualizar envio"
                              >
                                <i className={`bi ${aluno.envio.tipo === 'pdf' ? 'bi-file-earmark-pdf-fill' : 'bi-file-earmark-image-fill'} me-1`}></i>
                                <span className="at-arquivo-nome">{aluno.envio.arquivo}</span>
                                <i className="bi bi-box-arrow-up-right ms-2 at-arquivo-eye"></i>
                              </button>
                              <span className="at-envio-data">
                                <i className="bi bi-clock me-1"></i>
                                {formatarDataHora(aluno.envio.enviadoEm)}
                              </span>
                            </>
                          ) : (
                            <span className="at-envio-sem-envio">
                              <i className="bi bi-dash-circle me-1"></i>Não enviou
                            </span>
                          )}
                        </div>

                        {/* Nota + feedback + salvar */}
                        {temEnvio ? (
                          <div className="at-envio-nota-area">
                            <div className="at-nota-wrap">
                              <div className="at-nota-input-wrap">
                                <input
                                  type="number"
                                  step="0.5"
                                  min={0}
                                  max={modalEnvios.pontuacao}
                                  className={`at-nota-input ${avaliado && !reprovado ? 'at-nota-input--ok' : ''} ${reprovado ? 'at-nota-input--rep' : ''}`}
                                  placeholder="—"
                                  value={notaVal}
                                  onChange={(e) => setNotaEditando((p) => ({ ...p, [aluno.id]: e.target.value }))}
                                />
                                <span className="at-nota-max">/{modalEnvios.pontuacao}</span>
                              </div>
                              <button
                                className="at-salvar-nota-btn"
                                onClick={() => salvarNota(modalEnvios.id, aluno.id)}
                                title="Salvar nota"
                              >
                                <i className="bi bi-check2-circle me-1"></i>Salvar
                              </button>
                            </div>
                            <input
                              type="text"
                              className="at-feedback-input"
                              placeholder="Feedback para o aluno (opcional)…"
                              value={feedVal}
                              onChange={(e) => setFeedbackEditando((p) => ({ ...p, [aluno.id]: e.target.value }))}
                            />
                          </div>
                        ) : (
                          <div className="at-envio-nota-area at-envio-nota-area--disabled">
                            <span className="at-sem-envio-nota">Aguardando envio</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="at-modal__footer">
              <button className="btn btn-outline-secondary px-4" onClick={fecharEnvios}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Preview de Arquivo ═════════════════════════════════════════ */}
      {previewArquivo && (
        <div className="at-modal-overlay" onClick={(e) => e.target === e.currentTarget && setPreviewArquivo(null)}>
          <div className="at-preview-modal" role="dialog" aria-modal="true">

            <div className="at-preview-header">
              <div className="at-preview-header__info">
                <i
                  className={`bi ${previewArquivo.tipo === 'pdf' ? 'bi-file-earmark-pdf-fill' : 'bi-file-earmark-image-fill'} me-2`}
                  style={{ fontSize: '1.2rem' }}
                ></i>
                <span className="at-preview-header__nome">{previewArquivo.nome}</span>
              </div>
              <div className="at-preview-header__actions">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setPreviewArquivo(null)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Voltar aos envios
                </button>
                <a
                  href={previewArquivo.url}
                  download={previewArquivo.nome}
                  className="btn btn-sm btn-outline-primary ms-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-download me-1"></i>Baixar
                </a>
                <button className="at-modal__close ms-2" onClick={fecharEnvios} aria-label="Fechar">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="at-preview-body">
              {previewArquivo.tipo === 'pdf' ? (
                <iframe
                  src={previewArquivo.url}
                  title="Visualização do envio"
                  className="at-preview-iframe"
                />
              ) : (
                <div className="at-preview-img-wrap">
                  <img src={previewArquivo.url} alt="Envio do aluno" className="at-preview-img" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
