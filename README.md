# mu-season-4 — Backend bootstrap

Projeto inicial de um backend Node.js + TypeScript com Express.

## Como usar

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

- Executar testes:

  ```bash
  npm run test
  ```

- Formatar e lint:

  ```bash
  npm run lint
  npm run format
  ```

## Endpoints

- `GET /health` — retorna `{ status, uptime, timestamp }` **(sem autenticação)**
- `POST /tasks` — criar task (autenticação obrigatória)
- `GET /tasks` — listar tasks (autenticação obrigatória)
- `GET /tasks/:id` — obter task por ID (autenticação obrigatória)
- `PATCH /tasks/:id` — atualizar task (autenticação obrigatória)
- `DELETE /tasks/:id` — deletar task (autenticação obrigatória)

## Autenticação

Todos os endpoints `/tasks*` requerem autenticação via **API Key** no header `x-api-key`.

O endpoint `/health` é público e não requer autenticação.

### Exemplo de uso

```bash
# Com curl
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/tasks

# Com invalid/missing key: retorna 401 UNAUTHORIZED
curl http://localhost:3000/tasks
# {
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid or missing API key"
#   }
# }
```

### Configuração

A API Key é definida via variável de ambiente `API_KEY` (obrigatória em produção).

```bash
# Rodar com API Key customizada
API_KEY=my-super-secret-key-at-least-16-chars npm run dev
```

## Variáveis de Ambiente

Configuração centralizada e validada em startup. Nenhum uso direto de `process.env` fora do config layer.

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `NODE_ENV` | `"development" \| "test" \| "production"` | `development` | Ambiente de execução |
| `PORT` | `number` | `3000` | Porta do servidor |
| `APP_NAME` | `string` | `mu-season-4` | Nome da aplicação (logs) |
| `DATABASE_URL` | `string` | — | URL de conexão do banco SQLite (obrigatória) |
| `API_KEY` | `string` | — | Chave de autenticação para endpoints `/tasks*` (mín. 16 caracteres, obrigatória) |

### Exemplos

```bash
# Rodar com porta customizada
PORT=4000 npm run dev

# Rodar em produção
NODE_ENV=production npm start

# Validação obrigatória (falha com NODE_ENV inválido)
NODE_ENV=invalid npm run dev
# ❌ Erro de validação de configuração:
#   - NODE_ENV: Invalid enum value. Expected 'development' | 'test' | 'production'
```

## CI/CD

- CI executada em push/PR via GitHub Actions
- Branch `main` protegida: requer status check "CI" passando
- Admins não podem contornar proteção
