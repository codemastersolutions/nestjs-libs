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
- 🛡️ **Rate Limiting**: Built-in rate limiting with configurable thresholds
- 🛠️ **Flexible Configuration**: Support for both synchronous and asynchronous configuration
- 🌐 **Universal Framework Support**: Works seamlessly with both Express.js and Fastify
- 📦 **TypeScript Support**: Full TypeScript support with type definitions
- 🔧 **Customizable**: Configurable middleware, CORS, and exception handling
- ⚡ **Performance Optimized**: Efficient request handling and validation
- 🔐 **Enhanced Security**: Host header validation, request sanitization, and input validation

## Installation

```bash
npm install @cms-nestjs-libs/better-auth better-auth
# or
yarn add @cms-nestjs-libs/better-auth better-auth
# or
pnpm add @cms-nestjs-libs/better-auth better-auth
```

## Environment Variables

The library supports several environment variables for configuration:

### Core Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | `production`, `test`, `development` |
| `AUTH_SECRET` | Secret key for authentication | **Required** | `your-super-secret-key-here` |
| `DATABASE_URL` | Database connection string | **Required** | `postgresql://user:pass@localhost:5432/db` |
| `API_PREFIX` | Global API prefix | `api` | `v1`, `api/v2` |

### Rate Limiting Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|----------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) | `60000` (1 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per window | `100` | `50`, `200` |
| `RATE_LIMIT_ENABLED` | Enable/disable rate limiting | `true` | `false` |

### Security Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|----------|
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` | `https://app.com,https://admin.app.com` |
| `TRUSTED_HOSTS` | Trusted host patterns (comma-separated) | `localhost` | `app.com,*.app.com` |
| `ENABLE_REQUEST_VALIDATION` | Enable request validation | `true` | `false` |

### Example .env File

