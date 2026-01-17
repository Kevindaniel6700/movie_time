#!/bin/bash

# Movie Time - Single Click Startup Script
# This script builds and starts all services with Docker Compose

set -e

echo "=============================================="
echo "   MOVIE TIME - Single Click Deployment      "
echo "=============================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "[OK] Docker is running"
echo ""

# Stop any existing containers
echo "Cleaning up any existing containers..."
docker-compose down 2>/dev/null || true

# Build and start all services
echo ""
echo "Building and starting all services..."
echo "This may take a few minutes on first run..."
echo ""
docker-compose up --build -d

echo ""
echo "Waiting for services to be healthy..."
echo "(MongoDB needs to start and database needs to be seeded)"
echo ""

# Wait for services to be ready
MAX_WAIT=120
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    # Check if all containers are running
    RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$RUNNING" = "3" ]; then
        # Try to hit the backend health endpoint
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            echo "[OK] Backend API is healthy!"
            break
        fi
    fi
    
    printf "."
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
done

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo ""
    echo "[WARNING] Services are taking longer than expected. Check logs with: docker-compose logs"
else
    echo ""
    echo ""
    echo "=============================================="
    echo "   MOVIE TIME IS READY!                      "
    echo "=============================================="
    echo ""
    echo "Frontend:  http://localhost:8080"
    echo "Backend:   http://localhost:8000"
    echo "API Docs:  http://localhost:8000/docs"
    echo "MongoDB:   mongodb://localhost:27017"
    echo ""
    echo "Useful commands:"
    echo "  View logs:     docker-compose logs -f"
    echo "  Stop all:      docker-compose down"
    echo "  Restart:       docker-compose restart"
    echo "  Reset data:    docker-compose down -v && ./start.sh"
    echo ""
fi

