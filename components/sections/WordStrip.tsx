import Marquee from "@/components/ui/Marquee";

export default function WordStrip() {
  return (
    <div className="py-8 border-y border-slate-200 bg-slate-50/50">
      <Marquee
        items={["Privacy", "Security", "Innovation", "Trust", "Excellence"]}
        speed={25}
        separator=" · "
        className="text-cobalt/50 font-semibold"
      />
    </div>
  );
}
