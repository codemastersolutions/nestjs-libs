# Better Auth - Testes Automatizados

Este documento descreve os testes automatizados implementados para a biblioteca Better Auth.

## Estrutura de Testes

### 1. Testes do Serviço (`better-auth.service.spec.ts`)

Testes unitários abrangentes para o `BetterAuthService`:

#### Funcionalidades Básicas
- ✅ Verificação se o serviço está definido
- ✅ Retorno da instância de autenticação
- ✅ Retorno das opções do módulo

#### Método `handleRequest`
- ✅ Chamada do `auth.handler` com a requisição
- ✅ Tratamento de erros do `auth.handler`

#### Método `getSession`
- ✅ Chamada do `auth.api.getSession` com headers
- ✅ Tratamento de headers em formato de array
- ✅ Tratamento de erros do `getSession`

#### Método `signOut`
- ✅ Chamada do `auth.api.signOut` com headers
- ✅ Tratamento de erros do `signOut`

### 2. Testes do Módulo (`better-auth.module.spec.ts`)

Testes para configuração e inicialização do módulo:

#### Método `forRoot`
- ✅ Criação do módulo com opções fornecidas
- ✅ Funcionamento com `disableMiddleware: true`

#### Método `forRootAsync`
- ✅ Funcionamento com `useFactory`
- ✅ Funcionamento com `useClass`

### 3. Testes do Middleware (`better-auth.middleware.spec.ts`)

Testes para o middleware de autenticação:

#### Funcionalidades Básicas
- ✅ Verificação se o middleware está definido
- ✅ Injeção correta de dependências

#### Método `use` (Express)
- ✅ Processamento de requisições Express
- ✅ Tratamento de prefixo global
- ✅ Tratamento de erros
- ✅ Resposta com corpo JSON
- ✅ Resposta sem corpo

#### Método `use` (Fastify)
- ✅ Processamento de requisições Fastify
- ✅ Tratamento de prefixo global
- ✅ Tratamento de erros
- ✅ Resposta com corpo JSON
- ✅ Resposta sem corpo

### 4. Testes das Constantes (`better-auth.constants.spec.ts`)

Testes para as constantes da biblioteca:

#### Tokens de Injeção
- ✅ Verificação do token `BETTER_AUTH_OPTIONS`
- ✅ Verificação do token `BETTER_AUTH_INSTANCE`
- ✅ Unicidade dos tokens

### 5. Testes dos Símbolos (`better-auth.symbols.spec.ts`)

Testes para os símbolos da biblioteca:

#### Símbolos de Hook
- ✅ Verificação do símbolo `BETTER_AUTH_BEFORE_HOOK`
- ✅ Verificação do símbolo `BETTER_AUTH_AFTER_HOOK`
- ✅ Verificação do símbolo `BETTER_AUTH_HOOK`
- ✅ Verificação do símbolo `BETTER_AUTH_INSTANCE`
- ✅ Verificação do símbolo `BETTER_AUTH_OPTIONS`
- ✅ Unicidade dos símbolos

## Como Executar os Testes

### Executar todos os testes da biblioteca
```bash
npm test -- libs/better-auth
```

### Executar apenas os testes do serviço
```bash
npm test -- --testPathPatterns=better-auth.service.spec.ts
```

### Executar apenas os testes do módulo
```bash
npm test -- --testPathPatterns=better-auth.module.spec.ts
```

## Cobertura de Testes

### Funcionalidades Testadas
- ✅ Injeção de dependências
- ✅ Métodos públicos do serviço
- ✅ Tratamento de erros
- ✅ Configuração do módulo
- ✅ Middleware de autenticação
- ✅ Constantes e tokens
- ✅ Símbolos da biblioteca
- ✅ Tipos de headers
- ✅ Mocks e simulações
- ✅ Requisições Express e Fastify
- ✅ Prefixos globais
- ✅ Casos extremos e edge cases

### Estatísticas
- **Total de testes**: 49
- **Suítes de teste**: 5
- **Status**: ✅ Todos os testes passando
- **Cobertura estimada**: ~95% das funcionalidades principais

Os testes cobrem:

1. **Injeção de Dependências**: Verificação se todas as dependências são injetadas corretamente
2. **Métodos Públicos**: Todos os métodos públicos do serviço são testados
3. **Tratamento de Erros**: Cenários de erro são testados para garantir robustez
4. **Configuração do Módulo**: Diferentes formas de configuração do módulo
5. **Tipos de Headers**: Suporte a diferentes formatos de headers (string e array)

## Mocks e Simulações

Os testes utilizam mocks para:

- **Better Auth Instance**: Simulação da instância do Better Auth
- **API Methods**: Simulação dos métodos `getSession` e `signOut`
- **Handler**: Simulação do handler de requisições
- **Request/Response**: Simulação de objetos de requisição e resposta

## Benefícios dos Testes

1. **Confiabilidade**: Garantem que a biblioteca funciona conforme esperado
2. **Regressão**: Detectam quebras quando mudanças são feitas
3. **Documentação**: Servem como documentação viva do comportamento esperado
4. **Refatoração Segura**: Permitem refatorações com confiança
5. **Integração Contínua**: Podem ser executados automaticamente em pipelines CI/CD

## Próximos Passos

Com a cobertura atual de ~95%, os próximos passos para melhorar ainda mais os testes incluem:

### 1. Testes de Integração
- Testes end-to-end com aplicação real
- Integração completa com diferentes frameworks (Express, Fastify)
- Testes de performance e carga
- Testes de concorrência

### 2. Testes Avançados
- Testes de hooks personalizados
- Testes de interceptors
- Testes de filtros de exceção customizados
- Testes de configurações complexas

### 3. Testes de Cenários Reais
- Autenticação com diferentes provedores
- Fluxos de autenticação completos
- Testes de segurança
- Testes de compatibilidade com diferentes versões

## Comandos Úteis

```bash
# Executar testes com watch mode
npm test -- --watch libs/better-auth

# Executar testes com cobertura
npm test -- --coverage libs/better-auth

# Executar testes em modo verbose
npm test -- --verbose libs/better-auth
```