```env
# Core Configuration
NODE_ENV=production
AUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
API_PREFIX=api/v1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_ENABLED=true

# Security
CORS_ORIGIN=https://yourapp.com,https://admin.yourapp.com
TRUSTED_HOSTS=yourapp.com,*.yourapp.com
ENABLE_REQUEST_VALIDATION=true
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
| `rateLimitWindowMs`         | `number`  | `900000`     | Rate limit window (15 minutes) |
| `rateLimitMaxRequests`      | `number`  | `100`        | Max requests per window         |
| `disableRateLimit`          | `boolean` | `false`      | Disable rate limiting ⚠️        |
| `enableRequestValidation`   | `boolean` | `true`       | Enable request validation       |
| `trustedHosts`              | `string[]`| `['localhost']` | Trusted host patterns        |

⚠️ **Security Warning**: Options marked with ⚠️ have security implications. Only disable these features if you understand the risks and have alternative protection mechanisms.

### Rate Limiting Configuration

The library includes built-in rate limiting to protect against abuse:

```typescript
BetterAuthModule.forRoot({
  auth: yourBetterAuthInstance,
  // Rate limiting configuration
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100, // 100 requests per window
  disableRateLimit: false, // Keep rate limiting enabled
});
```

**Rate Limiting Features:**
- **Per-IP tracking**: Each IP address has its own request counter
- **Sliding window**: Uses a sliding window algorithm for accurate rate limiting
- **Automatic cleanup**: Old entries are automatically cleaned up to prevent memory leaks
- **Environment-based**: Can be configured via environment variables
- **Graceful handling**: Returns HTTP 429 (Too Many Requests) when limit exceeded

### Security Features

The library includes comprehensive security measures:

```typescript
BetterAuthModule.forRoot({
  auth: yourBetterAuthInstance,
  // Security configuration
  enableRequestValidation: true, // Validate all incoming requests
  trustedHosts: ['yourapp.com', '*.yourapp.com'], // Trusted host patterns
  disableTrustedOriginsCors: false, // Keep CORS protection
});
```

**Security Features:**
- **Host Header Validation**: Prevents host header injection attacks
- **Request Sanitization**: Validates and sanitizes all incoming requests
- **Input Validation**: Comprehensive validation of request objects and headers
- **CORS Protection**: Configurable CORS with trusted origins
- **Rate Limiting**: Built-in protection against brute force attacks

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

### Async Configuration with Environment Variables

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
          // Other Better Auth configuration
        }),
        // Global configuration
        globalPrefix: configService.get('API_PREFIX', 'api'),
        
        // Rate limiting configuration from environment
        rateLimitWindowMs: parseInt(configService.get('RATE_LIMIT_WINDOW_MS', '900000')),
        rateLimitMaxRequests: parseInt(configService.get('RATE_LIMIT_MAX_REQUESTS', '100')),
        disableRateLimit: configService.get('RATE_LIMIT_ENABLED', 'true') === 'false',
        
        // Security configuration from environment
        enableRequestValidation: configService.get('ENABLE_REQUEST_VALIDATION', 'true') === 'true',
        trustedHosts: configService.get('TRUSTED_HOSTS', 'localhost').split(','),
        
        // CORS configuration
        disableTrustedOriginsCors: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Production Configuration Example

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BetterAuthModule } from '@cms-nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';
import { database } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    BetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Database setup
        const connectionString = configService.get('DATABASE_URL');
        const client = postgres(connectionString);
        const db = drizzle(client);

        return {
          auth: betterAuth({
            database: database(db),
            secret: configService.get('AUTH_SECRET'),
            
            // Email and password authentication
            emailAndPassword: {
              enabled: true,
              requireEmailVerification: true,
            },
            
            // Social authentication
            socialProviders: {
              google: {
                clientId: configService.get('GOOGLE_CLIENT_ID'),
                clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
              },
              github: {
                clientId: configService.get('GITHUB_CLIENT_ID'),
                clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
              },
            },
            
            // Session configuration
            session: {
              expiresIn: 60 * 60 * 24 * 7, // 7 days
              updateAge: 60 * 60 * 24, // 1 day
            },
          }),
          
          // Production security settings
          globalPrefix: 'api/v1',
          rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
          rateLimitMaxRequests: 50, // Stricter limit for production
          enableRequestValidation: true,
          trustedHosts: [
            'yourapp.com',
            '*.yourapp.com',
            'api.yourapp.com'
          ],
        };
      },
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
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS with proper configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://yourapp.com',
      'https://admin.yourapp.com'
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
  console.log(`🚀 Application is running on: http://localhost:3001`);
}
bootstrap();
```

### Complete Fastify Setup

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS for Fastify
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://yourapp.com'
    ],
    credentials: true,
  });

  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Fastify application is running on: http://localhost:3001`);
}
bootstrap();
```

### Custom Authentication Guard

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private betterAuthService: BetterAuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    try {
      const session = await this.betterAuthService.getSession(request);
      
      if (!session?.user) {
        throw new UnauthorizedException('Authentication required');
      }

      // Attach user to request for use in controllers
      request.user = session.user;
      request.session = session;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
```

### Role-Based Authorization Guard

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private betterAuthService: BetterAuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session = await this.betterAuthService.getSession(request);

    if (!session?.user) {
      throw new ForbiddenException('Authentication required');
    }

    const userRoles = session.user.roles || [];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### Custom Decorators

```typescript
import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

// Public route decorator
export const Public = () => SetMetadata('isPublic', true);

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Current user decorator
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Current session decorator
export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
```

### Complete Controller Example

```typescript
import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Public, Roles, CurrentUser, CurrentSession } from './decorators/auth.decorators';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  @Get('session')
  async getSession(@CurrentSession() session: any) {
    return {
      user: session.user,
      expiresAt: session.expiresAt,
      activeOrganization: session.activeOrganization,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentSession() session: any) {
    await this.betterAuthService.signOut({ headers: session.headers });
  }

  @Get('admin')
  @Roles('admin', 'super-admin')
  async getAdminData(@CurrentUser() user: any) {
    return {
      message: 'This is admin-only data',
      user: user.email,
    };
  }

  @Get('public')
  @Public()
  async getPublicData() {
    return {
      message: 'This endpoint is publicly accessible',
      timestamp: new Date().toISOString(),
    };
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

#### 1. Module Installation Issues

**Problem**: `Module not found` errors

**Solution**:
```bash
# Ensure both packages are installed
npm install @cms-nestjs-libs/better-auth better-auth

# Clear node_modules and reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

#### 2. Database Connection Issues

**Problem**: Database connection errors

