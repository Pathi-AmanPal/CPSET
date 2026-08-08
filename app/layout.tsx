import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
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
      <body className="font-body circuit-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
