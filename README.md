# My Blog

# Project Overview

A modern full-stack blog application built with the Next.js App Router.
It demonstrates every rendering strategy (static, dynamic, ISR), secure
cookie-based authentication with hashed passwords, role-based access
control, and a clean layered architecture (UI → Server Actions →
Services → Repositories → Prisma).

# Features

- **Authentication** — register, login, logout. Passwords hashed with
  bcrypt; stateless sessions as jose-signed JWTs in HttpOnly cookies.
- **Authorization (RBAC)** — `USER` can create posts and edit/delete
  their own; `ADMIN` can manage all posts and all users.
- **Posts CRUD** — create, edit, delete, publish/draft, with unique
  slugs generated from titles.
- **ISR blog listing** — `/posts` is prerendered and revalidated every
  60 seconds, paginated via path segments (`/posts/page/2`).
- **Search** — debounced live search over title and content.
- **User profiles** — `/profile/[id]` with the user's published posts.
- **Dashboard** — manage your own posts, including drafts.
- **Admin dashboard** — site stats, user management (role changes,
  deletion), and moderation of all posts.
- **Validation** — all input validated server-side with Zod.
- **UX** — loading states, error boundary, custom 404.

# Tech Stack

- Next.js 16 (App Router, Server Components, Server Actions, Proxy)
- TypeScript (strict)
- Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`)
- PostgreSQL
- Tailwind CSS 4
- Zod 4, jose, bcryptjs

# Folder Structure

```
app/                  Routes only (pages, layouts, loading/error/404, API)
  (auth)/             /login, /register
  posts/              Listing (ISR), /posts/page/[number], [slug], new, edit, search
  profile/[id]/       Public profile (dynamic)
  dashboard/          Own-post management (dynamic, protected)
  admin/              Admin dashboard (dynamic, admin only)
  api/auth/me/        Session info for client components on static pages
actions/              Server Actions (thin: parse → validate → service)
components/           UI components (auth/, layout/, posts/, admin/, ui/)
hooks/                Client hooks (useDebouncedCallback)
lib/                  Prisma client, auth (session, password, DAL), slugify
  generated/prisma/   Generated Prisma client (gitignored)
repositories/         Prisma queries only
services/             Business rules + authorization checks
validators/           Zod schemas
types/                Shared TypeScript types
prisma/               Schema, migrations, seed
proxy.ts              Optimistic route protection (Next 16's middleware)
```

Layering rule: components never touch the database; Server Actions never
contain business rules; services never build SQL — that's the
repositories' job.

# Installation

Every step needed to recreate the project from scratch:

1. **Create the project**

   ```bash
   npx create-next-app@latest myblog --typescript --tailwind --eslint --app
   cd myblog
   ```

2. **Install dependencies**

   ```bash
   npm install @prisma/client @prisma/adapter-pg pg zod jose bcryptjs server-only dotenv
   npm install -D prisma tsx @types/pg
   ```

3. **Initialize Prisma**

   ```bash
   npx prisma init
   ```

   Set the generator to `prisma-client` with `output = "../lib/generated/prisma"`,
   and configure `prisma.config.ts` with the schema path and seed command
   (`tsx prisma/seed.ts`). Model `User` (with `password`, `role`) and
   `Post` (with `slug`, `published`, timestamps) as in `prisma/schema.prisma`.

4. **Create the database**

   Create a PostgreSQL database (locally or hosted) and put its
   connection string in `.env`:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/myblog"
   SESSION_SECRET="$(openssl rand -base64 32)"
   ```

5. **Run migrations**

   ```bash
   npx prisma migrate deploy   # applies prisma/migrations
   npx prisma generate
   ```

   (During development, create new migrations with
   `npx prisma migrate dev --name <change>`.)

6. **Seed the database**

   ```bash
   npx tsx prisma/seed.ts
   ```

   Creates an admin, two regular users and eleven sample posts
   (credentials in [LAUNCH.md](LAUNCH.md)).

7. **Run the development server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

See [LAUNCH.md](LAUNCH.md) for the full launch guide, test users and
production commands.

# Architecture Decisions

Documented in [AGENTS.md](AGENTS.md) under "Verified stack facts &
architecture decisions": Next 16 specifics (Proxy instead of middleware,
classic ISR model), the custom jose/bcrypt auth (following the official
Next.js authentication guide), and the security model (the Data Access
Layer is the security boundary; the Proxy is only an optimistic
pre-filter).