**Solution**:
```typescript
// Verify your DATABASE_URL format
// PostgreSQL: postgresql://username:password@localhost:5432/database
// MySQL: mysql://username:password@localhost:3306/database
// SQLite: sqlite:./database.db

// Test connection in your configuration
const connectionString = configService.get('DATABASE_URL');
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}
```

#### 3. CORS Configuration Issues

**Problem**: CORS errors in browser console

**Solution**:
```typescript
// Complete CORS setup
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://yourapp.com',
    // Add all your frontend domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Cookie', // Important for session cookies
  ],
});
```

#### 4. Rate Limiting Issues

**Problem**: Getting 429 (Too Many Requests) errors unexpectedly

**Solution**:
```typescript
// Adjust rate limiting settings
BetterAuthModule.forRoot({
  auth: yourBetterAuthInstance,
  rateLimitWindowMs: 60 * 1000, // 1 minute window
  rateLimitMaxRequests: 200, // Increase limit
  // Or disable for development
  disableRateLimit: process.env.NODE_ENV === 'development',
});
```

#### 5. Session Issues

**Problem**: Sessions not persisting or user getting logged out

**Solution**:
```typescript
// Check your Better Auth session configuration
auth: betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  // Ensure secret is set and consistent
  secret: process.env.AUTH_SECRET,
}),
```

#### 6. Fastify Compatibility Issues

**Problem**: Middleware not working with Fastify

**Solution**:
```typescript
// Install required Fastify middleware support
npm install @fastify/middie

// Register middleware plugin in your Fastify setup
import { FastifyAdapter } from '@nestjs/platform-fastify';

const fastifyAdapter = new FastifyAdapter();
fastifyAdapter.register(require('@fastify/middie'));

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  fastifyAdapter
);
```

#### 7. Environment Variables Not Loading

**Problem**: Configuration values are undefined

**Solution**:
```typescript
// Ensure ConfigModule is properly configured
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        AUTH_SECRET: Joi.string().min(32).required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      }),
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

#### 8. TypeScript Type Issues

**Problem**: TypeScript compilation errors

**Solution**:
```typescript
// Add proper type declarations
// types/better-auth.d.ts
declare module 'better-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      roles?: string[];
    };
  }
}

// Or use proper imports
import type { Auth, Session } from 'better-auth';
```

#### 9. OpenAPI/Swagger Integration Issues

**Problem**: "fail to fetch" errors in Swagger UI

**Solution**:
```typescript
// Ensure CORS includes OPTIONS method
app.enableCors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

// Add OpenAPI configuration
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Your API')
  .setDescription('API with Better Auth integration')
  .setVersion('1.0')
  .addBearerAuth() // Add if using bearer tokens
  .addCookieAuth('session') // Add for session cookies
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

#### 10. Performance Issues

**Problem**: Slow authentication responses

**Solution**:
```typescript
// Optimize database queries
auth: betterAuth({
  database: database(db, {
    // Add database connection pooling
    pool: {
      min: 2,
      max: 10,
    },
  }),
  // Enable session caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },
}),

// Reduce rate limiting overhead for high-traffic apps
rateLimitWindowMs: 60 * 1000, // Shorter window
rateLimitMaxRequests: 1000, // Higher limit
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// Add to your main.ts
if (process.env.NODE_ENV === 'development') {
  // Enable Better Auth debug logs
  process.env.DEBUG = 'better-auth:*';
}

// Or use NestJS logger
import { Logger } from '@nestjs/common';

const logger = new Logger('BetterAuth');
logger.debug('Better Auth configuration:', {
  rateLimitEnabled: !options.disableRateLimit,
  requestValidationEnabled: options.enableRequestValidation,
  trustedHosts: options.trustedHosts,
});
```

### Getting Help

If you're still experiencing issues:

1. **Check the logs**: Enable debug mode and check both NestJS and Better Auth logs
2. **Verify configuration**: Double-check all environment variables and configuration
3. **Test in isolation**: Create a minimal reproduction case
4. **Check versions**: Ensure you're using compatible versions of all dependencies
5. **Community support**: 
   - [GitHub Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
   - [Better Auth Discord](https://discord.gg/better-auth)
   - [NestJS Discord](https://discord.gg/nestjs)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../.github/README.md) for details.

## License

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Links

- [Better Auth Documentation](https://www.better-auth.com/)
- [NestJS Documentation](https://nestjs.com/)
- [GitHub Repository](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
