import React from 'react';
import { Link } from 'react-router-dom';

export default function InicioProfessor() {

  // --- MOCK DE DADOS (Simula dados vindos do backend) ---
  
  // Widget 1: Próxima Aula
  const proximaAula = {
    disciplina: 'Cálculo I - Turma A',
    horario: 'Hoje, 19:00 - 20:50',
    sala: 'B-105',
    totalAlunos: 32,
    turmaId: 't1' // ID para o link
  };
  
  // Widget 2: Ações Pendentes
  const acoesPendentes = [
    { id: 1, msg: 'Lançar notas: P1 de Cálculo I', link: '/dashboard/minhas-turmas' },
    { id: 2, msg: 'Lançar faltas: Aula de ontem (Física II)', link: '/dashboard/minhas-turmas' },
  ];
  
  // Widget 3: Últimos Comunicados Enviados
  const ultimosComunicados = [
    { id: 1, assunto: 'Aula de Terça Cancelada', para: 'Física II - Turma B' },
    { id: 2, assunto: 'Prazo da P1 Estendido', para: 'Cálculo I - Turma A' },
  ];
  
  // --- MUDANÇA AQUI ---
  // Widget 4: Próximas Avaliações (Em vez de Alunos em Risco)
  const proximasAvaliacoes = [
    // Note que hoje é 13/11/2025 no mock
    { id: 1, tipo: 'Prova (P1)', turma: 'Cálculo I - Turma A', data: '20/11/2025' },
    { id: 2, tipo: 'Entrega (Trabalho 1)', turma: 'Física II - Turma B', data: '22/11/2025' },
    { id: 3, tipo: 'Prazo Final de Correção', turma: 'P1 de Cálculo I', data: '27/11/2025' },
  ];
  // -----------------------------------------------------------

  return (
    <>

      {/* --- LINHA 1: Foco Principal (O que fazer agora) --- */}
      <div className="row g-4 mb-4">
        
        {/* --- WIDGET 1: Próxima Aula --- */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                Próxima Aula
              </h5>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <span className="badge bg-primary-subtle text-primary-emphasis mb-2">{proximaAula.horario}</span>
                <h3 className="card-title mb-1">{proximaAula.disciplina}</h3>
                <p className="fs-5 text-muted">
                  <i className="bi bi-geo-alt-fill me-2"></i>Sala: {proximaAula.sala}
                </p>
              </div>
              <div className="mt-3">
                <Link to="/dashboard/minhas-turmas" className="btn btn-primary">
                  <i></i>Gerenciar Turma
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- WIDGET 2: Ações Pendentes (To-Do List) --- */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i></i>
                Ações Pendentes
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {acoesPendentes.length === 0 ? (
                  <div className="p-4 text-center text-muted">Nenhuma ação pendente.</div>
                ) : (
                  acoesPendentes.map(acao => (
                    <Link 
                      key={acao.id} 
                      to={acao.link} 
                      className="list-group-item list-group-item-action"
                    >
                      <i></i>
                      {acao.msg}
                    </Link>
                  ))
                )}
              </div>
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/dashboard/minhas-turmas">Ver todas as turmas</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- LINHA 2: Comunicados e Agenda --- */}
      <div className="row g-4">
      
        {/* --- WIDGET 3: Últimos Comunicados --- */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i></i>
                Últimos Comunicados Enviados
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {ultimosComunicados.map(com => (
                  <div key={com.id} className="list-group-item">
                    <strong>{com.assunto}</strong>
                    <br/>
                    <small className="text-muted">Para: {com.para}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/dashboard/enviar-comunicado">Enviar novo comunicado</Link>
            </div>
          </div>
        </div>
        
        {/* --- MUDANÇA AQUI: WIDGET 4 (Próximas Avaliações) --- */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i></i>
                Próximas Avaliações
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {proximasAvaliacoes.length === 0 ? (
                  <div className="p-4 text-center text-muted">Nenhuma avaliação agendada.</div>
                ) : (
                  proximasAvaliacoes.map(aval => (
                    <div key={aval.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <strong>{aval.tipo}</strong>
                        <span className="badge bg-primary-subtle text-primary-emphasis">{aval.data}</span>
                      </div>
                      <small className="text-muted">{aval.turma}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card-footer bg-white text-center">
              {/* Link para o calendário que já fizemos */}
              <Link to="/dashboard/calendario">Ver calendário completo</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}