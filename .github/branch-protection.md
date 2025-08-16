# Branch Protection Rules

Para garantir que os pull requests só possam ser merged após os testes passarem, configure as seguintes regras de proteção de branch no GitHub:

## Configuração no GitHub

1. Vá para **Settings** > **Branches** no repositório
2. Clique em **Add rule** ou edite uma regra existente
3. Configure as seguintes opções:

### Para as branches `main` e `dev`:

- **Branch name pattern**: `main` (criar uma regra separada para `dev`)
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - **Status checks required**:
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

**Total: 13 status checks obrigatórios**
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators**

## Comandos para testar localmente

```bash
# Testar com diferentes versões do Node.js
nvm use 20 && pnpm test
nvm use 22 && pnpm test
nvm use 24 && pnpm test

# Testar com diferentes adapters
ADAPTER=express pnpm test
ADAPTER=fastify pnpm test

# Executar testes e2e
pnpm run test:e2e

# Executar com cobertura
pnpm test -- --coverage
```

## Notas importantes

- Os testes são executados em uma matriz de combinações: 3 versões do Node.js × 2 versões do NestJS × 2 adapters = 12 jobs
- Todos os jobs devem passar para que o PR possa ser merged
- A cobertura de código é executada separadamente e pode ser configurada como opcional
- O workflow é acionado em `opened`, `synchronize` e `reopened` de pull requests