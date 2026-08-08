# CPSET Club Website — Backend Build Prompt (Security-First)
*(Paste this into Codex)*

## Project Context

This backend serves **CPSET**, a college cybersecurity club's website. It is small in scope (no public user accounts, no payments) but **security posture matters disproportionately** — this club exists to teach cybersecurity, so a sloppy or vulnerable backend would be embarrassing and undermine the club's credibility. Treat this like a production system that will be scrutinized by security-literate students, not a throwaway class project.

## Scope

- **Public-facing:** read-only endpoints serving Team, Events, and Achievements data to the Next.js frontend. No public write access anywhere.
- **Admin-only:** a small number of club leads (1–5 people) need to log in and create/edit/delete Team, Events, and Achievements entries, including image uploads.
- **No general user accounts, no payments, no PII beyond admin login credentials and whatever the admins choose to publish about themselves publicly.**

## Tech Stack

- Next.js API routes (or Route Handlers) — same repo as frontend, deployed together on Vercel
- **Database:** Postgres (Vercel Postgres or Supabase) via **Prisma ORM** — no raw string-concatenated SQL anywhere
- **Image storage:** Vercel Blob (or S3-compatible) — private bucket, signed/short-lived URLs, never store secrets or execute uploaded files
- **Validation:** Zod schemas for every request body, on the server, regardless of what the client already validated
- **Hashing:** Argon2id for password hashing (fallback bcrypt with cost factor ≥12 if Argon2 unavailable in the environment)

## Authentication

- Admin login via email + password. Passwords hashed with Argon2id — never stored or logged in plaintext.
- Sessions via **httpOnly, Secure, SameSite=Strict** cookies. No JWTs stored in localStorage/sessionStorage under any circumstance.
- Session tokens must be cryptographically random (min 256 bits), stored server-side (or as signed, short-lived JWTs with rotation) with an expiry (e.g. 12–24h) and sliding renewal only on active use.
- **Rate-limit the login endpoint** specifically — e.g. max 5 attempts per IP+account per 15 minutes, with exponential backoff and a generic "invalid credentials" message (never reveal whether the email exists).
- Support **TOTP-based 2FA** for admin accounts (e.g. via `otplib`) — even if optional at launch, build the schema/flow so it can be turned on without a migration later.
- Log out must invalidate the session server-side, not just clear the cookie client-side.
- No "remember me" that extends session life beyond a sane bound; no password reset via insecure channels (email reset flow must use single-use, time-limited, signed tokens).

## Authorization

- Every mutating route (`POST`/`PUT`/`PATCH`/`DELETE`) must verify a valid admin session server-side before touching the database — never trust a client-side "isAdmin" flag.
- Public `GET` routes must only ever return fields intended for public display — never leak internal fields (e.g. admin emails, internal IDs beyond what's needed, timestamps not meant for display) by accident via a lazy `SELECT *` / full object serialization. Use explicit response DTOs/select clauses.

## Input Validation & Injection Prevention

- Zod-validate every incoming payload server-side: types, length limits, allowed characters, enum constraints. Reject anything that doesn't match — don't silently coerce.
- All DB access through Prisma's parameterized query builder — **zero raw SQL string interpolation.** If raw queries are ever unavoidable, use parameterized `$queryRaw` with placeholders, never template literals with interpolated values.
- Sanitize/escape any user-supplied text before it's ever rendered — even though this is admin-only input, treat it as untrusted (defense in depth against a compromised admin account or stored XSS).

## XSS / Output Safety

- Never use `dangerouslySetInnerHTML` on admin-entered content unless it passes through a strict allowlist sanitizer (e.g. `DOMPurify` server-side) — and prefer plain text rendering wherever rich formatting isn't actually needed.
- Set a strict **Content-Security-Policy** header (via `next.config.js` headers or middleware): restrict `script-src` to self (+ any specific CDN you actually use), disallow `unsafe-inline` where feasible, restrict `img-src`/`connect-src` to known origins (your blob storage domain, etc.).

## CSRF Protection

- Since auth is cookie-based, implement CSRF protection: `SameSite=Strict` cookies as the primary defense, plus a custom header check (e.g. require `X-Requested-With` or a CSRF token) on all state-changing admin routes as defense in depth.

## Secure HTTP Headers (apply globally via middleware)

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy:` disable camera/mic/geolocation etc. that the site doesn't use
- `Content-Security-Policy` as above

## File Upload Security (Team/Event/Achievement images)

- Whitelist file types by **magic-byte/content sniffing**, not just file extension or client-reported MIME type
- Enforce a strict max file size (e.g. 5MB) rejected server-side before upload completes
- Re-encode/re-process images server-side (e.g. via `sharp`) rather than storing the raw uploaded bytes — this strips embedded scripts/metadata and normalizes format
- Store with randomly generated filenames (never trust user-supplied filenames), in a bucket with public read but **no execute/no directory listing**, served via CDN
- Never allow uploads to be served from the same origin/path structure as anything interpretable as a script

## Rate Limiting & Abuse Prevention

- Rate-limit **all** API routes, not just login (e.g. via Vercel Edge Middleware + a store like Upstash Redis) — sensible defaults: stricter on auth routes, more relaxed on public GETs.
- Add basic bot/abuse protection if a public contact surface is ever added later (not currently in scope per club's plan).

## Secrets & Configuration

- All secrets (DB URL, blob tokens, session signing secret, SMTP creds if used) via environment variables only — `.env.local` in `.gitignore`, never committed
- Separate secrets per environment (dev/preview/prod) in Vercel's environment variable settings
- Rotate the session signing secret and admin passwords if this repo is ever made public or shared with non-club members

## Error Handling & Logging

- Never return raw stack traces, DB errors, or internal paths to the client — generic error messages only, detailed errors logged server-side
- Maintain an **audit log** of admin actions (who created/edited/deleted what, and when) in the database — this is both good security hygiene and useful if content is ever disputed
- Logs must never contain passwords, session tokens, or full request bodies of auth endpoints

## Dependency & Infra Hygiene

- Commit a lockfile (`package-lock.json`/`pnpm-lock.yaml`); enable Dependabot or `npm audit` in CI
- Keep Prisma, Next.js, and auth-related packages current — these are the highest-value packages to patch promptly
- HTTPS is enforced by default on Vercel — confirm no mixed-content warnings and that cookies are marked `Secure`

## Testing Requirement

Before considering the backend done, write and run test cases that specifically attempt:
- Login with wrong credentials repeatedly (confirm rate limiting kicks in)
- Accessing admin mutation routes without a valid session (must be rejected)
- Submitting malformed/oversized/wrong-type payloads to every endpoint (must be rejected with validation errors, not crash)
- Uploading a non-image file renamed with an image extension (must be rejected)
- Basic injection attempts in text fields (must be stored/rendered inert, not executed)

## Deliverable

A `/lib/db`, `/lib/auth`, `/app/api/**` structure (or Route Handlers equivalent) implementing the above, with a short `SECURITY.md` documenting the auth flow, header policy, and how to rotate secrets — so any future club lead can understand and maintain it without re-deriving the design.
