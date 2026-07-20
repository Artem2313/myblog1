<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.


# Project Goal

Refactor the existing blog application into a modern full-stack application using current best practices.

# Development Principles

- Keep code simple.
- Follow SOLID principles.
- Prefer composition over inheritance.
- Avoid duplication (DRY).
- Keep functions small.
- Keep components focused.
- Use TypeScript strictly.
- Prefer server components whenever possible.
- Only use client components when required.
- Never use `any`.
- Avoid unnecessary libraries.
- Write readable code over clever code.
- Keep folder structure organized.
- Remove dead code during refactoring.

# Architecture Rules

Use modern Next.js App Router architecture.

Separate:

- UI
- Business Logic
- Database
- Authentication
- Validation
- API

Do not place business logic inside React components.

# Naming

Use meaningful names.

Avoid abbreviations.

# Styling

Use a consistent styling approach throughout the application.

# Database

Use Prisma ORM.

Keep schema clean.

Use migrations.

Seed initial data when appropriate.

# Authentication

Authentication must be secure.

Passwords must be hashed.

Sessions must be handled correctly.

Never expose sensitive information.

# Validation

Validate all user input.

Use Zod for validation.

# Error Handling

Handle errors gracefully.

No silent failures.

Return meaningful messages.

# Documentation

Document major architectural decisions.

Update README.md whenever project changes affect setup or architecture.

-------------------------------------------------------
PROJECT REQUIREMENTS
-------------------------------------------------------

Refactor the application into a modern blog.

Use:

- Next.js (latest)
- TypeScript
- Prisma
- PostgreSQL
- App Router

-------------------------------------------------------
ROUTING
-------------------------------------------------------

The application must demonstrate all rendering strategies.

Implement:

Static pages

Examples:

- Home
- About
- Contact

Dynamic pages

Examples:

- /posts/[slug]
- /profile/[id]

Pre-rendered (ISR) pages

Example:

- Blog listing

Configure a reasonable revalidation interval.

-------------------------------------------------------
AUTHENTICATION
-------------------------------------------------------

Implement authentication.

Use NextAuth/Auth.js (recommended) or another modern secure solution.

Users should be able to:

- Register
- Login
- Logout

Passwords must be hashed.

-------------------------------------------------------
ROLES
-------------------------------------------------------

Implement RBAC.

Roles:

Admin

Can:

- create posts
- edit posts
- delete posts
- manage users
- CRUD everything

User

Can:

- create posts
- edit own posts
- delete own posts
- read everything

Users cannot edit or delete posts they do not own.

-------------------------------------------------------
DATABASE
-------------------------------------------------------

Use Prisma.

Suggested models:

User

- id
- name
- email
- password
- role
- createdAt

Post

- id
- title
- slug
- content
- published
- authorId
- createdAt
- updatedAt

Feel free to improve the schema if necessary.

-------------------------------------------------------
FEATURES
-------------------------------------------------------

Implement:

- Authentication
- Authorization
- CRUD Posts
- User Profile
- Admin Dashboard
- Post ownership
- Pagination
- Search posts
- Markdown support (optional)
- Nice loading states
- Error pages
- 404 page

-------------------------------------------------------
CODE QUALITY
-------------------------------------------------------

During refactoring:

- Remove obsolete code.
- Remove duplicated logic.
- Improve folder structure.
- Improve naming.
- Split large files.
- Extract reusable components.
- Extract reusable hooks.
- Extract services.
- Extract repositories where appropriate.

-------------------------------------------------------
FOLDER STRUCTURE
-------------------------------------------------------

Aim for something similar to:

app/

components/

features/

lib/

services/

repositories/

actions/

prisma/

types/

hooks/

validators/

middleware.ts

-------------------------------------------------------
README
-------------------------------------------------------

Completely rewrite README.md.

It should include:

# Project Overview

# Features

# Tech Stack

# Folder Structure

# Installation

Include every step that was required from the very beginning.

For example:

1.
Create project

npx create-next-app@latest

2.
Install dependencies

...

3.
Initialize Prisma

...

4.
Create database

...

5.
Run migrations

...

6.
Seed database

...

7.
Run development server

...

The README should allow someone to recreate the project from scratch.

-------------------------------------------------------
LAUNCH.md
-------------------------------------------------------

Create a separate file named

LAUNCH.md

It should contain:

How to launch the application

Environment variables

Database setup

Prisma commands

