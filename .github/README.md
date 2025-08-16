# GitHub Actions - Configuração de CI/CD

Este diretório contém os workflows e configurações do GitHub Actions para o projeto NestJS Libs.

## Workflows Disponíveis

### 1. Pull Request Tests (`pr-tests.yml`)

Workflow principal que executa testes automatizados em pull requests para as branches `main` e `dev`.

#### Características:
- **Trigger**: Pull requests para `main` e `dev` (opened, synchronize, reopened)
- **Matriz de testes**: 12 combinações diferentes
- **Proteção**: Bloqueia merge se algum teste falhar
- **Cobertura**: Relatório de cobertura de código opcional

#### Matriz de Testes:
```yaml
strategy:
  matrix:
    node-version: [20, 22, 24]
    nestjs-version: [10, 11]
    adapter: [express, fastify]
```

#### Jobs Executados:
1. **test**: Executa testes unitários e e2e para cada combinação
2. **test-results**: Verifica se todos os testes passaram

## Configuração de Branch Protection

Para ativar a proteção de branches, siga as instruções em [`branch-protection.md`](./branch-protection.md).

### Status Checks Obrigatórios:
- `Test Results`
- `Test Node 20 - NestJS 10 - express`
- `Test Node 20 - NestJS 10 - fastify`
- `Test Node 20 - NestJS 11 - express`
- `Test Node 20 - NestJS 11 - fastify`
- `Test Node 22 - NestJS 10 - express`
- `Test Node 22 - NestJS 10 - fastify`
- `Test Node 22 - NestJS 11 - express`
- `Test Node 22 - NestJS 11 - fastify`
- `Test Node 24 - NestJS 10 - express`
- `Test Node 24 - NestJS 10 - fastify`
- `Test Node 24 - NestJS 11 - express`
- `Test Node 24 - NestJS 11 - fastify`

## Scripts de Teste

O projeto inclui scripts específicos para testar diferentes adapters:

```bash
# Testes unitários por adapter
pnpm run test:express
pnpm run test:fastify

# Testes e2e por adapter
pnpm run test:e2e:express
pnpm run test:e2e:fastify

# Todos os testes
pnpm run test:all-adapters
```

## Variáveis de Ambiente

### `ADAPTER`
Define qual adapter usar nos testes:
- `express` (padrão)
- `fastify`

## Dependências Automáticas

O workflow instala automaticamente as dependências corretas baseadas na matriz:

### Para Express:
```bash
pnpm add -D @nestjs/platform-express
```

### Para Fastify:
```bash
pnpm add -D @nestjs/platform-fastify
```

### Para versões do NestJS:
```bash
# NestJS 10
pnpm add -D @nestjs/core@^10 @nestjs/common@^10 @nestjs/testing@^10

# NestJS 11
pnpm add -D @nestjs/core@^11 @nestjs/common@^11 @nestjs/testing@^11
```

## Troubleshooting

### Falhas Comuns

1. **Testes falhando em versões específicas do Node.js**
   - Verificar compatibilidade das dependências
   - Revisar logs específicos do job que falhou

2. **Dependências não encontradas**
   - Verificar se o `pnpm-lock.yaml` está atualizado
   - Confirmar se as versões no `package.json` são compatíveis

3. **Testes e2e falhando**
   - Verificar se os módulos corretos estão sendo importados
   - Confirmar se a variável `ADAPTER` está sendo usada corretamente

### Logs Úteis

Para debug local:
```bash
# Executar com logs detalhados
pnpm test -- --verbose

# Testar versão específica do Node.js
nvm use 20 && pnpm run test:all-adapters
nvm use 22 && pnpm run test:all-adapters
nvm use 24 && pnpm run test:all-adapters
```

## Arquivos de Configuração

- [`pr-tests.yml`](./workflows/pr-tests.yml) - Workflow principal
- [`branch-protection.md`](./branch-protection.md) - Instruções de proteção de branch
- [`TEST_MATRIX.md`](./TEST_MATRIX.md) - Documentação da matriz de testes

## Contribuindo

Ao fazer alterações nos workflows:

1. Teste localmente primeiro com `pnpm run test:all-adapters`
2. Verifique se todas as combinações da matriz funcionam
3. Atualize a documentação se necessário
4. Teste o workflow em um PR de exemplo

## Monitoramento

O workflow fornece:
- ✅ Status de cada job individual
- 🔍 Logs detalhados para debug
- ⚡ Execução paralela para rapidez

Todos os jobs devem passar para que o PR possa ser merged nas branches protegidas.