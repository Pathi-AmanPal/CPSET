"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
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
          /* Empty state */
          <motion.div
            className="text-center py-24"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-violet/50" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-royal mb-2">
              First event drops soon
            </h3>
            <p className="text-body/70 max-w-md mx-auto text-sm">
              We&apos;re planning something exciting. Stay tuned for
              workshops, CTFs, and more.
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
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">
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
