# @cms-nestjs-libs/better-auth | 🚧 Em Desenvolvimento, erros podem ocorrer. |

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

[![npm version](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uma integração abrangente do NestJS para [Better Auth](https://www.better-auth.com/), fornecendo recursos de autenticação perfeitos para suas aplicações NestJS.

## Inspiração e Necessidade

Esta biblioteca foi inspirada pelo excelente trabalho de [ThallesP/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth), que fornece integração do Better Auth para aplicações NestJS. No entanto, identificamos uma necessidade crítica no ecossistema: **suporte ao Fastify**.

Enquanto a biblioteca original foca exclusivamente no Express.js, muitas aplicações NestJS modernas aproveitam o Fastify por suas características superiores de performance. Esta biblioteca preenche essa lacuna fornecendo:

- **Suporte Universal a Frameworks**: Funciona perfeitamente com Express.js e Fastify
- **Otimização de Performance**: Aproveita a velocidade do Fastify mantendo compatibilidade com Express
- **API Unificada**: Experiência de autenticação consistente independentemente do adaptador HTTP subjacente
- **Segurança Aprimorada**: Medidas de segurança adicionais e camadas de validação

Nosso objetivo é fornecer à comunidade NestJS uma solução de autenticação robusta e agnóstica a frameworks que não comprometa performance ou segurança.

## Recursos

- 🚀 **Integração Fácil**: Configuração simples com injeção de dependência do NestJS
- 🔒 **Seguro por Padrão**: Recursos de segurança integrados e melhores práticas
- 🛠️ **Configuração Flexível**: Suporte para configuração síncrona e assíncrona
- 🌐 **Suporte a Middleware**: Manipulação automática de rotas para endpoints de autenticação
- 📦 **Suporte TypeScript**: Suporte completo ao TypeScript com definições de tipos
- 🔧 **Personalizável**: Middleware, CORS e tratamento de exceções configuráveis

## Instalação

```bash
npm install @cms-nestjs-libs/better-auth better-auth
# ou
yarn add @cms-nestjs-libs/better-auth better-auth
# ou
pnpm add @cms-nestjs-libs/better-auth better-auth
```

## Scripts Disponíveis

A biblioteca inclui vários scripts npm para desenvolvimento e testes:

### 🧪 Scripts de Teste

| Comando              | Descrição                                                     | Exemplo              |
| -------------------- | ------------------------------------------------------------- | -------------------- |
| `npm test`           | Executa todos os testes usando Jest                           | `npm test`           |
| `npm run test:watch` | Executa testes em modo watch para desenvolvimento             | `npm run test:watch` |
| `npm run test:cov`   | Executa testes com relatório de cobertura (texto, HTML, LCOV) | `npm run test:cov`   |
| `npm run test:debug` | Executa testes em modo debug com Node.js inspector            | `npm run test:debug` |

### 📊 Relatórios de Cobertura

Ao executar `npm run test:cov`, relatórios de cobertura são gerados em múltiplos formatos:

- **Texto**: Saída no console com resumo de cobertura
- **HTML**: Relatório HTML interativo no diretório `coverage/`
- **LCOV**: Formato legível por máquina para integração CI/CD

### 🔧 Fluxo de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar testes durante desenvolvimento
npm run test:watch

# Gerar relatório de cobertura
npm run test:cov

# Debugar testes que falharam
npm run test:debug
```

> **💡 Dica**: Use `test:watch` durante o desenvolvimento para re-executar automaticamente os testes quando os arquivos mudarem.

## Início Rápido

### 1. Configuração Básica

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@cms-nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth: betterAuth({
        database: {
          // Sua configuração de banco de dados
        },
        emailAndPassword: {
          enabled: true,
        },
        // Outras opções do Better Auth
      }),
    }),
  ],
})
export class AppModule {}
```

### 2. Usando o Serviço

```typescript
import { Injectable } from '@nestjs/common';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class AuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  async getSession(request: any) {
    return this.betterAuthService.getSession(request);
  }

  async signOut(request: any) {
    return this.betterAuthService.signOut(request);
  }

  // Manipular lógica de autenticação personalizada
  async handleAuth(request: any) {
    return this.betterAuthService.handleRequest(request);
  }
}
```

## Opções de Configuração

### BetterAuthModuleOptions

| Opção                       | Tipo      | Padrão          | Descrição                                 |
| --------------------------- | --------- | --------------- | ----------------------------------------- |
| `auth`                      | `Auth`    | **Obrigatório** | Instância do Better Auth                  |
| `disableExceptionFilter`    | `boolean` | `false`         | Desabilitar o filtro de exceções ⚠️       |
| `disableTrustedOriginsCors` | `boolean` | `false`         | Desabilitar CORS de origens confiáveis ⚠️ |
| `disableBodyParser`         | `boolean` | `false`         | Desabilitar o parser de corpo             |
| `globalPrefix`              | `string`  | `undefined`     | Prefixo global para rotas                 |
| `disableMiddleware`         | `boolean` | `false`         | Desabilitar o middleware ⚠️               |

⚠️ **Aviso de Segurança**: Opções marcadas com ⚠️ têm implicações de segurança. Desabilite essas funcionalidades apenas se você entender os riscos e tiver mecanismos de proteção alternativos.

## Compatibilidade de Frameworks

Esta biblioteca foi projetada para funcionar perfeitamente com os frameworks **Express.js** e **Fastify**:

### Suporte ao Express.js

- Suporte nativo para objetos request/response do Express
- Integração automática de middleware
- Compatibilidade total com o ecossistema Express

### Suporte ao Fastify

- Compatível com Fastify através do plugin `@fastify/middie`
- Manipula objetos IncomingMessage brutos
- Normalização automática de objetos de requisição

### Manipulação Universal de Requisições

O middleware detecta e manipula automaticamente diferentes formatos de objetos de requisição:

```typescript
// Funciona com Express e Fastify
interface UniversalRequest {
  path?: string; // Formato Express
  url?: string; // Formato Fastify/bruto
  method?: string;
  headers?: Record<string, string | string[]>;
  protocol?: string;
  originalUrl?: string;
  body?: any;
  get?: (header: string) => string | undefined;
}
```

## Recursos de Segurança

A biblioteca inclui várias medidas de segurança integradas:

### Proteção contra Injeção de Cabeçalho Host

```typescript
// Validação automática de cabeçalhos host
const hostRegex = /^[a-zA-Z0-9.-]+(?::[0-9]+)?$/;
const host = rawHost && hostRegex.test(rawHost) ? rawHost : 'localhost';
```

### Validação de Requisições

```typescript
// Todos os métodos do serviço incluem validação de entrada
if (!request || typeof request !== 'object') {
  throw new Error('Objeto de requisição inválido fornecido');
}

if (!request.headers || typeof request.headers !== 'object') {
  throw new Error('Cabeçalhos de requisição inválidos fornecidos');
}
```

### Tokens de Injeção de Dependência

A biblioteca usa tokens baseados em Symbol para prevenir conflitos de injeção:

```typescript
// Símbolos disponíveis para uso avançado
export const BETTER_AUTH_BEFORE_HOOK = Symbol('BETTER_AUTH_BEFORE_HOOK');
export const BETTER_AUTH_AFTER_HOOK = Symbol('BETTER_AUTH_AFTER_HOOK');
export const BETTER_AUTH_HOOK = Symbol('BETTER_AUTH_HOOK');
export const BETTER_AUTH_INSTANCE = Symbol('BETTER_AUTH_INSTANCE');
export const BETTER_AUTH_OPTIONS = Symbol('BETTER_AUTH_OPTIONS');
```

## Configuração Avançada

### Configuração Assíncrona

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BetterAuthModule } from '@cms-nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        auth: betterAuth({
          database: {
            provider: 'postgresql',
            url: configService.get('DATABASE_URL'),
          },
          secret: configService.get('AUTH_SECRET'),
          emailAndPassword: {
            enabled: true,
          },
          // Outras configurações do ambiente
        }),
        globalPrefix: configService.get('API_PREFIX', 'api'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Usando Classe de Configuração

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BetterAuthOptionsFactory,
  BetterAuthModuleOptions,
} from '@cms-nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';

