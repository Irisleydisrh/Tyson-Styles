# Tyson Styles — Agent Guide

## Architecture

**Monorepo-like split**: NestJS backend in `backend/`, TanStack Start frontend at root.

```
backend/          ← NestJS + Prisma + PostgreSQL
  src/main.ts     ← Express server, port 3001
  prisma/         ← Schema + migrations + seed
src/              ← TanStack Start (SSR) + Vite + React 19
  routes/         ← File-based routing via TanStack Router
  lib/            ← API client + data fetchers
  components/     ← React components (shadcn/ui + custom)
```

## Development

### Required commands (run both in separate terminals)

```bash
# Frontend
npm run dev:frontend   # Vite on port 3000

# Backend
cd backend && npm run start:dev   # NestJS on port 3001
```

`npm run dev` at root runs both via concurrently, but the backend child process may conflict with a standalone instance.

### Environment

| Variable | Default | Where |
|----------|---------|-------|
| `VITE_API_URL` | `http://localhost:3001` | `.env` (root) |
| `DATABASE_URL` | Supabase connection | `.env.local` (backend) |
| `JWT_SECRET` | dev secret | `.env.local` (backend) |
| `JWT_EXPIRES_IN` | `15m` / `1h` | `.env.local` (backend) |

### Database

- **Supabase PostgreSQL** (production): `postgresql://postgres.qttkzhbidiiqdndsbeuq:admin123@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Local Postgres via docker-compose also supported
- Sync schema: `cd backend && npx prisma migrate dev`
- Seed: `cd backend && npx prisma db seed` (creates admin user + 16 products + 6 categories)
- Default admin: `admin@tyson.styles` / `admin123`

## Critical Known Issues

### Missing `vite.config.ts` (BLOCKING)

The project uses `@lovable.dev/vite-tanstack-config` (provides `defineConfig` wrapper with TanStack Start SSR + Tailwind + React plugins) but **no vite.config.ts exists**. Without it, `vite dev` serves the static `index.html` maintenance page instead of the React app.

To fix: create `vite.config.ts` using `defineConfig` from `@lovable.dev/vite-tanstack-config`.

### `index.html` is a maintenance page

Root `index.html` shows "En Mantenimiento" (Under Maintenance). For TanStack Start, this should be a minimal HTML shell or removed.

### `api-client.ts` env var syntax is wrong

Line 2 uses `import.meta?.vite?.PUBLIC_API_URL` which does not exist in Vite. Must be `import.meta.env.VITE_API_URL`.

## Admin Access

Two separate auth systems:

| Page | Purpose | Mechanism |
|------|---------|-----------|
| `/auth` | User JWT login | Email + password → JWT tokens → localStorage |
| `/admin-tyson` | Quick admin panel | Hardcoded password `Admin2026` → sessionStorage (1h expiry) |

The `/auth` page redirects to `/admin` but the actual route is `/admin-panel` — this is a bug.

## API Client

Singleton `ApiClient` class at `src/lib/api-client.ts`:
- Manages JWT tokens in localStorage
- Auto-refreshes on 401
- All API calls go through `api.get/post/patch/delete`
- Base URL from `import.meta.env.VITE_API_URL`

**Gotcha**: The upload function in `products-api.ts` hardcodes `http://localhost:3001` instead of using the API client — will break on deploy.

## Deployment

| Target | Method | Trigger |
|--------|--------|---------|
| Backend | Railway via GitHub Actions | Push to `main` with `backend/**` changes + manual dispatch |
| Frontend | Cloudflare Workers via `wrangler.jsonc` | Manual `wrangler deploy` |
| Legacy | Vercel (static build → `dist/client`) | Connected in dashboard |

### Railway secrets required

```
RAILWAY_API_TOKEN       # Account token (not workspace-scoped)
RAILWAY_PROJECT_ID      # 4401905f-d6ec-4edf-a966-2c8db95e6f09
RAILWAY_ENVIRONMENT_ID  # 9c4fe5bd-e5a5-4bfa-8690-d4065ec463b4
DATABASE_URL            # Supabase connection string
JWT_SECRET              # Production secret
```

## Data Schema

Prisma models: `User`, `RefreshToken`, `Category`, `Product`, `Order`, `Review`, `PedidoHistorial`, `ExchangeRate`.

Products have `priceUSD` (Decimal), categories have `icon` (emoji string). Orders track `deliveryMethod: DOMICILIO | RECOGER` and `status` through `PENDING → CONFIRMED → DELIVERED/CANCELLED` cycle (also includes `PREPARING`, `SENT`).

## Shared UI

shadcn/ui components in `src/components/ui/`. Config at `components.json`:
- Style: new-york, no RSC
- CSS: Tailwind v4 via `@tailwindcss/vite` plugin
- Icon library: lucide-react
- CSS variables with OKLCH color space

## Tests

Vitest with jsdom at `src/test/`. Run:
```bash
npm test        # watch mode
npm run test:run  # single run
```

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin (no PostCSS config). Imported in `src/styles.css` using `@import "tailwindcss" source(none); @source "../src";`. CSS variables in OKLCH format with dark-first brand theme (teal primary, gold accent).
