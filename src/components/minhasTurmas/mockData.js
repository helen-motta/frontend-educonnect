export const MOCK_ESTAT = {
  p1: { nome: 'Prova 1', media: 6.8, mediana: 7.0, dp: 1.9, q1: 5.5, q3: 8.2, min: 2.0, max: 10.0, cv: 27.9 },
  p2: { nome: 'Prova 2', media: 7.2, mediana: 7.5, dp: 1.6, q1: 6.0, q3: 8.5, min: 3.0, max: 10.0, cv: 22.2 },
  t1: { nome: 'Trabalho', media: 8.1, mediana: 8.5, dp: 1.2, q1: 7.5, q3: 9.0, min: 5.0, max: 10.0, cv: 14.8 },
};

export const MOCK_CORR = {
  labels: ['P1', 'P2', 'T1', 'Média'],
  matrix: [
    [1.0, 0.72, 0.45, 0.88],
    [0.72, 1.0, 0.51, 0.91],
    [0.45, 0.51, 1.0, 0.67],
    [0.88, 0.91, 0.67, 1.0],
  ],
};

export const MOCK_REG = {
  beta0: 2.34,
  beta1: 0.78,
  r2: 0.77,
  pontos: [
    { x: 3.0, y: 4.8 },
    { x: 4.0, y: 5.5 },
    { x: 5.0, y: 6.1 },
    { x: 5.5, y: 6.7 },
    { x: 6.0, y: 7.0 },
    { x: 6.5, y: 7.3 },
    { x: 7.0, y: 7.8 },
    { x: 7.5, y: 8.0 },
    { x: 8.0, y: 8.6 },
    { x: 8.5, y: 9.0 },
    { x: 9.0, y: 9.2 },
    { x: 9.5, y: 9.7 },
  ],
};

export const MOCK_EVASAO_ALUNOS = [
  { nome: 'Ana Souza', ra: '20210201', p: 0.82, nota: 4.2, faltas: 8 },
  { nome: 'Julia Rocha', ra: '20210203', p: 0.74, nota: 4.9, faltas: 7 },
  { nome: 'Pedro Lima', ra: '20210202', p: 0.61, nota: 5.8, faltas: 5 },
  { nome: 'Lucas Alves', ra: '20210204', p: 0.45, nota: 6.3, faltas: 4 },
  { nome: 'Carlos Mendes', ra: '20210205', p: 0.18, nota: 8.1, faltas: 1 },
  { nome: 'Fernanda Dias', ra: '20210206', p: 0.09, nota: 9.2, faltas: 0 },
];

export const MOCK_KAPLAN = [
  { sem: '1º', taxa: 100 },
  { sem: '2º', taxa: 88 },
  { sem: '3º', taxa: 79 },
  { sem: '4º', taxa: 73 },
  { sem: '5º', taxa: 68 },
  { sem: '6º', taxa: 65 },
];
