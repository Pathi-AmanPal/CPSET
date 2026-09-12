"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import { Instagram, Linkedin, MessageCircle, ExternalLink, Terminal as TerminalIcon, Send } from "lucide-react";

const socials = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@cpset_ait",
    href: "https://www.instagram.com/cpset_ait/",
    gradient: "from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    glowColor: "rgba(255, 68, 100, 0.25)",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    handle: "CPSET Cyphoria Chapter",
    href: "https://www.linkedin.com/company/cyphoria-women-in-cybersecurity-wicys-%E2%80%93-chandigarh-university-student-chapter/posts/?feedView=all",
    gradient: "from-[#0A66C2] to-[#004182]",
    glowColor: "rgba(10, 102, 194, 0.25)",
  },
  {
    icon: MessageCircle,
    name: "Google Member Form",
    handle: "Official Student Registration",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform",
    gradient: "from-[#5A8AFF] to-[#7C5FE0]",
    glowColor: "rgba(90, 138, 255, 0.25)",
  },
];

interface CommandLog {
  id: number;
  input: string;
  output: React.ReactNode;
}

export default function ConnectTiles() {
  const [cmdInput, setCmdInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 1,
      input: "cpset --status",
      output: (
        <div className="text-cyan-300">
          [OK] CPSET Core Node active. Type <span className="text-yellow-300 font-bold">&quot;help&quot;</span> for available CLI commands.
        </div>
      ),
    },
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cmdInput.trim().toLowerCase();
    if (!clean) return;

    let outputNode: React.ReactNode = null;

    if (clean === "help") {
      outputNode = (
        <div className="text-slate-300 space-y-1">
          <div><span className="text-cyan-300 font-bold">about</span> - Learn about CPSET Centre of Excellence</div>
          <div><span className="text-cyan-300 font-bold">events</span> - List latest workshops & CTF drills</div>
          <div><span className="text-cyan-300 font-bold">team</span> - View core coordinator & leads</div>
          <div><span className="text-cyan-300 font-bold">join</span> - Get student membership link</div>
          <div><span className="text-cyan-300 font-bold">clear</span> - Clear terminal screen</div>
        </div>
      );
    } else if (clean === "about") {
      outputNode = (
        <div className="text-slate-300">
          CPSET (Centre for Privacy & Security in Emerging Technologies) is Chandigarh University&apos;s premier CoE for cyber research, forensics, and zero-trust engineering.
        </div>
      );
    } else if (clean === "events") {
      outputNode = (
        <div className="text-emerald-300 space-y-1">
          <div>1. Steganography & Network Forensics Workshop (Resource: Mr. Talha Jawad)</div>
          <div>2. Cyber Drill & CTF Championship</div>
          <div>3. Privacy Engineering & AI Safety Seminar</div>
        </div>
      );
    } else if (clean === "team") {
      outputNode = (
        <div className="text-violet-300 space-y-1">
          <div>Coordinator: Dr. Syed Irfan</div>
          <div>Secretary: Husanpreet Kaur</div>
          <div>Web Master: Pathi Aman Pal</div>
        </div>
      );
    } else if (clean === "join") {
      outputNode = (
        <div className="text-cyan-300">
          Member form link: <a href="https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform" target="_blank" rel="noreferrer" className="underline font-bold text-white">Click here to register</a>
        </div>
      );
    } else if (clean === "clear") {
      setLogs([]);
      setCmdInput("");
      return;
    } else {
      outputNode = <div className="text-rose-400">Command not recognized: &quot;{clean}&quot;. Type &quot;help&quot;.</div>;
    }

    setLogs((prev) => [...prev, { id: Date.now(), input: cmdInput, output: outputNode }]);
    setCmdInput("");
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#5A8AFF]/15 via-[#9B7FFF]/15 to-transparent blur-[140px] pointer-events-none" />

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A8AFF]/10 border border-[#5A8AFF]/30 text-cyan-300 text-xs font-mono mb-4">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBER COMMAND & CONNECT NODE</span>
        </div>
        <AnimatedText
          text="Stay Connected With CPSET"
          as="h2"
          className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight"
          gradient
        />
        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm sm:text-base font-sans">
          Join our official channels, submit inquiries, or run live CLI terminal commands.
        </p>
      </motion.div>

      {/* Social tiles */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {socials.map((social) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={staggerItem}
            whileHover={{ y: -6 }}
            className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center group transition-all duration-300 bg-[#090D24]/80 border border-white/10 hover:border-[#5A8AFF]/50 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,5,30,0.5)]"
          >
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
            >
              <social.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-white text-xl">
                {social.name}
              </h3>
              <p className="text-cyan-300 text-xs font-mono mt-1">{social.handle}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* Interactive CLI Terminal Window */}
      <motion.div
        className="max-w-3xl mx-auto rounded-2xl bg-[#07091B] border border-[#5A8AFF]/30 shadow-[0_0_50px_rgba(90,138,255,0.2)] overflow-hidden font-mono text-xs text-slate-200"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#0A0E2A] border-b border-[#5A8AFF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2">cpset-terminal // bash</span>
          </div>
          <div className="text-cyan-400 text-[10px]">interactive_cli_v1.0</div>
        </div>

        {/* Terminal Log Output Area */}
        <div className="p-5 space-y-4 max-h-64 overflow-y-auto bg-black/60">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400">cpset@cu:~$</span>
                <span className="text-white font-semibold">{log.input}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </div>
          ))}
        </div>

        {/* Terminal Command Input Form */}
        <form onSubmit={handleCommand} className="flex items-center px-4 py-3 bg-[#090D24] border-t border-[#5A8AFF]/20 gap-2">
          <span className="text-emerald-400 shrink-0">cpset@cu:~$</span>
          <input
            type="text"
            placeholder="Type command (e.g. 'help', 'events', 'join')..."
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none font-mono text-xs placeholder-slate-500"
          />
          <button type="submit" className="p-1.5 rounded-lg bg-[#5A8AFF]/20 text-cyan-300 hover:bg-[#5A8AFF]/40 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
