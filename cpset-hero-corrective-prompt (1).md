# CPSET Hero — Corrective Prompt (Fix These Exact Gaps)

The last attempt is missing major sections and has broken elements. Do NOT freestyle — match the reference screenshot exactly, section by section. Below is a literal diff between what exists now and what's required.

---

## ⚠️ MISSING ENTIRELY — add these back, they don't exist in the current build

### 1. Six floating cards around the globe
These are completely absent right now. Add them back exactly as before:

**Left side, stacked top to bottom:**
- Privacy First — "Advancing privacy-preserving technologies and research."
- Cyber Security — "Securing systems, networks and digital infrastructures."
- Emerging Tech — "Exploring AI, IoT, Blockchain and beyond."

**Right side, stacked top to bottom:**
- Expert Network — "Collaborating with experts and industry leaders."
- Innovation — "Driving innovation for a safer digital future."
- Excellence — "Building a culture of excellence in cybersecurity."

Each card: ~160×72px, white background, soft shadow, ~12px border radius, small purple line icon on the left, bold title, small two-line gray description below it. Left-aligned text, not centered.

Each card has a thin purple connector line running from its edge toward the globe, ending in a small purple dot node.

### 1a. Globe-surface nodes (the "pop-outs") — do not skip this
On the globe itself, there are **six small glowing purple dot nodes sitting directly on the sphere's surface/silhouette edge** — three aligned on the left side, three aligned on the right side, one for each card at matching heights (upper/middle/lower). These are separate from the dot at the card's end of the connector line — the connector line runs FROM the card TO one of these globe-surface nodes.

- Each globe-surface node is a small circle (~5–6px), solid purple, with a soft glow halo around it
- They sit exactly where the connector line meets the globe's outline, appearing to "pop out" slightly from the sphere's edge — like a small marker breaking the silhouette
- Add a very subtle pulse/glow animation on these nodes (slightly out of phase with each other) so they feel like live network access points on the globe, not static dots
- These six nodes rotate WITH the globe if you're doing true 3D rotation — or, if using the 2D/CSS fallback, keep them fixed at the silhouette edge (left/right, upper/middle/lower) since they represent connection points on the visible face, not a specific rotating landmass

### 2. Bottom statistics strip
Also completely absent. Add a horizontal row below the buttons/globe:
```
👥 500+ Active Members   🛡 20+ Research Projects   📅 15+ Events Every Year   🏆 10+ Achievements
```
Bold number, small gray label underneath, faint vertical divider lines between each group, centered as a group under the hero.

### 3. Logo institution subtitle
The navbar logo currently only shows "CPSET". Add "CHANDIGARH UNIVERSITY" underneath it in small letter-spaced uppercase, exactly like the reference.

### 4. Navbar CTA button
The "Become a Member" button belongs in the top-right corner of the navbar, not just inside the hero. Add it back to the navbar with the purple gradient background + white text + arrow.

---

## 🐛 BROKEN — fix these

### 5. Stray icon artifacts overlapping the headline
There are visible broken icon glyphs ("↔" / "⌄" type symbols) rendered directly on top of the words "in" and "Technologies" in the headline. This looks like an unstyled/failed icon component leaking into the text. Remove whatever element is causing this — it should not exist at all. The headline must be plain text, nothing overlapping it.

### 6. Headline size and line breaks
Currently wrapping into 4 lines ("Technologies" drops to its own line alone) and looks visually oversized relative to the globe. Fix the font-size so it locks to exactly these three lines, no more, no less:
```
Centre for Privacy and
Security in Emerging
Technologies
```
Reduce headline font size until this three-line break happens naturally, then hard-lock the `<br>` breaks so it can never reflow to 4 lines on desktop.

### 7. Globe is too faint and has no visible continents
Right now the globe reads as a nearly-invisible circle with scattered random dots — there's no recognizable world map. Increase the continent dot-cluster opacity/density enough that continent shapes (Africa, Americas, Eurasia outlines) are actually recognizable, matching the reference. Also increase the globe's overall size closer to ~530px diameter — right now it's rendering smaller and higher up than it should, causing the ripple rings to end up way below the content instead of directly under the globe.

### 8. Ripple rings position
The orbital rings are currently floating far below the button row with a big gap. They should sit immediately beneath the globe, closely nested under it, with the globe's "contact point" glow sitting at the ring stack's center — not detached lower on the page.

---

## Keep as-is (already correct)
- Overall white/lavender background
- Button styling and copy ("Become a Member ↗", "Explore ↓")
- Subtext copy
- Purple/blue gradient color system

---

## Final check before calling this done
Compare side by side against the reference and confirm all of these are true:
- [ ] Six cards visible, three per side, connected to the globe by lines + dot nodes
- [ ] Stats strip visible at the bottom with 4 groups
- [ ] Navbar shows "CPSET / CHANDIGARH UNIVERSITY" + full nav links + "Become a Member" button on the right
- [ ] Headline is exactly 3 lines, no overlapping icons/glyphs
- [ ] Globe shows recognizable continent shapes, is ~530px, and rotates slowly
- [ ] Ripple rings sit directly under the globe, not detached further down the page
