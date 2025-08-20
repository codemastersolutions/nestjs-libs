# @cms-nestjs-libs/better-auth | 🚧 En Desarrollo, pueden ocurrir errores. |

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

[![npm version](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/@cms-nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una integración integral de NestJS para [Better Auth](https://www.better-auth.com/), proporcionando capacidades de autenticación perfectas para tus aplicaciones NestJS.

## Inspiración y Necesidad

Esta biblioteca fue inspirada por el excelente trabajo de [ThallesP/nestjs-better-auth](https://github.com/ThallesP/nestjs-better-auth), que proporciona integración de Better Auth para aplicaciones NestJS. Sin embargo, identificamos una necesidad crítica en el ecosistema: **soporte para Fastify**.

Mientras que la biblioteca original se enfoca exclusivamente en Express.js, muchas aplicaciones NestJS modernas aprovechan Fastify por sus características superiores de rendimiento. Esta biblioteca llena ese vacío proporcionando:

- **Soporte Universal de Frameworks**: Funciona perfectamente con Express.js y Fastify
- **Optimización de Rendimiento**: Aprovecha la velocidad de Fastify manteniendo compatibilidad con Express
- **API Unificada**: Experiencia de autenticación consistente independientemente del adaptador HTTP subyacente
- **Seguridad Mejorada**: Medidas de seguridad adicionales y capas de validación

Nuestro objetivo es proporcionar a la comunidad NestJS una solución de autenticación robusta y agnóstica de frameworks que no comprometa el rendimiento o la seguridad.

## Características

- 🚀 **Integración Fácil**: Configuración simple con inyección de dependencias de NestJS
- 🔒 **Seguro por Defecto**: Características de seguridad integradas y mejores prácticas
- 🛡️ **Rate Limiting**: Rate limiting integrado con límites configurables
- 🛠️ **Configuración Flexible**: Soporte para configuración síncrona y asíncrona
- 🌐 **Soporte Universal de Frameworks**: Funciona perfectamente con Express.js y Fastify
- 📦 **Soporte TypeScript**: Soporte completo de TypeScript con definiciones de tipos
- 🔧 **Personalizable**: Middleware, CORS y manejo de excepciones configurables
- ⚡ **Optimizado para Rendimiento**: Manejo eficiente de solicitudes y validación
- 🔐 **Seguridad Mejorada**: Validación de host header, sanitización de solicitudes y validación de entrada

## Instalación

```bash
npm install @cms-nestjs-libs/better-auth better-auth
# o
yarn add @cms-nestjs-libs/better-auth better-auth
# o
pnpm add @cms-nestjs-libs/better-auth better-auth
```

## Variables de Entorno

La biblioteca soporta configuración a través de variables de entorno para mayor flexibilidad y seguridad:

### Configuración Principal

```env
# Configuración de la base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/mi_app

# Configuración de Better Auth
BETTER_AUTH_SECRET=tu-secreto-super-seguro-aqui
BETTER_AUTH_BASE_URL=http://localhost:3000
```

### Configuración de Rate Limiting

```env
# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000        # 15 minutos en milisegundos
RATE_LIMIT_MAX_REQUESTS=100        # Máximo 100 solicitudes por ventana
DISABLE_RATE_LIMIT=false           # Establecer en 'true' para deshabilitar
```

### Configuración de Seguridad

```env
# Seguridad (opcional)
ENABLE_REQUEST_VALIDATION=true     # Habilitar validación de solicitudes
TRUSTED_HOSTS=localhost,mi-dominio.com,*.mi-app.com  # Hosts confiables separados por comas
```

### Ejemplo de archivo .env

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/mi_app

# Better Auth
BETTER_AUTH_SECRET=mi-secreto-super-seguro-de-32-caracteres
BETTER_AUTH_BASE_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DISABLE_RATE_LIMIT=false

# Seguridad
ENABLE_REQUEST_VALIDATION=true
TRUSTED_HOSTS=localhost,127.0.0.1,mi-dominio.com

# Entorno
NODE_ENV=development
```

## Scripts Disponibles

La biblioteca incluye varios scripts npm para desarrollo y pruebas:

### 🧪 Scripts de Pruebas

| Comando              | Descripción                                                  | Ejemplo              |
| -------------------- | ------------------------------------------------------------ | -------------------- |
| `npm test`           | Ejecuta todas las pruebas usando Jest                        | `npm test`           |
| `npm run test:watch` | Ejecuta pruebas en modo watch para desarrollo                | `npm run test:watch` |
| `npm run test:cov`   | Ejecuta pruebas con reporte de cobertura (texto, HTML, LCOV) | `npm run test:cov`   |
| `npm run test:debug` | Ejecuta pruebas en modo debug con Node.js inspector          | `npm run test:debug` |

### 📊 Reportes de Cobertura

Al ejecutar `npm run test:cov`, se generan reportes de cobertura en múltiples formatos:

- **Texto**: Salida en consola con resumen de cobertura
- **HTML**: Reporte HTML interactivo en el directorio `coverage/`
- **LCOV**: Formato legible por máquina para integración CI/CD

### 🔧 Flujo de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar pruebas durante desarrollo
npm run test:watch

# Generar reporte de cobertura
npm run test:cov

# Debuggear pruebas que fallan
npm run test:debug
```

> **💡 Consejo**: Usa `test:watch` durante el desarrollo para re-ejecutar automáticamente las pruebas cuando los archivos cambien.

## Inicio Rápido

### 1. Configuración Básica

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@cms-nestjs-libs/better-auth';
import { betterAuth } from 'better-auth';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth: betterAuth({
        database: {
          // Tu configuración de base de datos
        },
        emailAndPassword: {
          enabled: true,
        },
        // Otras opciones de Better Auth
      }),
    }),
  ],
})
export class AppModule {}
```

### 2. Usando el Servicio

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

  // Manejar lógica de autenticación personalizada
  async handleAuth(request: any) {
    return this.betterAuthService.handleRequest(request);
  }
}
```

## Opciones de Configuración

### BetterAuthModuleOptions

| Opción                      | Tipo      | Por Defecto   | Descripción                                 |
| --------------------------- | --------- | ------------- | ------------------------------------------- |
| `auth`                      | `Auth`    | **Requerido** | Instancia de Better Auth                    |
| `disableExceptionFilter`    | `boolean` | `false`       | Deshabilitar filtro de excepciones ⚠️       |
| `disableTrustedOriginsCors` | `boolean` | `false`       | Deshabilitar CORS de orígenes confiables ⚠️ |
| `disableBodyParser`         | `boolean` | `false`       | Deshabilitar analizador de cuerpo           |
| `globalPrefix`              | `string`  | `undefined`   | Prefijo global para rutas                   |
| `disableMiddleware`         | `boolean` | `false`       | Deshabilitar el middleware ⚠️               |
| `rateLimitWindowMs`         | `number`  | `900000`      | Ventana de tiempo para rate limiting (ms)   |
| `rateLimitMaxRequests`      | `number`  | `100`         | Máximo de solicitudes por ventana           |
| `disableRateLimit`          | `boolean` | `false`       | Deshabilitar rate limiting                  |
| `enableRequestValidation`   | `boolean` | `true`        | Habilitar validación de solicitudes         |
| `trustedHosts`              | `string[]`| `[]`          | Lista de hosts confiables                   |

⚠️ **Advertencia de Seguridad**: Las opciones marcadas con ⚠️ tienen implicaciones de seguridad. Deshabilite estas características solo si comprende los riesgos y tiene mecanismos de protección alternativos.

## Compatibilidad de Frameworks

Esta biblioteca está diseñada para funcionar perfectamente con los frameworks **Express.js** y **Fastify**:

### Soporte para Express.js

- Soporte nativo para objetos request/response de Express
- Integración automática de middleware
- Compatibilidad completa con el ecosistema Express

### Soporte para Fastify

