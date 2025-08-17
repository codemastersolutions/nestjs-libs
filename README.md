# 🚀 NestJS Libs

Um monorepo de bibliotecas NestJS com sistema automatizado de build, testes e releases.

## 📦 Bibliotecas Disponíveis

- **[@nestjs-libs/better-auth](./libs/better-auth)** - Integração Better Auth para NestJS

## 🎯 Recursos

- ✅ **Build Automatizado** - Sistema CI/CD completo
- 🔄 **Versionamento Semântico** - Incremento automático de versões
- 🏷️ **Tags e Releases** - Criação automática no GitHub
- 📦 **Artefatos Prontos** - Pacotes NPM para distribuição
- 🧪 **Testes Automatizados** - Validação antes do release
- ⚡ **Execução Paralela** - Build otimizado por biblioteca
- 🛠️ **Scripts de Desenvolvimento** - Ferramentas para desenvolvimento local

## 🚀 Quick Start

### Listar Bibliotecas
```bash
pnpm libs:list
```

### Verificar Status
```bash
pnpm libs:status
```

### Build de Todas as Libs
```bash
pnpm libs:build-all [patch|minor|major]
```

### Criar Nova Biblioteca
```bash
pnpm libs:create minha-nova-lib
```

## 📋 Scripts Disponíveis

### Gerenciamento de Bibliotecas
- `pnpm libs:list` - Lista todas as bibliotecas
- `pnpm libs:status` - Mostra status de cada biblioteca
- `pnpm libs:build-all` - Build de todas as bibliotecas
- `pnpm libs:test-all` - Testa todas as bibliotecas
- `pnpm libs:clean-all` - Limpa artefatos de build
- `pnpm libs:create <nome>` - Cria nova biblioteca
- `pnpm libs:validate <nome>` - Valida estrutura da biblioteca
- `pnpm libs:package-all` - Cria pacotes de todas as libs

### Build Individual
- `pnpm build:lib <nome>` - Build de uma biblioteca específica
- `./scripts/build-lib.sh <nome> [patch|minor|major]` - Build com versionamento

### Testes
- `pnpm test` - Testes unitários
- `pnpm test:e2e` - Testes end-to-end
- `pnpm test:all-adapters` - Testes com todos os adaptadores

## 🤖 Sistema Automatizado

### Triggers
- **Pull request merged na `main`** com mudanças em `libs/` → Build automático
- **Execução Manual** → Build de todas as libs com escolha de versão

### Fluxo Automático
1. 🔍 Detecta bibliotecas modificadas
2. 📦 Faz build apenas das libs alteradas
3. 🔢 Incrementa versão automaticamente
4. 🧪 Executa testes de validação
5. 🏷️ Cria tag no formato `{lib}-v{version}`
6. 🎉 Cria release com artefatos
7. 📊 Gera relatório de execução

### Artefatos Gerados
Cada release contém:
- 📦 Pacote NPM completo (`.tgz`)
- 📋 Changelog automático
- 🔗 Links de instalação
- 📊 Comparação entre versões

## 🆕 Criando Nova Biblioteca

### 1. Usando o Script
```bash
pnpm libs:create minha-lib
```

### 2. Estrutura Criada
```
libs/minha-lib/
├── package.json              # Configuração da lib
├── src/
│   ├── index.ts             # Entry point
│   ├── minha-lib.module.ts  # Módulo NestJS
│   ├── minha-lib.service.ts # Serviço principal
│   ├── minha-lib.types.ts   # Tipos e interfaces
│   └── *.spec.ts            # Testes unitários
├── tsconfig.build.cjs.json  # Config build CJS
├── tsconfig.build.esm.json  # Config build ESM
├── tsconfig.lib.json        # Config desenvolvimento
└── README.md                # Documentação
```

### 3. Desenvolvimento
```bash
# Testar
pnpm test -- --testPathPatterns=minha-lib

# Build local
./scripts/build-lib.sh minha-lib patch

# Validar estrutura
pnpm libs:validate minha-lib
```

## 📚 Documentação

- [🚀 Build and Release System](./.github/BUILD_AND_RELEASE.md)
- [🧪 Testing Matrix](./.github/TEST_MATRIX.md)
- [🛡️ Branch Protection](./.github/branch-protection.md)

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ / 20+ / 22+ / 24+
- pnpm 10.14+

### Instalação
```bash
# Clone o repositório
git clone https://github.com/codemastersolutions/nestjs-libs.git
cd nestjs-libs

# Instale dependências
pnpm install

# Verifique o status
pnpm libs:status
```

## 🤝 Contribuindo

1. 🍴 Fork o projeto
2. 🌿 Crie uma branch: `git checkout -b feature/nova-feature`
3. 📝 Faça suas alterações
4. 🧪 Execute os testes: `pnpm test:all-adapters`
5. 📦 Teste o build: `pnpm libs:build-all`
6. 🚀 Commit e push
7. 🔄 Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**CodeMaster Soluções** - Desenvolvendo o futuro com tecnologia de ponta! 🚀
