import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const session = {
  token: 'jwt-token',
  usuario: { id: 7, nome: 'Ana', idPerfil: 4 },
};

function AuthProbe() {
  const auth = useAuth();

  return (
    <>
      <output data-testid="user">{JSON.stringify(auth.user)}</output>
      <output data-testid="authenticated">{String(auth.isAuthenticated)}</output>
      <button type="button" onClick={() => auth.login(session)}>Entrar</button>
      <button type="button" onClick={auth.logout}>Sair</button>
      <button type="button" onClick={() => auth.updateProfile({ nome: 'Ana Silva', telefone: '11999999999' })}>
        Atualizar perfil
      </button>
    </>
  );
}

const renderProvider = () => render(<AuthProvider><AuthProbe /></AuthProvider>);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  it('restaura uma sessão válida do armazenamento local', () => {
    localStorage.setItem('@EduConnect:user', JSON.stringify(session));

    renderProvider();

    expect(screen.getByTestId('user')).toHaveTextContent('Ana');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('ignora uma sessão local corrompida', () => {
    localStorage.setItem('@EduConnect:user', '{json-invalido');

    renderProvider();

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('persiste a sessão e redireciona após o login', () => {
    renderProvider();

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(JSON.parse(localStorage.getItem('@EduConnect:user'))).toEqual(session);
    expect(localStorage.getItem('@EduConnect:token')).toBe(session.token);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/inicio', { replace: true });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('atualiza o perfil sem perder os demais dados da sessão', () => {
    localStorage.setItem('@EduConnect:user', JSON.stringify(session));
    renderProvider();

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar perfil' }));

    const persisted = JSON.parse(localStorage.getItem('@EduConnect:user'));
    expect(persisted).toEqual({
      ...session,
      usuario: { ...session.usuario, nome: 'Ana Silva', telefone: '11999999999' },
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('remove todos os dados sensíveis e redireciona no logout', () => {
    localStorage.setItem('@EduConnect:user', JSON.stringify(session));
    localStorage.setItem('@EduConnect:token', session.token);
    renderProvider();

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(localStorage.getItem('@EduConnect:user')).toBeNull();
    expect(localStorage.getItem('@EduConnect:token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });
});
