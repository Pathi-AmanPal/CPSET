# Prompt for Antigravity — "The Case Board" Team Section

Paste everything below into Antigravity as your build brief. Swap in your club's real name where you see `[CLUB NAME]`, and drop your real team photos into the data array at the bottom.

---

## Role framing

You are acting as a senior product designer (the kind of designer a $2M/year studio would staff on a flagship brand moment). Build a **draggable "case board" team section** for `[CLUB NAME]`'s website — a corkboard-and-red-string investigation wall, reimagined as a way to meet the people who run the club. It should feel tactile, a little conspiratorial, and genuinely fun to mess with, not like a generic team grid with a filter slapped on.

## Concept

The Mentor, **Syed Irfan**, sits at the center of the board like the "case's central suspect" — the person everyone's threads lead back to. Every team member's polaroid is connected to his by a length of string, because that's structurally true: he's the hub they all connect through. Visitors can grab any photo and drag it around the board; the strings stay attached and redraw live, the way real string on a real corkboard would sag and pull taut as you move the pin.

**Signature element:** live-recalculating red string between the Mentor photo and every team photo. This is the one thing people will remember — protect it, don't compete with it with extra decoration.

## Visual tokens

**Color**
| Token | Hex | Use |
|---|---|---|
| `--cork-base` | `#A67B5B` | corkboard background (textured, not flat) |
| `--cork-shadow` | `#2B1D14` | vignette edges, board depth |
| `--paper-kraft` | `#C9A876` | map/paper scrap accents behind photos |
| `--polaroid-white` | `#F5F0E6` | photo border, slightly aged, never pure white |
| `--photo-sepia-dark` | `#4A3728` | photo shadow tones (placeholders rendered in warm sepia/duotone, not full color) |
| `--string-red` | `#B23A2E` | connecting string, muted brick-red not neon |
| `--pin-brass` | `#C9A24B` | push-pin heads |
| `--note-yellow` | `#E8D67A` | sticky-note name tags, slightly aged |
| `--ink` | `#2B2118` | all text, warm near-black, never pure black |

**Type**
- Display / labels ("MEET THE TEAM", note headers): a typewriter face — **Special Elite** or **Courier Prime**. Used sparingly, all-caps, tight tracking.
- Names & roles on each polaroid tag: a clean grotesque — **Archivo** or **Inter**, medium weight, so it stays legible against the busy board.
- Handwritten accents (small annotations, "MENTOR" scrawl under Syed's photo): **Caveat** or **Shadows Into Light**, used only for 1–2 word tags, never body copy.

**Layout (ASCII wireframe, desktop)**
```
┌──────────────────────────────────────────────────┐
│  [CLUB NAME]              MEET THE TEAM  (label)  │
│                                                    │
│      ▨tilt          ┌─────────┐        ▨tilt      │
│   member         ╲  │ MENTOR  │  ╱          member │
│                   ╲ │ Syed    │ ╱                  │
│         ▨──────────╲│ Irfan   │╱──────────▨        │
│      member          └─────────┘         member    │
│                   ╱          ╲                     │
│      ▨tilt       ╱            ╲       ▨tilt        │
│   member        ╱              ╲         member    │
│                                                     │
│         (strings radiate outward like spokes)      │
└──────────────────────────────────────────────────┘
```
Mentor polaroid is visibly larger (roughly 1.4x team photo size) and vertically centered. Team polaroids scatter around it at random-but-seeded rotations between -8° and 12°, no two touching edges. On mobile, collapse to a vertical scroll where the Mentor card pins at top and team cards stack below with shortened strings — full drag interaction stays, just constrained to a taller, narrower board.

## Content structure

Model the data so it's trivial to swap real photos in later:

```json
{
  "mentor": {
    "name": "Syed Irfan",
    "role": "Mentor",
    "photo": "/images/team/syed-irfan.jpg",
    "tag": "Mentor"
  },
  "team": [
    { "name": "[Member Name]", "role": "[Role — e.g. President]", "photo": "/images/team/placeholder-1.jpg" },
    { "name": "[Member Name]", "role": "[Role — e.g. Vice President]", "photo": "/images/team/placeholder-2.jpg" },
    { "name": "[Member Name]", "role": "[Role — e.g. Events Lead]", "photo": "/images/team/placeholder-3.jpg" }
  ]
}
```
Placeholder photos should render as warm sepia/duotone silhouettes (not gray boxes) so the board looks intentional even before real photos are in.

## Interaction & motion spec

- **Drag (desktop):** pointer-down grabs a polaroid, lifts its shadow and z-index, cursor becomes `grabbing`. Use spring physics (not linear follow) so it has a touch of weight and slight overshoot on release. Constrain drag within the board's bounds.
- **Drag (touch):** same behavior via touch events; keep it single-finger, no pinch/zoom complexity.
- **String redraw:** on every drag frame, recompute each string as a quadratic bezier from pin-point to pin-point with a bit of sag proportional to distance — not a straight line. Use `requestAnimationFrame`, not React state on every pixel, to keep this smooth.
- **Hover:** photo lifts slightly (translateY + larger shadow), its string thickens by ~1px.
- **Tap/click:** expands a short bio (name, role, one line about them) in a small torn-paper note that appears pinned beside the photo — not a modal that blocks the board.
- **Entrance:** on load, polaroids drop and pin into place one at a time (staggered ~80ms apart) with a small bounce; strings draw themselves in after all photos have landed.
- **Reduced motion:** if `prefers-reduced-motion` is set, skip the entrance stagger/bounce and string-draw animation — show the final state directly. Dragging should still work.

## Technical implementation

- **Stack:** React + Framer Motion is the natural fit — `drag`, `dragConstraints`, `dragElastic` handle the physics, and you get spring config for free. Render the strings as an SVG overlay positioned absolutely above the board, each `<path>` recomputed from the two connected elements' `getBoundingClientRect()`.
- **Performance:** transform photos with CSS `translate`/`rotate` (GPU-friendly), never animate `top`/`left`. Recompute string paths inside `requestAnimationFrame`, throttled to actual drag events, not on every render.
- **Accessibility:** every polaroid is a focusable element (`tabindex`, visible focus ring styled to match the corkboard aesthetic, e.g. a highlighted pin). Arrow keys nudge a focused photo's position; Enter/Space opens the same bio note that tap/click opens. Alt text on every photo uses the person's name and role.
- **Responsive:** breakpoint the board layout at ~768px per the mobile wireframe note above. Board height should be generous — this section wants room to breathe, not a cramped 400px strip.

## What to protect

The string network is the signature — spend your creative risk there and keep everything else (background texture, note styling, type) quiet and disciplined so the strings read clearly. Resist adding extra decoration (confetti, extra icons, gradients) that competes with it.
