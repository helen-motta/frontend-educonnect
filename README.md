# EduConnect Web

Portal React do EduConnect. O frontend usa Vite, autenticação JWT e uma camada única de acesso à API; as telas acadêmicas não dependem mais de coleções mockadas locais.

## Execução rápida

Pré-requisitos: Node.js 20 ou superior e npm.

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Abra `http://localhost:5173`. A API deve estar em `http://localhost:5055`, conforme `.env.example`.

Para testar a aplicação completa, inicie primeiro o backend. Ele cria seu próprio SQLite e dados de demonstração, portanto não é necessário baixar um banco.

## Configuração

```text
VITE_API_URL=http://localhost:5055/api
```

Altere `VITE_API_URL` quando o backend estiver em outro endereço. Variáveis Vite são incorporadas durante o build; em produção, defina o valor antes de executar `npm run build`.

## Contas locais

Com o seed padrão do backend, use a senha `123456` e uma das contas:

- `admin@educonnect.local`
- `coordenador@educonnect.local`
- `professor@educonnect.local`
- `aluno@educonnect.local`

## Organização

```text
src/
├── app/          composição da aplicação e rotas
├── components/   páginas e componentes visuais
├── contexts/     sessão/autenticação e tema
├── services/     cliente HTTP, autenticação e API do portal
└── main.jsx      ponto de entrada do Vite
```

O token fica centralizado no contexto de autenticação e é adicionado às chamadas pelo cliente HTTP. Perfis, dashboards, turmas, atividades, comunicados, salas, inscrições, matrículas e configurações carregam dados da API.

## Scripts

```powershell
npm start       # desenvolvimento em http://localhost:5173
npm run build   # gera a pasta dist
npm run preview # visualiza o build local
```

## Docker

O endereço da API é definido durante o build:

```powershell
docker build --build-arg VITE_API_URL=http://localhost:5055/api -t educonnect-web .
docker run --rm -p 5173:80 educonnect-web
```

Se o navegador acessar a API por outro host, passe esse endereço em `VITE_API_URL` e inclua a origem do frontend em `Cors__AllowedOrigins__0` no backend.

## Upload de imagens

A tela de configurações envia a foto como `multipart/form-data` para o backend. O navegador não recebe credenciais AWS: o backend valida e armazena o arquivo diretamente no S3, retornando apenas a URL pública.
