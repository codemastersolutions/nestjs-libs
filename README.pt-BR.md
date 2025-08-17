# 🚀 NestJS Libs

**📖 Idiomas da Documentação:** [English](README.md) | [Português](README.pt-BR.md) | [Español](README.es.md)

---

Um monorepo abrangente de bibliotecas NestJS com sistemas automatizados de build, testes e releases.

## 📦 Bibliotecas Disponíveis

- **[@nestjs-libs/better-auth](./libs/better-auth)** - Integração Better Auth para aplicações NestJS

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

## 📋 Scripts Principais

| Comando                   | Descrição                                        |
| ------------------------- | ------------------------------------------------ |
| `pnpm libs:list`          | Lista todas as bibliotecas disponíveis           |
| `pnpm libs:status`        | Mostra o status de cada biblioteca               |
| `pnpm libs:build-all`     | Faz build de todas as bibliotecas                |
| `pnpm libs:test-all`      | Testa todas as bibliotecas                       |
| `pnpm libs:create <nome>` | Cria uma nova biblioteca                         |
| `pnpm test:all-adapters`  | Testa com todos os adaptadores (Express/Fastify) |

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
