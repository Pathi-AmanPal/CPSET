# CPSET

Web portal and administration platform for the **Centre for Privacy and Security in Emerging Technologies** — a cybersecurity Centre of Excellence at Chandigarh University.

The project is two applications in one Next.js codebase:

- a **public site** presenting the centre's vision, objectives, team, events, and achievements
- a **protected admin panel** for managing that content without a redeploy

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, custom design tokens in `app/globals.css` |
| Database | PostgreSQL via Prisma |
| Image storage | Vercel Blob |
| Auth | Argon2id passwords, optional TOTP, server-side sessions |
| Validation | Zod |
| Motion / 3D | Framer Motion, GSAP, three.js (`@react-three/fiber`) |
| Tests | Vitest |

## Getting started

**Prerequisites:** Node.js 20+, a PostgreSQL database, and a Vercel Blob store.

```bash
npm ci
```

Copy the environment template and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | HMAC key for session and CSRF token digests. Must be 32+ characters — the app throws on startup otherwise. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob write token, server-side only |

Never commit `.env` or `.env.local`. Use distinct values for development, preview, and production.

Apply the schema and start the dev server:

```bash
npx prisma migrate dev --name init
npm run dev
```

The site runs at `http://localhost:3000`; the admin panel is at `/admin/login`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | `prisma generate` then a production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite |
| `npm run db:push` | Push the Prisma schema without a migration |
| `npm run db:seed` | Seed a development administrator — see the warning below |

## Creating an administrator

There is no public registration endpoint by design. The first administrator must be created directly against the database with an Argon2id password hash.

> [!WARNING]
> `prisma/seed.ts` creates an administrator with a **hardcoded email and password that are visible in this public repository**. It is for local development only. Never run `npm run db:seed` against a production or preview database, and if it has already been run against one, change that account's password immediately.

For any non-local environment, generate a hash out of band and insert the row yourself:

```bash
node -e "require('argon2').hash(process.argv[1]).then(console.log)" 'your-password-here'
```

Subsequent administrators are added the same way. TOTP is supported per account through the `totpSecret` and `totpEnabled` columns and requires no migration to enable.

## Project structure

```
app/
  (public)/          Public pages — home plus one route per section
  admin/
    login/           Unauthenticated login page
    (protected)/     Server-gated admin panel (requireAdmin in layout)
  api/
    auth/            Login and logout
    team/            Team CRUD
    events/          Event CRUD
    achievements/    Achievement CRUD
    uploads/image/   Authenticated image upload
components/
  sections/          Public page sections
  admin/             Admin sidebar and data table
  ui/                Reusable UI and motion primitives
  3d/                three.js globe
lib/
  auth/              Sessions, password and TOTP verification
  db/                Prisma client singleton
  api.ts             Origin, CSRF, and authorization gate for mutations
  content.ts         Shared CRUD layer for all three content kinds
  uploads.ts         Image validation and normalization
  rate-limit.ts      In-memory rate limiter
  validation.ts      Zod schemas
prisma/              Schema and development seed
proxy.ts             Security headers and API rate limiting
tests/               Vitest suite
```

## Content model

Three content kinds — `Team`, `Event`, `Achievement` — share one generic CRUD layer in `lib/content.ts`. Every mutation passes through `authorizedMutation`, which requires a live session, a same-origin request, an `X-Requested-With: XMLHttpRequest` header, and a matching CSRF token. Mutations are transactional and write an `AuditLog` row. Public reads use explicit Prisma `select` objects so admin and audit fields can never leak.

Uploaded images are capped at 5 MiB, verified as real JPEG/PNG/WebP by decoding them, then re-encoded to metadata-free WebP and stored under an unguessable key. Source filenames are never retained.

## Testing

```bash
npm test
```

Run the suite and a production build before every deployment. `SECURITY.md` lists the manual checks worth repeating: unauthenticated mutations, malformed request bodies, repeated failed logins, and a non-image file renamed to an image extension.

## Deployment

Set `DATABASE_URL`, `SESSION_SECRET`, and `BLOB_READ_WRITE_TOKEN` in the hosting provider's environment settings only. Run `prisma migrate deploy` rather than `migrate dev`.

Two operational notes before a production launch:

- `lib/rate-limit.ts` keeps counters in process memory, so limits apply per instance rather than globally. Replace it with a shared atomic store such as Upstash Redis.
- Security headers are currently declared in **both** `next.config.mjs` and `proxy.ts` with differing policies. Consolidate them into one place to avoid an unpredictable effective CSP.

See `SECURITY.md` for the full security model, rotation procedure, and runbook.

## License

No license is currently declared, so all rights are reserved by default.
