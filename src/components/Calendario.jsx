import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import './Calendario.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- Dados de Exemplo (Mock) ---
const EVENTOS_INICIAIS = [
  // ===== ENTREGAS DE TRABALHOS =====
  { title: 'Entrega - Projeto ES', start: '2026-01-31' },
  { title: 'Entrega - Padrões de Projeto', start: '2026-02-05' },
  { title: 'Entrega - Arquitetura v1', start: '2026-02-12' },
  { title: 'Entrega - Trabalho BD II', start: '2026-02-19' },
  { title: 'Entrega - Metodologia', start: '2026-02-26' },

];

export default function Calendario() {
  const [eventosAtuais, setEventosAtuais] = useState(EVENTOS_INICIAIS);

  return (
    <>
      <h2 className="mb-4">Calendário Acadêmico</h2>

      {/* --- INÍCIO DA MUDANÇA --- */}
      {/* 1. Adicionamos uma 'row' para conter o grid */}
      <div className="row">
        {/* 2. Definimos o tamanho:
          - 'col-lg-10': Em telas grandes (lg), ocupa 10 de 12 colunas.
          - 'col-xl-9': Em telas extra-grandes (xl), ocupa 9 de 12 colunas.
          - 'mx-auto': Centraliza a coluna.
          - Em telas pequenas (mobile), ele ocupará 100% (padrão).
        */}
        <div className="col-lg-10 col-xl-9 mx-auto">
          
          {/* O seu card original começa aqui */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              
              <FullCalendar
                plugins={[
                  dayGridPlugin, 
                  timeGridPlugin, 
                  bootstrap5Plugin,
                  interactionPlugin
                ]}
                themeSystem="bootstrap5"
                locales={[ptBrLocale]}
                locale="pt-br"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView="dayGridMonth"
                events={eventosAtuais}
                weekends={true}
                dayMaxEvents={true}
              />
              
            </div>
          </div>
          {/* O seu card original termina aqui */}

        </div> {/* 3. Fechamento da coluna */}
      </div> {/* 4. Fechamento da row */}
      {/* --- FIM DA MUDANÇA --- */}
    </>
  );
}