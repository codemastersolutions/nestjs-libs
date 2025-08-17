# 🚀 NestJS Libs

**📖 Idiomas de Documentación:** [English](README.md) | [Português](README.pt-BR.md) | [Español](README.es.md)

---

Un monorepo integral de bibliotecas NestJS con sistemas automatizados de build, pruebas y releases.

## 📦 Bibliotecas Disponibles

- **[@nestjs-libs/better-auth](./libs/better-auth)** - Integración Better Auth para aplicaciones NestJS

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

## 📋 Scripts Principales

| Comando                     | Descripción                                        |
| --------------------------- | -------------------------------------------------- |
| `pnpm libs:list`            | Lista todas las bibliotecas disponibles            |
| `pnpm libs:status`          | Muestra el estado de cada biblioteca               |
| `pnpm libs:build-all`       | Construye todas las bibliotecas                    |
| `pnpm libs:test-all`        | Prueba todas las bibliotecas                       |
| `pnpm libs:create <nombre>` | Crea una nueva biblioteca                          |
| `pnpm test:all-adapters`    | Prueba con todos los adaptadores (Express/Fastify) |

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
