import api from './api';
import { authenticate, requestPasswordReset, resetPassword } from './authService';

jest.mock('./api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

describe('authService', () => {
  it('envia as credenciais para o endpoint de login', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt-token' } });

    const result = await authenticate('aluno@educonnect.local', '123456');

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'aluno@educonnect.local',
      senha: '123456',
    });
    expect(result).toEqual({ token: 'jwt-token' });
  });

  it('solicita a recuperação usando somente o e-mail', async () => {
    api.post.mockResolvedValue({ data: { message: 'Solicitação recebida' } });

    await requestPasswordReset('aluno@educonnect.local');

    expect(api.post).toHaveBeenCalledWith('/auth/esqueci-senha', {
      email: 'aluno@educonnect.local',
    });
  });

  it('preserva token e nova senha ao redefinir a credencial', async () => {
    const payload = { token: 'reset-token', novaSenha: 'NovaSenha123!' };
    api.post.mockResolvedValue({ data: { message: 'Senha alterada' } });

    const result = await resetPassword(payload);

    expect(api.post).toHaveBeenCalledWith('/auth/reset-senha', payload);
    expect(result).toEqual({ message: 'Senha alterada' });
  });
});
