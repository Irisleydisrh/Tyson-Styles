#!/bin/bash
set -e

echo "🔄 Starting Tyson Styles Backend (Dev)..."

cd "$(dirname "$0")/.."

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
  echo "🐳 Using docker-compose..."
  docker-compose up -d
elif docker compose version &> /dev/null; then
  echo "🐳 Using docker compose..."
  docker compose up -d
else
  echo "📦 Docker not available, starting locally..."
  npm run start:dev
fi