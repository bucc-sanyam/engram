"use client";

/**
 * Tiny client-side cache for read-heavy data (dashboard + recall).
 *
 * Three layers, in order of speed:
 *   1. in-memory Map      — instant, survives client-side route changes
 *   2. sessionStorage     — survives full reloads within the same tab session
 *   3. the fetcher itself  — the network / Supabase call, run at most once per key
 *
 * Concurrent callers for the same key share ONE in-flight promise (dedup), so
 * the homepage firing eight fetches and a prefetch warming the same keys never
 * double-hits the backend. Nothing is stored server-side — this is purely the
 * "cache on the client browser" the product wants.
 */

interface CacheEntry<T> {
  value: T;
  /** epoch ms after which the entry is stale */
  expires: number;
}

/** Canonical cache keys — shared by the prefetcher and mutation invalidations. */
export const CACHE_KEYS = {
  plan: "plan",
  storySections: "story-sections",
  startedStories: "started-stories",
  profile: "profile",
  topics: "topics",
  reviews: "reviews",
  entries: "entries",
  fact: "fact",
} as const;

const MEM = new Map<string, CacheEntry<unknown>>();
const INFLIGHT = new Map<string, Promise<unknown>>();

const NS = "knovis.cache.";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

const canPersist = (() => {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem("__knovis_probe__", "1");
    window.sessionStorage.removeItem("__knovis_probe__");
    return true;
  } catch {
    return false;
  }
})();

function isFresh<T>(entry: CacheEntry<T> | null | undefined): entry is CacheEntry<T> {
  return !!entry && entry.expires > Date.now();
}

function readPersisted<T>(key: string): CacheEntry<T> | null {
  if (!canPersist) return null;
  try {
    const raw = window.sessionStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
}

function writePersisted<T>(key: string, entry: CacheEntry<T>): void {
  if (!canPersist) return;
  try {
    window.sessionStorage.setItem(NS + key, JSON.stringify(entry));
  } catch {
    /* quota / private mode — memory cache still works */
  }
}

/** A fresh entry from memory (fast path) or sessionStorage (rehydrated), else null. */
function getEntry<T>(key: string): CacheEntry<T> | null {
  const mem = MEM.get(key) as CacheEntry<T> | undefined;
  if (isFresh(mem)) return mem;
  const persisted = readPersisted<T>(key);
  if (isFresh(persisted)) {
    MEM.set(key, persisted); // promote back into memory
    return persisted;
  }
  return null;
}

export interface CacheOptions {
  /** Time-to-live in ms (default 5 min). */
  ttl?: number;
  /** Persist to sessionStorage so it survives reloads (default true). */
  persist?: boolean;
}

/** True when a fresh value already exists — used by prefetch to skip no-ops. */
export function isCached(key: string): boolean {
  return getEntry(key) !== null || INFLIGHT.has(key);
}

/**
 * Return the cached value for `key`, or run `fetcher` (deduped) and cache it.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: CacheOptions = {}
): Promise<T> {
  const hit = getEntry<T>(key);
  if (hit) return hit.value;

  const existing = INFLIGHT.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const ttl = opts.ttl ?? DEFAULT_TTL;
  const persist = opts.persist ?? true;

  const run = (async () => {
    try {
      const value = await fetcher();
      const entry: CacheEntry<T> = { value, expires: Date.now() + ttl };
      MEM.set(key, entry);
      if (persist) writePersisted(key, entry);
      return value;
    } finally {
      INFLIGHT.delete(key);
    }
  })();

  INFLIGHT.set(key, run);
  return run;
}

/**
 * Warm `key` in the background without awaiting. No-ops when a fresh value or an
 * in-flight request already exists, so it's safe to call on every page visit.
 */
export function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: CacheOptions = {}
): void {
  if (isCached(key)) return;
  cached(key, fetcher, opts).catch(() => {
    /* swallow — a failed prefetch just means the page fetches on demand */
  });
}

/** Drop one key (and any in-flight request) from every layer. */
export function invalidate(key: string): void {
  MEM.delete(key);
  INFLIGHT.delete(key);
  if (canPersist) {
    try {
      window.sessionStorage.removeItem(NS + key);
    } catch {
      /* ignore */
    }
  }
}

/** Wipe the whole cache — used on sign-out so a new login starts clean. */
export function clearCache(): void {
  MEM.clear();
  INFLIGHT.clear();
  if (!canPersist) return;
  try {
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const full = window.sessionStorage.key(i);
      if (full && full.startsWith(NS)) window.sessionStorage.removeItem(full);
    }
  } catch {
    /* ignore */
  }
}

