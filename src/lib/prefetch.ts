"use client";

/**
 * Prefetch + cached-read layer for the dashboard and recall flows.
 *
 * `warmCache()` fires every read the two hot pages need the moment the user
 * lands ANYWHERE on the site (see <Prefetcher/> in the root layout), so by the
 * time they open the dashboard or hit "Start recall" the data is already in the
 * client cache and renders instantly.
 *
 * The `get*Cached` helpers are drop-in replacements for the raw data functions —
 * they read from the warmed cache first and only fall back to the network on a
 * cold start or after invalidation.
 */
import { CACHE_KEYS, cached, invalidate, prefetch } from "./cache";
import { getEntries, getFactOfTheDay, getPlan, getProfile, getReviews, getTopics } from "./data";
import { getAllStorySections, getStartedStories } from "./stories";

// Today's plan carries per-topic "done" flags that flip mid-session, so it gets
// a short TTL and is invalidated explicitly after a quiz/plan mutation.
const PLAN_TTL = 90 * 1000;
// The fact of the day is deterministic per calendar day — cache it aggressively.
const FACT_TTL = 30 * 60 * 1000;

export const getPlanCached = () => cached(CACHE_KEYS.plan, getPlan, { ttl: PLAN_TTL });
export const getStorySectionsCached = () => cached(CACHE_KEYS.storySections, getAllStorySections);
export const getStartedStoriesCached = () => cached(CACHE_KEYS.startedStories, getStartedStories);
export const getProfileCached = () => cached(CACHE_KEYS.profile, getProfile);
export const getTopicsCached = () => cached(CACHE_KEYS.topics, getTopics);
export const getReviewsCached = () => cached(CACHE_KEYS.reviews, () => getReviews());
export const getEntriesCached = () => cached(CACHE_KEYS.entries, getEntries);
export const getFactCached = () => cached(CACHE_KEYS.fact, getFactOfTheDay, { ttl: FACT_TTL });

/**
 * Warm every read used by the dashboard and recall. Safe to call repeatedly —
 * `prefetch` no-ops when a key is already fresh or in flight.
 */
export function warmCache(): void {
  prefetch(CACHE_KEYS.plan, getPlan, { ttl: PLAN_TTL });
  prefetch(CACHE_KEYS.storySections, getAllStorySections);
  prefetch(CACHE_KEYS.startedStories, getStartedStories);
  prefetch(CACHE_KEYS.profile, getProfile);
  prefetch(CACHE_KEYS.topics, getTopics);
  prefetch(CACHE_KEYS.reviews, () => getReviews());
  prefetch(CACHE_KEYS.entries, getEntries);
  prefetch(CACHE_KEYS.fact, getFactOfTheDay, { ttl: FACT_TTL });
}

/** After a quiz is graded / the day is completed — plan, reviews and streak change. */
export function invalidateProgress(): void {
  invalidate(CACHE_KEYS.plan);
  invalidate(CACHE_KEYS.reviews);
  invalidate(CACHE_KEYS.profile);
}

/** After starting/ending a story or learning a section — topics & plan change. */
export function invalidateStories(): void {
  invalidate(CACHE_KEYS.storySections);
  invalidate(CACHE_KEYS.startedStories);
  invalidate(CACHE_KEYS.topics);
  invalidate(CACHE_KEYS.plan);
}

/** After ingesting a new learning — topics, entries and (possibly) the plan change. */
export function invalidateIngest(): void {
  invalidate(CACHE_KEYS.topics);
  invalidate(CACHE_KEYS.entries);
  invalidate(CACHE_KEYS.plan);
}

