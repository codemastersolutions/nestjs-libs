# 🚀 NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

A comprehensive monorepo of NestJS libraries with automated build, testing, and release systems.

## 📦 Available Libraries

| Library                                            | Description                                     | NPM Package                                                                                                                     | Status            |
| -------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| [@cms-nestjs-libs/better-auth](./libs/better-auth) | Better Auth integration for NestJS applications | [![npm](https://img.shields.io/npm/v/@cms-nestjs-libs/better-auth)](https://www.npmjs.com/package/@cms-nestjs-libs/better-auth) | 🚧 In Development |

## ✨ Key Features

- 🤖 **Automated CI/CD** - Complete build and release pipeline
- 📦 **Semantic Versioning** - Automatic version management
- 🏷️ **GitHub Releases** - Automated tagging and release creation
- 🧪 **Comprehensive Testing** - Unit and E2E tests with multiple adapters
- ⚡ **Parallel Execution** - Optimized builds per library
- 🛠️ **Development Tools** - Scripts for local development
- 📊 **Release Reports** - Detailed execution summaries

## 🚀 Quick Start

### Using Published Packages

```bash
# Install a specific library
npm install @cms-nestjs-libs/better-auth
# or
pnpm add @cms-nestjs-libs/better-auth
# or
yarn add @cms-nestjs-libs/better-auth
```

### Development Setup

```bash
# Clone the repository
git clone https://github.com/codemastersolutions/nestjs-libs.git
cd nestjs-libs

# Install dependencies
pnpm install

# List all libraries
pnpm libs:list

# Check status
pnpm libs:status

# Build all libraries
pnpm libs:build-all
```

## 📋 Available Scripts

### 🏗️ Build Scripts

| Command                     | Description                                | Example                          |
| --------------------------- | ------------------------------------------ | -------------------------------- |
| `pnpm clean`                | Remove all build artifacts                 | `pnpm clean`                     |
| `pnpm build`                | Clean and build all libraries              | `pnpm build`                     |
| `pnpm build:all-libs`       | Build all libraries sequentially           | `pnpm build:all-libs`            |
| `pnpm build:lib <name>`     | Build a specific library (CJS + ESM)       | `pnpm build:lib better-auth`     |
| `pnpm build:lib:cjs <name>` | Build CommonJS version of a library        | `pnpm build:lib:cjs better-auth` |
| `pnpm build:lib:esm <name>` | Build ES Modules version of a library      | `pnpm build:lib:esm better-auth` |
| `pnpm build:better-auth`    | Build the better-auth library specifically | `pnpm build:better-auth`         |

### 🧪 Testing Scripts

| Command                       | Description                              | Example                       |
| ----------------------------- | ---------------------------------------- | ----------------------------- |
| `pnpm test`                   | Run all tests                            | `pnpm test`                   |
| `pnpm test:watch`             | Run tests in watch mode                  | `pnpm test:watch`             |
| `pnpm test:cov`               | Run tests with coverage report           | `pnpm test:cov`               |
| `pnpm test:debug`             | Run tests in debug mode                  | `pnpm test:debug`             |
| `pnpm test:e2e`               | Run end-to-end tests                     | `pnpm test:e2e`               |
| `pnpm test:better-auth`       | Run tests for better-auth library        | `pnpm test:better-auth`       |
| `pnpm test:better-auth:cov`   | Run better-auth tests with coverage      | `pnpm test:better-auth:cov`   |
| `pnpm test:better-auth:watch` | Run better-auth tests in watch mode      | `pnpm test:better-auth:watch` |
| `pnpm test:express`           | Run tests with Express adapter           | `pnpm test:express`           |
| `pnpm test:fastify`           | Run tests with Fastify adapter           | `pnpm test:fastify`           |
| `pnpm test:e2e:express`       | Run E2E tests with Express               | `pnpm test:e2e:express`       |
| `pnpm test:e2e:fastify`       | Run E2E tests with Fastify               | `pnpm test:e2e:fastify`       |
| `pnpm test:all-adapters`      | Test with all adapters (Express/Fastify) | `pnpm test:all-adapters`      |

### 📦 Library Management Scripts

| Command                   | Description                            | Example                       |
| ------------------------- | -------------------------------------- | ----------------------------- |
| `pnpm libs:list`          | List all available libraries           | `pnpm libs:list`              |
| `pnpm libs:build-all`     | Build all libraries                    | `pnpm libs:build-all`         |
| `pnpm libs:test-all`      | Test all libraries                     | `pnpm libs:test-all`          |
| `pnpm libs:clean-all`     | Clean all library build artifacts      | `pnpm libs:clean-all`         |
| `pnpm libs:status`        | Show status of each library            | `pnpm libs:status`            |
| `pnpm libs:create <name>` | Create a new library                   | `pnpm libs:create my-new-lib` |
| `pnpm libs:validate`      | Validate library structure             | `pnpm libs:validate`          |
| `pnpm libs:package-all`   | Package all libraries for distribution | `pnpm libs:package-all`       |

### 🚀 Publishing Scripts

| Command                               | Description                | Example                                  |
| ------------------------------------- | -------------------------- | ---------------------------------------- |
| `pnpm publish:lib <name> [--dry-run]` | Publish a specific library | `pnpm publish:lib better-auth --dry-run` |
| `pnpm publish:all [--dry-run]`        | Publish all libraries      | `pnpm publish:all --dry-run`             |

> **💡 Tip:** Use `--dry-run` flag to test publishing without actually publishing to npm.

### 🛠️ Development Scripts

| Command            | Description                          | Example            |
| ------------------ | ------------------------------------ | ------------------ |
| `pnpm start`       | Start the application                | `pnpm start`       |
| `pnpm start:dev`   | Start in development mode with watch | `pnpm start:dev`   |
| `pnpm start:debug` | Start in debug mode                  | `pnpm start:debug` |
| `pnpm start:prod`  | Start in production mode             | `pnpm start:prod`  |
| `pnpm format`      | Format code with Prettier            | `pnpm format`      |
| `pnpm lint`        | Lint and fix code with ESLint        | `pnpm lint`        |

### 📝 Git & Commit Scripts

| Command            | Description                                  | Example            |
| ------------------ | -------------------------------------------- | ------------------ |
| `pnpm commit`      | Interactive commit with Conventional Commits | `pnpm commit`      |
| `pnpm commit:push` | Commit and push changes                      | `pnpm commit:push` |

### 🔧 Utility Scripts

| Command        | Description           | Example        |
| -------------- | --------------------- | -------------- |
| `pnpm prepare` | Setup Husky git hooks | `pnpm prepare` |

## 🤖 Automated System

**Triggers:**

- Pull request merged to `main` with changes in `libs/` → Automatic build
- Manual execution → Build all libraries with version selection

**Workflow:**

1. 🔍 Detect modified libraries
2. 📦 Build only changed libraries
3. 🔢 Auto-increment versions
4. 🧪 Run validation tests
5. 🏷️ Create tags in format `{lib}-v{version}`
6. 🎉 Create releases with artifacts
7. 📊 Generate execution reports

## 🤝 Contributing

See our contributing guides:

- [🇺🇸 English](./CONTRIBUTING.md)
- [🇧🇷 Português](./CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](./CONTRIBUTING.es.md)

### 📝 Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Use the interactive commit tool:

```bash
pnpm commit
```

See our [Conventional Commits Guide](./.github/CONVENTIONAL_COMMITS.md) for detailed information.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📚 Additional Documentation

- [🚀 Build and Release System](./.github/BUILD_AND_RELEASE.md)
- [🧪 Testing Matrix](./.github/TEST_MATRIX.md)
- [🛡️ Branch Protection](./.github/branch-protection.md)
- [🤝 Contributing Guidelines](./CONTRIBUTING.md)

## 🏢 About

**CodeMaster Soluções** - Building the future with cutting-edge technology! 🚀

---

_Made with ❤️ by the CodeMaster team_
