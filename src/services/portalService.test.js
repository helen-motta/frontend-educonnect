import api from './api';
import { portalService } from './portalService';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('portalService', () => {
  it('envia a foto no campo multipart esperado pelo backend', async () => {
    const file = new File(['foto'], 'perfil.png', { type: 'image/png' });
    api.post.mockResolvedValue({ data: { fotoUrl: 'https://cdn.exemplo/perfil.png' } });

    const result = await portalService.uploadProfilePhoto(file);

    expect(api.post).toHaveBeenCalledTimes(1);
    const [url, form] = api.post.mock.calls[0];
    expect(url).toBe('/perfil/foto');
    expect(form).toBeInstanceOf(FormData);
    expect(form.get('arquivo')).toBe(file);
    expect(result).toEqual({ fotoUrl: 'https://cdn.exemplo/perfil.png' });
  });

  it('mantém o contrato de atualização de atividades', async () => {
    const payload = { titulo: 'Prova final', dataEntrega: '2026-07-30' };
    api.put.mockResolvedValue({ data: { id: 15, ...payload } });

    const result = await portalService.updateActivity(15, payload);

    expect(api.put).toHaveBeenCalledWith('/atividades/15', payload);
    expect(result).toEqual({ id: 15, ...payload });
  });

  it('envia a solicitação de matrícula sem alterar o payload', async () => {
    const payload = { cursoId: 3, turno: 'Noturno' };
    api.post.mockResolvedValue({ data: { protocolo: 'MAT-2026-001' } });

    const result = await portalService.requestEnrollment(payload);

    expect(api.post).toHaveBeenCalledWith('/matriculas/solicitacoes', payload);
    expect(result).toEqual({ protocolo: 'MAT-2026-001' });
  });
});
