import Hero from "@/components/sections/Hero";
import IntroStrip from "@/components/sections/IntroStrip";
import WordStrip from "@/components/sections/WordStrip";
import VisionMission from "@/components/sections/VisionMission";
import ObjectivesList from "@/components/sections/ObjectivesList";
import TeamGrid from "@/components/sections/TeamGrid";
import EventsTimeline from "@/components/sections/EventsTimeline";
import AchievementsCarousel from "@/components/sections/AchievementsCarousel";
import ConnectTiles from "@/components/sections/ConnectTiles";

export default function HomePage() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <IntroStrip />
      <WordStrip />

      <section id="vision-mission" className="py-16 md:py-24 border-t border-slate-200/60">
        <VisionMission />
      </section>

      <section id="objectives" className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/60">
        <ObjectivesList />
      </section>

      <section id="team" className="py-16 md:py-24 border-t border-slate-200/60">
        <TeamGrid />
      </section>

      <section id="events" className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/60">
        <EventsTimeline />
      </section>

      <section id="achievements" className="py-16 md:py-24 border-t border-slate-200/60">
        <AchievementsCarousel />
      </section>

      <section id="connect" className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/60">
        <ConnectTiles />
      </section>
    </main>
  );
}
