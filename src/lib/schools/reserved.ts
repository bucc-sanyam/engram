/**
 * Top-level path segments that must NEVER be treated as a school slug.
 *
 * A school-branded URL is `/<school-slug>/class-9/...`, rewritten by proxy.ts
 * onto the canonical `/learn/class-9/...` tree. Because the school slug sits at
 * the root of the path, any real top-level route would be shadowed if a school
 * ever registered that slug. Every directory in `src/app/` must appear here.
 *
 * `scripts/validate-cbse.mts` asserts that invariant — if you add a route,
 * add it here or the check fails.
 */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // real app routes
  "about", "add", "api", "auth", "blogs", "brain", "learn",
  "login", "notes", "profile", "recall", "review",
  // framework / static
  "_next", "favicon.ico", "robots.txt", "sitemap.xml", "public",
  // reserved for future use — do not remove
  "admin", "s", "schools", "teach", "privacy", "terms", "pricing", "help",
]);

export function isReservedSlug(segment: string): boolean {
  return RESERVED_SLUGS.has(segment.toLowerCase());
}
