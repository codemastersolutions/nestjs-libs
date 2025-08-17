# @nestjs-libs/better-auth

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

[![npm version](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uma integração abrangente do NestJS para [Better Auth](https://www.better-auth.com/), fornecendo recursos de autenticação perfeitos para suas aplicações NestJS.

## Recursos

- 🚀 **Integração Fácil**: Configuração simples com injeção de dependência do NestJS
- 🔒 **Seguro por Padrão**: Recursos de segurança integrados e melhores práticas
- 🛠️ **Configuração Flexível**: Suporte para configuração síncrona e assíncrona
- 🌐 **Suporte a Middleware**: Manipulação automática de rotas para endpoints de autenticação
- 📦 **Suporte TypeScript**: Suporte completo ao TypeScript com definições de tipos
- 🔧 **Personalizável**: Middleware, CORS e tratamento de exceções configuráveis

## Instalação

```bash
npm install @nestjs-libs/better-auth better-auth
# ou
yarn add @nestjs-libs/better-auth better-auth
# ou
pnpm add @nestjs-libs/better-auth better-auth
```

## Início Rápido

### 1. Configuração Básica

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@nestjs-libs/better-auth';
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
import { BetterAuthService } from '@nestjs-libs/better-auth';

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
| `disableBodyParser`         | `boolean` | `false`         | Desabilitar analisador de corpo           |
| `globalPrefix`              | `string`  | `undefined`     | Prefixo global para rotas                 |
| `disableMiddleware`         | `boolean` | `false`         | Desabilitar o middleware ⚠️               |

⚠️ **Aviso de Segurança**: Opções marcadas com ⚠️ têm implicações de segurança. Desabilite esses recursos apenas se você entender os riscos e tiver mecanismos de proteção alternativos.

## Configuração Avançada

### Configuração Assíncrona

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BetterAuthModule } from '@nestjs-libs/better-auth';
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
} from '@nestjs-libs/better-auth';
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

#### Métodos

- `getAuth(): Auth` - Obter a instância do Better Auth
- `getOptions(): BetterAuthModuleOptions` - Obter opções do módulo
- `handleRequest(request: any): Promise<Response>` - Manipular solicitação de autenticação
- `getSession(request: { headers: Record<string, string | string[]> }): Promise<any>` - Obter sessão do usuário
- `signOut(request: { headers: Record<string, string | string[]> }): Promise<any>` - Desconectar usuário

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
import { BetterAuthService } from '@nestjs-libs/better-auth';

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

1. **Módulo não encontrado**: Certifique-se de que tanto `@nestjs-libs/better-auth` quanto `better-auth` estão instalados
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
