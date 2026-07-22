"use client";

import { useEffect } from "react";
import { warmCache } from "@/lib/prefetch";

/**
 * Fires a background cache warm-up the moment the user lands on ANY page, and
 * again whenever the tab regains focus (data may have gone stale while away).
 * Renders nothing — it just primes the client cache for the dashboard + recall.
 */
export default function Prefetcher() {
  useEffect(() => {
    warmCache();

    const onVisible = () => {
      if (document.visibilityState === "visible") warmCache();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}

