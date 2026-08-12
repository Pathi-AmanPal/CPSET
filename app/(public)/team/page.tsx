import TeamGrid from "@/components/sections/TeamGrid";
import TeamHighlightSection from "@/components/sections/TeamHighlightSection";

export const metadata = {
  title: "Team — CPSET",
  description: "Meet the people behind CPSET — cybersecurity researchers, mentors, and student leaders.",
};

export default function Page() {
  return (
    <main className="pt-8">
      <TeamHighlightSection />
      <TeamGrid />
    </main>
  );
}
