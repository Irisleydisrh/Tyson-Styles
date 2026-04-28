#!/bin/bash
set -e

echo "🔄 Running migrations..."

# Using Docker
docker exec tyson_backend npx prisma migrate deploy

# Seed if needed
docker exec tyson_backend npm run prisma:seed 2>/dev/null || true

echo "✅ Migrations complete!"