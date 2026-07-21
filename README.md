# EduConnect Web

Portal React que centraliza as funções acadêmicas e administrativas da faculdade em uma única aplicação.

A interface se adapta aos perfis de administrador, coordenador, professor e aluno. Todos utilizam a mesma API para acessar cursos, turmas, notas, frequência, atividades, comunicados, requerimentos e configurações.

## Funcionalidades

### Administrador

- gestão de usuários;
- dashboard institucional;
- consulta de logs e auditoria.

### Coordenador

- gestão de cursos, disciplinas e turmas;
- análise de requerimentos;
- configurações do portal;
- acompanhamento acadêmico.

### Professor

- turmas e alunos;
- notas e frequência;
- atividades e entregas;
- comunicados;
- calendário e salas.

### Aluno

- boletim e frequência;
- horários;
- matrícula;
- requerimentos;
- perfil e carteirinha virtual.

## Arquitetura

```text
src/
├── app/          rotas e composição
├── components/   páginas e componentes
├── contexts/     autenticação e tema
├── services/     acesso à API
└── main.jsx      inicialização
```

O fluxo principal é:

```text
Componente → Serviço → Axios → API
```

O `AuthContext` mantém a sessão, enquanto o cliente Axios adiciona o token JWT às requisições.

## Logs

A tela administrativa consulta os logs produzidos pelo backend:

```text
GET /api/audit/dashboard
GET /api/audit/logs
```

O frontend apenas apresenta e filtra os registros. A auditoria é criada no servidor para garantir maior confiabilidade.

## Integração com AWS

O frontend não acessa diretamente o S3.

```text
Frontend → Backend → Amazon S3
```

A foto é enviada como `multipart/form-data`. O backend valida o arquivo, realiza o upload e devolve a URL pública.

Nenhuma credencial AWS fica disponível no navegador.

## Insights acadêmicos

O modal de cursos atualmente mostra:

- carga horária;
- quantidade de disciplinas;
- código e descrição.

Indicadores de aprovação, reprovação, evasão e frequência ainda precisam ser calculados no backend por um endpoint específico.

## Tecnologias

- React 19;
- Vite 6;
- React Router;
- Axios;
- Bootstrap;
- FullCalendar;
- QR Code React;
- html2canvas;
- Docker e Nginx;
- Jest

## Configuração

```env
VITE_API_URL=http://localhost:5055/api
```

## Execução

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Acesse:

```text
http://localhost:5173
```

## Build

```powershell
npm run build
npm run preview
```

## Testes
``` 
npm test
npm run test:coverage
```