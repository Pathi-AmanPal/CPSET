"use client";

export default function CyberGlobeFallback() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-40">
      <div className="relative w-[500px] h-[500px] md:w-[650px] md:h-[650px]">
        {/* Outer rotating circuit ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-cobalt/40 animate-[spin_40s_linear_infinite]" />

        {/* Inner reverse rotating ring */}
        <div className="absolute inset-8 rounded-full border border-dotted border-violet/50 animate-[spin_25s_linear_infinite_reverse]" />

        {/* Glowing shield pulse center */}
        <div className="absolute inset-1/4 rounded-full bg-gradient-to-tr from-cobalt/20 via-violet/20 to-transparent blur-2xl animate-pulse" />

        {/* SVG Globe grid & Shield outlines */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-cobalt/30 animate-[spin_60s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        >
          {/* Latitude circles */}
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <ellipse cx="100" cy="100" rx="90" ry="30" strokeDasharray="2 2" />
          <ellipse cx="100" cy="100" rx="90" ry="60" strokeDasharray="2 2" />

          {/* Longitude ellipses */}
          <ellipse cx="100" cy="100" rx="30" ry="90" strokeDasharray="2 2" />
          <ellipse cx="100" cy="100" rx="60" ry="90" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Radial soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
    </div>
  );
}
