import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center" style={{ maxWidth: 480 }}>
            <i className="bi bi-exclamation-triangle-fill text-warning display-3 mb-3"></i>
            <h4 className="fw-bold mb-2">Algo deu errado</h4>
            <p className="text-muted mb-4">
              Ocorreu um erro inesperado nesta página. Tente novamente ou volte ao início.
            </p>
            {this.state.error && (
              <pre className="text-start bg-dark text-white rounded-3 p-3 small mb-4" style={{ overflowX: 'auto' }}>
                {this.state.error.message}
              </pre>
            )}
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-primary rounded-pill px-4" onClick={this.handleReset}>
                Tentar novamente
              </button>
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => window.location.href = '/dashboard/inicio'}>
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
