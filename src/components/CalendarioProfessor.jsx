import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // O plugin de interação
import { Modal, Button, Form } from 'react-bootstrap'; // Usaremos o Modal do Bootstrap
import './CalendarioProfessor.css'; // Um CSS customizado para as cores

// --- MOCK DE DADOS (Simula o que viria do Banco de Dados) ---

// 1. As turmas do professor (para o <select>)
const MOCK_TURMAS_PROF = [
  { id: 't1', nome: 'Cálculo I - Turma A' },
  { id: 't2', nome: 'Física II - Turma B' },
];

// 2. Os tipos de evento (para o <select>)
const EVENT_TIPOS = [
  { id: 'prova', nome: 'Prova', cor: 'danger' },
  { id: 'trabalho', nome: 'Trabalho / Entrega', cor: 'warning' },
  { id: 'aula', nome: 'Aula Especial / Revisão', cor: 'info' },
  { id: 'outro', nome: 'Outro', cor: 'secondary' },
];

// 3. Os eventos iniciais
const MOCK_EVENTS_INICIAIS = [
  {
    id: '1',
    title: 'P1 de Cálculo I',
    start: '2025-11-20T19:00:00', // Assumindo data atual 13/11
    end: '2025-11-20T21:00:00',
    allDay: false,
    extendedProps: {
      turmaId: 't1',
      tipo: 'prova',
    },
    className: 'fc-event-danger' // Cor
  },
  {
    id: '2',
    title: 'Prazo: Entrega Trabalho 1 (Física)',
    start: '2025-11-22',
    allDay: true,
    extendedProps: {
      turmaId: 't2',
      tipo: 'trabalho',
    },
    className: 'fc-event-warning text-dark' // Cor
  }
];
// -----------------------------------------------------------------

