"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import ThanosSnapCanvas from "@/components/ThanosSnapCanvas";

interface ReadingThemeContextType {
  isPaperMode: boolean;
  isSnapping: boolean;
  togglePaperMode: (e?: React.MouseEvent) => void;
}

const ReadingThemeContext = createContext<ReadingThemeContextType>({
  isPaperMode: false,
  isSnapping: false,
  togglePaperMode: () => {},
});

export function useReadingTheme() {
  return useContext(ReadingThemeContext);
}

export function ReadingThemeProvider({ children }: { children: React.ReactNode }) {
  const [isPaperMode, setIsPaperMode] = useState<boolean>(false);
  const [isSnapping, setIsSnapping] = useState<boolean>(false);
  const [snapPos, setSnapPos] = useState<{ x: number; y: number } | null>(null);
  const [targetMode, setTargetMode] = useState<"to-paper" | "to-dark">("to-paper");

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("knovis_paper_mode");
      if (saved === "true") {
        setIsPaperMode(true);
      }
    } catch {
      // ignore SSR / localStorage block
    }
  }, []);

  const togglePaperMode = (e?: React.MouseEvent) => {
    if (isSnapping) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const nextMode = !isPaperMode;
      setIsPaperMode(nextMode);
      try {
        localStorage.setItem("knovis_paper_mode", String(nextMode));
      } catch {
        // ignore
      }
      return;
    }

    if (e && e.clientX && e.clientY) {
      setSnapPos({ x: e.clientX, y: e.clientY });
    } else {
      setSnapPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }

    const nextMode = !isPaperMode;
    setTargetMode(nextMode ? "to-paper" : "to-dark");
    setIsSnapping(true);
  };

  const handleThemeFlip = () => {
    const nextMode = !isPaperMode;
    setIsPaperMode(nextMode);
    try {
      localStorage.setItem("knovis_paper_mode", String(nextMode));
    } catch {
      // ignore
    }
  };

  const handleSnapComplete = () => {
    setIsSnapping(false);
  };

  return (
    <ReadingThemeContext.Provider value={{ isPaperMode, isSnapping, togglePaperMode }}>
      <div className={isPaperMode ? "paper-mode-active" : ""}>
        {children}

        {/* Thanos Snap Overlay */}
        <ThanosSnapCanvas
          isActive={isSnapping}
          clickPos={snapPos}
          mode={targetMode}
          onThemeFlip={handleThemeFlip}
          onComplete={handleSnapComplete}
        />
      </div>
    </ReadingThemeContext.Provider>
  );
}