Migration commands

Seed commands

Development commands

Production commands

Testing checklist

Example test users

Admin credentials

Regular user credentials

Known limitations (if any)

-------------------------------------------------------
WORKFLOW
-------------------------------------------------------

Work incrementally.

Before each major change:

1. Explain what will be changed.
2. Implement it.
3. Verify it compiles.
4. Continue.

Do not make random architectural decisions.

Prefer maintainability over cleverness.

When finished, provide a final summary of:

- Files added
- Files removed
- Files modified
- Architecture improvements
- Remaining TODOs
- Future improvements

<!-- END:nextjs-agent-rules -->

-------------------------------------------------------
VERIFIED STACK FACTS & ARCHITECTURE DECISIONS
-------------------------------------------------------

Facts below were verified against the bundled docs in
`node_modules/next/dist/docs/` (Next.js 16.2.9) and the installed
packages. Follow them; do not fall back to older Next.js conventions.

# Next.js 16 specifics

- `middleware.ts` is renamed to `proxy.ts` (project root, Node.js
  runtime). Export a `proxy` function (named or default). Use it only
  for optimistic, cookie-based redirects — never for DB checks.
- `params` and `searchParams` in pages are Promises and must be awaited.
- Two caching models exist. This project uses the **classic model**
  (Cache Components / `use cache` is NOT enabled):
  - ISR: `export const revalidate = <seconds>` on the route +
    `generateStaticParams` for dynamic segments.
  - Invalidation after mutations: `revalidateTag()` / `revalidatePath()`
    inside Server Actions.
  - Awaiting `searchParams` opts a route into dynamic rendering — keep
    ISR routes free of `searchParams` (use path segments for pagination).
- Forms: `next/form` + Server Actions + `useActionState` for
  validation errors and pending state.
- `redirect()` throws — code after it never runs; call
  `revalidatePath/Tag` before it.

# Prisma 7 specifics

- Generator is `prisma-client` (not `prisma-client-js`); client output
  is generated into the repo, imported via a relative path.
- Requires a driver adapter: `@prisma/adapter-pg` + connection string.
- Config lives in `prisma.config.ts` (schema path, migrations path,
  seed command `tsx prisma/seed.ts`).
- Generated client location: `lib/generated/prisma` (moved out of
  `app/` so the routing directory contains only routes and UI).

# Authentication decision

Custom, library-free auth following the official Next.js
authentication guide (`02-guides/authentication.md`):

- Stateless sessions: JWT signed with `jose` (HS256, `SESSION_SECRET`
  env var), stored in an HttpOnly, Secure, SameSite=Lax cookie set on
  the server. Payload carries only `userId` and `role`.
- Passwords hashed with `bcryptjs`.
- Data Access Layer (`lib/auth/dal.ts`): `verifySession()` /
  `getCurrentUser()` wrapped in React `cache()`. Every Server Action
  and protected page calls the DAL — the proxy is only a UX-level
  pre-filter, never the security boundary.
- `server-only` package guards session/DAL modules.
- Rationale: NextAuth/Auth.js compatibility with Next 16 is unverified
  in this environment and the app needs only credentials auth; the
  docs-endorsed jose approach is smaller and fully under our control.

# Authorization decision

- `Role` enum in Prisma: `USER`, `ADMIN`.
- Ownership/permission checks live in the service layer
  (`services/`), not in components and not only in the UI: every
  mutating Server Action re-checks the session and the permission.

# Rendering strategy map

| Route                  | Strategy                              |
| ---------------------- | ------------------------------------- |
| `/`, `/about`, `/contact` | Static (prerendered at build)      |
| `/posts` + `/posts/page/[number]` | ISR, `revalidate = 60`, path-segment pagination |
| `/posts/[slug]`        | ISR + `generateStaticParams`          |
| `/posts/search`        | Dynamic (uses `searchParams`)         |
| `/profile/[id]`        | Dynamic                               |
| `/dashboard`, `/admin` | Dynamic (session-dependent)           |
| auth pages             | Static shell, actions do the work     |

# Layering

UI (components, app/) → Server Actions (actions/, thin: parse form
data, call service, map errors) → Services (services/, business rules
+ authorization) → Repositories (repositories/, Prisma queries only)
→ Prisma. Validation schemas in validators/ (Zod v4 — note: v4 uses
`z.email()`, `{ error: '...' }` message syntax). Shared types in
types/.
