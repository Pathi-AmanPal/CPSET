import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import TargetCursor from "@/components/ui/TargetCursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CPSET — Centre for Privacy and Security in Emerging Technologies",
  description:
    "CPSET is Chandigarh University's cybersecurity club dedicated to privacy, security research, and fostering talent in emerging technologies.",
  keywords: [
    "CPSET",
    "cybersecurity",
    "Chandigarh University",
    "privacy",
    "security",
    "emerging technologies",
  ],
  openGraph: {
    title: "CPSET — Centre for Privacy and Security in Emerging Technologies",
    description:
      "Chandigarh University's cybersecurity club. Privacy · Security · Innovation · Trust · Excellence.",
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
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="font-body circuit-bg min-h-screen relative overflow-x-hidden">
        {/* React Bits TargetCursor */}
        <TargetCursor
          targetSelector='.cursor-target, button, a, input, select, textarea, [role="button"]'
          spinDuration={2}
          hideDefaultCursor={true}
          hoverDuration={0.2}
          parallaxOn={true}
          cursorColor="#5A8AFF"
          cursorColorOnTarget="#9B7FFF"
        />

        {/* Ambient Vibrant Blue to Purple Gradient Background Mesh */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top-left Blue to Purple ambient orb */}
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-cobalt/25 via-blue-500/15 to-violet/25 blur-[140px]" />

          {/* Center-right Vibrant Violet orb */}
          <div className="absolute top-[35%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-violet/25 via-purple-500/20 to-cobalt/15 blur-[150px]" />

          {/* Bottom-left Electric Blue & Violet orb */}
          <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cobalt/20 via-blue-600/15 to-violet/30 blur-[130px]" />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
