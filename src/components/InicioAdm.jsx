import React from 'react';
import { Link } from 'react-router-dom';

export default function InicioAdm() {
  
  // --- MOCK DE DADOS (Simula dados vindos do backend) ---
  const stats = {
    totalAlunos: 1245,
    totalProfessores: 87,
    totalStaff: 12,
    failedLogins24h: 14,
    contasBloqueadas: 2,
    serverStatus: 'Online',
    dbStatus: 'Conectado',
    diskUsageApp: 75,
  };

  // --- MUDANÇA AQUI: Removidos 'icon' e 'color' ---
  const recentLogs = [
    { id: 1, user: 'prof.silva@edu.com', msg: 'Atualizou as notas de Cálculo I.', time: '5 min atrás' },
    { id: 2, user: 'coord.ana@edu.com', msg: 'Criou a turma "Física II - Turma C".', time: '12 min atrás' },
    { id: 3, user: 'admin@edu.com', msg: 'Excluiu o usuário "aluno.joao@edu.com".', time: '20 min atrás' },
    { id: 4, user: 'coord.ana@edu.com', msg: 'Editou a disciplina "Álgebra Linear".', time: '45 min atrás' },
  ];
  // -----------------------------------------------------------
  
  return (
    <>
      <h2 className="mb-4">Dashboard de Administração (TI)</h2>

      {/* --- LINHA 1: Resumo e Saúde --- */}
      <div className="row g-4 mb-4">
        
        {/* --- WIDGET 1: Resumo do Sistema (Estilizado) --- */}
        <div className="col-lg-16">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi-people-fill me-2"></i>Resumo do Sistema</h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                {/* Card de Stat: Alunos */}
                <div className="col-md-4">
                  <div className="card text-center h-100 border-0 bg-light">
                    <div className="card-body">
                      <i className="bi bi-person-fill fs-2 text-primary"></i>
                      <h4 className="mb-0 mt-2">{stats.totalAlunos}</h4>
                      <small className="text-muted">Alunos Ativos</small>
                    </div>
                  </div>
                </div>
                {/* Card de Stat: Professores */}
                <div className="col-md-4">
                  <div className="card text-center h-100 border-0 bg-light">
                    <div className="card-body">
                      <i className="bi bi-person-workspace fs-2 text-success"></i>
                      <h4 className="mb-0 mt-2">{stats.totalProfessores}</h4>
                      <small className="text-muted">Professores</small>
                    </div>
                  </div>
                </div>
                {/* Card de Stat: Staff */}
                <div className="col-md-4">
                  <div className="card text-center h-100 border-0 bg-light">
                    <div className="card-body">
                      <i className="bi bi-person-badge fs-2 text-info"></i>
                      <h4 className="mb-0 mt-2">{stats.totalStaff}</h4>
                      <small className="text-muted">Staff (Admin/Coord.)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- LINHA 2: Atividade e Segurança --- */}
      <div className="row g-4">
      
        {/* --- WIDGET 3: Atividade Recente (Sem Ícones) --- */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi bi-file-earmark-text-fill me-2"></i>Atividade Recente (CRUD)</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {/* O .map() agora usa o novo mock focado em CRUD */}
                {recentLogs.map(log => (
                  // --- MUDANÇA AQUI: Removido o elemento <i> ---
                  <div key={log.id} className="list-group-item d-flex align-items-center py-3">
                    <div className="flex-grow-1">
                      <strong className="me-1">{log.user}</strong>
                      {log.msg}
                    </div>
                    <small className="text-muted ms-3">{log.time}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/dashboard/logs-sistema">Ver todos os logs do sistema</Link>
            </div>
          </div>
        </div>
        
        {/* --- WIDGET 4: Status de Segurança (Métrico, não log) --- */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi-shield-lock-fill me-2"></i>Status de Segurança</h5>
            </div>
            <div className="card-body p-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong className="d-block">Logins Falhos (24h)</strong>
                    <small className="text-muted">Tentativas de acesso bloqueadas.</small>
                  </div>
                  <span className={`badge ${stats.failedLogins24h > 10 ? 'bg-danger' : 'bg-warning text-dark'} fs-6`}>
                    {stats.failedLogins24h}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong className="d-block">Contas Bloqueadas</strong>
                    <small className="text-muted">Usuários bloqueados por segurança.</small>
                  </div>
                  <span className={`badge ${stats.contasBloqueadas > 0 ? 'bg-danger' : 'bg-secondary'} fs-6`}>
                    {stats.contasBloqueadas}
                  </span>
                </li>
              </ul>
              <div className="mt-3">
                <Link to="/dashboard/gerenciar-usuarios" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-people-fill me-1"></i> Gerenciar Usuários
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}