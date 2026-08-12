import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import PremiumCursor from "@/components/ui/PremiumCursor";
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

        {/* Premium Apple-physics cursor */}
        <PremiumCursor />

        {/* Ambient background mesh — deeper void colours */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top-left: deep cobalt orb */}
          <div
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[160px]"
            style={{ background: "radial-gradient(circle, rgba(59,106,219,0.22) 0%, rgba(90,138,255,0.10) 60%, transparent 100%)" }}
          />
          {/* Center-right: violet orb */}
          <div
            className="absolute top-[30%] -right-48 w-[750px] h-[750px] rounded-full blur-[180px]"
            style={{ background: "radial-gradient(circle, rgba(124,95,224,0.20) 0%, rgba(155,127,255,0.10) 60%, transparent 100%)" }}
          />
          {/* Bottom-left: fuchsia accent */}
          <div
            className="absolute -bottom-32 left-[20%] w-[500px] h-[500px] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, rgba(217,70,239,0.10) 0%, rgba(155,127,255,0.06) 60%, transparent 100%)" }}
          />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
