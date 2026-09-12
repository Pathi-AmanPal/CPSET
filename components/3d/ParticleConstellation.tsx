"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Particle Constellation — Stationary Stars with Small Tight Glow
   • Stars remain stationary in position (no ambient wash/aura)
   • Hovering cursor leaves a long trail (2500ms lifetime)
   • 2.5x interaction radius around cursor trail
   • Small, tight, crisp glow directly surrounding glowing stars
   ───────────────────────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  color: string;
  alpha: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  color: string;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

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
  const trailRef = useRef<TrailPoint[]>([]);
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
    const PARTICLE_COUNT = isMobile ? 95 : 260;
    const CONNECTION_DIST = isMobile ? 130 : 180;
    
    // Interaction radius (2.5x standard cursor)
    const GLOW_RADIUS = isMobile ? 220 : 320;
    
    // Trail lifetime (2500ms)
    const TRAIL_LIFETIME = 2500;

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

        // Distributed stationary stars
        let x = Math.random() * w;
        let y = Math.random() * h;
        if (i % 3 !== 0) {
          x = w * 0.10 + Math.random() * (w * 0.80);
          y = h * 0.08 + Math.random() * (h * 0.84);
        }

        particles.push({
          x,
          y,
          z,
          baseSize: 1.2 + z * 2.2,
          color: pickColor(),
          alpha: 0.2 + z * 0.4,
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
      const now = performance.now();
      const scrollY = scrollRef.current;
      const time = frameRef.current++;

      // Filter trail points by 2500ms lifetime
      const currentTrail = trailRef.current.filter(
        (tp) => now - tp.time < TRAIL_LIFETIME
      );
      trailRef.current = currentTrail;

      if (time % 90 === 0) spawnPulse();

      // ── Update & Draw Stationary Particles with Small Tight Glow ──
      for (const p of particles) {
        const drawY = p.y + scrollY * p.z * 0.05;

        // Calculate maximum trail glow for stationary star
        let trailGlow = 0;
        for (const tp of currentTrail) {
          const dx = p.x - tp.x;
          const dy = drawY - tp.y;
          const dist = Math.hypot(dx, dy);

          if (dist < GLOW_RADIUS) {
            const age = (now - tp.time) / TRAIL_LIFETIME;
            const distFactor = Math.pow(1 - dist / GLOW_RADIUS, 1.4);
            const ageFactor = Math.pow(1 - age, 1.2);
            const intensity = distFactor * ageFactor;
            if (intensity > trailGlow) {
              trailGlow = intensity;
            }
          }
        }

        // Final star size and alpha based on trail glow
        const alpha = Math.min(1, p.alpha * 0.35 + trailGlow * 0.65);
        const size = p.baseSize * (1 + trailGlow * 1.2);

        // Small tight glow (no large ambient aura)
        if (trailGlow > 0.02) {
          const glowRadius = size * 1.8;
          const glow = ctx!.createRadialGradient(p.x, drawY, 0, p.x, drawY, glowRadius);
          glow.addColorStop(0, `rgba(${p.color}, ${trailGlow * 0.50})`);
          glow.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx!.fillStyle = glow;
          ctx!.beginPath();
          ctx!.arc(p.x, drawY, glowRadius, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Crisp Core star dot
        ctx!.fillStyle = `rgba(${p.color}, ${alpha})`;
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
          const dy = (pA.y + ayOffset) - (pB.y + scrollRef.current * pB.z * 0.05);
          const distSq = dx * dx + dy * dy;

          if (distSq < connDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.12 * Math.min(pA.alpha, pB.alpha);

            ctx!.strokeStyle = `rgba(${COLORS.cobalt}, ${lineAlpha})`;
            ctx!.beginPath();
            ctx!.moveTo(pA.x, pA.y + ayOffset);
            ctx!.lineTo(pB.x, pB.y + scrollRef.current * pB.z * 0.05);
            ctx!.stroke();
          }
        }
      }

      // ── Draw Travelling Data Pulses ──
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
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });
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
