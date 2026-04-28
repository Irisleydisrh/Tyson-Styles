# Tyson Styles - Backend API

NestJS + Prisma + PostgreSQL backend for tyson.styles e-commerce.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 2. Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client
npm run prisma:generate

# Run migrations and seed
npm run prisma:migrate -- --name init
npm run prisma:seed
```

### 3. Run

```bash
# Development
npm run start:dev

# Production
npm run build && npm run start
```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me

### Categories
- GET /api/categories
- POST /api/categories (admin)
- PATCH /api/categories/:id (admin)
- DELETE /api/categories/:id (admin)

### Products
- GET /api/products
- GET /api/products/featured
- GET /api/products/:slug
- POST /api/products (admin)
- PATCH /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Orders
- GET /api/orders (admin)
- GET /api/orders/my
- POST /api/orders
- PATCH /api/orders/:id/status (admin)

### Reviews
- GET /api/reviews/product/:productId
- POST /api/reviews (auth)
- PATCH /api/reviews/:id/approve (admin)

### Upload
- POST /api/upload/image (admin)

## Default Admin
- Email: admin@tyson.styles
- Password: admin123

## Env Variables
See .env.example for all configuration options.

## Notes
- Migraciones automáticas: ejecutar `npm run prisma:deploy` o `npm run prisma:migrate`
- El servidor corre en puerto 3001 (configurable via PORT en .env)

## Docker Deployment

### Quick Start with Docker
```bash
cp .env.example .env
# Edit .env with your settings

# Start database + backend
./scripts/start-dev.sh

# Or manually:
docker-compose up -d
```

### Production Deploy
```bash
cp .env.production.example .env
# Edit .env with production values

./scripts/deploy.sh
```

### Run Migrations
```bash
./scripts/migrate.sh
# Or:
docker exec tyson_backend npx prisma migrate deploy
```

### Stop
```bash
docker-compose down
# or
docker stop tyson_backend && docker rm tyson_backend
```

### Useful Commands
```bash
# View logs
docker logs -f tyson_backend

# Access database
docker exec -it tyson_postgres psql -U postgres Tyson_bd

# Run seed
docker exec tyson_backend npm run prisma:seed
```