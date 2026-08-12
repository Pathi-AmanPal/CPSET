"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { fetchTeam } from "@/lib/fetchers";
import type { TeamMember } from "@/lib/types";
import { Users } from "lucide-react";
import Image from "next/image";

export default function TeamGrid() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam()
      .then(setMembers)
      .catch(() => setMembers([]))
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
            Our People
          </p>
          <AnimatedText
            text="Meet the Team"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-cobalt/30 border-t-cobalt rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          /* Empty state */
          <motion.div
            className="text-center py-24"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(13,18,48,0.80)", border: "1px solid rgba(100,130,255,0.20)" }}
            >
              <Users className="w-8 h-8 text-cobalt/70" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-royal mb-2">
              Team roster coming soon
            </h3>
            <p className="text-body/70 max-w-md mx-auto text-sm">
              We&apos;re assembling a talented group of cybersecurity
              enthusiasts. Check back soon.
            </p>
          </motion.div>
        ) : (
          /* Staggered masonry-style grid */
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {members.map((member) => (
              <motion.div
                key={member.id}
                variants={staggerItem}
                className="break-inside-avoid"
              >
                <SpotlightCard className="p-0 overflow-hidden">
                  {member.imageUrl && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,11,26,1) 0%, rgba(7,11,26,0.3) 40%, transparent 100%)" }} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg text-royal mb-1">
                      {member.name}
                    </h3>
                    <p className="text-cobalt text-sm font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-body/70 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
