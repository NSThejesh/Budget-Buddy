#!/bin/bash

# Budget Buddy Quick Start Script
# This script helps you quickly run Budget Buddy with Docker

set -e

echo "🚀 Budget Buddy Docker Setup"
echo "============================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is ready!"

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -i :$port &> /dev/null; then
        echo "⚠️  Port $port is already in use."
        echo "   You can:"
        echo "   1. Stop the service using port $port"
        echo "   2. Edit docker-compose.yml to use a different port"
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking required ports..."
if ! check_port 3001; then
    echo "   To use a different port, edit docker-compose.yml and change:"
    echo "   ports: [\"NEWPORT:3001\"]"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if ! check_port 27017; then
    echo "   MongoDB port conflict detected."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Ports are available!"

# Build and start
echo "📦 Building and starting Budget Buddy..."
echo "   This may take a few minutes on the first run..."

# Ask user preference
echo "How would you like to run Budget Buddy?"
echo "1. Foreground (see logs, Ctrl+C to stop)"
echo "2. Background (detached mode)"
read -p "Choose (1 or 2): " -n 1 -r
echo

if [[ $REPLY == "2" ]]; then
    echo "🚀 Starting in background mode..."
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "📊 Service status:"
    docker-compose ps
    
    echo ""
    echo "🎉 Budget Buddy is running!"
    echo "📱 Access your app at: http://localhost:3001"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker-compose logs -f"
    echo "  Stop app:     docker-compose down"
    echo "  Restart:      docker-compose restart"
    echo "  View status:  docker-compose ps"
    
else
    echo "🚀 Starting in foreground mode..."
    echo "   Press Ctrl+C to stop the application"
    echo ""
    docker-compose up --build
fi
