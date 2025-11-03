import React, { useState } from 'react'; // O useState é necessário para guardar os eventos
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Necessário para navegar e clicar
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

// Importação de CSS corrigida
import 'bootstrap-icons/font/bootstrap-icons.css';


// --- Dados de Exemplo (Mock do Banco de Dados) ---
// Precisamos disso para o calendário não ficar vazio
const EVENTOS_INICIAIS = [
  {
    id: '1',
    title: 'Prova de Cálculo I',
    // Coloca o evento para "Hoje"
    start: new Date().toISOString().substr(0, 10), 
    allDay: true,
    color: '#dc3545' // Cor vermelha (danger)
  },
  {
    id: '2',
    title: 'Reunião de Alinhamento',
    // Coloca o evento para "Daqui a 2 dias" às 10:30
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().substr(0, 10) + 'T10:30:00',
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().substr(0, 10) + 'T11:30:00',
    color: '#0d6efd' // Cor azul (primary)
  }
];
// --- Fim dos Dados de Exemplo ---


export default function Calendario() {
  // O state é a "base" de onde o calendário lê os dados
  const [eventosAtuais, setEventosAtuais] = useState(EVENTOS_INICIAIS);

  return (
    <>
      <h2 className="mb-4">Calendário Acadêmico</h2>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          
          {/* ESTE É O JSX BASE DO FULLCALENDAR
          */}
          <FullCalendar
            // Plugins essenciais para visualização e tema
            plugins={[
              dayGridPlugin, 
              timeGridPlugin, 
              bootstrap5Plugin,
              interactionPlugin // Recomendado para navegação e clique
            ]}
            
            // Define o tema para combinar com o Bootstrap
            themeSystem="bootstrap5"
            
            // Define os botões do cabeçalho (Mês, Semana, Dia)
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            
            // Visualização inicial
            initialView="dayGridMonth"
            
            // De onde o calendário vai ler os eventos
            events={eventosAtuais}
            
            // Configurações visuais
            weekends={true}      // Mostrar fins de semana
            dayMaxEvents={true}  // Limita o número de eventos por dia (cria o "+2 more")

            // Para a versão "Professor", você adicionaria:
            // selectable={true}
            // editable={true}
            // select={suaFuncaoDeAdicionar}
            // eventClick={suaFuncaoDeEditarOuDeletar}
          />
          
        </div>
      </div>
    </>
  );
}