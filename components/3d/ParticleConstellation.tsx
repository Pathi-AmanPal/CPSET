"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Particle Constellation — Cybersecurity Network Background
   • Tethered orbital motion around origin points (limited motion space)
   • Smooth, medium-paced natural star floating
   • Highly reactive mouse repulsion & spring restoration
   • Dynamic constellation connections & data pulses
   ───────────────────────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  z: number;
  pushX: number;
  pushY: number;
  baseSize: number;
  color: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  t: number; // 0→1 progress
  speed: number;
  color: string;
}

// Colour palette
const COLORS = {
  cobalt: "90, 138, 255",
  violet: "155, 127, 255",
  white: "220, 230, 255",
  cyan: "120, 220, 255",
};

const COLOR_POOL = [
  COLORS.cobalt,
  COLORS.cobalt,
  COLORS.cobalt,
  COLORS.violet,
  COLORS.violet,
  COLORS.white,
  COLORS.cyan,
];

function pickColor(): string {
  return COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
}

export default function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const frameRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return () => {};

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 85 : 235;
    const CONNECTION_DIST = isMobile ? 130 : 180;
    const MOUSE_RADIUS = 220;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const z = Math.random();

        // 65% of stars anchored in central 70% zone so middle never empties out
        let originX = Math.random() * w;
        let originY = Math.random() * h;
        if (i % 3 !== 0) {
          originX = w * 0.15 + Math.random() * (w * 0.70);
          originY = h * 0.12 + Math.random() * (h * 0.76);
        }

        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          orbitRadiusX: 18 + Math.random() * 32,
          orbitRadiusY: 14 + Math.random() * 28,
          orbitSpeed: 0.0033 + Math.random() * 0.0055, // 25% further slower movement speed
          z,
          pushX: 0,
          pushY: 0,
          baseSize: 1.1 + z * 2.2,
          color: pickColor(),
          alpha: 0.25 + z * 0.45,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0055 + Math.random() * 0.008,
        });
      }
    }

    function spawnPulse() {
      if (pulses.length > 8) return;
      for (let attempt = 0; attempt < 10; attempt++) {
        const i = Math.floor(Math.random() * particles.length);
        const j = Math.floor(Math.random() * particles.length);
        if (i === j) continue;
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST * 1.1) {
          pulses.push({
            fromIdx: i,
            toIdx: j,
            t: 0,
            speed: 0.009 + Math.random() * 0.014,
            color: Math.random() > 0.5 ? COLORS.cyan : COLORS.violet,
          });
          return;
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scrollY = scrollRef.current;
      const time = frameRef.current++;

      // Periodically spawn data-packet pulses along constellation lines
      if (time % 90 === 0) spawnPulse();

      // ── Update & Draw Particles ──
      for (const p of particles) {
        // Balanced orbital trigonometric motion around (originX, originY)
        const t = time * p.orbitSpeed;
        const baseOffsetX = Math.sin(t + p.pulsePhase) * p.orbitRadiusX;
        const baseOffsetY = Math.cos(t * 0.85 + p.pulsePhase) * p.orbitRadiusY;

        let targetX = p.originX + baseOffsetX;
        let targetY = p.originY + baseOffsetY;

        // Mouse repulsion calculation (highly reactive)
        const dmx = targetX - mx;
        const dmy = targetY - my;
        const mouseDist = Math.hypot(dmx, dmy);

        if (mouseDist < MOUSE_RADIUS && mouseDist > 0.1) {
          const force = Math.pow(1 - mouseDist / MOUSE_RADIUS, 1.8) * 55;
          const targetPushX = (dmx / mouseDist) * force;
          const targetPushY = (dmy / mouseDist) * force;

          p.pushX += (targetPushX - p.pushX) * 0.25;
          p.pushY += (targetPushY - p.pushY) * 0.25;
        } else {
          // Smooth spring relaxation back to orbit
          p.pushX *= 0.88;
          p.pushY *= 0.88;
        }

        p.x = targetX + p.pushX;
        p.y = targetY + p.pushY;

        // Parallax offset
        const parallaxOffset = scrollY * p.z * 0.05;

        // Pulse glow animation
        p.pulsePhase += p.pulseSpeed;
        const pulse = 0.65 + Math.sin(p.pulsePhase) * 0.35;
        const drawY = p.y + parallaxOffset;
        const drawAlpha = Math.min(1, p.alpha * pulse);
        const size = p.baseSize * (0.85 + pulse * 0.35);

        // Softened outer radial aura (glow reduced)
        const glow = ctx!.createRadialGradient(p.x, drawY, 0, p.x, drawY, size * 3.2);
        glow.addColorStop(0, `rgba(${p.color}, ${drawAlpha * 0.30})`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p.x, drawY, size * 3.2, 0, Math.PI * 2);
        ctx!.fill();

        // Core star dot
        ctx!.fillStyle = `rgba(${p.color}, ${drawAlpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, drawY, size, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ── Draw Constellation Connections ──
      const connDistSq = CONNECTION_DIST * CONNECTION_DIST;
      ctx!.lineWidth = 0.75;

      for (let i = 0; i < particles.length; i++) {
        const pA = particles[i];
        const ayOffset = scrollRef.current * pA.z * 0.05;

        for (let j = i + 1; j < particles.length; j++) {
          const pB = particles[j];
          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.15 * Math.min(pA.alpha, pB.alpha);
            const byOffset = scrollRef.current * pB.z * 0.05;

            ctx!.strokeStyle = `rgba(${COLORS.cobalt}, ${lineAlpha})`;
            ctx!.beginPath();
            ctx!.moveTo(pA.x, pA.y + ayOffset);
            ctx!.lineTo(pB.x, pB.y + byOffset);
            ctx!.stroke();
          }
        }
      }

      // ── Draw Travelling Pulses ──
      const activePulses: Pulse[] = [];
      for (const pulse of pulses) {
        pulse.t += pulse.speed;
        if (pulse.t > 1) continue;

        const pA = particles[pulse.fromIdx];
        const pB = particles[pulse.toIdx];
        if (!pA || !pB) continue;

        const px = pA.x + (pB.x - pA.x) * pulse.t;
        const py =
          pA.y +
          scrollRef.current * pA.z * 0.05 +
          (pB.y + scrollRef.current * pB.z * 0.05 - (pA.y + scrollRef.current * pA.z * 0.05)) *
            pulse.t;

        const pulseAlpha = Math.sin(pulse.t * Math.PI) * 0.95;

        const pg = ctx!.createRadialGradient(px, py, 0, px, py, 9);
        pg.addColorStop(0, `rgba(${pulse.color}, ${pulseAlpha})`);
        pg.addColorStop(0.5, `rgba(${pulse.color}, ${pulseAlpha * 0.4})`);
        pg.addColorStop(1, `rgba(${pulse.color}, 0)`);
        ctx!.fillStyle = pg;
        ctx!.beginPath();
        ctx!.arc(px, py, 9, 0, Math.PI * 2);
        ctx!.fill();

        activePulses.push(pulse);
      }
      pulses = activePulses;

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    function handleResize() {
      resize();
      createParticles();
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleScroll() {
      scrollRef.current = window.scrollY;
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
