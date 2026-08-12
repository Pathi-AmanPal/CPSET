"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import FuzzyText from "@/components/ui/FuzzyText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { fetchEvents } from "@/lib/fetchers";
import { formatDate, isUpcoming } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

export default function EventsTimeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter((e) => isUpcoming(e.eventDate));
  const past = events.filter((e) => !isUpcoming(e.eventDate));

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
            Events
          </p>
          <AnimatedText
            text="Workshops, Talks & Competitions"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-cobalt/30 border-t-cobalt rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          /* Empty state with FuzzyText */
          <motion.div
            className="text-center py-12 flex flex-col items-center justify-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-6"
              style={{ background: "rgba(56,189,248,0.1)", borderColor: "rgba(56,189,248,0.35)", color: "#7dd3fc" }}>
              <Sparkles className="w-4 h-4" />
              EVENTS // COMING SOON
            </div>

            <div className="my-2 cursor-pointer">
              <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.6}
                enableHover={true}
                clickEffect={true}
                color="#e2e8f0"
                gradient={["#38bdf8", "#818cf8", "#c084fc"]}
                fontSize="clamp(3rem, 10vw, 7rem)"
                fontWeight={900}
                fuzzRange={26}
              >
                EVENTS
              </FuzzyText>
            </div>

            <h3 className="font-heading text-xl font-semibold text-royal mb-2 mt-4">
              First Event Dropping Soon
            </h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed font-mono">
              We&apos;re planning something exciting. Stay tuned for workshops, CTFs, and live security hackathons.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section>
                <motion.h2
                  className="font-heading font-semibold text-xl text-royal mb-8 flex items-center gap-2"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  Upcoming
                </motion.h2>

                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {upcoming.map((event, i) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={i}
                      accent
                    />
                  ))}
                </motion.div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <motion.h2
                  className="font-heading font-semibold text-xl text-body/60 mb-8"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Past Events
                </motion.h2>

                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {past.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </motion.div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function EventCard({
  event,
  index,
  accent = false,
}: {
  event: Event;
  index: number;
  accent?: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      variants={isLeft ? fadeInLeft : fadeInRight}
      className={isLeft ? "md:mr-20" : "md:ml-20"}
    >
      <SpotlightCard className="p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {event.imageUrl && (
            <div className="relative w-full md:w-56 aspect-video md:aspect-auto shrink-0">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 224px"
              />
            </div>
          )}

          <div className="p-6 flex-1">
            <div className="flex items-center gap-4 text-sm text-body/70 mb-3">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-cobalt" />
                {formatDate(event.eventDate)}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-cobalt" />
                {event.location}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-lg text-royal mb-2">
              {event.title}
            </h3>
            <p className="text-body/70 text-sm leading-relaxed">
              {event.description}
            </p>

            {accent && (
              <div className="mt-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)" }}
                >
                  Upcoming
                </span>
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
