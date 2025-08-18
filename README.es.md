# 🚀 NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

Un monorepo integral de bibliotecas NestJS con sistemas automatizados de build, pruebas y releases.

## 📦 Bibliotecas Disponibles

| Biblioteca                                         | Descripción                                      | Paquete NPM                                                                                                                     | Estado           |
| -------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| [@cms-nestjs-libs/better-auth](./libs/better-auth) | Integración Better Auth para aplicaciones NestJS | [![npm](https://img.shields.io/npm/v/@cms-nestjs-libs/better-auth)](https://www.npmjs.com/package/@cms-nestjs-libs/better-auth) | 🚧 En Desarrollo |

## ✨ Características Principales

- 🤖 **CI/CD Automatizado** - Pipeline completo de build y release
- 📦 **Versionado Semántico** - Gestión automática de versiones
- 🏷️ **Releases GitHub** - Creación automática de tags y releases
- 🧪 **Pruebas Integrales** - Pruebas unitarias y E2E con múltiples adaptadores
- ⚡ **Ejecución Paralela** - Builds optimizados por biblioteca
- 🛠️ **Herramientas de Desarrollo** - Scripts para desarrollo local
- 📊 **Reportes de Release** - Resúmenes detallados de ejecución

## 🚀 Inicio Rápido

```bash
# Clona el repositorio
git clone https://github.com/codemastersolutions/nestjs-libs.git
cd nestjs-libs

# Instala las dependencias
pnpm install

# Lista todas las bibliotecas
pnpm libs:list

# Verifica el estado
pnpm libs:status

# Construye todas las bibliotecas
pnpm libs:build-all
```

## 📋 Scripts Disponibles

### 🏗️ Scripts de Build

| Comando                       | Descripción                                         | Ejemplo                          |
| ----------------------------- | --------------------------------------------------- | -------------------------------- |
| `pnpm clean`                  | Elimina todos los artefactos de build               | `pnpm clean`                     |
| `pnpm build`                  | Limpia y construye todas las bibliotecas            | `pnpm build`                     |
| `pnpm build:all-libs`         | Construye todas las bibliotecas secuencialmente     | `pnpm build:all-libs`            |
| `pnpm build:lib <nombre>`     | Construye una biblioteca específica (CJS + ESM)     | `pnpm build:lib better-auth`     |
| `pnpm build:lib:cjs <nombre>` | Construye la versión CommonJS de una biblioteca     | `pnpm build:lib:cjs better-auth` |
| `pnpm build:lib:esm <nombre>` | Construye la versión ES Modules de una biblioteca   | `pnpm build:lib:esm better-auth` |
| `pnpm build:better-auth`      | Construye la biblioteca better-auth específicamente | `pnpm build:better-auth`         |

### 🧪 Scripts de Pruebas

| Comando                       | Descripción                                        | Ejemplo                       |
| ----------------------------- | -------------------------------------------------- | ----------------------------- |
| `pnpm test`                   | Ejecuta todas las pruebas                          | `pnpm test`                   |
| `pnpm test:watch`             | Ejecuta pruebas en modo watch                      | `pnpm test:watch`             |
| `pnpm test:cov`               | Ejecuta pruebas con reporte de cobertura           | `pnpm test:cov`               |
| `pnpm test:debug`             | Ejecuta pruebas en modo debug                      | `pnpm test:debug`             |
| `pnpm test:e2e`               | Ejecuta pruebas end-to-end                         | `pnpm test:e2e`               |
| `pnpm test:better-auth`       | Ejecuta pruebas de la biblioteca better-auth       | `pnpm test:better-auth`       |
| `pnpm test:better-auth:cov`   | Ejecuta pruebas del better-auth con cobertura      | `pnpm test:better-auth:cov`   |
| `pnpm test:better-auth:watch` | Ejecuta pruebas del better-auth en modo watch      | `pnpm test:better-auth:watch` |
| `pnpm test:express`           | Ejecuta pruebas con adaptador Express              | `pnpm test:express`           |
| `pnpm test:fastify`           | Ejecuta pruebas con adaptador Fastify              | `pnpm test:fastify`           |
| `pnpm test:e2e:express`       | Ejecuta pruebas E2E con Express                    | `pnpm test:e2e:express`       |
| `pnpm test:e2e:fastify`       | Ejecuta pruebas E2E con Fastify                    | `pnpm test:e2e:fastify`       |
| `pnpm test:all-adapters`      | Prueba con todos los adaptadores (Express/Fastify) | `pnpm test:all-adapters`      |

### 📦 Scripts de Gestión de Bibliotecas

| Comando                     | Descripción                                         | Ejemplo                         |
| --------------------------- | --------------------------------------------------- | ------------------------------- |
| `pnpm libs:list`            | Lista todas las bibliotecas disponibles             | `pnpm libs:list`                |
| `pnpm libs:build-all`       | Construye todas las bibliotecas                     | `pnpm libs:build-all`           |
| `pnpm libs:test-all`        | Prueba todas las bibliotecas                        | `pnpm libs:test-all`            |
| `pnpm libs:clean-all`       | Limpia artefactos de build de todas las bibliotecas | `pnpm libs:clean-all`           |
| `pnpm libs:status`          | Muestra el estado de cada biblioteca                | `pnpm libs:status`              |
| `pnpm libs:create <nombre>` | Crea una nueva biblioteca                           | `pnpm libs:create mi-nueva-lib` |
| `pnpm libs:validate`        | Valida la estructura de las bibliotecas             | `pnpm libs:validate`            |
| `pnpm libs:package-all`     | Empaqueta todas las bibliotecas para distribución   | `pnpm libs:package-all`         |

### 🚀 Scripts de Publicación

| Comando                                 | Descripción                       | Ejemplo                                  |
| --------------------------------------- | --------------------------------- | ---------------------------------------- |
| `pnpm publish:lib <nombre> [--dry-run]` | Publica una biblioteca específica | `pnpm publish:lib better-auth --dry-run` |
| `pnpm publish:all [--dry-run]`          | Publica todas las bibliotecas     | `pnpm publish:all --dry-run`             |

> **💡 Consejo:** Usa la bandera `--dry-run` para probar la publicación sin realmente publicar en npm.

### 🛠️ Scripts de Desarrollo

| Comando            | Descripción                         | Ejemplo            |
| ------------------ | ----------------------------------- | ------------------ |
| `pnpm start`       | Inicia la aplicación                | `pnpm start`       |
| `pnpm start:dev`   | Inicia en modo desarrollo con watch | `pnpm start:dev`   |
| `pnpm start:debug` | Inicia en modo debug                | `pnpm start:debug` |
| `pnpm start:prod`  | Inicia en modo producción           | `pnpm start:prod`  |
| `pnpm format`      | Formatea código con Prettier        | `pnpm format`      |
| `pnpm lint`        | Analiza y corrige código con ESLint | `pnpm lint`        |

### 📝 Scripts de Git & Commit

| Comando            | Descripción                                 | Ejemplo            |
| ------------------ | ------------------------------------------- | ------------------ |
| `pnpm commit`      | Commit interactivo con Conventional Commits | `pnpm commit`      |
| `pnpm commit:push` | Hace commit y push de los cambios           | `pnpm commit:push` |

### 🔧 Scripts Utilitarios

| Comando        | Descripción              | Ejemplo        |
| -------------- | ------------------------ | -------------- |
| `pnpm prepare` | Configura hooks de Husky | `pnpm prepare` |

## 🤖 Sistema Automatizado

**Disparadores:**

- Pull request fusionado en `main` con cambios en `libs/` → Build automático
- Ejecución manual → Build de todas las bibliotecas con selección de versión

**Flujo:**

1. 🔍 Detecta bibliotecas modificadas
2. 📦 Construye solo las bibliotecas cambiadas
3. 🔢 Incrementa versiones automáticamente
4. 🧪 Ejecuta pruebas de validación
5. 🏷️ Crea tags en formato `{lib}-v{version}`
6. 🎉 Crea releases con artefactos
7. 📊 Genera reportes de ejecución

## 🤝 Contribuyendo

Vea nuestra [Guía de Contribución](./CONTRIBUTING.es.md) para información detallada sobre cómo contribuir a este proyecto.

### 📝 Directrices de Commit

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/). Use la herramienta interactiva de commit:

```bash
pnpm commit
```

Vea nuestra [Guía de Conventional Commits](./.github/CONVENTIONAL_COMMITS.md) para información detallada.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ve el archivo [LICENSE](LICENSE) para detalles.

## 📚 Documentación Adicional

- [🚀 Sistema de Build y Release](./.github/BUILD_AND_RELEASE.md)
- [🧪 Matriz de Pruebas](./.github/TEST_MATRIX.md)
- [🛡️ Protección de Branch](./.github/branch-protection.md)
- [🤝 Directrices de Contribución](./CONTRIBUTING.es.md)

## 🏢 Acerca de

**CodeMaster Soluções** - ¡Construyendo el futuro con tecnología de vanguardia! 🚀

---

_Hecho con ❤️ por el equipo CodeMaster_
