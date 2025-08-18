#!/bin/bash

# Library management script
# Usage: ./scripts/manage-libs.sh <command> [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

log_lib() {
    echo -e "${CYAN}📦 $1${NC}"
}

# Show usage
show_usage() {
    echo "Library Management Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list                    List all libraries with versions"
    echo "  build-all [version]     Build all libraries (patch|minor|major)"
    echo "  test-all               Run tests for all libraries"
    echo "  clean-all              Clean all build artifacts"
    echo "  status                 Show status of all libraries"
    echo "  create <name>          Create a new library template"
    echo "  validate <name>        Validate library structure"
    echo "  package-all            Create packages for all libraries"
    echo "  publish <name>         Publish a specific library to npm"
    echo "  publish-all            Publish all libraries to npm"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 build-all patch"
    echo "  $0 create my-new-lib"
    echo "  $0 validate better-auth"
    echo "  $0 publish better-auth"
    echo "  $0 publish-all"
}

# List all libraries
list_libs() {
    log_header "📋 Available Libraries"
    echo ""

    if [ ! -d "libs" ]; then
        log_error "libs/ directory not found"
        return 1
    fi

    local count=0
    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            if [ -f "$lib/package.json" ]; then
                version=$(jq -r '.version' "$lib/package.json")
                description=$(jq -r '.description // "No description"' "$lib/package.json")
                log_lib "$lib_name v$version"
                echo "    $description"
            else
                log_lib "$lib_name"
                log_warning "    No package.json found"
            fi
            count=$((count + 1))
            echo ""
        fi
    done

    if [ $count -eq 0 ]; then
        log_warning "No libraries found in libs/ directory"
    else
        log_success "Found $count libraries"
    fi
}

# Build all libraries
build_all() {
    local version_type="${1:-patch}"
    log_header "🏗️  Building All Libraries ($version_type)"
    echo ""

    local success_count=0
    local total_count=0

    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            total_count=$((total_count + 1))

            log_info "Building $lib_name..."

            if ./scripts/build-lib.sh "$lib_name" "$version_type"; then
                success_count=$((success_count + 1))
                log_success "$lib_name built successfully"
            else
                log_error "Failed to build $lib_name"
            fi
            echo ""
        fi
    done

    log_header "📊 Build Summary"
    echo "✅ Successful: $success_count/$total_count"
    if [ $success_count -eq $total_count ]; then
        log_success "All libraries built successfully!"
    else
        log_warning "Some libraries failed to build"
    fi
}

# Test all libraries
test_all() {
    log_header "🧪 Testing All Libraries"
    echo ""

    local success_count=0
    local total_count=0

    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            total_count=$((total_count + 1))

            log_info "Testing $lib_name..."

            if pnpm test -- --testPathPatterns="$lib_name" --silent; then
                success_count=$((success_count + 1))
                log_success "$lib_name tests passed"
            else
                log_error "$lib_name tests failed"
            fi
        fi
    done

    echo ""
    log_header "📊 Test Summary"
    echo "✅ Passed: $success_count/$total_count"
    if [ $success_count -eq $total_count ]; then
        log_success "All tests passed!"
    else
        log_warning "Some tests failed"
    fi
}

# Clean all build artifacts
clean_all() {
    log_header "🧹 Cleaning All Build Artifacts"

    log_info "Cleaning with pnpm..."
    pnpm clean

    log_info "Removing distribution packages..."
    rm -rf dist-packages/
    rm -f *.tgz

    log_success "All build artifacts cleaned"
}

# Show status of all libraries
show_status() {
    log_header "📊 Libraries Status"
    echo ""

    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            log_lib "$lib_name"

            # Check package.json
            if [ -f "$lib/package.json" ]; then
                echo "  ✅ package.json: $(jq -r '.version' "$lib/package.json")"
            else
                echo "  ❌ package.json: Missing"
            fi

            # Check TypeScript configs
            if [ -f "$lib/tsconfig.build.cjs.json" ]; then
                echo "  ✅ CJS config: Present"
            else
                echo "  ⚠️  CJS config: Missing"
            fi

            if [ -f "$lib/tsconfig.build.esm.json" ]; then
                echo "  ✅ ESM config: Present"
            else
                echo "  ⚠️  ESM config: Missing"
            fi

            # Check source files
            if [ -f "$lib/src/index.ts" ]; then
                echo "  ✅ Entry point: src/index.ts"
            else
                echo "  ❌ Entry point: Missing src/index.ts"
            fi

            # Check build output
            if [ -d "$lib/dist" ]; then
                echo "  ✅ Build output: Present"
            else
                echo "  ⚠️  Build output: Not built"
            fi

            echo ""
        fi
    done
}

