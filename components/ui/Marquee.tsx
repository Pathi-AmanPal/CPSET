"use client";

interface MarqueeProps {
  items: string[];
  speed?: number;
  separator?: string;
  className?: string;
}

export default function Marquee({
  items,
  speed = 30,
  separator = " · ",
  className = "",
}: MarqueeProps) {
  const content = items.join(separator) + separator;

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      aria-hidden="true"
    >
      <div
        className="inline-flex"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        <span className="font-heading text-lg md:text-xl tracking-widest text-body/40 uppercase">
          {content}
        </span>
        <span className="font-heading text-lg md:text-xl tracking-widest text-body/40 uppercase">
          {content}
        </span>
      </div>
    </div>
  );
}
