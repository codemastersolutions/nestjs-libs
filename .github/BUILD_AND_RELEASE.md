# 🚀 Build and Release System

Sistema automatizado para build, versionamento e release de todas as bibliotecas no monorepo.

## 📋 Visão Geral

O sistema detecta automaticamente:
- ✅ Todas as libs na pasta `libs/`
- 🔍 Mudanças em cada lib
- 📦 Faz build apenas das libs modificadas
- 🏷️ Incrementa versão automaticamente
- 🎯 Cria tags e releases individuais
- 📁 Gera artefatos prontos para distribuição

## 🎯 Triggers

### Automático
```yaml
# Dispara quando um pull request é merged na main com mudanças em libs/
pull_request:
  types: [closed]
  branches: [main]
  paths: ['libs/**']
```

### Manual
```yaml
# Permite execução manual com escolha do tipo de versão
workflow_dispatch:
  inputs:
    version_type: [patch, minor, major]
```

## 🔄 Fluxo de Trabalho

### 1. Detecção de Mudanças
- 🔍 Escaneia pasta `libs/` para encontrar todas as bibliotecas
- 📊 Compara commits para detectar libs modificadas
- 🎯 Execução manual processa todas as libs

### 2. Build e Release (Para cada lib)
- 📥 Checkout do código
- 🛠️ Setup Node.js + pnpm
- 📦 Instalação de dependências
- 🔢 Incremento de versão
- 🏗️ Build CJS + ESM
- 🧪 Execução de testes
- 📋 Criação do pacote de distribuição
- 📤 Publicação no NPM registry
- 🏷️ Commit + Tag + Push
- 🎉 Criação da Release no GitHub

## 🎯 Release Process

The release process includes:

1. **Version Management**: Automatic semantic versioning
2. **Build Process**: TypeScript compilation to CJS and ESM
3. **Testing**: Comprehensive test execution
4. **Packaging**: NPM-ready package creation
5. **NPM Publishing**: Automatic publication to NPM registry
6. **GitHub Release**: Automated release creation with artifacts
7. **Tagging**: Git tag creation and pushing

## 📦 NPM Publishing

Each library is automatically published to NPM registry as a separate package:

- **Package Scope**: `@nestjs-libs`
- **Naming**: `@nestjs-libs/{library-name}`
- **Access**: Public packages
- **Registry**: https://registry.npmjs.org

### Requirements
- NPM token configured in GitHub secrets (`NPM_TOKEN`)
- Proper package.json configuration in each library
- Build artifacts (CJS and ESM) available

See [NPM Publishing Guide](./NPM_PUBLISHING.md) for detailed setup instructions.

## 📦 Estrutura de Artefatos

Cada release contém:
```
{lib-name}-v{version}.tgz
├── package.json          # Versão atualizada
├── dist/
│   ├── cjs/              # Build CommonJS
│   └── esm/              # Build ES Modules
├── README.md             # Documentação (se existir)
└── LICENSE               # Licença (se existir)
```

## 🏷️ Convenção de Tags

```bash
# Formato: {lib-name}-v{version}
better-auth-v1.0.0
better-auth-v1.0.1
other-lib-v2.1.0
```

## 📋 Versionamento Semântico

| Tipo | Quando usar | Exemplo |
|------|-------------|----------|
| `patch` | Bug fixes, pequenas correções | `1.0.0` → `1.0.1` |
| `minor` | Novas features, mudanças compatíveis | `1.0.0` → `1.1.0` |
| `major` | Breaking changes | `1.0.0` → `2.0.0` |

## 🛠️ Scripts Locais

### Build de todas as libs
```bash
pnpm build
# ou
pnpm build:all-libs
```

### Build de uma lib específica
```bash
pnpm build:lib better-auth
```

### Build por tipo
```bash
# Apenas CJS
pnpm build:lib:cjs better-auth

# Apenas ESM
pnpm build:lib:esm better-auth
```

## 🆕 Adicionando Nova Biblioteca

### 1. Estrutura Mínima
```
libs/nova-lib/
├── package.json                    # ✅ Obrigatório
├── src/
│   └── index.ts                   # ✅ Obrigatório
├── tsconfig.build.cjs.json        # ✅ Para build CJS
├── tsconfig.build.esm.json        # ✅ Para build ESM
├── README.md                      # 📝 Recomendado
└── LICENSE                        # 📝 Recomendado
```

### 2. package.json Mínimo
```json
{
  "name": "@nestjs-libs/nova-lib",
  "version": "0.0.1",
  "description": "Descrição da nova lib",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  }
}
```

### 3. Configuração TypeScript

**tsconfig.build.cjs.json:**
```json
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "outDir": "./dist/cjs",
    "module": "CommonJS",
    "target": "ES2020"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}
```

**tsconfig.build.esm.json:**
```json
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "outDir": "./dist/esm",
    "module": "ES2022",
    "target": "ES2022"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}
```

## 🔧 Configuração Automática

O sistema é **completamente automático**:
- ✅ Detecta novas libs automaticamente
- ✅ Não requer modificação do workflow
- ✅ Funciona com qualquer estrutura de lib
- ✅ Suporta builds condicionais (CJS/ESM opcionais)

## 📊 Monitoramento

### GitHub Actions
- 📋 Summary detalhado de cada execução
- 🔍 Logs completos de build e teste
- ⚡ Execução paralela por lib
- 🎯 Status individual por biblioteca

### Releases
- 📦 Artefatos prontos para download
- 📋 Changelog automático
- 🔗 Links de instalação
- 📊 Comparação entre versões

## 🚨 Troubleshooting

### Build falha
1. ✅ Verificar se `tsconfig.build.*.json` existem
2. ✅ Verificar se `src/index.ts` existe
3. ✅ Verificar sintaxe do `package.json`
4. ✅ Verificar dependências no workspace

### Testes falham
1. ✅ Verificar se arquivos `*.spec.ts` estão corretos
2. ✅ Verificar configuração do Jest
3. ✅ Verificar imports e exports

### Release não criada
1. ✅ Verificar permissões do `GITHUB_TOKEN`
2. ✅ Verificar se tag foi criada
3. ✅ Verificar se commit foi feito

## 🎉 Benefícios

- 🚀 **Zero configuração** para novas libs
- ⚡ **Build paralelo** e otimizado
- 🎯 **Versionamento automático** e consistente
- 📦 **Artefatos prontos** para distribuição
- 🔄 **CI/CD completo** integrado
- 📊 **Monitoramento** detalhado
- 🛡️ **Testes automáticos** antes do release