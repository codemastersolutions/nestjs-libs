# Matriz de Testes - Configuração

Este documento descreve a configuração da matriz de testes para o projeto NestJS Libs.

## Combinações Testadas

O workflow de CI/CD testa todas as combinações das seguintes versões:

### Versões do Node.js
- Node.js 20.x (LTS)
- Node.js 22.x (Current)
- Node.js 24.x (Latest)

### Versões do NestJS
- NestJS 10.x
- NestJS 11.x

### Adapters
- Express
- Fastify

## Total de Combinações

**3 versões Node.js × 2 versões NestJS × 2 adapters = 12 jobs de teste**

## Dependências por Adapter

### Express
```json
{
  "@nestjs/platform-express": "^10.0.0 || ^11.0.0",
  "@types/express": "^5.0.0"
}
```

### Fastify
```json
{
  "@nestjs/platform-fastify": "^10.0.0 || ^11.0.0",
  "@fastify/static": "latest",
  "@fastify/view": "latest"
}
```

## Comandos de Teste

### Testes Unitários
```bash
# Express
ADAPTER=express pnpm test

# Fastify
ADAPTER=fastify pnpm test
```

### Testes E2E
```bash
# Express
ADAPTER=express pnpm run test:e2e

# Fastify
ADAPTER=fastify pnpm run test:e2e
```

### Todos os Adapters
```bash
pnpm run test:all-adapters
```

## Configuração de Versões do NestJS

### NestJS 10.x
```bash
pnpm add -D @nestjs/core@^10 @nestjs/common@^10 @nestjs/testing@^10
```

### NestJS 11.x
```bash
pnpm add -D @nestjs/core@^11 @nestjs/common@^11 @nestjs/testing@^11
```

## Status Checks Obrigatórios

Para que um PR seja aprovado, todos os seguintes checks devem passar:

1. `Test Results` (job agregador)
2. `Test Node 20 - NestJS 10 - express`
3. `Test Node 20 - NestJS 10 - fastify`
4. `Test Node 20 - NestJS 11 - express`
5. `Test Node 20 - NestJS 11 - fastify`
6. `Test Node 22 - NestJS 10 - express`
7. `Test Node 22 - NestJS 10 - fastify`
8. `Test Node 22 - NestJS 11 - express`
9. `Test Node 22 - NestJS 11 - fastify`
10. `Test Node 24 - NestJS 10 - express`
11. `Test Node 24 - NestJS 10 - fastify`
12. `Test Node 24 - NestJS 11 - express`
13. `Test Node 24 - NestJS 11 - fastify`

## Execução Local

Para testar localmente antes de fazer push:

```bash
# Instalar diferentes versões do Node.js com nvm
nvm install 20
nvm install 22
nvm install 24

# Testar com Node.js 20
nvm use 20
pnpm install
pnpm run test:all-adapters

# Testar com Node.js 22
nvm use 22
pnpm install
pnpm run test:all-adapters

# Testar com Node.js 24
nvm use 24
pnpm install
pnpm run test:all-adapters
```

## Troubleshooting

### Falhas Comuns

1. **Incompatibilidade de versões**: Verificar se as versões do NestJS são compatíveis com a versão do Node.js
2. **Dependências em falta**: Verificar se todas as dependências do adapter estão instaladas
3. **Testes específicos do adapter**: Alguns testes podem precisar de configuração específica por adapter

### Logs Úteis

```bash
# Ver logs detalhados dos testes
pnpm test -- --verbose

# Ver logs de cobertura
pnpm run test:cov

# Debug de testes específicos
pnpm test -- --testNamePattern="nome do teste"
```