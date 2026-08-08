"use client";

import TextLoop from "@/components/ui/TextLoop";

export default function WordStrip() {
  return (
    <div className="py-1 border-y border-slate-200/80 bg-slate-50/70 overflow-hidden">
      <TextLoop
        text="PRIVACY ✦ SECURITY ✦ INNOVATION ✦ TRUST ✦ EXCELLENCE"
        shape="line"
        speed={75}
        direction="forward"
        separator="✦"
        fontSize={15}
        fontWeight={700}
        letterSpacing={3}
        uppercase
        color="#0047AB"
        ribbon={true}
        ribbonColor="rgba(0, 71, 171, 0.05)"
        ribbonWidth={36}
        pauseOnHover={true}
      />
    </div>
  );
}