@Injectable()
export class BetterAuthConfigService implements BetterAuthOptionsFactory {
  constructor(private configService: ConfigService) {}

  createBetterAuthOptions(): BetterAuthModuleOptions {
    return {
      auth: betterAuth({
        database: {
          provider: 'postgresql',
          url: this.configService.get('DATABASE_URL'),
        },
        secret: this.configService.get('AUTH_SECRET'),
        emailAndPassword: {
          enabled: true,
        },
      }),
    };
  }
}

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      useClass: BetterAuthConfigService,
    }),
  ],
})
export class AppModule {}
```

## Middleware

O módulo configura automaticamente o middleware para manipular rotas de autenticação:

- `/api/auth/*` - Todos os endpoints de autenticação
- `api/auth/*` - Formato de caminho alternativo

Para desabilitar o middleware:

```typescript
BetterAuthModule.forRoot({
  auth: suaInstanciaBetterAuth,
  disableMiddleware: true, // ⚠️ Aviso de Segurança
});
```

## Referência da API

### BetterAuthService

#### `getAuth(): Auth`

Retorna a instância do Better Auth configurada.

```typescript
const auth = this.betterAuthService.getAuth();
// Use a instância auth para operações personalizadas
```

#### `getOptions(): BetterAuthModuleOptions`

Retorna as opções de configuração do módulo.

```typescript
const options = this.betterAuthService.getOptions();
console.log('Prefixo global:', options.globalPrefix);
```

#### `handleRequest(request: any): Promise<Response>`

Manipula uma requisição de autenticação. Valida a entrada e processa a requisição através do Better Auth.

**Parâmetros:**

- `request`: Objeto de requisição (Express, Fastify ou formato bruto)

**Validação:**

- Verifica se o objeto de requisição é válido
- Valida a presença e formato dos cabeçalhos
- Normaliza diferentes formatos de requisição

```typescript
try {
  const response = await this.betterAuthService.handleRequest(req);
  // Processar resposta
} catch (error) {
  // Manipular erro de validação ou processamento
}
```

#### `getSession(request: any): Promise<Session | null>`

Obtém a sessão do usuário a partir da requisição. Inclui validação de entrada.

**Parâmetros:**

- `request`: Objeto de requisição contendo cookies/tokens de sessão

**Retorna:**

- `Session`: Objeto de sessão se válida
- `null`: Se nenhuma sessão válida for encontrada

```typescript
const session = await this.betterAuthService.getSession(req);
if (session) {
  console.log('Usuário logado:', session.user.id);
} else {
  console.log('Usuário não autenticado');
}
```

#### `signOut(request: any): Promise<Response>`

Desconecta o usuário, invalidando sua sessão. Inclui validação de entrada.

**Parâmetros:**

- `request`: Objeto de requisição contendo informações de sessão

**Retorna:**

- `Response`: Resposta de logout com cookies limpos

```typescript
const logoutResponse = await this.betterAuthService.signOut(req);
// Resposta inclui cabeçalhos para limpar cookies de sessão
```

## Exemplos

### Configuração Completa do Express.js

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS se necessário
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

### Guard de Autenticação Personalizado

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private betterAuthService: BetterAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const session = await this.betterAuthService.getSession(request);
      return !!session?.user;
    } catch {
      return false;
    }
  }
}
```

## Considerações de Segurança

1. **Variáveis de Ambiente**: Armazene configurações sensíveis em variáveis de ambiente
2. **HTTPS**: Sempre use HTTPS em produção
3. **CORS**: Configure CORS adequadamente para seu domínio
4. **Segurança do Banco de Dados**: Proteja sua conexão com o banco de dados
5. **Gerenciamento de Segredos**: Use segredos fortes e únicos

## Solução de Problemas

### Problemas Comuns

1. **Módulo não encontrado**: Certifique-se de que tanto `@cms-nestjs-libs/better-auth` quanto `better-auth` estão instalados
2. **Conexão com banco de dados**: Verifique sua configuração de banco de dados
3. **Erros de CORS**: Verifique sua configuração de CORS
4. **Conflitos de middleware**: Certifique-se de que não há middleware conflitante nas rotas de autenticação

## Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](../../.github/README.md) para detalhes.

## Licença

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Links

- [Documentação do Better Auth](https://www.better-auth.com/)
- [Documentação do NestJS](https://nestjs.com/)
- [Repositório GitHub](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
