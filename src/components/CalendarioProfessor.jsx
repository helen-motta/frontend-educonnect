import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Essencial para o clique em datas
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Modal } from 'bootstrap'; 

import api from '../api'; 

import './Calendario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CalendarioProfessor() {
  // --- ESTADOS DO CALENDÁRIO E EVENTOS ---
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ESTADOS DO FORMULÁRIO DE CRIAÇÃO ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: '',
    dataInicio: '',
    descricao: '',
    tipo: 3, // Começa como 3 (Disciplina) por padrão
    disciplinaId: ''
  });

  // Disciplinas do professor carregadas da API
  const [disciplinasDoProfessor, setDisciplinasDoProfessor] = useState([]);

  const buscarTurmas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/turmas/professor'); 
      console.log("Turmas do professor:", response.data);
      
      // Mapeia os dados da API para o formato esperado pelo componente
      const disciplinasFormatadas = response.data.map(turma => ({
        id: turma.id,
        nome: `${turma.nomeTurma} - ${turma.disciplinaNome}`,
        horariosFormatados: turma.horariosFormatados || [],
        quantidadeInscritos: turma.quantidadeInscritos,
        vagas: turma.vagas
      }));
      
      setDisciplinasDoProfessor(disciplinasFormatadas);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setDisciplinasDoProfessor([]);
    } finally {
      setIsLoading(false);
    }
  };

  const modalViewRef = useRef(null);
  const modalCreateRef = useRef(null);

  // --- FUNÇÕES AUXILIARES (Cores e Nomes) ---
  const definirCorDoEvento = (tipo) => {
    switch (tipo) {
      case 'Seminario': return '#6f42c1'; 
      case 'Workshop': return '#198754'; 
      case 'Disciplina': return '#0d6efd';
      default: return '#6c757d';
    }
  };

  const definirNomeDoTipo = (tipo) => {
    switch (Number(tipo)) {
      case 1: return 'Seminário';
      case 2: return 'Workshop';
      case 3: return 'Disciplina';
      default: return 'Outro';
    }
  };

  // --- BUSCAR EVENTOS ---
  const buscarEventos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/Eventos');
      console.log("Eventos recebidos da API:", response.data);
      const eventosFormatados = response.data.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        color: definirCorDoEvento(ev.extendedProps.tipo),
        extendedProps: ev.extendedProps
      }));
      setEventos(eventosFormatados);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    buscarEventos();
    buscarTurmas();
  }, []);

  // --- INTERAÇÕES DO USUÁRIO ---
  
  // 1. Professor clicou em um evento existente (Abre modal de visualização)
  const handleEventClick = (info) => {
    console.log("Evento clicado:", info.event);
    setEventoSelecionado({
      titulo: info.event.title,
      inicio: info.event.start.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      tipoNome: info.event.extendedProps.tipo,
      ...info.event.extendedProps
    });
    const modal = new Modal(modalViewRef.current);
    modal.show();
  };

  // 2. Professor clicou em um dia vazio no calendário (Abre modal de criação)
  const handleDateClick = (info) => {
    // Pega a data clicada e formata para o input do tipo datetime-local (YYYY-MM-DDTHH:mm)
    // Se clicou na visualização mensal, adiciona uma hora padrão (ex: 08:00)
    const dataFormatada = info.dateStr.includes('T') ? info.dateStr.substring(0, 16) : `${info.dateStr}T08:00`;

    
    setNovoEvento({
      titulo: '',
      dataInicio: dataFormatada,
      descricao: '',
      tipo: 3, 
      disciplinaId: ''
    });

    const modal = new Modal(modalCreateRef.current);
    modal.show();
  };

  const handleCriarEvento = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      titulo: novoEvento.titulo,
      dataInicio: novoEvento.dataInicio,
      descricao: novoEvento.descricao,
      tipo: Number(novoEvento.tipo),
      disciplinaId: Number(novoEvento.tipo) === 3 ? Number(novoEvento.disciplinaId) : null
    };

    console.log("Payload para criação do evento:", payload);

    try {
      await api.post('/Eventos', payload);
      
      const modal = Modal.getInstance(modalCreateRef.current);
      modal.hide();
      
      buscarEventos();
      
      alert("Evento criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      alert("Erro ao criar o evento. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>Gestão do Calendário</h2>
        
        <div className="d-flex gap-3 small fw-semibold">
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#0d6efd', borderRadius: '50%'}}></span> Disciplina
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#6f42c1', borderRadius: '50%'}}></span> Seminário
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#198754', borderRadius: '50%'}}></span> Workshop
          </span>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body bg-light text-muted small rounded">
          <i className="bi bi-info-circle-fill me-2 text-primary"></i>
          Dica: Clique em qualquer dia ou horário livre no calendário abaixo para agendar um novo evento.
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 position-relative">
              {isLoading && (
                <div className="position-absolute top-50 start-50 translate-middle z-3">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div>
                </div>
              )}

              <div style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
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
                  dateClick={handleDateClick} // <-- Habilita o clique em datas vazias
                  selectable={true}
                  dayMaxEvents={true}
                  height="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: VISUALIZAR EVENTO EXISTENTE (Igual ao do aluno) */}
      <div className="modal fade" id="modalViewEvento" tabIndex="-1" ref={modalViewRef}>
         {/* ... (Mesmo código do modal de visualização do aluno) ... */}
         <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-light border-bottom-0">
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

      {/* MODAL 2: CRIAR NOVO EVENTO (Específico do Professor) */}
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
                  
                  {/* Título */}
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Título do Evento *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      maxLength="100"
                      placeholder="Ex: Prova P1, Seminário de IA..."
                      value={novoEvento.titulo}
                      onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})}
                    />
                  </div>

                  {/* Data e Hora */}
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Data e Hora *</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      required 
                      value={novoEvento.dataInicio}
                      onChange={e => setNovoEvento({...novoEvento, dataInicio: e.target.value})}
                    />
                  </div>

                  {/* Tipo de Evento */}
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Tipo de Evento *</label>
                    <select 
                      className="form-select" 
                      value={novoEvento.tipo}
                      onChange={e => setNovoEvento({...novoEvento, tipo: Number(e.target.value)})}
                    >
                      <option value={3}>Evento de Disciplina (Provas, Entregas)</option>
                      <option value={1}>Seminário Aberto</option>
                      <option value={2}>Workshop Institucional</option>
                    </select>
                  </div>

                  {/* Disciplina (Aparece SÓ SE o tipo for 3) */}
                  {novoEvento.tipo === 3 && (
                    <div className="col-12 border-start border-primary border-3 ms-2 ps-3 py-2 bg-light rounded">
                      <label className="form-label fw-semibold small text-primary">Vincular a qual disciplina? *</label>
                      <select 
                        className="form-select" 
                        required 
                        value={novoEvento.disciplinaId}
                        onChange={e => setNovoEvento({...novoEvento, disciplinaId: e.target.value})}
                      >
                        <option value="">Selecione uma disciplina...</option>
                        {disciplinasDoProfessor.map(disc => (
                          <option key={disc.id} value={disc.id}>{disc.nome}</option>
                        ))}
                      </select>
                      <div className="form-text small">Apenas alunos matriculados nesta disciplina verão este evento.</div>
                    </div>
                  )}

                  {/* Descrição */}
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Instruções / Descrição</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      maxLength="500"
                      placeholder="Orientações adicionais para os alunos..."
                      value={novoEvento.descricao}
                      onChange={e => setNovoEvento({...novoEvento, descricao: e.target.value})}
                    ></textarea>
                  </div>

                </div>
              </div>
              
              <div className="modal-footer border-0 mt-3">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Salvando...</>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}