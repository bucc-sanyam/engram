import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Fraunces } from "next/font/google";
import Footer from "@/components/Footer";
import TutorialTour from "@/components/TutorialTour";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Literary serif reserved for long-form reading (the topic "blog" pages).
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const jetmono = JetBrains_Mono({
  variable: "--font-jetmono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Knovis — your second brain",
  description:
    "Knowledge + vision — and yes, it sounds like 'novice' on purpose. Log what you learn, watch it grow into a living knowledge graph, and revise it right before you'd forget.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${jetmono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="ambient" aria-hidden />
        <div className="blob blob-ember" aria-hidden />
        <div className="blob blob-teal" aria-hidden />
        <div className="blob blob-gold" aria-hidden />
        {children}
        <Footer />
        <TutorialTour />
      </body>
    </html>
  );
}
