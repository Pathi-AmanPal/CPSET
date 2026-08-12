# CPSET Hero Section — Rebuild Prompt

Paste this whole thing into your coding agent. It's written so the agent can't "reinterpret" the layout — every section is explicit.

---

## Context

I have an existing hero section (screenshot attached: current state) that needs to be rebuilt to match a reference design (screenshot attached: target state). The current globe is a flat wireframe circle with no continents, no rotation, and no ripple effect underneath. Fix this specifically — do not redesign anything else about the layout unless noted below.

**Do not change the copy, the line breaks in the headline, or the card content.** Only fix the visual/technical gaps listed in Part 1.

---

## PART 1 — The Globe (this is the main fix, be precise)

Build the globe as a **rotating, translucent, holographic wireframe Earth**, not a flat 2D circle.

**Structure (layer these, in order, back to front):**
1. Outer atmospheric glow — very low-opacity lavender radial blur, no hard edge
2. Sphere wireframe — longitude lines (vertical, curved per spherical perspective) and latitude lines (horizontal, compressed toward top/bottom, not evenly spaced flat lines)
3. Digital continents — rendered as a **dot/point cloud**, not solid shapes. Use a scattered stipple pattern that traces real continent outlines (a dotted world map texture mapped onto the sphere). Continents should be a light purple/blue, low opacity, denser dots forming the landmass edges.
4. A few faint connection nodes/points glowing slightly brighter than the rest, scattered on the sphere surface, with an occasional soft pulse.

**Rotation:**
- The globe must continuously rotate on its Y-axis, slow and constant — one full revolution roughly every 25–40 seconds. No easing pauses, no user-triggered rotation — it should just be quietly spinning in the background at all times.
- Latitude/longitude lines and the continent dot-map must rotate together as one sphere (not just a background texture panning — it needs to read as a 3D object turning).

**Implementation approach (pick one):**
- **Preferred:** `three.js` (or `@react-three/fiber` if the project is React) — a `SphereGeometry` with a wireframe material for lat/long lines, plus a separate `Points`/`particles` layer using a dotted world-map texture (alpha-masked to continent shapes) mapped onto the same sphere and rotated in sync.
- **Fallback (no 3D library):** an SVG/Canvas 2D approximation — draw latitude ellipses that compress near the poles, longitude arcs that curve with proper sphere perspective, and a canvas-rendered dot-cloud continent map that shifts horizontally to simulate rotation (parallax scroll of the dot texture masked inside the circle).

**Translucency is mandatory:** the globe must stay behind the headline and be soft enough that the text and background remain fully legible through it. Never let it become an opaque or solid-looking sphere — opacity on the wireframe/continents should sit roughly in the 10–20% range, glow even lower.

**Size/position:** roughly 500–530px diameter on desktop, centered horizontally in the hero, top edge starting just below the navbar, vertically centered behind the headline/buttons.

---

## PART 2 — The Ripple / Orbital Rings Beneath the Globe (mandatory, currently missing)

Directly beneath the globe, add **4–6 concentric elliptical rings** that look like a digital platform the globe is floating above — like ripples radiating outward from a contact point.

- Rings are wide, flat ellipses, much wider than the globe itself (~600px at the widest, scaling down toward the smallest inner ring)
- Very thin strokes, low-opacity lavender/purple, no fill
- Stack them so the smallest is closest to the globe's base and rings widen going outward/downward
- A small bright point of light sits at the ring's center, like the "contact point" where the globe meets the platform
- Animate this subtly: each ring can have a slow, staggered opacity pulse (2.5–4s per cycle, offset per ring) so it feels alive without being distracting — think a gentle radar/sonar ripple, not a flashy animation
- Do not make these rings solid shadows or drop-shadows — they are distinct linear ring shapes, layered above the background but below the floating cards

---

## PART 3 — Full Page Spec (for reference / consistency — keep what already matches)

### Navbar (~68px tall, white background)
- Left: shield logo + "CPSET" (bold) with "CHANDIGARH UNIVERSITY" beneath in smaller letter-spaced uppercase
- Center-right nav: Home / Vision & Mission / Objectives / Team / Events / Achievements / Connect
- "Home" is active — darker text + thin purple underline
- Right: "Become a Member" button, purple gradient, rounded, white text, arrow icon, ~140×37px

### Hero content (centered, max-width ~500px, layered in front of the globe)
- Small shield icon, then uppercase letter-spaced label "CHANDIGARH UNIVERSITY"
- Headline, exactly three lines, do not let it reflow automatically:
  ```
  Centre for Privacy and
  Security in Emerging
  Technologies
  ```
  Bold geometric sans-serif, ~44–48px, deep blue-to-purple gradient/color, center-aligned
- Subtext (two lines, centered, gray-blue, ~15–17px):
  ```
  Empowering the next generation of
  cybersecurity professionals
  ```
- Two buttons side by side: "Become a Member ↗" (primary, purple gradient) and "Explore ↓" (secondary, white with subtle purple border)

### Six floating cards (three left, three right of the globe)
Small (~160×72px), white/translucent, soft shadow, ~12px radius, subtle border, left-aligned icon + title + two-line description.

Left: Privacy First / Cyber Security / Emerging Tech
Right: Expert Network / Innovation / Excellence

Each card connects toward the globe with a thin low-opacity purple line ending in a small (~4–5px) purple node dot — this implies "research domain connected to the central network." Keep this connector detail; it's currently missing/weak.

### Bottom stats strip
Four evenly spaced groups, each with a small purple line icon, a bold number, and a small gray label, with faint vertical separators between groups:
```
500+ Active Members   |   20+ Research Projects   |   15+ Events Every Year   |   10+ Achievements
```

### Global rules
- Background stays white with very subtle lavender atmospheric gradient — never dark/cyberpunk
- Cards stay small; never enlarge them
- Globe stays centered and translucent; never opaque or full-bleed
- Headline line breaks are fixed, not auto-wrapped
- All animation is slow and restrained — no bouncing, no fast spins, no flashing neon

---

## Deliverable
Rebuild the hero section (or just the `Globe`/`OrbitalRings` components if the rest already matches) so it satisfies Parts 1 and 2 exactly, while preserving everything in Part 3 that's already correct.
