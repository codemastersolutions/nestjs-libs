# @nestjs-libs/better-auth

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

[![npm version](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive NestJS integration for [Better Auth](https://www.better-auth.com/), providing seamless authentication capabilities for your NestJS applications.

## Features

- 🚀 **Easy Integration**: Simple setup with NestJS dependency injection
- 🔒 **Secure by Default**: Built-in security features and best practices
- 🛠️ **Flexible Configuration**: Support for both synchronous and asynchronous configuration
- 🌐 **Middleware Support**: Automatic route handling for authentication endpoints
- 📦 **TypeScript Support**: Full TypeScript support with type definitions
- 🔧 **Customizable**: Configurable middleware, CORS, and exception handling

## Installation

```bash
npm install @nestjs-libs/better-auth better-auth
# or
yarn add @nestjs-libs/better-auth better-auth
# or
pnpm add @nestjs-libs/better-auth better-auth
```

## Quick Start

### 1. Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth: betterAuth({
        database: {
          // Your database configuration
        },
        emailAndPassword: {
          enabled: true,
        },
        // Other Better Auth options
      }),
    }),
  ],
})
export class AppModule {}
```

### 2. Using the Service

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

  // Handle custom authentication logic
  async handleAuth(request: any) {
    return this.betterAuthService.handleRequest(request);
  }
}
```

## Configuration Options

### BetterAuthModuleOptions

| Option                      | Type      | Default      | Description                     |
| --------------------------- | --------- | ------------ | ------------------------------- |
| `auth`                      | `Auth`    | **Required** | Better Auth instance            |
| `disableExceptionFilter`    | `boolean` | `false`      | Disable the exception filter ⚠️ |
| `disableTrustedOriginsCors` | `boolean` | `false`      | Disable trusted origins CORS ⚠️ |
| `disableBodyParser`         | `boolean` | `false`      | Disable body parser             |
| `globalPrefix`              | `string`  | `undefined`  | Global prefix for routes        |
| `disableMiddleware`         | `boolean` | `false`      | Disable the middleware ⚠️       |

⚠️ **Security Warning**: Options marked with ⚠️ have security implications. Only disable these features if you understand the risks and have alternative protection mechanisms.

## Advanced Configuration

### Async Configuration

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
          // Other configuration from environment
        }),
        globalPrefix: configService.get('API_PREFIX', 'api'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Using Configuration Class

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

The module automatically configures middleware to handle authentication routes:

- `/api/auth/*` - All authentication endpoints
- `api/auth/*` - Alternative path format

To disable the middleware:

```typescript
BetterAuthModule.forRoot({
  auth: yourBetterAuthInstance,
  disableMiddleware: true, // ⚠️ Security Warning
});
```

## API Reference

### BetterAuthService

#### Methods

- `getAuth(): Auth` - Get the Better Auth instance
- `getOptions(): BetterAuthModuleOptions` - Get module options
- `handleRequest(request: any): Promise<Response>` - Handle authentication request
- `getSession(request: { headers: Record<string, string | string[]> }): Promise<any>` - Get user session
- `signOut(request: { headers: Record<string, string | string[]> }): Promise<any>` - Sign out user

## Examples

### Complete Express.js Setup

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

### Custom Authentication Guard

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

## Security Considerations

1. **Environment Variables**: Store sensitive configuration in environment variables
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Database Security**: Secure your database connection
5. **Secret Management**: Use strong, unique secrets

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure both `@nestjs-libs/better-auth` and `better-auth` are installed
2. **Database connection**: Verify your database configuration
3. **CORS errors**: Check your CORS configuration
4. **Middleware conflicts**: Ensure no conflicting middleware on auth routes

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../.github/README.md) for details.

## License

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Links

- [Better Auth Documentation](https://www.better-auth.com/)
- [NestJS Documentation](https://nestjs.com/)
- [GitHub Repository](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
