# 📝 Conventional Commits Guide

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent and meaningful commit messages.

## 🚀 Quick Start

### Using Commitizen (Recommended)

```bash
# Instead of git commit, use:
pnpm commit
# or
npx cz
```

This will launch an interactive prompt to help you create properly formatted commit messages.

### Manual Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## 📋 Commit Types

| Type | Description | Example |
|------|-------------|----------|
| `feat` | New feature | `feat(auth): add OAuth2 integration` |
| `fix` | Bug fix | `fix(api): resolve null pointer exception` |
| `docs` | Documentation | `docs: update README with new examples` |
| `style` | Code style changes | `style: fix indentation in auth module` |
| `refactor` | Code refactoring | `refactor(utils): simplify validation logic` |
| `perf` | Performance improvements | `perf(db): optimize query performance` |
| `test` | Tests | `test(auth): add unit tests for login` |
| `chore` | Build/tooling changes | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add automated testing workflow` |
| `build` | Build system changes | `build: update webpack configuration` |
| `revert` | Revert previous commit | `revert: revert feat(auth): add OAuth2` |

## 🎯 Scopes

Scopes help identify which part of the codebase is affected:

- `better-auth` - Better Auth library
- `core` - Core functionality
- `api` - API related changes
- `docs` - Documentation
- `ci` - CI/CD pipeline
- `deps` - Dependencies

## ✅ Good Examples

```bash
# Feature with scope
feat(better-auth): add session management

# Bug fix with detailed description
fix(api): resolve authentication timeout issue

Implement proper error handling for expired tokens
and add retry mechanism for failed requests.

Closes #123

# Documentation update
docs: add contributing guidelines

# Breaking change
feat(api)!: redesign authentication flow

BREAKING CHANGE: The authentication API has been
completely redesigned. See migration guide for details.
```

## ❌ Bad Examples

```bash
# Too vague
fix: stuff

# Wrong type
update: add new feature

# Missing description
feat(auth):

# Too long subject (>100 chars)
feat(auth): add a very long description that exceeds the maximum allowed length for commit messages
```

## 🔧 Configuration

The project is configured with:

- **Commitlint**: Validates commit messages against conventional commit rules
- **Husky**: Git hooks to run commitlint on commit
- **Commitizen**: Interactive commit message builder

## 🚨 Validation Rules

- Type is required and must be lowercase
- Subject is required and cannot be empty
- Subject cannot end with a period
- Header cannot exceed 100 characters
- Body lines cannot exceed 100 characters
- Breaking changes must be indicated with `!` or `BREAKING CHANGE:`

## 🛠️ Troubleshooting

### Commit Rejected

If your commit is rejected:

1. Check the error message for specific rule violations
2. Use `pnpm commit` for guided commit creation
3. Ensure your commit follows the conventional format

### Bypass Validation (Not Recommended)

```bash
# Only in emergency situations
git commit --no-verify -m "emergency fix"
```

## 📚 Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen Documentation](https://github.com/commitizen/cz-cli)
- [Commitlint Rules](https://commitlint.js.org/#/reference-rules)

---

*Following these guidelines helps maintain a clean, readable commit history and enables automated changelog generation.*