# Create new library template
create_lib() {
    local lib_name="$1"

    if [ -z "$lib_name" ]; then
        log_error "Library name is required"
        echo "Usage: $0 create <lib-name>"
        return 1
    fi

    local lib_path="libs/$lib_name"

    if [ -d "$lib_path" ]; then
        log_error "Library '$lib_name' already exists"
        return 1
    fi

    log_header "🆕 Creating New Library: $lib_name"

    # Create directory structure
    mkdir -p "$lib_path/src"

    # Create package.json
    cat > "$lib_path/package.json" << EOF
{
  "name": "@cms-nestjs-libs/$lib_name",
  "version": "0.0.1",
  "description": "$lib_name integration for NestJS",
  "author": "CodeMaster Soluções",
  "license": "MIT",
  "keywords": [
    "$lib_name",
    "nestjs",
    "nest"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/codemastersolutions/nestjs-libs.git"
  },
  "bugs": {
    "url": "https://github.com/codemastersolutions/nestjs-libs/issues"
  },
  "homepage": "https://github.com/codemastersolutions/nestjs-libs#readme",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  },
  "scripts": {
    "test": "jest",
    "test:cov": "npx c8 --reporter=text --reporter=html --reporter=lcov --include='src/**/*.ts' --exclude='src/**/*.spec.ts' --exclude='src/**/*.d.ts' jest",
    "test:watch": "jest --watch",
    "test:debug": "node --inspect-brk -r ts-node/register node_modules/.bin/jest --runInBand"
  },
  "peerDependencies": {
    "typescript": "^5.1.3",
    "@nestjs/common": "^10.0.0 || ^11.0.0",
    "@nestjs/core": "^10.0.0 || ^11.0.0"
  }
}
EOF

    # Create TypeScript config for CJS build
    cat > "$lib_path/tsconfig.build.cjs.json" << EOF
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "outDir": "dist/cjs",
    "declaration": true,
    "emitDeclarationOnly": false
  },
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
EOF

    cat > "$lib_path/tsconfig.build.esm.json" << EOF
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "outDir": "dist/esm",
    "declaration": true,
    "emitDeclarationOnly": false
  },
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
EOF

    # Create base TypeScript lib config
    cat > "$lib_path/tsconfig.lib.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "sourceMap": false
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*spec.ts",
    "coverage",
    "jest.config.cjs"
  ]
}
EOF

    cat > "$lib_path/tsconfig.lib.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}
EOF

    # Create source files
    cat > "$lib_path/src/index.ts" << EOF
export * from './$lib_name.module';
export * from './$lib_name.service';
export * from './$lib_name.types';
EOF

    # Convert kebab-case to PascalCase for class names
    lib_name_camel=$(echo "$lib_name" | sed 's/-\([a-z]\)/\U\1/g')
    lib_name_capitalized="$(echo "${lib_name_camel:0:1}" | tr '[:lower:]' '[:upper:]')${lib_name_camel:1}"

    cat > "$lib_path/src/$lib_name.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ${lib_name_capitalized}Service } from './$lib_name.service';

@Module({
  providers: [${lib_name_capitalized}Service],
  exports: [${lib_name_capitalized}Service],
})
export class ${lib_name_capitalized}Module {}
EOF

    cat > "$lib_path/src/$lib_name.service.ts" << EOF
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${lib_name_capitalized}Service {
  getHello(): string {
    return 'Hello from ${lib_name_capitalized}Service!';
  }
}
EOF

    cat > "$lib_path/src/$lib_name.types.ts" << EOF
// Types and interfaces for $lib_name

export interface ${lib_name_capitalized}Config {
  // Add configuration options here
}
EOF

    # Create test files
    cat > "$lib_path/src/$lib_name.service.spec.ts" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${lib_name_capitalized}Service } from './$lib_name.service';