export default function CalendarioProfessor() {

  // State para os eventos do calendário
  const [currentEvents, setCurrentEvents] = useState(MOCK_EVENTS_INICIAIS);
  
  // States para controlar o Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State para o formulário do evento
  const [formData, setFormData] = useState({});

  /**
   * Helper para fechar o modal e resetar o formulário
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({}); // Limpa o formulário
  };

  /**
   * Ação: Clicar em uma data (ou arrastar) para CRIAR um novo evento
   */
  const handleDateSelect = (selectInfo) => {
    setFormData({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setIsEditing(false); // Estamos criando, não editando
    setShowModal(true);
  };

  /**
   * Ação: Clicar em um evento existente para EDITAR
   */
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setFormData({
      id: event.id,
      title: event.title,
      start: event.startStr.slice(0, 16), // Formata para 'yyyy-MM-ddTHH:mm'
      end: event.endStr.slice(0, 16),
      allDay: event.allDay,
      turmaId: event.extendedProps.turmaId || '',
      tipo: event.extendedProps.tipo || 'outro',
    });
    setIsEditing(true); // Estamos editando
    setShowModal(true);
  };

  /**
   * Ação: Salvar o formulário (Criação ou Edição)
   */
  const handleModalSave = (e) => {
    e.preventDefault();

    const { id, title, start, end, allDay, turmaId, tipo } = formData;
    
    if (!title || !turmaId || !tipo) {
      alert('Por favor, preencha o Título, Turma e Tipo.');
      return;
    }

    const tipoInfo = EVENT_TIPOS.find(t => t.id === tipo);
    const eventData = {
      id: id || `e${Date.now()}`, // Cria novo ID se não existir
      title,
      start,
      end: allDay ? null : end, // Se for 'allDay', não precisa de 'end'
      allDay,
      extendedProps: { turmaId, tipo },
      className: `fc-event-${tipoInfo.cor}${tipo === 'warning' ? ' text-dark' : ''}`
    };

    if (isEditing) {
      // Lógica de ATUALIZAR
      setCurrentEvents(currentEvents.map(ev => ev.id === id ? eventData : ev));
    } else {
      // Lógica de CRIAR
      setCurrentEvents([...currentEvents, eventData]);
    }
    
    handleCloseModal();
  };

  /**
   * Ação: Excluir o evento (botão no modal)
   */
  const handleDeleteEvent = () => {
    if (window.confirm(`Tem certeza que deseja excluir o evento: "${formData.title}"?`)) {
      setCurrentEvents(currentEvents.filter(ev => ev.id !== formData.id));
      handleCloseModal();
    }
  };

  /**
   * Ação: Arrastar e soltar um evento
   */
  const handleEventDrop = (info) => {
    if (!window.confirm("Tem certeza que deseja mover este evento?")) {
      info.revert(); // Desfaz a mudança
      return;
    }
    
    // Atualiza o state (simulação)
    setCurrentEvents(currentEvents.map(ev => 
      ev.id === info.event.id ? { ...ev, start: info.event.startStr, end: info.event.endStr } : ev
    ));
    alert('Evento movido!');
  };
  
  // Handler genérico para o formulário
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Renderiza ícones nos eventos
  const renderEventContent = (eventInfo) => {
    const tipo = eventInfo.event.extendedProps.tipo;
    let icon = 'bi-calendar-event';
    if (tipo === 'prova') icon = 'bi-pencil-square';
    if (tipo === 'trabalho') icon = 'bi-file-earmark-text';
    if (tipo === 'aula') icon = 'bi-book';
    
    return (
      <>
        <i className={`bi ${icon} me-2`}></i>
        <b>{eventInfo.timeText}</b>
        <span className="ms-2">{eventInfo.event.title}</span>
      </>
    );
  };

  return (
    <>
      <h2 className="mb-4">Calendário Acadêmico (Professor)</h2>
      <div className="alert alert-light">
        <i className="bi bi-info-circle-fill me-2"></i>
        Clique em uma data para adicionar um evento, ou clique em um evento para editá-lo.
      </div>
      
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            initialView='dayGridMonth'
            locale='pt-br' // Para traduzir
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              list: 'Lista'
            }}
            events={currentEvents}
            selectable={true}        // Permite clicar em datas vazias
            editable={true}          // Permite arrastar eventos
            select={handleDateSelect}     // Handler para criar
            eventClick={handleEventClick}  // Handler para editar/ver
            eventDrop={handleEventDrop}    // Handler para arrastar
            eventContent={renderEventContent} // Customiza a aparência do evento
          />
        </div>
      </div>

      {/* --- MODAL DE CRIAÇÃO/EDIÇÃO --- */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleModalSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? 'Editar Evento' : 'Adicionar Novo Evento'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título do Evento</Form.Label>
              <Form.Control type="text" name="title" value={formData.title || ''} onChange={handleFormChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Evento</Form.Label>
              <Form.Select name="tipo" value={formData.tipo || ''} onChange={handleFormChange} required>
                <option value="" disabled>Selecione o tipo...</option>
                {EVENT_TIPOS.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Para qual turma?</Form.Label>
              <Form.Select name="turmaId" value={formData.turmaId || ''} onChange={handleFormChange} required>
                <option value="" disabled>Selecione a turma...</option>
                {MOCK_TURMAS_PROF.map(turma => (
                  <option key={turma.id} value={turma.id}>{turma.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Início</Form.Label>
              <Form.Control type={formData.allDay ? 'date' : 'datetime-local'} name="start" value={formData.start || ''} onChange={handleFormChange} required />
            </Form.Group>
            
            {!formData.allDay && (
              <Form.Group className="mb-3">
                <Form.Label>Fim</Form.Label>
                <Form.Control type="datetime-local" name="end" value={formData.end || ''} onChange={handleFormChange} />
              </Form.Group>
            )}

            <Form.Check type="switch" label="Dia inteiro?" name="allDay" checked={formData.allDay || false} onChange={handleFormChange} />
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <div>
              {isEditing && (
                <Button variant="danger" type="button" onClick={handleDeleteEvent}>
                  <i className="bi bi-trash-fill me-2"></i>Excluir
                </Button>
              )}
            </div>
            <div>
              <Button variant="secondary" type="button" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Evento
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}