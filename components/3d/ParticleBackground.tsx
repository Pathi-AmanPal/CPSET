"use client";

import dynamic from "next/dynamic";

const ParticleConstellation = dynamic(
  () => import("@/components/3d/ParticleConstellation"),
  { ssr: false }
);

export default function ParticleBackground() {
  return <ParticleConstellation />;
}
