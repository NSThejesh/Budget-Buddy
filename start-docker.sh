#!/bin/bash

# Budget Buddy Docker Startup Script - Cross Platform Compatible
echo "🚀 Starting Budget Buddy with Docker (Cross-Platform)..."

# Detect platform
OS=$(uname -s)
ARCH=$(uname -m)

case $OS in
    Darwin)
        PLATFORM="macOS"
        case $ARCH in
            arm64) DOCKER_PLATFORM="linux/arm64" ;;
            x86_64) DOCKER_PLATFORM="linux/amd64" ;;
            *) DOCKER_PLATFORM="linux/amd64" ;;
        esac
        ;;
    Linux)
        PLATFORM="Linux"
        case $ARCH in
            aarch64|arm64) DOCKER_PLATFORM="linux/arm64" ;;
            x86_64|amd64) DOCKER_PLATFORM="linux/amd64" ;;
            *) DOCKER_PLATFORM="linux/amd64" ;;
        esac
        ;;
    MINGW*|CYGWIN*|MSYS*)
        PLATFORM="Windows"
        DOCKER_PLATFORM="linux/amd64"
        ;;
    *)
        PLATFORM="Unknown"
        DOCKER_PLATFORM="linux/amd64"
        ;;
esac

echo "📋 Detected platform: $PLATFORM ($ARCH)"
echo "🐳 Using Docker platform: $DOCKER_PLATFORM"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    if [[ "$PLATFORM" == "macOS" ]]; then
        echo "   💡 Tip: Start Docker Desktop from Applications"
    elif [[ "$PLATFORM" == "Windows" ]]; then
        echo "   💡 Tip: Start Docker Desktop from Start Menu"
    fi
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose >/dev/null 2>&1 && ! command -v docker compose >/dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set Docker Compose command (v1 vs v2)
if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

echo "🔧 Using: $DOCKER_COMPOSE"

# Set platform-specific environment variables
export BUILDPLATFORM="$DOCKER_PLATFORM"
export TARGETPLATFORM="$DOCKER_PLATFORM"

# Build and start containers
echo "🔨 Building containers for $DOCKER_PLATFORM..."
$DOCKER_COMPOSE build

echo "🌟 Starting containers..."
$DOCKER_COMPOSE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
if $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo "✅ Budget Buddy is now running on $PLATFORM!"
    echo ""
    echo "🌐 Frontend: http://localhost:3001"
    echo "🔗 API Health: http://localhost:3001/api/health"
    echo "🗄️  MongoDB: localhost:27017"
    echo ""
    echo "📊 Platform Info:"
    echo "   OS: $PLATFORM ($ARCH)"
    echo "   Docker Platform: $DOCKER_PLATFORM"
    echo ""
    echo "📋 To stop the application:"
    echo "   $DOCKER_COMPOSE down"
    echo ""
    echo "📋 To view logs:"
    echo "   $DOCKER_COMPOSE logs -f budget-buddy-app"
    echo "   $DOCKER_COMPOSE logs -f mongodb"
    echo ""
    echo "🔍 To check status:"
    echo "   ./docker-status.sh"
else
    echo "❌ Something went wrong. Check the logs:"
    echo "   $DOCKER_COMPOSE logs"
    echo ""
    echo "🚫 Troubleshooting tips for $PLATFORM:"
    if [[ "$PLATFORM" == "macOS" && "$ARCH" == "arm64" ]]; then
        echo "   - Ensure Docker Desktop has Apple Silicon support enabled"
        echo "   - Try: docker system prune -f && $DOCKER_COMPOSE up --build"
    elif [[ "$PLATFORM" == "Windows" ]]; then
        echo "   - Ensure WSL2 is enabled and updated"
        echo "   - Try running as Administrator"
    fi
fi
