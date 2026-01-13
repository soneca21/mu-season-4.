# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-13

### Added
- Bootstrap técnico de backend Node.js + TypeScript 5.x
- Framework Express 4.x com suporte a ESM
- Rota `/health` retornando status, uptime e timestamp
- CI/CD minimal com GitHub Actions (lint, build, test)
- Testes unitários com Vitest + Supertest para rota `/health`
- Proteção de branch `main` com required status check "CI"
- Versionamento SemVer e primeiras release notes
- ESLint + Prettier configurados
- TypeScript strict mode habilitado

### Security
- Proteção de branch main com enforce_admins=true
- Nenhum bypass para administradores

[0.1.0]: https://github.com/soneca21/mu-season-4./releases/tag/v0.1.0
