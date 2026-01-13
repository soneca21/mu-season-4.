# mu-season-4 — Backend bootstrap

Projeto inicial de um backend Node.js + TypeScript com Express.

Como usar:

- Instalar dependências:

  ```bash
  npm install
  ```

- Rodar em desenvolvimento (auto-reload):

  ```bash
  npm run dev
  ```

- Build para produção:

  ```bash
  npm run build
  npm start
  ```

Endpoints:

- GET /health — retorna { status, uptime, timestamp }

Porta padrão: `3000` — pode ser alterada via `PORT`.
