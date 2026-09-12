"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import FuzzyText from "@/components/ui/FuzzyText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { fetchAchievements } from "@/lib/fetchers";
import { formatDate } from "@/lib/utils";
import type { Achievement } from "@/lib/types";
import { Trophy } from "lucide-react";
import Image from "next/image";

export default function AchievementsCarousel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAchievements()
      .then(setAchievements)
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-cobalt font-heading text-sm uppercase tracking-[0.3em] font-semibold mb-4">
            Achievements
          </p>
          <AnimatedText
            text="Milestones & Recognition"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-2 border-cobalt/30 border-t-cobalt rounded-full animate-spin" />
          </div>
        ) : achievements.length === 0 ? (
          /* Empty state with FuzzyText */
          <motion.div
            className="text-center py-6 flex flex-col items-center justify-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >

            <div className="my-2 cursor-pointer">
              <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.6}
                enableHover={true}
                clickEffect={true}
                color="#e2e8f0"
                gradient={["#facc15", "#f97316", "#a855f7"]}
                fontSize="clamp(2.2rem, 7vw, 5.5rem)"
                fontWeight={900}
                fuzzRange={26}
              >
                ACHIEVEMENTS
              </FuzzyText>
            </div>

            <h3 className="font-heading text-xl font-semibold text-royal mb-2 mt-4">
              Milestones Unlocking Soon
            </h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed font-mono">
              Great things are in the works. Our research publications, awards, and national CTF recognitions will be published here.
            </p>
          </motion.div>
        ) : (
          /* Horizontal scroll-snap carousel */
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  className="snap-center shrink-0 w-80 md:w-96"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <SpotlightCard className="h-full p-0 overflow-hidden">
                    {ach.imageUrl && (
                      <div className="relative aspect-video">
                        <Image
                          src={ach.imageUrl}
                          alt={ach.title}
                          fill
                          className="object-cover"
                          sizes="384px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-cobalt text-xs font-semibold mb-2">
                        {formatDate(ach.achievedAt)}
                      </p>
                      <h3 className="font-heading font-semibold text-lg text-royal mb-2">
                        {ach.title}
                      </h3>
                      <p className="text-body/70 text-sm leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>

            {/* Scroll hint gradient */}
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </main>
  );
}
