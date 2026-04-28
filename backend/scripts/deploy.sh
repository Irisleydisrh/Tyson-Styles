#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Tyson Styles - Deployment Script${NC}"
echo "======================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from example...${NC}"
    cp .env.production.example .env
    echo -e "${RED}❌ Please edit .env file with your production values before running again!${NC}"
    exit 1
fi

# Build and start services
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker compose build

echo -e "${GREEN}🚀 Starting services...${NC}"
docker compose up -d

# Wait for healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check status
echo -e "${GREEN}📊 Service Status:${NC}"
docker compose ps

# Show logs
echo -e "${GREEN}📝 Backend Logs (last 20 lines):${NC}"
docker compose logs --tail=20 backend

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Backend API: http://localhost:3001"
echo "PostgreSQL: localhost:5432"
echo ""
echo "Commands:"
echo "  docker compose logs -f        # View logs"
echo "  docker compose stop            # Stop services"
echo "  docker compose restart        # Restart services"
echo "  docker compose down          # Stop and remove services"