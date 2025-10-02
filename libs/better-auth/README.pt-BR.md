# @cms-nestjs-libs/better-auth

**📖 Escolha seu idioma / Choose your language / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

[![npm version](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Compatible-red.svg)](https://nestjs.com/)

Uma integração abrangente do NestJS para [Better Auth](https://www.better-auth.com/), fornecendo recursos de autenticação perfeitos para suas aplicações NestJS com suporte universal para **Express.js** e **Fastify**.

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
- 🛡️ **Rate Limiting**: Rate limiting integrado com limites configuráveis
- 🛠️ **Configuração Flexível**: Suporte para configuração síncrona e assíncrona
- 🌐 **Suporte Universal a Frameworks**: Funciona perfeitamente com Express.js e Fastify
- 📦 **Suporte TypeScript Completo**: Definições de tipos completas e inferência de tipos
- 🎯 **Decorators e Guards**: Decorators prontos para uso e guards de autenticação
- 🔧 **Personalizável**: Middleware, CORS e tratamento de exceções configuráveis
- ⚡ **Otimizado para Performance**: Manipulação eficiente de requisições e validação
- 🔐 **Segurança Aprimorada**: Validação de host header, sanitização de requisições e validação de entrada
- 📝 **Logging Configurável**: Sistema de logging flexível para debugging e monitoramento

## Instalação

```bash
pnpm add @cms-nestjs-libs/better-auth better-auth
# ou
npm install @cms-nestjs-libs/better-auth better-auth
# ou
yarn add @cms-nestjs-libs/better-auth better-auth
```

### Dependências Peer

Esta biblioteca requer as seguintes dependências peer (que devem estar instaladas no seu projeto):

**Pacotes Core do NestJS:**
- `@nestjs/common` (^10.0.0)
- `@nestjs/core` (^10.0.0)

**Adaptadores HTTP (escolha um):**
- `@nestjs/platform-express` + `express` (para Express.js)
- `@nestjs/platform-fastify` + `fastify` (para Fastify)

**Biblioteca de Autenticação:**
- `better-auth` (^1.0.0)

**TypeScript:**
- `typescript` (^5.0.0)

## Variáveis de Ambiente

A biblioteca suporta várias variáveis de ambiente para configuração:

### Configuração Principal

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|----------|
| `NODE_ENV` | Modo do ambiente | `development` | `production`, `test`, `development` |
| `AUTH_SECRET` | Chave secreta para autenticação | **Obrigatório** | `sua-chave-super-secreta-aqui` |
| `DATABASE_URL` | String de conexão do banco de dados | **Obrigatório** | `postgresql://user:pass@localhost:5432/db` |
| `API_PREFIX` | Prefixo global da API | `api` | `v1`, `api/v2` |

### Configuração de Rate Limiting

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|----------|
| `RATE_LIMIT_WINDOW_MS` | Janela de rate limit em milissegundos | `900000` (15 min) | `60000` (1 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requisições por janela | `100` | `50`, `200` |
| `RATE_LIMIT_ENABLED` | Habilitar/desabilitar rate limiting | `true` | `false` |

### Configuração de Segurança

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|----------|
| `CORS_ORIGIN` | Origens CORS permitidas (separadas por vírgula) | `http://localhost:3000` | `https://app.com,https://admin.app.com` |
| `TRUSTED_HOSTS` | Padrões de hosts confiáveis (separados por vírgula) | `localhost` | `app.com,*.app.com` |
| `ENABLE_REQUEST_VALIDATION` | Habilitar validação de requisições | `true` | `false` |

### Exemplo de Arquivo .env

```env
# Configuração Principal
NODE_ENV=production
AUTH_SECRET=sua-chave-super-secreta-aqui-torne-ela-longa-e-aleatoria
DATABASE_URL=postgresql://username:password@localhost:5432/seu_banco
API_PREFIX=api/v1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_ENABLED=true

# Segurança
CORS_ORIGIN=https://seuapp.com,https://admin.seuapp.com
TRUSTED_HOSTS=seuapp.com,*.seuapp.com
ENABLE_REQUEST_VALIDATION=true
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

## Decorators e Guards

A biblioteca fornece decorators e guards prontos para uso para autenticação e autorização:

### Decorators Disponíveis

#### `@AuthRequired()`
Protege rotas que requerem autenticação. Pode ser aplicado a classes de controller ou métodos.

```typescript
import { Controller, Get } from '@nestjs/common';
import { AuthRequired } from '@cms-nestjs-libs/better-auth';

@Controller('protegido')
export class ControllerProtegido {
  @AuthRequired()
  @Get()
  obterDadosProtegidos() {
    return { message: 'Estes dados requerem autenticação' };
  }
}
```

#### `@Public()`
Marca rotas como públicas (sem necessidade de autenticação). Útil quando há um guard de autenticação global.

```typescript
import { Controller, Post } from '@nestjs/common';
import { Public } from '@cms-nestjs-libs/better-auth';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

#### `@User()`
Extrai o usuário autenticado da requisição. Deve ser usado junto com guards de autenticação.

```typescript
import { Controller, Get } from '@nestjs/common';
import { AuthRequired, User } from '@cms-nestjs-libs/better-auth';

interface TipoUsuario {
  id: string;
  email: string;
  name: string;
}

@Controller('perfil')
export class PerfilController {
  @AuthRequired()
  @Get()
  obterPerfil(@User<TipoUsuario>() usuario: TipoUsuario) {
    return { usuario };
  }

  @AuthRequired()
  @Get('id')
  obterIdUsuario(@User<TipoUsuario, 'id'>('id') idUsuario: string) {
    return { idUsuario };
  }
}
```

### Guards Disponíveis

#### `AuthGuard`
Guard integrado que manipula autenticação para rotas. Injeta automaticamente dados de usuário e sessão no objeto de requisição.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@cms-nestjs-libs/better-auth';

@Controller('api')
@UseGuards(AuthGuard)
export class ApiController {
  @Get('dados')
  obterDados() {
    return { message: 'Dados protegidos' };
  }
}
```

O `AuthGuard` automaticamente:
- Verifica se a rota está marcada como pública com `@Public()`
- Valida a sessão do usuário usando Better Auth
- Injeta objetos `user` e `session` na requisição
- Lança `UnauthorizedException` para autenticação inválida ou ausente

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
            url: configService.get('NEST_LIBS_BA_DATABASE_URL'),
          },
          secret: configService.get('NEST_LIBS_BA_AUTH_SECRET'),
          emailAndPassword: {
            enabled: true,
          },
          // Outras configurações do ambiente
        }),
        globalPrefix: configService.get('NEST_LIBS_BA_API_PREFIX', 'api'),
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
          url: this.configService.get('NEST_LIBS_BA_DATABASE_URL'),
        },
        secret: this.configService.get('NEST_LIBS_BA_AUTH_SECRET'),
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

## Configuração CORS para Plugin OpenAPI

Ao usar o Better Auth com o plugin OpenAPI (para documentação Swagger/Scalar), você precisa configurar CORS adequadamente para lidar com requisições OPTIONS de preflight da interface de documentação.

### Configuração CORS Necessária

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS essencial para plugin OpenAPI
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Seu frontend
      'http://localhost:3001',  // Seu servidor API
      // Adicione outras origens conforme necessário
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  await app.listen(3001);
}
bootstrap();
```

### Por Que Isso É Necessário

O plugin OpenAPI gera documentação interativa que faz requisições AJAX para seus endpoints de autenticação. Os navegadores enviam requisições OPTIONS de preflight para essas requisições cross-origin, que precisam de cabeçalhos CORS adequados para ter sucesso.

**Sem configuração CORS:**
- Requisições OPTIONS retornam 404 (Better Auth não lida com preflight)
- Interface de documentação mostra erros "fail to fetch"
- Endpoints de autenticação aparecem quebrados na UI

**Com configuração CORS adequada:**
- Requisições OPTIONS retornam 204 com cabeçalhos CORS adequados
- Interface de documentação funciona perfeitamente
- Todos os fluxos de autenticação funcionam corretamente

### Notas Específicas por Framework

#### Express.js
```typescript
// CORS é tratado automaticamente pelo NestJS
app.enableCors({ /* config */ });
```

#### Fastify
```typescript
// CORS é tratado automaticamente pelo NestJS
// Nenhuma configuração específica do Fastify é necessária
app.enableCors({ /* config */ });
```

## Solução de Problemas

### Problemas Comuns

1. **Módulo não encontrado**: Certifique-se de que tanto `@cms-nestjs-libs/better-auth` quanto `better-auth` estão instalados
2. **Conexão com banco de dados**: Verifique sua configuração de banco de dados
3. **Erros de CORS**: Verifique sua configuração de CORS (veja seção CORS acima)
4. **OpenAPI "fail to fetch"**: Certifique-se de que CORS está configurado adequadamente com método OPTIONS permitido
5. **Conflitos de middleware**: Certifique-se de que não há middleware conflitante nas rotas de autenticação

## Contribuindo

Contribuições são bem-vindas! Por favor, veja nosso [Guia de Contribuição](CONTRIBUTING.md) para detalhes.

### Configuração de Desenvolvimento

1. Clone o repositório
2. Instale as dependências: `pnpm install`
3. Execute os testes: `pnpm test`
4. Faça o build da biblioteca: `pnpm build`

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

- 📖 [Documentação](https://github.com/cms-nestjs-libs/better-auth)
- 🐛 [Rastreador de Issues](https://github.com/cms-nestjs-libs/better-auth/issues)
- 💬 [Discussões](https://github.com/cms-nestjs-libs/better-auth/discussions)

## Projetos Relacionados

- [Better Auth](https://github.com/better-auth/better-auth) - A biblioteca de autenticação principal
- [NestJS](https://nestjs.com/) - Um framework Node.js progressivo

---

Feito com ❤️ pela equipe CMS NestJS Libs
