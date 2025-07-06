#!/bin/bash

# Budget Buddy Docker Status Check
echo "🔍 Budget Buddy Docker Status Check"
echo "=================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Check container status
echo "📦 Container Status:"
docker-compose ps

echo ""
echo "🔧 Service Health:"

# Check API health
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null)
if [ "$API_STATUS" = "200" ]; then
    echo "✅ API: Running (http://localhost:3001/api/health)"
else
    echo "❌ API: Not responding"
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>/dev/null)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: Running (http://localhost:3001)"
else
    echo "❌ Frontend: Not responding"
fi

# Check MongoDB
MONGO_STATUS=$(docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null)
if [ "$MONGO_STATUS" = "1" ]; then
    echo "✅ MongoDB: Running (localhost:27017)"
else
    echo "❌ MongoDB: Not responding"
fi

echo ""
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" budget-buddy-app budget-buddy-mongo

echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3001"
echo "   API: http://localhost:3001/api/health"
echo "   MongoDB: localhost:27017"