describe('${lib_name_capitalized}Service', () => {
  let service: ${lib_name_capitalized}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${lib_name_capitalized}Service],
    }).compile();

    service = module.get<${lib_name_capitalized}Service>(${lib_name_capitalized}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return hello message', () => {
    expect(service.getHello()).toBe('Hello from ${lib_name_capitalized}Service!');
  });
});
EOF

    # Create README
    cat > "$lib_path/README.md" << EOF
# @cms-nestjs-libs/$lib_name

$lib_name integration for NestJS applications.

## Installation

\`\`\`bash
npm install @cms-nestjs-libs/$lib_name
# or
pnpm add @cms-nestjs-libs/$lib_name
# or
yarn add @cms-nestjs-libs/$lib_name
\`\`\`

## Usage

\`\`\`typescript
import { Module } from '@nestjs/common';
import { ${lib_name_capitalized}Module } from '@cms-nestjs-libs/$lib_name';

@Module({
  imports: [${lib_name_capitalized}Module],
})
export class AppModule {}
\`\`\`

## License

MIT
EOF

    log_success "Library '$lib_name' created successfully!"
    echo ""
    log_info "Next steps:"
    echo "  1. cd $lib_path"
    echo "  2. Implement your library logic"
    echo "  3. Run tests: pnpm test -- --testPathPatterns=$lib_name"
    echo "  4. Build: ./scripts/build-lib.sh $lib_name"
}

# Validate library structure
validate_lib() {
    local lib_name="$1"

    if [ -z "$lib_name" ]; then
        log_error "Library name is required"
        echo "Usage: $0 validate <lib-name>"
        return 1
    fi

    local lib_path="libs/$lib_name"

    if [ ! -d "$lib_path" ]; then
        log_error "Library '$lib_name' not found"
        return 1
    fi

    log_header "🔍 Validating Library: $lib_name"
    echo ""

    local issues=0

    # Check required files
    local required_files=(
        "package.json"
        "src/index.ts"
        "tsconfig.build.cjs.json"
        "tsconfig.build.esm.json"
    )

    for file in "${required_files[@]}"; do
        if [ -f "$lib_path/$file" ]; then
            log_success "$file exists"
        else
            log_error "$file is missing"
            issues=$((issues + 1))
        fi
    done

    # Validate package.json
    if [ -f "$lib_path/package.json" ]; then
        if jq -e '.name' "$lib_path/package.json" > /dev/null; then
            log_success "package.json has valid name"
        else
            log_error "package.json missing name field"
            issues=$((issues + 1))
        fi

        if jq -e '.version' "$lib_path/package.json" > /dev/null; then
            log_success "package.json has valid version"
        else
            log_error "package.json missing version field"
            issues=$((issues + 1))
        fi
    fi

    echo ""
    if [ $issues -eq 0 ]; then
        log_success "✅ Library '$lib_name' is valid!"
    else
        log_error "❌ Library '$lib_name' has $issues issues"
        return 1
    fi
}

# Package all libraries
package_all() {
    log_header "📦 Packaging All Libraries"
    echo ""

    # Clean previous packages
    rm -rf dist-packages/
    rm -f *.tgz

    local success_count=0
    local total_count=0

    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            total_count=$((total_count + 1))

            log_info "Packaging $lib_name..."

            if [ -f "$lib/package.json" ] && [ -d "$lib/dist" ]; then
                version=$(jq -r '.version' "$lib/package.json")

                # Create package directory
                mkdir -p "dist-packages/$lib_name"

                # Copy files
                cp "$lib/package.json" "dist-packages/$lib_name/"
                [ -f "$lib/README.md" ] && cp "$lib/README.md" "dist-packages/$lib_name/"
                [ -f "$lib/LICENSE" ] && cp "$lib/LICENSE" "dist-packages/$lib_name/"
                cp -r "$lib/dist" "dist-packages/$lib_name/"

                # Create tarball
                cd "dist-packages/$lib_name"
                npm pack
                mv *.tgz "../../$lib_name-v$version.tgz"
                cd ../..

                success_count=$((success_count + 1))
                log_success "$lib_name packaged as $lib_name-v$version.tgz"
            else
                log_warning "$lib_name not built or missing package.json"
            fi
        fi
    done

    echo ""
    log_header "📊 Packaging Summary"
    echo "✅ Packaged: $success_count/$total_count"
    if [ $success_count -gt 0 ]; then
        log_success "Packages created in current directory"
    fi
}

# Publish a specific library
publish_lib() {
    local lib_name="$1"
    local dry_run="$2"

    if [ -z "$lib_name" ]; then
        log_error "Library name is required"
        echo "Usage: $0 publish <library-name> [--dry-run]"
        return 1
    fi

    local lib_path="libs/$lib_name"

    if [ ! -d "$lib_path" ]; then
        log_error "Library '$lib_name' not found in libs/ directory"
        return 1
    fi

    log_header "📦 Publishing Library: $lib_name"
    echo ""

    # Validate library structure
    log_info "Validating library structure..."
    if ! ./scripts/manage-libs.sh validate "$lib_name" > /dev/null 2>&1; then
        log_error "Library validation failed. Please fix issues before publishing."
        return 1
    fi

    # Build the library
    log_info "Building library..."
    if ! pnpm build:lib "$lib_name" > /dev/null 2>&1; then
        log_error "Build failed. Please fix build issues before publishing."
        return 1
    fi

    # Run tests
    log_info "Running tests..."
    if ! pnpm test:$lib_name --silent > /dev/null 2>&1; then
        log_error "Tests failed. Please fix test issues before publishing."
        return 1
    fi

    # Check if already published
    local version=$(jq -r '.version' "$lib_path/package.json")
    local package_name=$(jq -r '.name' "$lib_path/package.json")

    log_info "Checking if version $version is already published..."
    if npm view "$package_name@$version" version > /dev/null 2>&1; then
        log_error "Version $version is already published. Please update the version in package.json."
        return 1
    fi

    # Publish
    local publish_cmd="npm publish"
    if [ "$dry_run" = "--dry-run" ]; then
        publish_cmd="$publish_cmd --dry-run"
        log_info "Publishing $package_name@$version (dry-run)..."
    else
        publish_cmd="$publish_cmd --access public"
        log_info "Publishing $package_name@$version..."
    fi

    cd "$lib_path"

    if $publish_cmd; then
        cd ../..
        if [ "$dry_run" = "--dry-run" ]; then
            log_success "$lib_name v$version would be published successfully! (dry-run)"
        else
            log_success "$lib_name v$version published successfully!"
        fi
        return 0
    else
        cd ../..
        log_error "Failed to publish $lib_name"
        return 1
    fi
}

# Publish all libraries
publish_all() {
    local dry_run="$1"

    log_header "📦 Publishing All Libraries"
    echo ""

    local success_count=0
    local total_count=0
    local failed_libs=()

    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            total_count=$((total_count + 1))

            log_info "Publishing $lib_name..."

            if publish_lib "$lib_name" "$dry_run"; then
                success_count=$((success_count + 1))
            else
                failed_libs+=("$lib_name")
            fi
            echo ""
        fi
    done

    log_header "📊 Publishing Summary"
    echo "✅ Published: $success_count/$total_count"

    if [ ${#failed_libs[@]} -gt 0 ]; then
        log_warning "Failed libraries:"
        for lib in "${failed_libs[@]}"; do
            echo "  - $lib"
        done
    fi

    if [ $success_count -eq $total_count ]; then
        if [ "$dry_run" = "--dry-run" ]; then
            log_success "All libraries would be published successfully! (dry-run)"
        else
            log_success "All libraries published successfully!"
        fi
    else
        log_warning "Some libraries failed to publish"
        return 1
    fi
}

# Main script logic
case "$1" in
    list)
        list_libs
        ;;
    build-all)
        build_all "$2"
        ;;
    test-all)
        test_all
        ;;
    clean-all)
        clean_all
        ;;
    status)
        show_status
        ;;
    create)
        create_lib "$2"
        ;;
    validate)
        validate_lib "$2"
        ;;
    package-all)
        package_all
        ;;
    publish)
        publish_lib "$2" "$3"
        ;;
    publish-all)
        publish_all "$2"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac