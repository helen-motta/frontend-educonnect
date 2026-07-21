import api from './api';

export const portalService = {
  getProfile: async () => (await api.get('/perfil')).data,
  uploadProfilePhoto: async (file) => {
    const form = new FormData(); form.append('arquivo', file);
    return (await api.post('/perfil/foto', form)).data;
  },
  savePreferences: async (preferences) => (await api.put('/perfil/preferencias', preferences)).data,
  getPortalConfig: async () => (await api.get('/configuracoes-portal')).data,
  savePortalConfig: async (config) => (await api.put('/configuracoes-portal', config)).data,
  getProfessorDashboard: async () => (await api.get('/dashboard/professor')).data,
  getCoordinatorDashboard: async () => (await api.get('/dashboard/coordenador')).data,
  getClasses: async () => (await api.get('/turmas/professor')).data,
  getClassDetails: async (id) => (await api.get(`/turmas/${id}`)).data,
  getNotices: async () => (await api.get('/comunicados')).data,
  createNotice: async (payload) => (await api.post('/comunicados', payload)).data,
  getActivities: async () => (await api.get('/atividades')).data,
  createActivity: async (payload) => (await api.post('/atividades', payload)).data,
  updateActivity: async (id, payload) => (await api.put(`/atividades/${id}`, payload)).data,
  deleteActivity: async (id) => api.delete(`/atividades/${id}`),
  gradeSubmission: async (activityId, studentId, payload) => api.put(`/atividades/${activityId}/entregas/${studentId}`, payload),
  getRooms: async () => (await api.get('/salas')).data,
  getAvailableCourses: async () => (await api.get('/matriculas/cursos-disponiveis')).data,
  requestEnrollment: async (payload) => (await api.post('/matriculas/solicitacoes', payload)).data,
};
