#!/bin/bash

# Budget Buddy Cross-Platform Docker Build Script
# Supports: Linux (x86_64, ARM64), macOS (Intel, Apple Silicon), Windows

echo "🐳 Budget Buddy Multi-Platform Docker Build"
echo "============================================="

# Check if Docker buildx is available
if ! docker buildx version >/dev/null 2>&1; then
    echo "❌ Docker Buildx is not available. Please update Docker to a recent version."
    exit 1
fi

# Create buildx builder if it doesn't exist
BUILDER_NAME="budget-buddy-builder"
if ! docker buildx ls | grep -q "$BUILDER_NAME"; then
    echo "🔧 Creating multi-platform builder..."
    docker buildx create --name "$BUILDER_NAME" --driver docker-container --bootstrap
fi

# Use the builder
docker buildx use "$BUILDER_NAME"

# Build for multiple platforms
echo "🚀 Building Budget Buddy for multiple platforms..."
echo "   - linux/amd64 (Intel/AMD 64-bit)"
echo "   - linux/arm64 (ARM 64-bit, Apple Silicon)"
echo ""

# Build and push (or load locally)
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag budget-buddy:latest \
    --tag budget-buddy:multiplatform \
    --load \
    .

if [ $? -eq 0 ]; then
    echo "✅ Multi-platform build completed successfully!"
    echo ""
    echo "🏷️  Available tags:"
    echo "   - budget-buddy:latest"
    echo "   - budget-buddy:multiplatform"
    echo ""
    echo "🌍 Supported platforms:"
    echo "   - Linux x86_64 (Intel/AMD)"
    echo "   - Linux ARM64 (Apple Silicon, Raspberry Pi 4+)"
    echo "   - macOS Intel"
    echo "   - macOS Apple Silicon"
    echo "   - Windows with WSL2"
    echo ""
    echo "🚀 To run on any platform:"
    echo "   docker-compose up -d"
    echo ""
    echo "📦 To save for sharing:"
    echo "   docker save budget-buddy:multiplatform | gzip > budget-buddy-multiplatform.tar.gz"
else
    echo "❌ Build failed. Check the logs above for details."
    exit 1
fi
