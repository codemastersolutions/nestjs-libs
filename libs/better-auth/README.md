# @cms-nestjs-libs/better-auth | 🚧 In Development, errors may occur. |

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

[![npm version](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive NestJS integration for [Better Auth](https://www.better-auth.com/), providing seamless authentication capabilities for your NestJS applications.

## Inspiration and Need

This library was inspired by the excellent work of [ThallesP/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth), which provides Better Auth integration for NestJS applications. However, we identified a critical need in the ecosystem: **Fastify support**.

While the original library focuses exclusively on Express.js, many modern NestJS applications leverage Fastify for its superior performance characteristics. This library bridges that gap by providing:

- **Universal Framework Support**: Works seamlessly with both Express.js and Fastify
- **Performance Optimization**: Takes advantage of Fastify's speed while maintaining Express compatibility
- **Unified API**: Consistent authentication experience regardless of the underlying HTTP adapter
- **Enhanced Security**: Additional security measures and validation layers

Our goal is to provide the NestJS community with a robust, framework-agnostic authentication solution that doesn't compromise on performance or security.

## Features

- 🚀 **Easy Integration**: Simple setup with NestJS dependency injection
- 🔒 **Secure by Default**: Built-in security features and best practices
- 🛠️ **Flexible Configuration**: Support for both synchronous and asynchronous configuration
- 🌐 **Middleware Support**: Automatic route handling for authentication endpoints
- 📦 **TypeScript Support**: Full TypeScript support with type definitions
- 🔧 **Customizable**: Configurable middleware, CORS, and exception handling

## Installation

```bash
npm install @cms-nestjs-libs/better-auth better-auth
# or
yarn add @cms-nestjs-libs/better-auth better-auth
# or
pnpm add @cms-nestjs-libs/better-auth better-auth
```

## Available Scripts

The library includes several npm scripts for development and testing:

### 🧪 Testing Scripts

| Command              | Description                                       | Example              |
| -------------------- | ------------------------------------------------- | -------------------- |
| `npm test`           | Run all tests using Jest                          | `npm test`           |
| `npm run test:watch` | Run tests in watch mode for development           | `npm run test:watch` |
| `npm run test:cov`   | Run tests with coverage report (text, HTML, LCOV) | `npm run test:cov`   |
| `npm run test:debug` | Run tests in debug mode with Node.js inspector    | `npm run test:debug` |

### 📊 Coverage Reports

When running `npm run test:cov`, coverage reports are generated in multiple formats:

- **Text**: Console output with coverage summary
- **HTML**: Interactive HTML report in `coverage/` directory
- **LCOV**: Machine-readable format for CI/CD integration

### 🔧 Development Workflow

```bash
# Install dependencies
npm install

# Run tests during development
npm run test:watch

# Generate coverage report
npm run test:cov

# Debug failing tests
npm run test:debug
```

> **💡 Tip**: Use `test:watch` during development to automatically re-run tests when files change.

## Quick Start

### 1. Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@cms-nestjs-libs/better-auth';
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

## Framework Compatibility

This library is designed to work seamlessly with both **Express.js** and **Fastify** frameworks:

### Express.js Support

- Native support for Express request/response objects
- Automatic middleware integration
- Full compatibility with Express ecosystem

### Fastify Support

- Compatible with Fastify through `@fastify/middie` plugin
- Handles raw IncomingMessage objects
- Automatic request object normalization

### Universal Request Handling

The middleware automatically detects and handles different request object formats:

```typescript
// Works with both Express and Fastify
interface UniversalRequest {
  path?: string; // Express format
  url?: string; // Fastify/raw format
  method?: string;
  headers?: Record<string, string | string[]>;
  protocol?: string;
  originalUrl?: string;
  body?: any;
  get?: (header: string) => string | undefined;
}
```

## Security Features

The library includes several built-in security measures:

### Host Header Injection Protection

```typescript
// Automatic validation of host headers
const hostRegex = /^[a-zA-Z0-9.-]+(?::[0-9]+)?$/;
const host = rawHost && hostRegex.test(rawHost) ? rawHost : 'localhost';
```

### Request Validation

```typescript
// All service methods include input validation
if (!request || typeof request !== 'object') {
  throw new Error('Invalid request object provided');
}

if (!request.headers || typeof request.headers !== 'object') {
  throw new Error('Invalid request headers provided');
}
```

### Dependency Injection Tokens

The library uses Symbol-based tokens to prevent injection conflicts:

```typescript
// Available symbols for advanced usage
export const BETTER_AUTH_BEFORE_HOOK = Symbol('BETTER_AUTH_BEFORE_HOOK');
export const BETTER_AUTH_AFTER_HOOK = Symbol('BETTER_AUTH_AFTER_HOOK');
export const BETTER_AUTH_HOOK = Symbol('BETTER_AUTH_HOOK');
export const BETTER_AUTH_INSTANCE = Symbol('BETTER_AUTH_INSTANCE');
export const BETTER_AUTH_OPTIONS = Symbol('BETTER_AUTH_OPTIONS');
```

## Advanced Configuration

### Async Configuration

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

##### `getAuth(): Auth`

Returns the Better Auth instance for direct access to Better Auth functionality.

##### `getOptions(): BetterAuthModuleOptions`

Returns the module configuration options.

##### `handleRequest(request: Request): Promise<Response>`

Handles authentication requests using the Better Auth handler. Includes comprehensive input validation:

- Validates request object structure
- Ensures required properties (url, method) are present
- Compatible with Web API Request format

```typescript
// Example usage
const webRequest = new Request('https://example.com/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
});

const response = await betterAuthService.handleRequest(webRequest);
```

##### `getSession(request: { headers: Record<string, string | string[]> }): Promise<any>`

Retrieves the current user session from request headers. Includes header validation:

- Validates request headers structure
- Ensures headers object is properly formatted

```typescript
// Example usage
const session = await betterAuthService.getSession({
  headers: {
    cookie: 'session=abc123',
    authorization: 'Bearer token123',
  },
});
```

##### `signOut(request: { headers: Record<string, string | string[]> }): Promise<any>`

Signs out the current user. Includes the same header validation as `getSession`.

```typescript
// Example usage
const result = await betterAuthService.signOut({
  headers: {
    cookie: 'session=abc123',
  },
});
```

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

## Security Considerations

1. **Environment Variables**: Store sensitive configuration in environment variables
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Database Security**: Secure your database connection
5. **Secret Management**: Use strong, unique secrets

## CORS Configuration for OpenAPI Plugin

When using Better Auth with the OpenAPI plugin (for Swagger/Scalar documentation), you need to configure CORS properly to handle preflight OPTIONS requests from the documentation interface.

### Required CORS Setup

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Essential CORS configuration for OpenAPI plugin
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Your frontend
      'http://localhost:3001',  // Your API server
      // Add other origins as needed
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

### Why This Is Needed

The OpenAPI plugin generates interactive documentation that makes AJAX requests to your authentication endpoints. Browsers send preflight OPTIONS requests for these cross-origin requests, which need proper CORS headers to succeed.

**Without CORS configuration:**
- OPTIONS requests return 404 (Better Auth doesn't handle preflight)
- Documentation interface shows "fail to fetch" errors
- Authentication endpoints appear broken in the UI

**With proper CORS configuration:**
- OPTIONS requests return 204 with proper CORS headers
- Documentation interface works seamlessly
- All authentication flows function correctly

### Framework-Specific Notes

#### Express.js
```typescript
// CORS is handled automatically by NestJS
app.enableCors({ /* config */ });
```

#### Fastify
```typescript
// CORS is handled automatically by NestJS
// No additional Fastify-specific configuration needed
app.enableCors({ /* config */ });
```

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure both `@cms-nestjs-libs/better-auth` and `better-auth` are installed
2. **Database connection**: Verify your database configuration
3. **CORS errors**: Check your CORS configuration (see CORS section above)
4. **OpenAPI "fail to fetch"**: Ensure CORS is properly configured with OPTIONS method allowed
5. **Middleware conflicts**: Ensure no conflicting middleware on auth routes

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../.github/README.md) for details.

## License

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Links

- [Better Auth Documentation](https://www.better-auth.com/)
- [NestJS Documentation](https://nestjs.com/)
- [GitHub Repository](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
