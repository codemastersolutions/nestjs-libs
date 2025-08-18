# 🚀 NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

Um monorepo abrangente de bibliotecas NestJS com sistemas automatizados de build, testes e releases.

## 📦 Bibliotecas Disponíveis

| Biblioteca                                         | Descrição                                     | Pacote NPM                                                                                                                      | Status                |
| -------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [@cms-nestjs-libs/better-auth](./libs/better-auth) | Integração Better Auth para aplicações NestJS | [![npm](https://img.shields.io/npm/v/@cms-nestjs-libs/better-auth)](https://www.npmjs.com/package/@cms-nestjs-libs/better-auth) | 🚧 Em Desenvolvimento |

## ✨ Principais Recursos

- 🤖 **CI/CD Automatizado** - Pipeline completo de build e release
- 📦 **Versionamento Semântico** - Gerenciamento automático de versões
- 🏷️ **Releases GitHub** - Criação automática de tags e releases
- 🧪 **Testes Abrangentes** - Testes unitários e E2E com múltiplos adaptadores
- ⚡ **Execução Paralela** - Builds otimizados por biblioteca
- 🛠️ **Ferramentas de Desenvolvimento** - Scripts para desenvolvimento local
- 📊 **Relatórios de Release** - Resumos detalhados de execução

## 🚀 Início Rápido

```bash
# Clone o repositório
git clone https://github.com/codemastersolutions/nestjs-libs.git
cd nestjs-libs

# Instale as dependências
pnpm install

# Liste todas as bibliotecas
pnpm libs:list

# Verifique o status
pnpm libs:status

# Faça build de todas as bibliotecas
pnpm libs:build-all
```

## 📋 Scripts Disponíveis

### 🏗️ Scripts de Build

| Comando                     | Descrição                                           | Exemplo                          |
| --------------------------- | --------------------------------------------------- | -------------------------------- |
| `pnpm clean`                | Remove todos os artefatos de build                  | `pnpm clean`                     |
| `pnpm build`                | Limpa e faz build de todas as bibliotecas           | `pnpm build`                     |
| `pnpm build:all-libs`       | Faz build de todas as bibliotecas sequencialmente   | `pnpm build:all-libs`            |
| `pnpm build:lib <nome>`     | Faz build de uma biblioteca específica (CJS + ESM)  | `pnpm build:lib better-auth`     |
| `pnpm build:lib:cjs <nome>` | Faz build da versão CommonJS de uma biblioteca      | `pnpm build:lib:cjs better-auth` |
| `pnpm build:lib:esm <nome>` | Faz build da versão ES Modules de uma biblioteca    | `pnpm build:lib:esm better-auth` |
| `pnpm build:better-auth`    | Faz build da biblioteca better-auth especificamente | `pnpm build:better-auth`         |

### 🧪 Scripts de Teste

| Comando                       | Descrição                                        | Exemplo                       |
| ----------------------------- | ------------------------------------------------ | ----------------------------- |
| `pnpm test`                   | Executa todos os testes                          | `pnpm test`                   |
| `pnpm test:watch`             | Executa testes em modo watch                     | `pnpm test:watch`             |
| `pnpm test:cov`               | Executa testes com relatório de cobertura        | `pnpm test:cov`               |
| `pnpm test:debug`             | Executa testes em modo debug                     | `pnpm test:debug`             |
| `pnpm test:e2e`               | Executa testes end-to-end                        | `pnpm test:e2e`               |
| `pnpm test:better-auth`       | Executa testes da biblioteca better-auth         | `pnpm test:better-auth`       |
| `pnpm test:better-auth:cov`   | Executa testes do better-auth com cobertura      | `pnpm test:better-auth:cov`   |
| `pnpm test:better-auth:watch` | Executa testes do better-auth em modo watch      | `pnpm test:better-auth:watch` |
| `pnpm test:express`           | Executa testes com adaptador Express             | `pnpm test:express`           |
| `pnpm test:fastify`           | Executa testes com adaptador Fastify             | `pnpm test:fastify`           |
| `pnpm test:e2e:express`       | Executa testes E2E com Express                   | `pnpm test:e2e:express`       |
| `pnpm test:e2e:fastify`       | Executa testes E2E com Fastify                   | `pnpm test:e2e:fastify`       |
| `pnpm test:all-adapters`      | Testa com todos os adaptadores (Express/Fastify) | `pnpm test:all-adapters`      |

### 📦 Scripts de Gerenciamento de Bibliotecas

| Comando                   | Descrição                                        | Exemplo                           |
| ------------------------- | ------------------------------------------------ | --------------------------------- |
| `pnpm libs:list`          | Lista todas as bibliotecas disponíveis           | `pnpm libs:list`                  |
| `pnpm libs:build-all`     | Faz build de todas as bibliotecas                | `pnpm libs:build-all`             |
| `pnpm libs:test-all`      | Testa todas as bibliotecas                       | `pnpm libs:test-all`              |
| `pnpm libs:clean-all`     | Limpa artefatos de build de todas as bibliotecas | `pnpm libs:clean-all`             |
| `pnpm libs:status`        | Mostra o status de cada biblioteca               | `pnpm libs:status`                |
| `pnpm libs:create <nome>` | Cria uma nova biblioteca                         | `pnpm libs:create minha-nova-lib` |
| `pnpm libs:validate`      | Valida a estrutura das bibliotecas               | `pnpm libs:validate`              |
| `pnpm libs:package-all`   | Empacota todas as bibliotecas para distribuição  | `pnpm libs:package-all`           |

### 🚀 Scripts de Publicação

| Comando                               | Descrição                         | Exemplo                                  |
| ------------------------------------- | --------------------------------- | ---------------------------------------- |
| `pnpm publish:lib <nome> [--dry-run]` | Publica uma biblioteca específica | `pnpm publish:lib better-auth --dry-run` |
| `pnpm publish:all [--dry-run]`        | Publica todas as bibliotecas      | `pnpm publish:all --dry-run`             |

> **💡 Dica:** Use a flag `--dry-run` para testar a publicação sem realmente publicar no npm.

### 🛠️ Scripts de Desenvolvimento

| Comando            | Descrição                                | Exemplo            |
| ------------------ | ---------------------------------------- | ------------------ |
| `pnpm start`       | Inicia a aplicação                       | `pnpm start`       |
| `pnpm start:dev`   | Inicia em modo desenvolvimento com watch | `pnpm start:dev`   |
| `pnpm start:debug` | Inicia em modo debug                     | `pnpm start:debug` |
| `pnpm start:prod`  | Inicia em modo produção                  | `pnpm start:prod`  |
| `pnpm format`      | Formata código com Prettier              | `pnpm format`      |
| `pnpm lint`        | Analisa e corrige código com ESLint      | `pnpm lint`        |

### 📝 Scripts de Git & Commit

| Comando            | Descrição                                  | Exemplo            |
| ------------------ | ------------------------------------------ | ------------------ |
| `pnpm commit`      | Commit interativo com Conventional Commits | `pnpm commit`      |
| `pnpm commit:push` | Faz commit e push das mudanças             | `pnpm commit:push` |

### 🔧 Scripts Utilitários

| Comando        | Descrição                | Exemplo        |
| -------------- | ------------------------ | -------------- |
| `pnpm prepare` | Configura hooks do Husky | `pnpm prepare` |

## 🤖 Sistema Automatizado

**Gatilhos:**

- Pull request mesclado na `main` com mudanças em `libs/` → Build automático
- Execução manual → Build de todas as bibliotecas com seleção de versão

**Fluxo:**

1. 🔍 Detecta bibliotecas modificadas
2. 📦 Faz build apenas das bibliotecas alteradas
3. 🔢 Incrementa versões automaticamente
4. 🧪 Executa testes de validação
5. 🏷️ Cria tags no formato `{lib}-v{version}`
6. 🎉 Cria releases com artefatos
7. 📊 Gera relatórios de execução

## 🤝 Contribuindo

Veja nosso [Guia de Contribuição](./CONTRIBUTING.pt-BR.md) para informações detalhadas sobre como contribuir com este projeto.

### 📝 Diretrizes de Commit

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/). Use a ferramenta interativa de commit:

```bash
pnpm commit
```

Veja nosso [Guia de Conventional Commits](./.github/CONVENTIONAL_COMMITS.md) para informações detalhadas.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📚 Documentação Adicional

- [🚀 Sistema de Build e Release](./.github/BUILD_AND_RELEASE.md)
- [🧪 Matriz de Testes](./.github/TEST_MATRIX.md)
- [🛡️ Proteção de Branch](./.github/branch-protection.md)
- [🤝 Diretrizes de Contribuição](./CONTRIBUTING.pt-BR.md)

## 🏢 Sobre

**CodeMaster Soluções** - Construindo o futuro com tecnologia de ponta! 🚀

---

_Feito com ❤️ pela equipe CodeMaster_
