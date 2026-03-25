import React from 'react';
import { Link } from 'react-router-dom';

// (Importe seu CSS, ex: './InicioCoordenador.css')
// import './InicioCoordenador.css';

export default function InicioCoordenador() {

  // --- MOCK DE DADOS (Simula dados vindos do backend) ---
  
  // (Removido o mock 'statsMatricula')
  
  const requerimentosPendentes = [
    { id: 1, tipo: 'Aproveitamento de Matéria', aluno: 'Ana Silva' },
    { id: 2, tipo: 'Quebra de Pré-requisito', aluno: 'Bruno Costa' },
    { id: 3, tipo: 'Ajuste de Matrícula', aluno: 'Carla Dias' },
  ];
  
  const alertasAcademicos = [
    { id: 1, msg: 'Turma "Cálculo II - Turma C" está sem professor alocado.', link: '/dashboard/gerenciar-turmas' },
    { id: 2, msg: 'Disciplina "Inteligência Artificial" está sem ementa cadastrada.', link: '/dashboard/gerenciar-cursos' },
  ];
  
  const statsGerais = {
    totalCursos: 8,
    totalDisciplinas: 152,
    totalTurmasAbertas: 68,
  };
  // -----------------------------------------------------------

  return (
    <>
      <h2 className="mb-4">Dashboard do Coordenador</h2>

      {/* --- LINHA 1: Feeds de Ação (Caixa de Entrada e Alertas) --- */}
      <div className="row g-4 mb-4">

        {/* --- WIDGET 1: Caixa de Entrada (Requerimentos) --- */}
        {/* MUDANÇA: Agora ocupa 'col-lg-6' (metade da tela) */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-inbox-fill me-2 text-danger"></i>
                Caixa de Entrada ({requerimentosPendentes.length} Pendentes)
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {requerimentosPendentes.length === 0 ? (
                  <div className="p-4 text-center text-muted">Nenhum requerimento pendente.</div>
                ) : (
                  requerimentosPendentes.map(req => (
                    <Link 
                      key={req.id} 
                      to="/dashboard/requerimentos-academicos" 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{req.tipo}</strong>
                        <br/>
                        <small className="text-muted">Solicitante: {req.aluno}</small>
                      </div>
                      <i className="bi bi-chevron-right"></i>
                    </Link>
                  ))
                )}
              </div>
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/dashboard/requerimentos-academicos">Revisar todos os requerimentos</Link>
            </div>
          </div>
        </div>

        {/* --- WIDGET 2: Alertas de Configuração --- */}
        {/* MUDANÇA: Agora ocupa 'col-lg-6' (metade da tela) */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                Alertas de Alocação
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {alertasAcademicos.length === 0 ? (
                  <div className="p-4 text-center text-muted">Nenhum alerta. Tudo certo!</div>
                ) : (
                  alertasAcademicos.map(alerta => (
                    <Link key={alerta.id} to={alerta.link} className="list-group-item list-group-item-action list-group-item-warning">
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {alerta.msg}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- LINHA 2: Resumo Acadêmico --- */}
      <div className="row g-4">
      
        {/* --- WIDGET 3: Resumo Acadêmico (Links Rápidos) --- */}
        {/* MUDANÇA: Agora ocupa 'col-lg-12' (linha inteira) */}
        <div className="col-lg-12">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi bi-collection-fill me-2"></i>Resumo Acadêmico</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {/* Card de Stat: Cursos */}
                <div className="col-md-4">
                  <Link to="/dashboard/gerenciar-cursos" className="text-decoration-none">
                    <div className="card text-center h-100 border-0 bg-light card-acao-coord">
                      <div className="card-body">
                        <i className="bi bi-journal-bookmark-fill fs-2 text-info"></i>
                        <h4 className="mb-0 mt-2">{statsGerais.totalCursos}</h4>
                        <small className="text-muted">Cursos Ativos</small>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* Card de Stat: Disciplinas */}
                <div className="col-md-4">
                  <Link to="/dashboard/gerenciar-cursos" className="text-decoration-none">
                    <div className="card text-center h-100 border-0 bg-light card-acao-coord">
                      <div className="card-body">
                        <i className="bi bi-book-fill fs-2 text-info"></i>
                        <h4 className="mb-0 mt-2">{statsGerais.totalDisciplinas}</h4>
                        <small className="text-muted">Disciplinas Totais</small>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* Card de Stat: Turmas */}
                <div className="col-md-4">
                  <Link to="/dashboard/gerenciar-turmas" className="text-decoration-none">
                    <div className="card text-center h-100 border-0 bg-light card-acao-coord">
                      <div className="card-body">
                        <i className="bi bi-grid-3x3-gap-fill fs-2 text-info"></i>
                        <h4 className="mb-0 mt-2">{statsGerais.totalTurmasAbertas}</h4>
                        <small className="text-muted">Turmas Abertas</small>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}