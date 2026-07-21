import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function InicioAdm() {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalProfessores: 0,
    totalStaff: 0,
    failedLogins24h: 0,
    contasBloqueadas: 0,
    serverStatus: 'Indisponivel',
    dbStatus: 'Indisponivel',
    diskUsageApp: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ativo = true;

    const carregarDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/audit/dashboard', { params: { logsLimit: 10 } });
        const data = response?.data ?? {};
        const rawStats = data.stats ?? data.Stats ?? {};
        const rawLogs = data.recentLogs ?? data.RecentLogs ?? [];

        if (!ativo) return;

        setStats({
          totalAlunos: rawStats.totalAlunos ?? rawStats.TotalAlunos ?? 0,
          totalProfessores: rawStats.totalProfessores ?? rawStats.TotalProfessores ?? 0,
          totalStaff: rawStats.totalStaff ?? rawStats.TotalStaff ?? 0,
          failedLogins24h: rawStats.failedLogins24h ?? rawStats.FailedLogins24h ?? 0,
          contasBloqueadas: rawStats.contasBloqueadas ?? rawStats.ContasBloqueadas ?? 0,
          serverStatus: rawStats.serverStatus ?? rawStats.ServerStatus ?? 'Indisponivel',
          dbStatus: rawStats.dbStatus ?? rawStats.DbStatus ?? 'Indisponivel',
          diskUsageApp: rawStats.diskUsageApp ?? rawStats.DiskUsageApp ?? 0,
        });

        setRecentLogs(
          rawLogs.map((log, idx) => ({
            id: log.id ?? log.Id ?? idx,
            user: log.user ?? log.User ?? 'sistema',
            msg: log.msg ?? log.Msg ?? 'Registrou uma atividade no sistema.',
            time: log.time ?? log.Time ?? 'agora',
          }))
        );
      } catch (err) {
        if (!ativo) return;
        setError('Nao foi possivel carregar os dados do dashboard.');
        setStats((prev) => ({
          ...prev,
          serverStatus: 'Offline',
          dbStatus: 'Indisponivel',
        }));
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);
  
  return (
    <>
      <h2 className="mb-4">Dashboard de Administração (TI)</h2>

      {error && <div className="alert alert-warning">{error}</div>}

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
                      <h4 className="mb-0 mt-2">{loading ? '...' : stats.totalAlunos}</h4>
                      <small className="text-muted">Alunos Ativos</small>
                    </div>
                  </div>
                </div>
                {/* Card de Stat: Professores */}
                <div className="col-md-4">
                  <div className="card text-center h-100 border-0 bg-light">
                    <div className="card-body">
                      <i className="bi bi-person-workspace fs-2 text-success"></i>
                      <h4 className="mb-0 mt-2">{loading ? '...' : stats.totalProfessores}</h4>
                      <small className="text-muted">Professores</small>
                    </div>
                  </div>
                </div>
                {/* Card de Stat: Staff */}
                <div className="col-md-4">
                  <div className="card text-center h-100 border-0 bg-light">
                    <div className="card-body">
                      <i className="bi bi-person-badge fs-2 text-info"></i>
                      <h4 className="mb-0 mt-2">{loading ? '...' : stats.totalStaff}</h4>
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
                {loading ? (
                  <div className="list-group-item py-3 text-muted">Carregando atividades...</div>
                ) : recentLogs.length === 0 ? (
                  <div className="list-group-item py-3 text-muted">Nenhuma atividade recente.</div>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="list-group-item d-flex align-items-center py-3">
                      <div className="flex-grow-1">
                        <strong className="me-1">{log.user}</strong>
                        {log.msg}
                      </div>
                      <small className="text-muted ms-3">{log.time}</small>
                    </div>
                  ))
                )}
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
                    {loading ? '...' : stats.failedLogins24h}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong className="d-block">Contas Bloqueadas</strong>
                    <small className="text-muted">Usuários bloqueados por segurança.</small>
                  </div>
                  <span className={`badge ${stats.contasBloqueadas > 0 ? 'bg-danger' : 'bg-secondary'} fs-6`}>
                    {loading ? '...' : stats.contasBloqueadas}
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