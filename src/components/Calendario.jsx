import React, { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Modal } from 'bootstrap';

import api from '../api';
import { useAuth } from './AuthContext';

import './Calendario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Calendario() {
  const { user } = useAuth();
  const idPerfil = user?.usuario?.idPerfil;
  const canManageCalendar = idPerfil === 3;

  const TIPOS_EVENTO = useMemo(
    () => [
      {
        id: 1,
        key: 'Seminario',
        nome: 'Seminário',
        legenda: 'Seminário',
        opcaoCriacao: 'Seminário Aberto'
      },
      {
        id: 2,
        key: 'Workshop',
        nome: 'Workshop',
        legenda: 'Workshop',
        opcaoCriacao: 'Workshop Institucional'
      },
      {
        id: 3,
        key: 'Disciplina',
        nome: 'Disciplina',
        legenda: 'Disciplina',
        opcaoCriacao: 'Evento de Disciplina (Provas, Entregas)'
      }
    ],
    []
  );

  const CORES_EVENTO = {
    Seminario: '#6f42c1',
    Workshop: '#198754',
    Disciplina: '#0d6efd',
    Outro: '#6c757d'
  };

  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [disciplinasDoProfessor, setDisciplinasDoProfessor] = useState([]);

  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [novoEvento, setNovoEvento] = useState({
    titulo: '',
    dataInicio: '',
    descricao: '',
    tipo: 3,
    disciplinaId: ''
  });

  const modalViewRef = useRef(null);
  const modalCreateRef = useRef(null);

  const obterMetaTipo = (tipo) => {
    const tipoNumero = Number(tipo);
    if (!Number.isNaN(tipoNumero) && tipoNumero > 0) {
      return TIPOS_EVENTO.find((item) => item.id === tipoNumero) || null;
    }

    const tipoString = String(tipo || '').trim().toLowerCase();
    const normalizado = tipoString
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    if (normalizado.includes('seminario')) {
      return TIPOS_EVENTO.find((item) => item.key === 'Seminario') || null;
    }
    if (normalizado.includes('workshop')) {
      return TIPOS_EVENTO.find((item) => item.key === 'Workshop') || null;
    }
    if (normalizado.includes('disciplina')) {
      return TIPOS_EVENTO.find((item) => item.key === 'Disciplina') || null;
    }

    return null;
  };

  const formatarEventoDaApi = (eventoApi) => {
    const meta = obterMetaTipo(eventoApi?.extendedProps?.tipo);
    return {
      id: eventoApi.id,
      title: eventoApi.title,
      start: eventoApi.start,
      color: CORES_EVENTO[meta?.key] || CORES_EVENTO.Outro,
      extendedProps: eventoApi.extendedProps || {}
    };
  };

  const buscarEventos = async () => {
    setIsLoadingEventos(true);
    try {
      const response = await api.get('/Eventos');
      setEventos((response.data || []).map(formatarEventoDaApi));
    } catch (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
    } finally {
      setIsLoadingEventos(false);
    }
  };

  const buscarTurmasProfessor = async () => {
    if (!canManageCalendar) {
      setDisciplinasDoProfessor([]);
      return;
    }

    setIsLoadingTurmas(true);
    try {
      const response = await api.get('/turmas/professor');
      const disciplinasFormatadas = (response.data || []).map((turma) => ({
        id: turma.id,
        nome: `${turma.nomeTurma} - ${turma.disciplinaNome}`
      }));
      setDisciplinasDoProfessor(disciplinasFormatadas);
    } catch (error) {
      console.error('Erro ao buscar turmas do professor:', error);
      setDisciplinasDoProfessor([]);
    } finally {
      setIsLoadingTurmas(false);
    }
  };

  useEffect(() => {
    buscarEventos();
    buscarTurmasProfessor();
  }, [canManageCalendar]);

  const formatarDataParaInput = (dateStr) => {
    if (!dateStr) {
      return '';
    }
    return dateStr.includes('T') ? dateStr.substring(0, 16) : `${dateStr}T08:00`;
  };

  const resetarFormulario = (dateStr = '') => {
    setNovoEvento({
      titulo: '',
      dataInicio: formatarDataParaInput(dateStr),
      descricao: '',
      tipo: 3,
      disciplinaId: ''
    });
  };

  const handleEventClick = (info) => {
    const meta = obterMetaTipo(info.event.extendedProps.tipo);

    setEventoSelecionado({
      titulo: info.event.title,
      inicio: info.event.start?.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      tipoNome: meta?.nome || 'Outro',
      ...info.event.extendedProps
    });

    Modal.getOrCreateInstance(modalViewRef.current).show();
  };

  const handleDateClick = (info) => {
    if (!canManageCalendar) {
      return;
    }

    resetarFormulario(info.dateStr);
    Modal.getOrCreateInstance(modalCreateRef.current).show();
  };

  const handleCriarEvento = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      titulo: novoEvento.titulo,
      dataInicio: novoEvento.dataInicio,
      descricao: novoEvento.descricao,
      tipo: Number(novoEvento.tipo),
      disciplinaId: Number(novoEvento.tipo) === 3 ? Number(novoEvento.disciplinaId) : null
    };

    try {
      await api.post('/Eventos', payload);
      Modal.getOrCreateInstance(modalCreateRef.current).hide();
      await buscarEventos();
      alert('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar o evento. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>{canManageCalendar ? 'Gestão do Calendário' : 'Calendário Acadêmico'}</h2>

        <div className="d-flex gap-3 small fw-semibold">
          {TIPOS_EVENTO.map((tipo) => (
            <span key={tipo.id} className="d-flex align-items-center gap-1">
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: CORES_EVENTO[tipo.key],
                  borderRadius: '50%'
                }}
              ></span>
              {tipo.legenda}
            </span>
          ))}
        </div>
      </div>

      {canManageCalendar && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body bg-light text-muted small rounded">
            <i className="bi bi-info-circle-fill me-2 text-primary"></i>
            Dica: Clique em qualquer dia ou horário livre no calendário para agendar um novo evento.
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 position-relative">
              
              {isLoadingEventos && (
                <div className="position-absolute top-50 start-50 translate-middle z-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando calendário...</span>
                  </div>
                </div>
              )}

              <div style={{ opacity: isLoadingEventos ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin]}
                  themeSystem="bootstrap5"
                  locales={[ptBrLocale]}
                  locale="pt-br"
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                  }}
                  events={eventos}
                  eventClick={handleEventClick}
                  dateClick={canManageCalendar ? handleDateClick : undefined}
                  selectable={canManageCalendar}
                  dayMaxEvents={true}
                  height="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalEvento" tabIndex="-1" aria-hidden="true" ref={modalViewRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark border-bottom-0">
              <h5 className="modal-title fw-bold">
                <span className="badge bg-secondary me-2">{eventoSelecionado?.tipoNome}</span>
                <div className="light-grey">{eventoSelecionado?.titulo}</div>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="text-muted small d-block">Data e Hora</label>
                  <span className="fw-semibold">📅 {eventoSelecionado?.inicio}</span>
                </div>
                
                {eventoSelecionado?.professor && (
                  <div className="col-12 border-top pt-2">
                    <label className="text-muted small d-block">Professor Responsável</label>
                    <span className="fw-semibold">👤 {eventoSelecionado.professor}</span>
                  </div>
                )}

                {eventoSelecionado?.descricao && (
                  <div className="col-12 border-top pt-2">
                    <div className="p-3 bg-light rounded border-start border-primary border-4">
                      <label className="text-muted small d-block mb-1">Descrição</label>
                      <p className="mb-0 small">{eventoSelecionado.descricao}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary btn-sm px-4" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      {canManageCalendar && (
        <div className="modal fade" id="modalCriarEvento" tabIndex="-1" ref={modalCreateRef}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleCriarEvento}>
                <div className="modal-header border-bottom-0">
                  <h5 className="modal-title fw-bold">Agendar Novo Evento</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="modal-body py-0">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Título do Evento *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        maxLength="100"
                        placeholder="Ex: Prova P1, Seminário de IA..."
                        value={novoEvento.titulo}
                        onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Data e Hora *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={novoEvento.dataInicio}
                        onChange={(e) => setNovoEvento({ ...novoEvento, dataInicio: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Tipo de Evento *</label>
                      <select
                        className="form-select"
                        value={novoEvento.tipo}
                        onChange={(e) => setNovoEvento({ ...novoEvento, tipo: Number(e.target.value), disciplinaId: '' })}
                      >
                        {TIPOS_EVENTO.map((tipo) => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.opcaoCriacao}
                          </option>
                        ))}
                      </select>
                    </div>

                    {Number(novoEvento.tipo) === 3 && (
                      <div className="col-12 border-start border-primary border-3 ms-2 ps-3 py-2 bg-light rounded">
                        <label className="form-label fw-semibold small text-primary">Vincular a qual disciplina? *</label>
                        <select
                          className="form-select"
                          required
                          disabled={isLoadingTurmas}
                          value={novoEvento.disciplinaId}
                          onChange={(e) => setNovoEvento({ ...novoEvento, disciplinaId: e.target.value })}
                        >
                          <option value="">Selecione uma disciplina...</option>
                          {disciplinasDoProfessor.map((disciplina) => (
                            <option key={disciplina.id} value={disciplina.id}>
                              {disciplina.nome}
                            </option>
                          ))}
                        </select>
                        <div className="form-text small">Apenas alunos matriculados nesta disciplina verão este evento.</div>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Instruções / Descrição</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        maxLength="500"
                        placeholder="Orientações adicionais para os alunos..."
                        value={novoEvento.descricao}
                        onChange={(e) => setNovoEvento({ ...novoEvento, descricao: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 mt-3">
                  <button type="button" className="btn btn-light" data-bs-dismiss="modal" disabled={isSubmitting}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Salvando...
                      </>
                    ) : (
                      'Confirmar Agendamento'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}