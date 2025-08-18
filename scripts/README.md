# Simulador de Release - GitHub Actions

Este simulador permite testar localmente toda a lógica da GitHub Action `build-and-release.yml` antes de criar um pull request oficial. Ele replica o comportamento completo da action, incluindo análise de conventional commits, versionamento automático e geração de release notes.

## 📋 Funcionalidades

- ✅ **Análise de Conventional Commits**: Detecta e categoriza commits seguindo a especificação [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ **Versionamento Automático**: Calcula automaticamente o tipo de bump (major, minor, patch) baseado nos commits
- ✅ **Geração de Release Notes**: Cria release notes estruturadas em Markdown
- ✅ **Simulação de Build e Testes**: Simula o processo de build e execução de testes
- ✅ **Modo Dry-Run**: Executa sem fazer alterações reais no repositório
- ✅ **Logs Detalhados**: Fornece feedback completo sobre cada etapa do processo

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 14.0.0
- Git configurado
- pnpm instalado
- Repositório git inicializado

### Configuração

1. Navegue até o diretório do projeto:
```bash
cd /path/to/your/project
```

2. Instale as dependências do simulador:
```bash
cd scripts
npm install
```

3. Torne o script executável (se necessário):
```bash
chmod +x simulate-release.js
```

## 📖 Uso

### Uso Básico

```bash
# Simular release da biblioteca padrão (better-auth) em modo dry-run
node scripts/simulate-release.js

# Ou usando npm script
cd scripts && npm run simulate
```

### Opções Disponíveis

```bash
node scripts/simulate-release.js [opções]
```

#### Opções:

- `-l, --library <nome>`: Nome da biblioteca (padrão: `better-auth`)
- `--no-dry-run`: Executa de verdade, fazendo alterações reais no repositório
- `-v, --verbose`: Modo verboso com logs detalhados
- `-h, --help`: Mostra ajuda

### Exemplos de Uso

```bash
# Simular release da biblioteca 'better-auth' (padrão)
node scripts/simulate-release.js

# Simular release de uma biblioteca específica
node scripts/simulate-release.js --library my-lib

# Executar com logs verbosos
node scripts/simulate-release.js --verbose

# Executar de verdade (não é simulação)
node scripts/simulate-release.js --no-dry-run

# Combinar opções
node scripts/simulate-release.js --library better-auth --verbose --no-dry-run
```

### Scripts NPM Disponíveis

```bash
cd scripts

# Simulação padrão
npm run simulate

# Simulação com logs verbosos
npm run simulate:verbose

# Execução real (sem dry-run)
npm run simulate:real

# Mostrar ajuda
npm run help
```

## 🔍 Como Funciona

O simulador executa as seguintes etapas, replicando exatamente a GitHub Action:

### 1. Verificação Inicial
- ✅ Verifica se a biblioteca existe em `libs/{library}`
- ✅ Valida se o `package.json` está presente
- ✅ Obtém a versão atual da biblioteca

### 2. Análise de Commits
- 🔍 Busca a última tag da biblioteca (`{library}-v*`)
- 📝 Obtém todos os commits desde a última tag (ou desde o início se não houver tags)
- 🏷️ Analisa cada commit usando a especificação Conventional Commits

### 3. Categorização de Commits

Os commits são categorizados baseado no tipo:

| Tipo | Impacto na Versão | Descrição |
|------|------------------|------------|
| `feat` | **minor** | Nova funcionalidade |
| `fix` | **patch** | Correção de bug |
| `perf` | **patch** | Melhoria de performance |
| `BREAKING CHANGE` ou `!` | **major** | Mudança que quebra compatibilidade |
| `build`, `chore`, `ci`, `docs`, `refactor`, `revert`, `style`, `test` | **nenhum** | Não afeta versão semântica |

### 4. Determinação da Versão
- 📊 Calcula o tipo de bump necessário baseado nos commits analisados
- 🧮 Calcula a nova versão seguindo [Semantic Versioning](https://semver.org/)

### 5. Geração de Release Notes
- 📝 Cria release notes estruturadas em Markdown
- 🚨 Destaca breaking changes
- ✨ Lista novas funcionalidades
- 🐛 Lista correções de bugs
- 📊 Inclui estatísticas dos commits

### 6. Simulação de Build e Testes
- 🔨 Simula o build da biblioteca (`pnpm run build:lib {library}`)
- 🧪 Simula a execução de testes (`pnpm run test {library}`)

### 7. Resumo Final
- 📋 Mostra resumo completo da simulação
- 📝 Exibe as release notes geradas
- ⚠️ Indica se foi executado em modo dry-run

## 📊 Exemplo de Saída

```
🚀 [2024-01-15T10:30:00.000Z] Iniciando simulador de release
📦 [2024-01-15T10:30:00.001Z] Biblioteca: better-auth
🔍 [2024-01-15T10:30:00.002Z] Modo: DRY-RUN (simulação)

🔍 [2024-01-15T10:30:00.010Z] Verificando se a biblioteca existe...
✅ [2024-01-15T10:30:00.015Z] Biblioteca encontrada

📋 [2024-01-15T10:30:00.020Z] Obtendo versão atual...
📦 [2024-01-15T10:30:00.025Z] Versão atual: 1.2.3

🏷️ [2024-01-15T10:30:00.030Z] Buscando última tag...
🏷️ [2024-01-15T10:30:00.040Z] Última tag encontrada: better-auth-v1.2.3

📝 [2024-01-15T10:30:00.050Z] Analisando commits...
📝 [2024-01-15T10:30:00.060Z] 5 commits encontrados

🔍 [2024-01-15T10:30:00.070Z] Analisando conventional commits...
🔍 [2024-01-15T10:30:00.080Z] Análise: 0 major, 2 minor, 1 patch, 2 outros

📊 [2024-01-15T10:30:00.090Z] Determinando tipo de bump...
📊 [2024-01-15T10:30:00.095Z] Tipo de bump determinado: minor

🧮 [2024-01-15T10:30:00.100Z] Calculando nova versão (1.2.3 -> minor)...
🧮 [2024-01-15T10:30:00.105Z] Nova versão: 1.3.0

📝 [2024-01-15T10:30:00.110Z] Gerando release notes...
📝 [2024-01-15T10:30:00.120Z] Release notes geradas

🔨 [2024-01-15T10:30:00.130Z] Simulando build da biblioteca...
🔨 [2024-01-15T10:30:00.135Z] [DRY-RUN] Build simulado com sucesso

🧪 [2024-01-15T10:30:00.140Z] Simulando testes...
🧪 [2024-01-15T10:30:00.145Z] [DRY-RUN] Testes simulados com sucesso

================================================================================
📋 RESUMO DA SIMULAÇÃO
================================================================================
📦 Biblioteca: better-auth
🏷️ Versão atual: 1.2.3
🆕 Nova versão: 1.3.0
📊 Tipo de bump: minor
📝 Commits analisados: 5
🏷️ Última tag: better-auth-v1.2.3

📝 RELEASE NOTES:
----------------------------------------
# Release 1.3.0

**Versão anterior:** 1.2.3
**Tipo de release:** minor
**Commits analisados:** 5

## ✨ Novas Funcionalidades

- **feat(auth):** adicionar suporte a OAuth2
- **feat(validation):** implementar validação de email

## 🐛 Correções

- **fix(security):** corrigir vulnerabilidade de XSS

## 🔧 Outras Mudanças

- **docs:** atualizar documentação da API
- **chore:** atualizar dependências

## 📊 Estatísticas

- Total de commits: 5
- Conventional commits: 4
- Commits com impacto na versão: 3

================================================================================

⚠️  MODO DRY-RUN: Nenhuma alteração foi feita no repositório.
💡 Para executar de verdade, use: --no-dry-run

✅ [2024-01-15T10:30:00.200Z] Simulação concluída com sucesso!
```

## 🔧 Configuração Avançada

### Estrutura de Arquivos

```
scripts/
├── simulate-release.js      # Script principal
├── conventional-commits.js  # Módulo de análise de commits
├── version-manager.js       # Módulo de gerenciamento de versões
├── package.json            # Dependências do simulador
└── README.md               # Esta documentação
```

### Personalização

Você pode personalizar o comportamento do simulador modificando os arquivos:

- **`conventional-commits.js`**: Adicionar novos tipos de commit ou alterar regras de categorização
- **`version-manager.js`**: Modificar lógica de versionamento ou integração com git
- **`simulate-release.js`**: Alterar fluxo principal ou adicionar novas funcionalidades

## 🐛 Solução de Problemas

### Erro: "Biblioteca não encontrada"

```
❌ Biblioteca 'my-lib' não encontrada em: /path/to/libs/my-lib
```

**Solução**: Verifique se:
- A biblioteca existe no diretório `libs/`
- O nome da biblioteca está correto
- O `package.json` existe na pasta da biblioteca

### Erro: "Nenhum commit novo encontrado"

```
📋 Nenhum commit novo encontrado. Nada para fazer.
```

**Solução**: Isso significa que não há commits novos desde a última tag. Para testar:
- Faça alguns commits de teste
- Ou delete a última tag temporariamente
- Ou especifique uma biblioteca diferente

### Erro: "Build falhou" ou "Testes falharam"

**Solução**: 
- Execute em modo dry-run primeiro: `node simulate-release.js`
- Verifique se as dependências estão instaladas: `pnpm install`
- Verifique se os scripts `build:lib` e `test` existem no `package.json` raiz

### Erro de Permissão

```
Errno: EACCES, permission denied
```

**Solução**:
```bash
chmod +x scripts/simulate-release.js
```

## 🤝 Contribuição

Para contribuir com melhorias no simulador:

1. Faça suas alterações nos arquivos do diretório `scripts/`
2. Teste as alterações executando o simulador
3. Atualize esta documentação se necessário
4. Faça commit seguindo Conventional Commits

## 📚 Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [pnpm](https://pnpm.io/)

## 📄 Licença

Este simulador segue a mesma licença do projeto principal.