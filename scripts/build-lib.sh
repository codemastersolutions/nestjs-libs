#!/bin/bash

# Build script for individual libraries
# Usage: ./scripts/build-lib.sh <lib-name> [version-type]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if lib name is provided
if [ -z "$1" ]; then
    log_error "Usage: $0 <lib-name> [version-type]"
    log_info "Available libraries:"
    for lib in libs/*/; do
        if [ -d "$lib" ]; then
            lib_name=$(basename "$lib")
            echo "  - $lib_name"
        fi
    done
    exit 1
fi

LIB_NAME="$1"
VERSION_TYPE="${2:-patch}"
LIB_PATH="libs/$LIB_NAME"

# Check if library exists
if [ ! -d "$LIB_PATH" ]; then
    log_error "Library '$LIB_NAME' not found in libs/ directory"
    exit 1
fi

# Check if package.json exists
if [ ! -f "$LIB_PATH/package.json" ]; then
    log_error "package.json not found in $LIB_PATH"
    exit 1
fi

log_info "Building library: $LIB_NAME"
log_info "Version increment: $VERSION_TYPE"

# Get current version
CURRENT_VERSION=$(jq -r '.version' "$LIB_PATH/package.json")
log_info "Current version: $CURRENT_VERSION"

# Calculate new version
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"

case $VERSION_TYPE in
    major)
        major=$((major + 1))
        minor=0
        patch=0
        ;;
    minor)
        minor=$((minor + 1))
        patch=0
        ;;
    patch)
        patch=$((patch + 1))
        ;;
    *)
        log_error "Invalid version type: $VERSION_TYPE. Use: patch, minor, or major"
        exit 1
        ;;
esac

NEW_VERSION="$major.$minor.$patch"
log_info "New version: $NEW_VERSION"

# Update package.json version
log_info "Updating package.json version..."
jq ".version = \"$NEW_VERSION\"" "$LIB_PATH/package.json" > temp.json
mv temp.json "$LIB_PATH/package.json"
log_success "Version updated in package.json"

# Clean previous builds
log_info "Cleaning previous builds..."
pnpm clean
log_success "Clean completed"

# Install dependencies
log_info "Installing dependencies..."
pnpm install --frozen-lockfile
log_success "Dependencies installed"

# Build CJS if config exists
if [ -f "$LIB_PATH/tsconfig.build.cjs.json" ]; then
    log_info "Building CommonJS..."
    pnpm exec tsc -p "$LIB_PATH/tsconfig.build.cjs.json"
    log_success "CommonJS build completed"
else
    log_warning "No CJS config found, skipping CommonJS build"
fi

# Build ESM if config exists
if [ -f "$LIB_PATH/tsconfig.build.esm.json" ]; then
    log_info "Building ES Modules..."
    pnpm exec tsc -p "$LIB_PATH/tsconfig.build.esm.json"
    log_success "ES Modules build completed"
else
    log_warning "No ESM config found, skipping ES Modules build"
fi

# Run tests
log_info "Running tests..."
if ! pnpm test "$LIB_PATH/src/$LIB_NAME.service.spec.ts"; then
    log_error "Tests failed"
    exit 1
fi
log_success "Tests passed"

# Create distribution package
log_info "Creating distribution package..."
mkdir -p "dist-packages/$LIB_NAME"

# Copy package.json
cp "$LIB_PATH/package.json" "dist-packages/$LIB_NAME/"

# Copy README if exists
if [ -f "$LIB_PATH/README.md" ]; then
    cp "$LIB_PATH/README.md" "dist-packages/$LIB_NAME/"
fi

# Copy LICENSE if exists
if [ -f "$LIB_PATH/LICENSE" ]; then
    cp "$LIB_PATH/LICENSE" "dist-packages/$LIB_NAME/"
fi

# Copy built files
if [ -d "$LIB_PATH/dist" ]; then
    cp -r "$LIB_PATH/dist" "dist-packages/$LIB_NAME/"
fi

# Create tarball
cd "dist-packages/$LIB_NAME"
npm pack
mv *.tgz "../../$LIB_NAME-v$NEW_VERSION.tgz"
cd ../..

log_success "Distribution package created: $LIB_NAME-v$NEW_VERSION.tgz"

# Show summary
echo ""
log_success "🎉 Build completed successfully!"
echo ""
echo "📦 Library: $LIB_NAME"
echo "🔢 Version: $CURRENT_VERSION → $NEW_VERSION"
echo "📁 Package: $LIB_NAME-v$NEW_VERSION.tgz"
echo ""
log_info "Next steps:"
echo "  1. Review the changes"
echo "  2. Commit and push to trigger automatic release"
echo "  3. Or manually create a release with the generated package"
echo ""