- Compatible con Fastify a través del plugin `@fastify/middie`
- Maneja objetos IncomingMessage en bruto
- Normalización automática de objetos de solicitud

### Manejo Universal de Solicitudes

El middleware detecta y maneja automáticamente diferentes formatos de objetos de solicitud:

```typescript
// Funciona con Express y Fastify
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

## Configuración de Rate Limiting

La biblioteca incluye rate limiting integrado para proteger tu aplicación contra abuso:

### Configuración Básica

```typescript
BetterAuthModule.forRoot({
  auth: betterAuth({ /* tu configuración */ }),
  rateLimitWindowMs: 900000,     // 15 minutos
  rateLimitMaxRequests: 100,     // 100 solicitudes por ventana
  disableRateLimit: false,       // Habilitar rate limiting
})
```

### Configuración con Variables de Entorno

```typescript
BetterAuthModule.forRootAsync({
  useFactory: () => ({
    auth: betterAuth({ /* tu configuración */ }),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    disableRateLimit: process.env.DISABLE_RATE_LIMIT === 'true',
  }),
})
```

### Comportamiento del Rate Limiting

- **Ventana Deslizante**: Usa una ventana de tiempo deslizante para contar solicitudes
- **Por IP**: Rate limiting aplicado por dirección IP del cliente
- **Respuesta HTTP 429**: Retorna "Too Many Requests" cuando se excede el límite
- **Headers Informativos**: Incluye headers `X-RateLimit-*` en las respuestas

## Características de Seguridad

La biblioteca incluye varias medidas de seguridad integradas:

### Protección contra Inyección de Encabezado Host

```typescript
// Validación automática de encabezados host
const hostRegex = /^[a-zA-Z0-9.-]+(?::[0-9]+)?$/;
const host = rawHost && hostRegex.test(rawHost) ? rawHost : 'localhost';
```

### Validación de Solicitudes

```typescript
// Todos los métodos del servicio incluyen validación de entrada
if (!request || typeof request !== 'object') {
  throw new Error('Objeto de solicitud inválido proporcionado');
}

