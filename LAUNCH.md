# LAUNCH.md

How to launch and operate the application.

## How to launch the application

```bash
npm install            # also runs `prisma generate` (postinstall)
npx prisma migrate deploy
npx tsx prisma/seed.ts # optional, adds test users + sample posts
npm run dev            # http://localhost:3000
```

## Environment variables

Create a `.env` file in the project root:

| Variable         | Purpose                                   | Example                                             |
| ---------------- | ----------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string              | `postgresql://user:pass@localhost:5432/myblog`      |
| `SESSION_SECRET` | HMAC key for signing session JWTs         | output of `openssl rand -base64 32`                 |

## Database setup

1. Start PostgreSQL (locally or use a hosted instance).
2. Create a database and set `DATABASE_URL` accordingly.
3. Apply migrations and seed (commands below).

## Prisma commands

```bash
npx prisma generate        # regenerate the client into lib/generated/prisma
npx prisma studio          # inspect the database in a browser
npx prisma validate        # validate schema.prisma
```

## Migration commands

```bash
npx prisma migrate deploy              # apply committed migrations (non-interactive)
npx prisma migrate dev --name <name>   # create + apply a new migration (development)
npx prisma migrate status              # show migration state
```

## Seed commands

```bash
npx tsx prisma/seed.ts   # idempotent: upserts users and posts by unique keys
```

## Development commands

```bash
npm run dev     # development server with hot reload
npm run lint    # ESLint
npx tsc --noEmit  # typecheck
```

## Production commands

```bash
npm run build   # production build (prerenders static + ISR pages, needs the DB)
npm run start   # serve the production build
```

## Testing checklist

- [ ] `/`, `/about`, `/contact` render (static).
- [ ] `/posts` lists published posts; `/posts/page/2` paginates; new
      posts appear within ~60 s (ISR revalidation).
- [ ] `/posts/search` finds posts by title/content while typing.
- [ ] Register a new account → redirected to `/dashboard`, header shows
      the user menu.
- [ ] Log out, log back in with the same credentials.
- [ ] Wrong password → "Invalid email or password." (no detail leaks).
- [ ] Create a draft post → visible only in `/dashboard`; publish it →
      visible on `/posts` and `/posts/[slug]`.
- [ ] Edit and delete an own post; verify Edit/Delete controls do not
      appear on other users' posts.
- [ ] As a regular user, opening `/admin` redirects to `/dashboard`;
      opening another user's post edit URL redirects to the post.
- [ ] Logged out, `/dashboard`, `/admin`, `/posts/new` redirect to `/login`.
- [ ] As admin, `/admin` shows stats; change a user's role; delete a
      user; edit/delete any post.
- [ ] Unknown URL shows the custom 404 page.

## Example test users

Seeded by `prisma/seed.ts`:

### Admin credentials

- Email: `admin@example.com`
- Password: `Admin123!`

### Regular user credentials

- Email: `alice@example.com`, Password: `User1234!`
- Email: `bob@example.com`, Password: `User1234!`

## Known limitations

- Markdown rendering is not implemented (post content is plain text,
  rendered with preserved line breaks).
- Sessions are stateless JWTs: logout clears the cookie but cannot
  revoke a stolen token before it expires (7 days); role changes take
  effect on next login.
- The session-dependent header menu and the Edit/Delete controls on
  ISR post pages hydrate client-side via `/api/auth/me`, so they appear
  after a short delay.
- Legacy users that existed before the auth migration (`*@prisma.io`)
  have an empty password hash and cannot log in; delete them from the
  admin dashboard or assign passwords manually.
- No rate limiting on login/registration; add one before exposing the
  app publicly.
