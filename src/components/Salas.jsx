import React, { useState, useEffect, useMemo } from "react";
import "./Salas.css";

const HORARIOS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const MOCK_SALAS = ["A1-01", "A1-02", "A1-03", "A1-04", "A1-05", "C1-01", "C1-02", "C1-03", "C2-01"];

const MOCK_RESERVAS = [
  { id: 1, sala: "A1-02", inicio: "08:00", duracao: 3, titulo: "MAT101", tipo: "disciplina", professor: "Dr. Arnaldo", turma: "Eng. Civil - 2º Sem" },
  { id: 2, sala: "A1-03", inicio: "10:00", duracao: 2, titulo: "MAT221", tipo: "disciplina", professor: "Dra. Maria", turma: "CC - 4º Sem" },
  { id: 3, sala: "C1-03", inicio: "14:00", duracao: 3, titulo: "Seminário IA", tipo: "evento", professor: "Palestrante Convidado", turma: "Aberto ao público" },
  { id: 4, sala: "C2-01", inicio: "09:00", duracao: 4, titulo: "Workshop Dados", tipo: "evento", professor: "Lab. Analytics", turma: "Inscritos via Portal" }
];

export default function SalasGantt() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date(2026, 2, 5));
  const [now, setNow] = useState(new Date());
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timelinePosition = useMemo(() => {
    const inicioDia = 7; 
    const hora = now.getHours();
    const minutos = now.getMinutes();
    if (hora < inicioDia || hora >= 23) return null;

    const minutosTotais = (hora - inicioDia) * 60 + minutos;
    const totalMinutosGrid = 16 * 60; 
    return (minutosTotais / totalMinutosGrid) * 100;
  }, [now]);

  const isHoje = dataSelecionada.toDateString() === new Date(2026, 2, 5).toDateString();

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="date-controls" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button className="btn-light" onClick={() => setDataSelecionada(new Date(dataSelecionada.setDate(dataSelecionada.getDate() - 1)))}>◀</button>
          <h5 style={{margin: 0, fontWeight: 'bold', minWidth: '150px', textAlign: 'center'}}>
            {dataSelecionada.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', weekday: 'short' })}
          </h5>
          <button className="btn-light" onClick={() => setDataSelecionada(new Date(dataSelecionada.setDate(dataSelecionada.getDate() + 1)))}>▶</button>
        </div>
        <button className="btn-edu-outline" onClick={() => setDataSelecionada(new Date(2026, 2, 5))}>Hoje</button>
      </div>

      <div className="gantt-card">
        <table className="gantt-table">
          <thead>
            <tr>
              <th className="sticky-col">Salas</th>
              {HORARIOS.slice(0, -1).map(h => <th key={h}>{h.split(':')[0]}h</th>)}
            </tr>
          </thead>
          <tbody>
            {MOCK_SALAS.map(sala => (
              <tr key={sala}>
                <td className="sticky-col">{sala}</td>
                {HORARIOS.slice(0, -1).map((hora, i) => {
                  const reserva = MOCK_RESERVAS.find(r => r.sala === sala && r.inicio === hora);
                  return (
                    <td key={i} className="gantt-cell">
                      {reserva && (
                        <div 
                          className={`reserva-block reserva-${reserva.tipo}`}
                          onClick={() => setReservaSelecionada(reserva)}
                          style={{ width: `calc(${reserva.duracao * 100}% - 6px)` }}
                        >
                          {reserva.titulo}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {isHoje && timelinePosition !== null && (
          <div 
            className="timeline-now-line" 
            style={{ left: `calc(100px + (100% - 100px) * ${timelinePosition / 100})` }}
          >
            <div className="timeline-pointer" />
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {reservaSelecionada && (
        <div className="modal-overlay" onClick={() => setReservaSelecionada(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-header bg-${reservaSelecionada.tipo}`}>
              <h3>{reservaSelecionada.titulo}</h3>
              <button className="close-btn" onClick={() => setReservaSelecionada(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>📍 Sala:</strong> {reservaSelecionada.sala}</p>
              <p><strong>⏰ Horário:</strong> {reservaSelecionada.inicio} ({reservaSelecionada.duracao}h de duração)</p>
              <p><strong>👤 Responsável:</strong> {reservaSelecionada.professor}</p>
              <p><strong>👥 Turma/Público:</strong> {reservaSelecionada.turma}</p>
            </div>
          </div>
        </div>
      )}

      <div className="gantt-legend" style={{marginTop: '15px', display: 'flex', gap: '20px', fontSize: '0.8rem'}}>
        <div><span className="dot bg-disciplina"/> Disciplinas</div>
        <div><span className="dot bg-prova"/> Provas</div>
        <div><span className="dot bg-evento"/> Eventos</div>
      </div>
    </div>
  );
}