# 🚀 NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](README.md)
- [🇧🇷 Português](README.pt-BR.md)
- [🇪🇸 Español](README.es.md)

---

A comprehensive monorepo of NestJS libraries with automated build, testing, and release systems.

## 📦 Available Libraries

- **[@nestjs-libs/better-auth](./libs/better-auth)** - Better Auth integration for NestJS applications

## ✨ Key Features

- 🤖 **Automated CI/CD** - Complete build and release pipeline
- 📦 **Semantic Versioning** - Automatic version management
- 🏷️ **GitHub Releases** - Automated tagging and release creation
- 🧪 **Comprehensive Testing** - Unit and E2E tests with multiple adapters
- ⚡ **Parallel Execution** - Optimized builds per library
- 🛠️ **Development Tools** - Scripts for local development
- 📊 **Release Reports** - Detailed execution summaries

## 🚀 Quick Start

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

## 📋 Main Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `pnpm libs:list`          | List all available libraries             |
| `pnpm libs:status`        | Show status of each library              |
| `pnpm libs:build-all`     | Build all libraries                      |
| `pnpm libs:test-all`      | Test all libraries                       |
| `pnpm libs:create <name>` | Create a new library                     |
| `pnpm test:all-adapters`  | Test with all adapters (Express/Fastify) |

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
