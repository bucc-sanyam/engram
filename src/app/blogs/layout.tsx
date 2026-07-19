import React from "react";
import { ReadingThemeProvider } from "@/context/ReadingThemeContext";
import PaperModeToggle from "@/components/PaperModeToggle";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReadingThemeProvider>
      <div className="relative min-h-screen">
        {/* Floating Paper Mode toggle button in the bottom-right corner */}
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 md:bottom-6 md:right-6">
          <PaperModeToggle />
        </div>

        {children}
      </div>
    </ReadingThemeProvider>
  );
}
