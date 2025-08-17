# Contributing to NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

We welcome contributions to the `nestjs-libs` monorepo! This document provides guidelines and information for contributors working on any of our NestJS libraries.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Git
- Basic knowledge of NestJS and TypeScript
- Understanding of the specific library you want to contribute to

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nestjs-libs.git
   cd nestjs-libs
   ```

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Navigate to the specific library you want to work on:

   ```bash
   cd libs/<library-name>
   ```

3. Run tests to ensure everything is working:

   ```bash
   pnpm test
   ```

4. Build the library:
   ```bash
   pnpm run build
   ```

## Project Structure

```
nestjs-libs/
├── .github/                        # GitHub workflows and templates
├── libs/                           # All NestJS libraries
│   └── <library-name>/
│       ├── src/
│       │   ├── *.constants.ts      # Constants and tokens
│       │   ├── *.module.ts         # NestJS module definition
│       │   ├── *.service.ts        # Service implementations
│       │   ├── *.types.ts          # TypeScript interfaces
│       │   └── index.ts            # Public API exports
│       ├── *.spec.ts               # Unit tests
│       ├── jest.config.cjs         # Jest configuration
│       ├── package.json            # Package configuration
│       ├── tsconfig.*.json         # TypeScript configurations
│       └── README*.md              # Library documentation
├── scripts/                        # Build and management scripts
├── src/                           # Example applications
├── package.json                    # Root package configuration
└── pnpm-workspace.yaml            # Workspace configuration
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/<library-name>/add-oauth-support`
- `fix/<library-name>/middleware-cors-issue`
- `docs/<library-name>/update-readme`
- `refactor/<library-name>/service-cleanup`

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(better-auth): add session validation method`
- `fix(better-auth): resolve CORS configuration issue`
- `docs(better-auth): update installation instructions`
- `test(better-auth): add unit tests for auth methods`

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper access modifiers (`private`, `protected`, `public`)
- Document public APIs with JSDoc comments

### Code Style

- Follow the existing code style (Prettier configuration)
- Use meaningful variable and function names
- Keep functions small and focused
- Prefer composition over inheritance

### Example Code Style:

```typescript
/**
 * Handles service requests for library integration
 * @param request - The incoming request
 * @returns Promise resolving to the service response
 */
async handleRequest(request: ServiceRequest): Promise<ServiceResponse> {
  // Validate input
  if (!this.isValidRequest(request)) {
    throw new BadRequestException('Invalid service request');
  }

  // Process request
  return this.processRequest(request);
}
```

## Testing

### Unit Tests

- Write unit tests for all new functionality
- Maintain at least 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Structure:

```typescript
describe('LibraryService', () => {
  describe('handleRequest', () => {
    it('should successfully process valid service request', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      const expectedResponse = createExpectedResponse();

      // Act
      const result = await service.handleRequest(mockRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run specific test file
pnpm test <library-name>.service.spec.ts
```

## Documentation

### Code Documentation

- Document all public APIs with JSDoc
- Include parameter descriptions and return types
- Add usage examples for complex functionality

### README Updates

- Update all language versions (EN, PT-BR, ES)
- Include new features in examples
- Update configuration options
- Add troubleshooting information if needed

## Pull Request Process

### Before Submitting

1. **Test your changes:**

   ```bash
   pnpm test
   pnpm run build
   ```

2. **Check code style:**

   ```bash
   pnpm run lint
   pnpm run format
   ```

3. **Update documentation** if needed

4. **Add tests** for new functionality

### PR Guidelines

1. **Title:** Use clear, descriptive titles
2. **Description:** Explain what changes were made and why
3. **Testing:** Describe how the changes were tested
4. **Breaking Changes:** Clearly mark any breaking changes
5. **Documentation:** Note any documentation updates

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Issue Reporting

### Bug Reports

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, NestJS version, etc.)
- Code examples if applicable

### Feature Requests

Include:

- Clear description of the proposed feature
- Use case and motivation
- Possible implementation approach
- Examples of how it would be used

## Release Process

The library uses automated releases:

1. **Development:** Work on feature branches
2. **Pull Request:** Submit PR to `main` branch
3. **Review:** Code review and approval
4. **Merge:** PR merged triggers automated build and release
5. **Versioning:** Semantic versioning based on commit messages

### Version Bumping

- `feat:` → Minor version bump
- `fix:` → Patch version bump
- `BREAKING CHANGE:` → Major version bump

## Getting Help

- **Documentation:** Check the README files
- **Issues:** Search existing issues on GitHub
- **Discussions:** Use GitHub Discussions for questions
- **Library Documentation:** Refer to the specific library's README and documentation

## Recognition

Contributors are recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Package.json contributors field

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `nestjs-libs`! 🚀