if (!request.headers || typeof request.headers !== 'object') {
  throw new Error('Encabezados de solicitud inválidos proporcionados');
}
```

### Tokens de Inyección de Dependencias

La biblioteca usa tokens basados en Symbol para prevenir conflictos de inyección:

```typescript
// Símbolos disponibles para uso avanzado
export const BETTER_AUTH_BEFORE_HOOK = Symbol('BETTER_AUTH_BEFORE_HOOK');
export const BETTER_AUTH_AFTER_HOOK = Symbol('BETTER_AUTH_AFTER_HOOK');
export const BETTER_AUTH_HOOK = Symbol('BETTER_AUTH_HOOK');
export const BETTER_AUTH_INSTANCE = Symbol('BETTER_AUTH_INSTANCE');
export const BETTER_AUTH_OPTIONS = Symbol('BETTER_AUTH_OPTIONS');
```

## Configuración Avanzada

### Configuración Asíncrona con Variables de Entorno

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
          secret: configService.get('BETTER_AUTH_SECRET'),
          baseURL: configService.get('BETTER_AUTH_BASE_URL'),
          emailAndPassword: {
            enabled: true,
          },
        }),
        // Configuración de Rate Limiting
        rateLimitWindowMs: parseInt(configService.get('RATE_LIMIT_WINDOW_MS')) || 900000,
        rateLimitMaxRequests: parseInt(configService.get('RATE_LIMIT_MAX_REQUESTS')) || 100,
        disableRateLimit: configService.get('DISABLE_RATE_LIMIT') === 'true',
        // Configuración de Seguridad
        enableRequestValidation: configService.get('ENABLE_REQUEST_VALIDATION') !== 'false',
        trustedHosts: configService.get('TRUSTED_HOSTS')?.split(',') || [],
        globalPrefix: configService.get('API_PREFIX', 'api'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Ejemplo de Configuración de Producción

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
        const connectionString = configService.get('DATABASE_URL');
        const client = postgres(connectionString);
        const db = drizzle(client);

        return {
          auth: betterAuth({
            database: database(db),
            secret: configService.get('BETTER_AUTH_SECRET'),
            baseURL: configService.get('BETTER_AUTH_BASE_URL'),
            emailAndPassword: {
              enabled: true,
              requireEmailVerification: true,
            },
            session: {
              expiresIn: 60 * 60 * 24 * 7, // 7 días
              updateAge: 60 * 60 * 24, // 1 día
            },
          }),
          // Configuración de seguridad para producción
          rateLimitWindowMs: 900000, // 15 minutos
          rateLimitMaxRequests: 50,  // Más restrictivo en producción
          disableRateLimit: false,
          enableRequestValidation: true,
          trustedHosts: [
            configService.get('PRODUCTION_DOMAIN'),
            configService.get('STAGING_DOMAIN'),
          ].filter(Boolean),
          disableExceptionFilter: false,
          disableTrustedOriginsCors: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Usando Clase de Configuración

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

El módulo configura automáticamente el middleware para manejar rutas de autenticación:

- `/api/auth/*` - Todos los endpoints de autenticación
- `api/auth/*` - Formato de ruta alternativo

Para deshabilitar el middleware:

```typescript
BetterAuthModule.forRoot({
  auth: tuInstanciaBetterAuth,
  disableMiddleware: true, // ⚠️ Advertencia de Seguridad
});
```

## Referencia de API

### BetterAuthService

#### `getAuth(): Auth`

Devuelve la instancia de Better Auth configurada.

```typescript
const auth = this.betterAuthService.getAuth();
// Usar la instancia auth para operaciones personalizadas
```

#### `getOptions(): BetterAuthModuleOptions`

Devuelve las opciones de configuración del módulo.

```typescript
const options = this.betterAuthService.getOptions();
console.log('Prefijo global:', options.globalPrefix);
```

#### `handleRequest(request: any): Promise<Response>`

Maneja una solicitud de autenticación. Valida la entrada y procesa la solicitud a través de Better Auth.

**Parámetros:**

- `request`: Objeto de solicitud (Express, Fastify o formato bruto)

**Validación:**

- Verifica si el objeto de solicitud es válido
- Valida la presencia y formato de los encabezados
- Normaliza diferentes formatos de solicitud

```typescript
try {
  const response = await this.betterAuthService.handleRequest(req);
  // Procesar respuesta
} catch (error) {
  // Manejar error de validación o procesamiento
}
```

#### `getSession(request: any): Promise<Session | null>`

Obtiene la sesión del usuario de la solicitud. Incluye validación de entrada.

**Parámetros:**

- `request`: Objeto de solicitud que contiene cookies/tokens de sesión

**Devuelve:**

- `Session`: Objeto de sesión si es válida
- `null`: Si no se encuentra una sesión válida

```typescript
const session = await this.betterAuthService.getSession(req);
if (session) {
  console.log('Usuario conectado:', session.user.id);
} else {
  console.log('Usuario no autenticado');
}
```

#### `signOut(request: any): Promise<Response>`

Cierra la sesión del usuario, invalidando su sesión. Incluye validación de entrada.

**Parámetros:**

- `request`: Objeto de solicitud que contiene información de sesión

**Devuelve:**

- `Response`: Respuesta de cierre de sesión con cookies limpiadas

```typescript
const logoutResponse = await this.betterAuthService.signOut(req);
// La respuesta incluye encabezados para limpiar cookies de sesión
```

## Ejemplos

### Configuración Completa de Express.js

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS si es necesario
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

### Configuración Completa de Fastify

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Registrar plugin middie para compatibilidad con middleware
  await app.register(require('@fastify/middie'));

  // Configurar CORS
  await app.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
```

### Guard de Autenticación Personalizado

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private betterAuthService: BetterAuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta es pública
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
      if (session?.user) {
        request.user = session.user;
        request.session = session;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
```

### Guard de Autorización Basado en Roles

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '@cms-nestjs-libs/better-auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private betterAuthService: BetterAuthService,
    private reflector: Reflector,
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
      return false;
    }

    // Asumiendo que el usuario tiene un campo 'role' o 'roles'
    const userRoles = Array.isArray(session.user.role) 
      ? session.user.role 
      : [session.user.role];

    return requiredRoles.some(role => userRoles.includes(role));
  }
}
```

### Decoradores Personalizados

```typescript
import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorador para rutas públicas
export const Public = () => SetMetadata('isPublic', true);

// Decorador para roles requeridos
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Decorador para obtener el usuario actual
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Decorador para obtener la sesión actual
export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
```

### Ejemplo de Controlador Completo

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Public, Roles, CurrentUser, CurrentSession } from './decorators';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  @Get('profile')
  getProfile(@CurrentUser() user: any, @CurrentSession() session: any) {
    return {
      user,
      sessionInfo: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    };
  }

  @Get('public-info')
  @Public()
  getPublicInfo() {
    return { message: 'Esta información es pública' };
  }

  @Get('admin-only')
  @Roles('admin')
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'Datos solo para administradores',
      adminUser: user,
    };
  }

  @Post('moderator-action')
  @Roles('admin', 'moderator')
  performModeratorAction(@CurrentUser() user: any) {
    return {
      message: 'Acción realizada por moderador/admin',
      performedBy: user.id,
    };
  }
}
```

## Consideraciones de Seguridad

1. **Variables de Entorno**: Almacena configuraciones sensibles en variables de entorno
2. **HTTPS**: Siempre usa HTTPS en producción
3. **CORS**: Configura CORS adecuadamente para tu dominio
4. **Seguridad de Base de Datos**: Asegura tu conexión de base de datos
5. **Gestión de Secretos**: Usa secretos fuertes y únicos

## Configuración CORS para Plugin OpenAPI

Al usar Better Auth con el plugin OpenAPI (para documentación Swagger/Scalar), necesitas configurar CORS adecuadamente para manejar las solicitudes OPTIONS de preflight desde la interfaz de documentación.

### Configuración CORS Requerida

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS esencial para plugin OpenAPI
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Tu frontend
      'http://localhost:3001',  // Tu servidor API
      // Agrega otros orígenes según sea necesario
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

### Por Qué Esto Es Necesario

El plugin OpenAPI genera documentación interactiva que hace solicitudes AJAX a tus endpoints de autenticación. Los navegadores envían solicitudes OPTIONS de preflight para estas solicitudes cross-origin, que necesitan headers CORS adecuados para tener éxito.

**Sin configuración CORS:**
- Las solicitudes OPTIONS devuelven 404 (Better Auth no maneja preflight)
- La interfaz de documentación muestra errores "fail to fetch"
- Los endpoints de autenticación aparecen rotos en la UI

**Con configuración CORS adecuada:**
- Las solicitudes OPTIONS devuelven 204 con headers CORS adecuados
- La interfaz de documentación funciona perfectamente
- Todos los flujos de autenticación funcionan correctamente

### Notas Específicas por Framework

#### Express.js
```typescript
// CORS es manejado automáticamente por NestJS
app.enableCors({ /* config */ });
```

#### Fastify
```typescript
// CORS es manejado automáticamente por NestJS
// No se necesita configuración específica de Fastify
app.enableCors({ /* config */ });
```

## Solución de Problemas

### Problemas de Instalación del Módulo

**Error**: `Cannot find module '@cms-nestjs-libs/better-auth'`

```bash
# Solución: Instalar todas las dependencias requeridas
npm install @cms-nestjs-libs/better-auth better-auth
# o
yarn add @cms-nestjs-libs/better-auth better-auth
```

### Problemas de Conexión a Base de Datos

**Error**: `Database connection failed`

```typescript
// Solución: Verificar configuración de base de datos
BetterAuthModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    auth: betterAuth({
      database: {
        provider: 'postgresql', // o 'mysql', 'sqlite'
        url: configService.get('DATABASE_URL'), // Verificar que esta variable exista
      },
      // ... resto de configuración
    }),
  }),
  inject: [ConfigService],
})
```

### Problemas de CORS

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

```typescript
// Solución: Configurar CORS correctamente
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://tu-dominio.com',
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
```

### Problemas de Rate Limiting

**Error**: `Too Many Requests (429)`

```typescript
// Solución: Ajustar configuración de rate limiting
BetterAuthModule.forRoot({
  auth: betterAuth({ /* configuración */ }),
  rateLimitWindowMs: 900000,     // Aumentar ventana de tiempo
  rateLimitMaxRequests: 200,     // Aumentar límite de solicitudes
  disableRateLimit: true,        // Deshabilitar temporalmente para debugging
})
```

### Problemas de Gestión de Sesiones

**Error**: `Session not found` o `Invalid session`

```typescript
// Solución: Verificar configuración de cookies y sesiones
const session = await this.betterAuthService.getSession(request);
if (!session) {
  // Manejar caso de sesión no válida
  throw new UnauthorizedException('Sesión no válida');
}

