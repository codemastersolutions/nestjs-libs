# 📦 NPM Publishing Guide

This document explains how the automatic NPM publishing works for the NestJS Libraries monorepo.

## 🚀 Overview

Each library in the `libs/` directory is automatically published as a separate NPM package when a new release is created. The publishing process is integrated into the existing build and release workflow.

## 📋 Package Configuration

### Package Naming Convention
All packages are published under the `@nestjs-libs` scope:
- `libs/better-auth` → `@nestjs-libs/better-auth`
- `libs/new-lib` → `@nestjs-libs/new-lib`

### Required package.json Fields
Each library's `package.json` must include:

```json
{
  "name": "@nestjs-libs/library-name",
  "version": "0.0.1",
  "description": "Library description",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/codemastersolutions/nestjs-libs.git"
  },
  "bugs": {
    "url": "https://github.com/codemastersolutions/nestjs-libs/issues"
  },
  "homepage": "https://github.com/codemastersolutions/nestjs-libs#readme"
}
```

## ⚙️ Setup Requirements

### 1. NPM Token Configuration
To enable automatic publishing, you need to configure an NPM token:

1. **Create NPM Token**:
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Login to your account
   - Go to Access Tokens → Generate New Token
   - Choose "Automation" type
   - Copy the generated token

2. **Add to GitHub Secrets**:
   - Go to your repository settings
   - Navigate to Secrets and Variables → Actions
   - Add a new secret named `NPM_TOKEN`
   - Paste your NPM token as the value

### 2. NPM Organization Setup
Ensure the `@nestjs-libs` organization exists on NPM and you have publishing permissions.

## 🔄 Publishing Process

The publishing happens automatically when:

1. **Pull Request Merged**: When a PR affecting `libs/` is merged to `main`
2. **Manual Trigger**: Using the workflow dispatch with version type selection

### Workflow Steps:
1. **Detect Changes**: Identifies which libraries were modified
2. **Version Increment**: Automatically bumps version (patch/minor/major)
3. **Build**: Compiles TypeScript to CJS and ESM formats
4. **Test**: Runs library-specific tests
5. **Package**: Creates distribution package
6. **Publish to NPM**: Publishes to NPM registry with public access
7. **GitHub Release**: Creates GitHub release with artifacts
8. **Git Tag**: Creates and pushes version tag

## 📊 Version Management

### Automatic Versioning
- **Pull Request**: Defaults to `patch` increment
- **Manual Trigger**: Choose between `patch`, `minor`, or `major`

### Version Format
Follows semantic versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- Example: `1.2.3`

## 🏷️ Tagging Strategy

Each library gets its own tag:
- Format: `{library-name}-v{version}`
- Example: `better-auth-v1.2.3`

## 📦 Package Structure

Published packages include:
```
@nestjs-libs/library-name/
├── dist/
│   ├── cjs/          # CommonJS build
│   └── esm/          # ES Modules build
├── package.json      # Package metadata
├── README.md         # Documentation
└── LICENSE           # License file (if exists)
```

## 🔍 Monitoring

### Check Publication Status
1. **GitHub Actions**: Monitor workflow runs in the Actions tab
2. **NPM Registry**: Check package page at `https://www.npmjs.com/package/@nestjs-libs/{library-name}`
3. **GitHub Releases**: View releases in the repository

### Troubleshooting

Common issues and solutions:

1. **NPM Token Expired**:
   - Generate new token on npmjs.com
   - Update `NPM_TOKEN` secret in GitHub

2. **Permission Denied**:
   - Ensure you're a member of `@nestjs-libs` organization
   - Check organization permissions on NPM

3. **Version Already Exists**:
   - NPM doesn't allow republishing same version
   - Workflow automatically increments version to avoid conflicts

4. **Build Failures**:
   - Check TypeScript compilation errors
   - Ensure all dependencies are properly declared

## 🎯 Best Practices

1. **Semantic Versioning**: Follow SemVer guidelines for version increments
2. **Documentation**: Keep README.md updated for each library
3. **Testing**: Ensure tests pass before merging
4. **Dependencies**: Use `peerDependencies` for framework dependencies
5. **Exports**: Provide both CJS and ESM builds for compatibility

## 📚 Related Documentation

- [Build and Release Guide](./BUILD_AND_RELEASE.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Conventional Commits](./CONVENTIONAL_COMMITS.md)

---

**Note**: This publishing system is designed to work seamlessly with the existing monorepo structure while maintaining individual package versioning and releases.