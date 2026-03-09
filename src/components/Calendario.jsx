import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Modal } from 'bootstrap'; 

import api from '../api'; 

import './Calendario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CalendarioAluno() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const modalRef = useRef(null);

  const definirCorDoEvento = (tipo) => {
    switch (tipo) {
      case 'Seminario': return '#6f42c1'; // Seminário
      case 'Workshop': return '#198754'; // Workshop
      case 'Disciplina': return '#0d6efd'; // Disciplina
      default: return '#6c757d'; // Cinza (Fallback)
    }
  };

  const definirNomeDoTipo = (tipo) => {
    switch (tipo) {
      case 1: return 'Seminário';
      case 2: return 'Workshop';
      case 3: return 'Disciplina';
      default: return 'Outro';
    }
  };

  useEffect(() => {
    const buscarEventos = async () => {
      try {
        const response = await api.get('/Eventos'); 
        
        const eventosFormatados = response.data.map(ev => ({
          id: ev.id,
          title: ev.title,
          start: ev.start,
          color: definirCorDoEvento(ev.extendedProps.tipo),
          extendedProps: ev.extendedProps
        }));

        setEventos(eventosFormatados);
      } catch (error) {
        console.error("Erro ao buscar eventos do calendário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    buscarEventos();
  }, []);

  const handleEventClick = (info) => {
    setEventoSelecionado({
      titulo: info.event.title,
      inicio: info.event.start.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      tipoNome: definirNomeDoTipo(info.event.extendedProps.tipo),
      ...info.event.extendedProps
    });
    
    const modalElement = modalRef.current;
    const bootstrapModal = new Modal(modalElement);
    bootstrapModal.show();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Calendário Acadêmico</h2>
        
        {/* LEGENDA DE CORES PARA O ALUNO */}
        <div className="d-flex gap-3 small fw-semibold">
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#0d6efd', borderRadius: '50%'}}></span>
            Disciplina
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#6f42c1', borderRadius: '50%'}}></span>
            Seminário
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{width: '12px', height: '12px', backgroundColor: '#198754', borderRadius: '50%'}}></span>
            Workshop
          </span>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 position-relative">
              
              {/* Spinner de Loading enquanto busca na API */}
              {isLoading && (
                <div className="position-absolute top-50 start-50 translate-middle z-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando calendário...</span>
                  </div>
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
                  dayMaxEvents={true}
                  height="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalEvento" tabIndex="-1" aria-hidden="true" ref={modalRef}>
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
                
                {/* Mostra o professor apenas se a API retornar esse dado */}
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
    </>
  );
}