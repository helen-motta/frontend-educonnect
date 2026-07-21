import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const renderPrivateRoute = () => render(
  <MemoryRouter initialEntries={['/area-restrita']}>
    <Routes>
      <Route
        path="/area-restrita"
        element={<PrivateRoute><h1>Conteúdo privado</h1></PrivateRoute>}
      />
      <Route path="/login" element={<h1>Página de login</h1>} />
    </Routes>
  </MemoryRouter>,
);

describe('PrivateRoute', () => {
  it('renderiza o conteúdo para uma sessão autenticada', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    renderPrivateRoute();

    expect(screen.getByRole('heading', { name: 'Conteúdo privado' })).toBeInTheDocument();
  });

  it('redireciona uma sessão não autenticada para o login', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    renderPrivateRoute();

    expect(screen.getByRole('heading', { name: 'Página de login' })).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo privado')).not.toBeInTheDocument();
  });

  it('não expõe o conteúdo enquanto a sessão está carregando', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true });

    const { container } = renderPrivateRoute();

    expect(container).toBeEmptyDOMElement();
  });
});
