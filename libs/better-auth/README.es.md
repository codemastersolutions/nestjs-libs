# @nestjs-libs/better-auth

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

[![npm version](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth.svg)](https://badge.fury.io/js/%40nestjs-libs%2Fbetter-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una integración integral de NestJS para [Better Auth](https://www.better-auth.com/), proporcionando capacidades de autenticación perfectas para tus aplicaciones NestJS.

## Características

- 🚀 **Integración Fácil**: Configuración simple con inyección de dependencias de NestJS
- 🔒 **Seguro por Defecto**: Características de seguridad integradas y mejores prácticas
- 🛠️ **Configuración Flexible**: Soporte para configuración síncrona y asíncrona
- 🌐 **Soporte de Middleware**: Manejo automático de rutas para endpoints de autenticación
- 📦 **Soporte TypeScript**: Soporte completo de TypeScript con definiciones de tipos
- 🔧 **Personalizable**: Middleware, CORS y manejo de excepciones configurables

## Instalación

```bash
npm install @nestjs-libs/better-auth better-auth
# o
yarn add @nestjs-libs/better-auth better-auth
# o
pnpm add @nestjs-libs/better-auth better-auth
```

## Inicio Rápido

### 1. Configuración Básica

```typescript
import { Module } from '@nestjs/common';
import { BetterAuthModule } from '@nestjs-libs/better-auth';
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

  // Manejar lógica de autenticación personalizada
  async handleAuth(request: any) {
    return this.betterAuthService.handleRequest(request);
  }
}
```

## Opciones de Configuración

### BetterAuthModuleOptions

| Opción                      | Tipo      | Predeterminado | Descripción                                 |
| --------------------------- | --------- | -------------- | ------------------------------------------- |
| `auth`                      | `Auth`    | **Requerido**  | Instancia de Better Auth                    |
| `disableExceptionFilter`    | `boolean` | `false`        | Deshabilitar el filtro de excepciones ⚠️    |
| `disableTrustedOriginsCors` | `boolean` | `false`        | Deshabilitar CORS de orígenes confiables ⚠️ |
| `disableBodyParser`         | `boolean` | `false`        | Deshabilitar analizador de cuerpo           |
| `globalPrefix`              | `string`  | `undefined`    | Prefijo global para rutas                   |
| `disableMiddleware`         | `boolean` | `false`        | Deshabilitar el middleware ⚠️               |

⚠️ **Advertencia de Seguridad**: Las opciones marcadas con ⚠️ tienen implicaciones de seguridad. Solo deshabilita estas características si entiendes los riesgos y tienes mecanismos de protección alternativos.

## Configuración Avanzada

### Configuración Asíncrona

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

#### Métodos

- `getAuth(): Auth` - Obtener la instancia de Better Auth
- `getOptions(): BetterAuthModuleOptions` - Obtener opciones del módulo
- `handleRequest(request: any): Promise<Response>` - Manejar solicitud de autenticación
- `getSession(request: { headers: Record<string, string | string[]> }): Promise<any>` - Obtener sesión del usuario
- `signOut(request: { headers: Record<string, string | string[]> }): Promise<any>` - Cerrar sesión del usuario

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

## Consideraciones de Seguridad

1. **Variables de Entorno**: Almacena configuraciones sensibles en variables de entorno
2. **HTTPS**: Siempre usa HTTPS en producción
3. **CORS**: Configura CORS adecuadamente para tu dominio
4. **Seguridad de Base de Datos**: Asegura tu conexión de base de datos
5. **Gestión de Secretos**: Usa secretos fuertes y únicos

## Solución de Problemas

### Problemas Comunes

1. **Módulo no encontrado**: Asegúrate de que tanto `@nestjs-libs/better-auth` como `better-auth` estén instalados
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
