# E-commerce Admin System (NestJS + Prisma + PostgreSQL + React + Ant Design)

> **Status**: Work in Progress (WIP)

## Overview

- Monorepo with `backend` (NestJS + Prisma + PostgreSQL) and `frontend` (React + Vite + Ant Design).
- Provides core admin capabilities: auth, role-based access, products/categories, users, dashboard analytics, image upload, recycle bin (soft delete).

## Tech Stack

- Backend: NestJS 11, Prisma 5, PostgreSQL, JWT/Passport, Multer upload, ConfigModule, Swagger-ready, Jest.
- Frontend: React 19, React Router 7, Ant Design 6, Axios, Recharts, WangEditor, Framer Motion, Vite.
- Tooling: pnpm, ESLint, TypeScript, Prisma Migrate/Seed.

## Key Features (by module)

- Auth
  - Email/password login with bcrypt hashing; only ADMIN can sign in to admin UI.
  - JWT accessToken (default 5m, configurable via `JWT_EXPIRES_IN`) + refreshToken (7d).
  - Endpoints: `/auth/login`, `/auth/register`, `/auth/refresh`; refresh token persisted on User.
  - `roles.decorator` + `roles.guard` for RBAC (ADMIN/USER).
  - `response.interceptor` wraps successful responses to a consistent shape.
- Users
  - CRUD in `users` module; signup defaults to USER. Promote to ADMIN manually for console access.
- Categories
  - Unique category name; parent/child self-relation; one-to-many with products.
- Products
  - CRUD; soft delete via `deletedAt` powering recycle bin.
  - Linked to category and creator; `isActive` flag; optional description.
- Dashboard
  - Aggregates: product count (excluding soft-deleted), category count, admin count.
  - Category distribution and last-7-day creation trend.
- Upload
  - `/upload/image`: image-only, 5MB limit, stored under `uploads/images`, returns public URL.
- Frontend
  - Protected routes via `ProtectedRoute`; redirect if unauthenticated.
  - Pages: Auth (login/register), Dashboard, Users, Products (list/create/edit/detail/recycle bin), Categories (list/create/edit).
  - Axios interceptor auto-attaches accessToken; refreshes on 401 using refreshToken.
  - Ant Design UI + Recharts charts + WangEditor rich text.

## Directory Glance

- `backend/src/modules/*`: auth, users, products, categories, dashboard, upload.
- `backend/prisma/`: `schema.prisma` models, `migrations/`, `seed.ts`.
- `backend/common/`: decorators, guards, interceptors, Prisma exception filters.
- `frontend/src/routes/index.tsx`: router with protected layout.
- `frontend/src/pages/*`: page components; `utils/axios.ts` Axios instance and interceptors.

## Database Model (Prisma)

### User

| Field        | Type           | Description                 |
| ------------ | -------------- | --------------------------- |
| id           | Int, PK        | User ID                     |
| username     | String, unique | Username                    |
| email        | String, unique | Email                       |
| password     | String         | bcrypt hash                 |
| role         | Enum Role      | ADMIN / USER (default USER) |
| refreshToken | String?        | Persisted refresh token     |
| createdAt    | DateTime       | Created time                |
| updatedAt    | DateTime       | Updated time                |

### Category

| Field     | Type           | Description         |
| --------- | -------------- | ------------------- |
| id        | Int, PK        | Category ID         |
| name      | String, unique | Category name       |
| parentId  | Int?           | Parent category     |
| children  | Category[]     | Children categories |
| products  | Product[]      | Linked products     |
| createdAt | DateTime       | Created time        |
| updatedAt | DateTime       | Updated time        |

### Product

| Field       | Type           | Description                |
| ----------- | -------------- | -------------------------- |
| id          | Int, PK        | Product ID                 |
| name        | String, unique | Product name               |
| price       | Float          | Price                      |
| stock       | Int            | Stock                      |
| isActive    | Boolean        | On/off shelf, default true |
| description | String?        | Description                |
| deletedAt   | DateTime?      | Soft delete timestamp      |
| userId      | Int            | Creator user               |
| categoryId  | Int            | Category                   |
| createdAt   | DateTime       | Created time               |
| updatedAt   | DateTime       | Updated time               |

### Enum

| Name | Values      |
| ---- | ----------- |
| Role | ADMIN, USER |

## Environment Variables

Create `backend/.env` (example):

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
JWT_SECRET="dev-secret"
JWT_EXPIRES_IN=300        # seconds; default 300 (5 minutes)
```

## Install & Run

> Requires local PostgreSQL; pnpm recommended.

### Backend

```bash
cd backend
pnpm install
pnpm prisma migrate dev      # init/sync DB
pnpm prisma db seed          # optional: seed data
pnpm run start:dev           # default port 3000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev                 # default port 5173
```

## Testing

Backend (from `backend`):

```bash
pnpm run test         # unit
pnpm run test:e2e     # e2e
pnpm run test:cov     # coverage
```

## Notes

- Admin login requires `role=ADMIN`; promote a user manually in DB after registration.
- Uploads are stored under `backend/uploads/images`, returned URL like `http://localhost:3000/uploads/images/<filename>`.
- Axios 401 handling: auto-refresh via refreshToken; on refresh failure, clears storage and redirects to login.
