# CPSET security operations

## Authentication and authorization

Administrators authenticate by email and an Argon2id password. `Admin` includes optional `totpSecret` and `totpEnabled` fields, so TOTP can be enabled without a database migration. Successful login creates a 256-bit random token. Only its SHA-256 digest is stored in Postgres; the raw token is an `httpOnly`, `Secure`, `SameSite=Strict` cookie with a 12-hour sliding expiry. Logout deletes the server-side session.

Every mutation calls `authorizedMutation`, which requires both a live session and `X-Requested-With: XMLHttpRequest`. The custom header, paired with SameSite cookies, is CSRF defense in depth. Public routes use explicit Prisma `select` objects and never return admin or audit fields.

## Content and uploads

All JSON inputs are parsed with Zod. Content is stored as text and must be rendered as text (do not introduce `dangerouslySetInnerHTML`). Images are limited to 5 MiB, decoded to prove JPEG/PNG/WebP magic bytes, and re-encoded as WebP with `sharp`, stripping metadata. Object keys use a random suffix and never preserve the source filename.

The Blob domain is deliberately the separate CDN origin. It serves image-only processed assets; it must not share an application origin or host executable uploads. Configure the Blob store with no write credentials exposed to browsers.

## Headers and rate limits

Middleware sets HSTS, CSP, frame denial, MIME-sniffing protection, referrer policy, and a restrictive permissions policy for every response. Login is limited per IP and account; every API path also has a baseline limit. The included memory limiter is adequate only for local development/single-process deployments. Before production, replace `lib/rate-limit.ts` with a shared atomic store (such as Upstash Redis) so limits apply across Vercel instances and add exponential retry penalties.

## Deploy and rotate

Set `DATABASE_URL`, `SESSION_SECRET`, and `BLOB_READ_WRITE_TOKEN` only in the hosting provider’s environment settings. Do not commit `.env.local`. Use distinct development, preview, and production values. Rotate the Blob token if exposed. To force all sessions to expire, delete the `Session` rows; rotate admin passwords (and TOTP secrets, if applicable) separately. Any future password-reset flow must use a single-use, short-lived server-side token delivered through a verified email channel.

## Runbook

1. Run `npm ci`, then `npx prisma migrate dev --name init` locally (use `prisma migrate deploy` in production).
2. Create the initial administrator out of band with an Argon2id password hash; no public registration endpoint exists.
3. Run `npm test` and `npm run build` before deployment. Test unauthenticated mutations, malformed bodies, repeated failed logins, and a renamed non-image upload.
