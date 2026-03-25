export const PROFILE_IDS = {
  ADMIN: 1,
  COORDENADOR: 2,
  PROFESSOR: 3,
  ALUNO: 4,
};

export const PROFILE_TITLES = {
  [PROFILE_IDS.ALUNO]: 'Portal do Aluno',
  [PROFILE_IDS.PROFESSOR]: 'Portal do Professor',
  [PROFILE_IDS.COORDENADOR]: 'Painel do Coordenador',
  [PROFILE_IDS.ADMIN]: 'Painel de Administração',
};

export const PROFILE_MENU_ITEMS = {
  [PROFILE_IDS.ADMIN]: [
    { to: '/dashboard/inicio', label: 'Início', iconClass: 'bi bi-house-door-fill me-2', end: true },
    { to: '/dashboard/gerenciar-usuarios', label: 'Usuários', iconClass: 'bi bi-people-fill me-2' },
    { to: '/dashboard/logs', label: 'Logs do sistema', iconClass: 'bi bi-megaphone-fill me-2' },
    { to: '/dashboard/configuracoes-portal', label: 'Configurações do Portal', iconClass: 'bi bi-gear-fill me-2' },
  ],
  [PROFILE_IDS.COORDENADOR]: [
    { to: '/dashboard/inicio', label: 'Início', iconClass: 'bi bi-house-door-fill me-2', end: true },
    { to: '/dashboard/gerenciar-cursos', label: 'Cursos e Disciplinas', iconClass: 'bi bi-journal-bookmark-fill me-2' },
    { to: '/dashboard/gerenciar-requerimentos', label: 'Requerimentos', iconClass: 'bi bi-megaphone-fill me-2' },
    { to: '/dashboard/gerenciar-turmas', label: 'Turmas', iconClass: 'bi bi-person-video3 me-2' },
  ],
  [PROFILE_IDS.PROFESSOR]: [
    { to: '/dashboard/inicio', label: 'Início', iconClass: 'bi bi-house-door-fill me-2', end: true },
    { to: '/dashboard/minhas-turmas', label: 'Minhas Turmas', iconClass: 'bi bi-people-fill me-2' },
    { to: '/dashboard/atividades-turma', label: 'Atividades', iconClass: 'bi bi-journal-check me-2' },
    { to: '/dashboard/salas', label: 'Salas', iconClass: 'bi bi-door-open-fill me-2' },
    { to: '/dashboard/comunicados', label: 'Comunicados', iconClass: 'bi bi-megaphone-fill me-2' },
    { to: '/dashboard/calendario-professor', label: 'Calendário', iconClass: 'bi bi-calendar-fill me-2' },
  ],
  [PROFILE_IDS.ALUNO]: [
    { to: '/dashboard/inicio', label: 'Início', iconClass: 'bi bi-house-door-fill me-2', end: true },
    { to: '/dashboard/horarios', label: 'Horários', iconClass: 'bi bi-clock-fill me-2' },
    { to: '/dashboard/calendario', label: 'Calendário', iconClass: 'bi bi-calendar-week-fill me-2' },
    { to: '/dashboard/notasfrequencia', label: 'Notas e frequência', iconClass: 'bi bi-bar-chart-fill me-2' },
    { to: '/dashboard/salas', label: 'Salas', iconClass: 'bi bi-door-open-fill me-2' },
    { to: '/dashboard/requerimentos', label: 'Requerimentos', iconClass: 'bi bi-file-earmark-text-fill me-2' },
    { to: '/dashboard/carteirinha', label: 'Carteirinha', iconClass: 'bi bi-person-badge-fill me-2' },
  ],
};

export const getProfileTitle = (profileId) => {
  return PROFILE_TITLES[profileId] || 'Dashboard';
};

export const getProfileMenuItems = (profileId) => {
  return PROFILE_MENU_ITEMS[profileId] || [];
};
