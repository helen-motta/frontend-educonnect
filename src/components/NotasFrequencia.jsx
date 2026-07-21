import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function NotasFrequencia() {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const periodoAtual = `${now.getFullYear()}.${now.getMonth() < 6 ? 1 : 2}`;

  const buscarBoletimAluno = async () => {
    try {
      setLoading(true);
      const alunoId = user?.usuario?.id;
      if (!alunoId) return;
      const response = await api.get(`/Boletim/aluno/${alunoId}`);
      setDisciplinas(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar boletim:", error);
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarBoletimAluno();
  }, [user?.usuario?.id]);

  const calcularMedia = (disc) => {
    if (disc.notaFinal !== null && disc.notaFinal !== undefined) {
      return disc.notaFinal;
    }

    const notas = [disc.p1, disc.p2, disc.trabalho].filter(
      (n) => typeof n === 'number'
    );

    if (notas.length === 0) return '-';

    const media = notas.reduce((acc, n) => acc + n, 0) / notas.length;
    return media.toFixed(1);
  };

  const getBadgeClass = (nota) => {
    if (nota === '-' || nota === null || nota === undefined) return 'bg-secondary';
    return nota >= 6 ? 'bg-success' : 'bg-danger';
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Notas e Frequência</h2>

        <span className="badge bg-primary-subtle text-primary-emphasis fs-6">Período {periodoAtual}</span>
      </div>
      {loading ? (
        <div className="text-center p-5">Carregando informações...</div>
      ) : (
        <div className="accordion" id="accordionNotasFrequencia">
          {disciplinas.length === 0 && (
            <p className="text-center text-muted">
              Nenhum dado de boletim encontrado.
            </p>
          )}

          {disciplinas.map((disc, index) => {
            const media = calcularMedia(disc);
            const frequencia = disc.frequenciaPercentual ?? 0;

            return (
              <div
                className="accordion-item shadow-sm border-0 mb-3"
                key={disc.turmaId || index}
              >
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                  >
                    <div className="d-flex justify-content-between w-100 pe-3 flex-wrap align-items-center">
                      <div>
                        <strong className="fs-5">{disc.disciplina}</strong>
                        <div className="text-muted small">Prof. {disc.professor}</div>
                      </div>
                      <div className="d-flex gap-3 mt-2 mt-md-0">
                        <span className="fs-6">
                          Média:{' '}
                          <span className={`badge ${getBadgeClass(media)}`}>
                            {media}
                          </span>
                        </span>
                        <span className="fs-6">
                          Frequência:{' '}
                          <span className="badge bg-success">
                            {frequencia}%
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionNotasFrequencia"
                >
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6 border-end">
                        <h5>Detalhamento das Notas</h5>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                            Prova 1 (P1)
                            <span className="badge bg-primary rounded-pill fs-6">
                              {disc.p1 ?? '-'}
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                            Prova 2 (P2)
                            <span className="badge bg-primary rounded-pill fs-6">
                              {disc.p2 ?? '-'}
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                            Trabalho
                            <span className="badge bg-primary rounded-pill fs-6">
                              {disc.trabalho ?? '-'}
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                            Nota Final
                            <span className="badge bg-secondary rounded-pill fs-6">
                              {disc.notaFinal ?? '-'}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6 ps-md-4">
                        <h5>Frequência</h5>
                        <div
                          className="progress"
                          style={{ height: '25px' }}
                          role="progressbar"
                        >
                          <div
                            className={`progress-bar ${
                              frequencia < 75 ? 'bg-danger' : 'bg-success'
                            }`}
                            style={{ width: `${frequencia}%` }}
                          >
                            {frequencia}% Presente
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
