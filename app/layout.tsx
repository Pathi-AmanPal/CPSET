import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import TargetCursor from "@/components/ui/TargetCursor";
import SiteGuard from "@/components/ui/SiteGuard";
import ParticleBackground from "@/components/3d/ParticleBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CPSET — Centre for Privacy and Security in Emerging Technologies",
  description:
    "A specialized Cybersecurity Centre of Excellence at Chandigarh University promoting education, research, innovation, industry collaboration, and skill development in cybersecurity, privacy, digital forensics, AI security, cloud security, IoT security, and emerging technologies.",
  keywords: [
    "CPSET",
    "cybersecurity",
    "Chandigarh University",
    "privacy engineering",
    "digital forensics",
    "AI security",
    "cloud security",
    "IoT security",
    "network security",
    "ethical hacking",
    "penetration testing",
    "threat intelligence",
    "malware analysis",
    "blockchain security",
    "GRC",
    "CTF",
    "cybersecurity research",
    "emerging technologies",
    "Centre of Excellence",
  ],
  openGraph: {
    title: "CPSET — Centre for Privacy and Security in Emerging Technologies",
    description:
      "Securing Privacy. Empowering Innovation. Protecting the Future. — Chandigarh University's Cybersecurity Centre of Excellence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="circuit-bg min-h-screen relative overflow-x-hidden"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>

        {/* Site-wide content protection — right-click block, shortcut block, devtools blur */}
        <SiteGuard />

        {/* Target locking cursor: steady shape when unhovered, locks onto buttons on hover */}
        <TargetCursor
          targetSelector='.cursor-target, button, a, input, select, textarea, [role="button"]'
          spinDuration={0}
          hideDefaultCursor={true}
          hoverDuration={0.18}
          parallaxOn={true}
          cursorColor="#5A8AFF"
          cursorColorOnTarget="#9B7FFF"
        />

        {/* 3D Interactive Particle Constellation — fixed behind all content */}
        <ParticleBackground />

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
