import Hero from "@/components/sections/Hero";
import IntroStrip from "@/components/sections/IntroStrip";
import WordStrip from "@/components/sections/WordStrip";
import VisionMission from "@/components/sections/VisionMission";
import ObjectivesList from "@/components/sections/ObjectivesList";
import TeamGrid from "@/components/sections/TeamGrid";
import TeamHighlightSection from "@/components/sections/TeamHighlightSection";
import EventsTimeline from "@/components/sections/EventsTimeline";
import AchievementsCarousel from "@/components/sections/AchievementsCarousel";
import ConnectTiles from "@/components/sections/ConnectTiles";
import Scroll3DSection from "@/components/ui/Scroll3DSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <section id="hero">
        <Hero />
      </section>

      <IntroStrip />
      <WordStrip />

      {/* 3D Perspective Scroll fold-in sections */}
      <Scroll3DSection maxRotateX={16} depth={100}>
        <section id="vision-mission" className="py-8 md:py-12 border-t border-blue-500/15">
          <VisionMission />
        </section>
      </Scroll3DSection>

      <Scroll3DSection maxRotateX={18} depth={120}>
        <section id="objectives" className="py-8 md:py-12 border-t border-blue-500/15">
          <ObjectivesList />
        </section>
      </Scroll3DSection>

      <Scroll3DSection maxRotateX={14} depth={90}>
        <section id="team" className="py-8 md:py-12 border-t border-blue-500/15">
          <TeamGrid />
          <TeamHighlightSection />
        </section>
      </Scroll3DSection>

      <Scroll3DSection maxRotateX={18} depth={140}>
        <section id="events" className="py-8 md:py-12 border-t border-blue-500/15">
          <EventsTimeline />
        </section>
      </Scroll3DSection>

      <Scroll3DSection maxRotateX={15} depth={100}>
        <section id="achievements" className="py-8 md:py-12 border-t border-blue-500/15">
          <AchievementsCarousel />
        </section>
      </Scroll3DSection>

      <Scroll3DSection maxRotateX={12} depth={80}>
        <section id="connect" className="py-8 md:py-12 border-t border-blue-500/15">
          <ConnectTiles />
        </section>
      </Scroll3DSection>
    </main>
  );
}
