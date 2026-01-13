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

- `GET /health` — retorna `{ status, uptime, timestamp }`

## Variáveis de Ambiente

Configuração centralizada e validada em startup. Nenhum uso direto de `process.env` fora do config layer.

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `NODE_ENV` | `"development" \| "test" \| "production"` | `development` | Ambiente de execução |
| `PORT` | `number` | `3000` | Porta do servidor |
| `APP_NAME` | `string` | `mu-season-4` | Nome da aplicação (logs) |

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
