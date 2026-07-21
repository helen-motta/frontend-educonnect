import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import api from '../services/api';
import html2canvas from 'html2canvas'; // Importar a biblioteca
import './Horarios.css';
import { useAuth } from '../contexts/AuthContext';

export default function Horarios() {
  const { user } = useAuth();
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(); // Referência para capturar a tabela

  const gradeHorariaBase = [
    { codigo: 'M1', intervalo: '07:00 - 08:40' },
    { codigo: 'M2', intervalo: '08:50 - 10:30' },
    { codigo: 'M3', intervalo: '10:40 - 12:20' },
    { codigo: 'T1', intervalo: '13:00 - 14:40' },
    { codigo: 'T2', intervalo: '14:50 - 16:30' },
    { codigo: 'N1', intervalo: '19:00 - 20:40' },
    { codigo: 'N2', intervalo: '20:50 - 22:30' },
  ];

  const diasSemana = [
    { id: 2, nome: "Segunda" }, { id: 3, nome: "Terça" }, { id: 4, nome: "Quarta" },
    { id: 5, nome: "Quinta" }, { id: 6, nome: "Sexta" }
  ];

  useEffect(() => {
    const buscarHorarios = async () => {
      try {
        setLoading(true);
        const alunoId = user?.usuario?.id;
        if (!alunoId) return;
        const response = await api.get(`/Turmas/aluno/${alunoId}/horarios`);
        setAulas(response.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    buscarHorarios();
  }, [user?.usuario?.id]);

  // Função para baixar a grade
  const handleDownload = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a qualidade da imagem
      backgroundColor: "#ffffff", // Garante fundo branco no print
      logging: false,
      useCORS: true // Ajuda se houver imagens externas
    });

    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = data;
    link.download = `grade-horaria-${new Date().getFullYear()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const encontrarAula = (codigoSlot, diaId) => {
    return aulas.find(a => a.codigoSlot === codigoSlot && a.diaSemana === diaId);
  };

  const getCorMateria = (nome) => {
    const cores = ['#0d6efd', '#6610f2', '#198754', '#dc3545', '#fd7e14', '#0dcaf0'];
    let hash = 0;
    for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    return cores[Math.abs(hash) % cores.length];
  };

  if (loading) return <div className="p-5 text-center">Carregando grade horária...</div>;

  return (
    // Adicionamos a ref no container que queremos baixar
    <div className="card shadow-sm border-0 mb-4" ref={printRef}>
      <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Grade Horária</h5>
        
        {/* Botão de Download (não sairá na foto se você colocar a ref apenas na tabela, 
            mas aqui coloquei no card para baixar o título junto) */}
      <button 
        onClick={handleDownload} 
        className="btn btn-download-academico"
        data-html2canvas-ignore
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-2" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
        Exportar Grade
      </button>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle horarios-table mb-0">
            <thead>
              <tr>
                <th className="coluna-horario-fixa">Horário</th>
                {diasSemana.map(dia => <th key={dia.id}>{dia.nome}</th>)}
              </tr>
            </thead>
            <tbody>
              {gradeHorariaBase.map(slot => (
                <tr key={slot.codigo}>
                  <td className="coluna-horario-fixa small">
                    <div className="fw-bold">{slot.intervalo.split(' - ')[0]}</div>
                    <div className="text-muted">{slot.intervalo.split(' - ')[1]}</div>
                    <div className="badge bg-light text-muted border mt-1" style={{fontSize: '10px'}}>{slot.codigo}</div>
                  </td>
                  
                  {diasSemana.map(dia => {
                    const aula = encontrarAula(slot.codigo, dia.id);
                    return (
                      <td key={`${slot.codigo}-${dia.id}`} className={aula ? 'celula-aula-ativa' : ''}>
                        {aula ? (
                          <>
                            <div className="indicador-materia" style={{ backgroundColor: getCorMateria(aula.disciplina) }}></div>
                            <div className="conteudo-aula">
                              <strong className="nome-materia d-block">{aula.disciplina}</strong>
                              <span className="info-extra d-block">{aula.professor.split(' ')[0]}</span>
                              <div><span className="badge-sala">{aula.sala}</span></div>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted opacity-25">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
