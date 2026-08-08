# CPSET Club Website — Frontend + Admin Build Prompt
*(Paste this into Antigravity, Claude Sonnet/Opus)*

## Project Context

Build a website for **CPSET (Centre for Privacy and Security in Emerging Technologies)**, a cybersecurity club at Chandigarh University. This is a public-facing informational site with a hidden admin panel for club leads to manage content (no public backend features like signup — members join via a CU intranet link).

The site must feel like it belongs to a serious, modern cybersecurity organization — not a generic college club page. Think: dark, layered, technical, quietly confident. Avoid the "grid of equal-sized rounded boxes" look entirely. Use asymmetry, depth, and motion instead of flat card grids.

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Component library:** [React Bits](https://reactbits.dev) — use their animated components rather than building from scratch where one fits (see mapping below)
- **Motion:** Framer Motion for page/scroll transitions and micro-interactions
- **3D:** react-three-fiber + drei for the hero animation
- **Icons:** lucide-react

## Design System

Use this exact palette (from the club's official brand guide — do not deviate):

| Role | Hex | Usage |
|---|---|---|
| Background | `#0A0E1A` (dark variant of their navy, not the light `#F8F8F8` — this site should run dark-mode-first) | Page background |
| Surface / panels | `#0F1729` | Cards, panel backgrounds, glass surfaces |
| Primary A — Electric Cobalt | `#0047AB` | Primary buttons, links, key accents |
| Primary B — Deep Royal | `#002366` | Gradients, secondary emphasis, headers |
| Illumination / Vibe (purple accent) | `#8B00FF` | Highlights, hover glows, gradient endpoints, the 3D hero glow |
| Secondary text/interface | `#E0E0E0` | Body text on dark backgrounds |
| Accent marker | `#FF0000` | **Sparingly** — only for urgent/alert-style badges (e.g. "Live Now"), never decorative |

Typography: A geometric sans for headings (e.g. **Space Grotesk** or **Sora**) paired with a clean readable sans for body (e.g. **Inter**). No default system fonts.

Visual language:
- Dark navy → deep royal → violet gradient meshes as background washes, not flat fills
- Glassmorphism panels (subtle blur + border, not heavy glass) for content surfaces
- Diagonal or angled section dividers instead of hard horizontal lines
- Subtle animated grid/circuit-line background details (referencing the logo's globe/network lines), low opacity, non-distracting
- Generous negative space — do not cram every section into equal boxes

## Folder / Component Structure

```
/app
  /(public)
    /page.tsx                → Home
    /vision-mission/page.tsx
    /objectives/page.tsx
    /team/page.tsx
    /events/page.tsx
    /achievements/page.tsx
    /connect/page.tsx
  /admin
    /login/page.tsx
    /dashboard/page.tsx
    /team/page.tsx           → CRUD UI
    /events/page.tsx         → CRUD UI
    /achievements/page.tsx   → CRUD UI
/components
  /ui                        → React Bits components, wrapped/themed
  /sections                  → Section-level composed components (Hero, MissionGrid, etc.)
  /admin                     → Admin-only components (forms, tables, upload widgets)
/lib                         → fetchers, types, utils
```

Keep every section as its own composable component — nothing hardcoded directly into page files. This is what makes it "modular": you should be able to reorder, swap, or restyle any section independently.

## Page-by-Page Brief

### Home
- **Hero:** Full-viewport 3D scene — a rotating dotted globe with a glowing shield/lock at the center, thin animated connection lines arcing across it (directly referencing the CPSET logo). Overlaid with the club name, a one-line tagline, and a CTA pair ("Become a Member" → CU intranet link, "Explore" → scrolls down). Use React Bits' text animation components (e.g. shiny/gradient text, split-text reveal) for the headline rather than static text.
- Below the fold: a short, asymmetric intro strip (not a centered paragraph block) — text on one side, an animated stat/counter or particle accent on the other.
- A horizontal marquee or auto-scroll strip teasing "Privacy · Security · Innovation · Trust · Excellence" (from the logo's outer ring text) — use a React Bits marquee component.

### Vision & Mission
- Vision as a large, quiet, centered statement — no card, just strong typography with a subtle animated gradient behind it.
- The 6 mission points: **do not** render as 6 identical boxes in a 2x3 grid. Instead use a staggered/offset layout — alternating left-right alignment, or a vertical timeline-style layout with connecting lines, revealed on scroll (Framer Motion `whileInView`). Each point gets an icon (lucide-react) matching its theme (research, real-world challenges, collaboration, talent, awareness, national security).

### Objectives
- Similar treatment to the poster's objective list, but reimagined — an interactive vertical list where hovering/tapping an objective expands it with more detail, rather than 6 static boxes.
- Footer strip with the four pillars (Collaborate / Innovate / Secure / Empower) as an animated icon row.

### Team
- Fetches from the database (empty state: a tasteful "Team roster coming soon" placeholder, not a broken empty grid).
- When populated: an asymmetric masonry or staggered card layout (React Bits has tilt/spotlight card components — use one) with photo, name, role, and social links. Hover reveals a subtle glow in the accent purple.

### Events
- Fetches from database. Timeline-style layout (past/upcoming split), each event card using a spotlight/tilt hover effect, with an image, date, and short description.
- Empty state should still look intentional (e.g. "First event drops soon" with the 3D/particle background still active).

### Achievements
- Same data-driven pattern as Events/Team. Suggest a horizontal scroll-snap showcase rather than a static grid, since achievement counts will grow slowly.

### Connect
- Instagram, Twitter/X, WhatsApp channel/community — as large, distinct interactive tiles (not tiny footer icons), each with its own hover animation and brand-appropriate accent, plus the CU intranet "Become a Member" button prominently repeated here.

## Admin Panel

- `/admin/login` — clean, minimal, dark, single centered form (email + password). No club branding flourishes here — keep it plain and serious, this is a security tool.
- `/admin/dashboard` — quick counts (team members, events, achievements) and shortcuts to each CRUD section.
- Each CRUD section (`team`, `events`, `achievements`):
  - Table/list view of existing entries with edit/delete actions
  - "Add new" form with: text fields as needed, an image upload widget (drag-and-drop, with preview, client-side size/type check before upload)
  - Clear success/error toasts for every action
  - Confirm-before-delete modal (no accidental deletions)
- **Note:** the admin UI should be functional and clean, not decorative. Save the visual flair for the public site.

## Interaction & Performance Rules

- All scroll-triggered animations must use `whileInView` with `once: true` (no re-triggering, avoid jank)
- 3D hero must lazy-load, degrade gracefully (static gradient fallback) on low-end devices, and never block first paint of the text content
- Mobile-first responsive breakpoints — test the 3D hero specifically at mobile widths, reduce complexity there if needed
- Respect `prefers-reduced-motion` — disable non-essential animation for users who request it
- Lighthouse performance score target: 85+ on mobile

## What I need from you

Scaffold the full modular project structure above with working page shells, the themed React Bits components, the 3D hero, and the admin panel UI (forms/tables can call placeholder API routes — actual backend logic comes from a separate security-focused build). Explain any structural decisions briefly as you go so I can steer changes.
