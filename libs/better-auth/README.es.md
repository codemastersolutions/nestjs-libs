# @cms-nestjs-libs/better-auth

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

[![npm version](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth)
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
- 🛠️ **Configuración Flexible**: Soporte para configuración síncrona y asíncrona
- 🌐 **Soporte de Middleware**: Manejo automático de rutas para endpoints de autenticación
- 📦 **Soporte TypeScript**: Soporte completo de TypeScript con definiciones de tipos
- 🔧 **Personalizable**: Middleware, CORS y manejo de excepciones configurables

## Instalación

```bash
npm install @cms-nestjs-libs/better-auth better-auth
# o
yarn add @cms-nestjs-libs/better-auth better-auth
# o
pnpm add @cms-nestjs-libs/better-auth better-auth
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

### Configuración Asíncrona

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
          // Otra configuración del entorno
        }),
        globalPrefix: configService.get('API_PREFIX', 'api'),
      }),
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

### Guard de Autenticación Personalizado

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

## Consideraciones de Seguridad

1. **Variables de Entorno**: Almacena configuraciones sensibles en variables de entorno
2. **HTTPS**: Siempre usa HTTPS en producción
3. **CORS**: Configura CORS adecuadamente para tu dominio
4. **Seguridad de Base de Datos**: Asegura tu conexión de base de datos
5. **Gestión de Secretos**: Usa secretos fuertes y únicos

## Solución de Problemas

### Problemas Comunes

1. **Módulo no encontrado**: Asegúrate de que tanto `@cms-nestjs-libs/better-auth` como `better-auth` estén instalados
2. **Conexión de base de datos**: Verifica tu configuración de base de datos
3. **Errores de CORS**: Revisa tu configuración de CORS
4. **Conflictos de middleware**: Asegúrate de que no haya middleware conflictivo en las rutas de autenticación

## Contribuyendo

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](../../.github/README.md) para más detalles.

## Licencia

MIT © [CodeMaster Soluções](https://github.com/codemastersolutions)

## Enlaces

- [Documentación de Better Auth](https://www.better-auth.com/)
- [Documentación de NestJS](https://nestjs.com/)
- [Repositorio GitHub](https://github.com/codemastersolutions/nestjs-libs)
- [Issues](https://github.com/codemastersolutions/nestjs-libs/issues)