// Verificar configuración de Better Auth
betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24,     // 1 día
  },
  // ... resto de configuración
})
```

### Problemas de Compatibilidad con Fastify

**Error**: `Middleware not working with Fastify`

```typescript
// Solución: Registrar plugin middie
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter()
  );

  // IMPORTANTE: Registrar middie antes de usar middleware
  await app.register(require('@fastify/middie'));

  await app.listen(3000);
}
```

### Problemas de Variables de Entorno

**Error**: `Environment variables not loaded`

```typescript
// Solución: Configurar ConfigModule correctamente
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'], // Verificar rutas de archivos
      load: [() => ({
        // Valores por defecto
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'default-secret',
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/db',
      })],
    }),
    // ... resto de módulos
  ],
})
```

### Problemas de Tipos TypeScript

**Error**: `Type errors with Better Auth types`

```typescript
// Solución: Crear tipos personalizados
// types/better-auth.d.ts
declare module 'better-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string | string[];
    // Agregar campos personalizados aquí
  }

  interface Session {
    user: User;
    id: string;
    expiresAt: Date;
    // Agregar campos de sesión personalizados aquí
  }
}
```

### Problemas de Integración OpenAPI/Swagger

**Error**: `OpenAPI documentation not working`

```typescript
// Solución: Configurar Swagger correctamente
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('API con Better Auth')
  .setDescription('API con autenticación')
  .setVersion('1.0')
  .addBearerAuth() // Para autenticación Bearer
  .addCookieAuth('session') // Para autenticación por cookies
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
  },
});
```

### Problemas de Rendimiento

**Error**: `Slow authentication responses`

```typescript
// Solución: Optimizar configuración
BetterAuthModule.forRoot({
  auth: betterAuth({
    // Usar pool de conexiones para base de datos
    database: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 10,
      },
    },
    // Configurar cache de sesiones
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  }),
  // Optimizar rate limiting
  rateLimitWindowMs: 60000,  // Ventana más corta
  rateLimitMaxRequests: 1000, // Límite más alto
})
```

### Modo Debug

Para habilitar logging detallado:

```typescript
// En tu archivo main.ts
if (process.env.NODE_ENV === 'development') {
  // Habilitar logging detallado
  process.env.DEBUG = 'better-auth:*';
}
```

### Obtener Ayuda

Si continúas teniendo problemas:

1. **Revisa los logs**: Habilita el modo debug para obtener más información
2. **Verifica la documentación**: [Better Auth Docs](https://www.better-auth.com/)
3. **Busca issues existentes**: [GitHub Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
4. **Crea un nuevo issue**: Incluye código de reproducción y logs de error

## Contribuyendo

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](../../.github/README.md) para más detalles.

## Licencia

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Enlaces

- [Documentación de Better Auth](https://www.better-auth.com/)
- [Documentación de NestJS](https://nestjs.com/)
- [Repositorio GitHub](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
