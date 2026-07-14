/**
 * Day-boundary helpers. The app's "day" is the USER'S LOCAL calendar day —
 * reviews done at 1am IST belong to that IST date, not the previous UTC date.
 * Server code can't see the browser's clock, so API calls pass the timezone
 * offset (`new Date().getTimezoneOffset()`, JS convention: IST = -330).
 */

/** YYYY-MM-DD of a date in the user's local timezone. */
export function localDayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** The browser's UTC offset in minutes (JS convention: UTC − local, IST = -330). */
export function tzOffsetMinutes(): number {
  return new Date().getTimezoneOffset();
}

/** UTC instant (ISO) of local midnight for a YYYY-MM-DD local day key. */
export function localDayStartIso(dayKey: string): string {
  return new Date(dayKey + "T00:00:00").toISOString();
}

/** UTC instant (ISO) of the end of that local day (next local midnight). */
export function localDayEndIso(dayKey: string): string {
  return new Date(new Date(dayKey + "T00:00:00").getTime() + 86400000).toISOString();
}

// ---- server-side variants (offset passed from the client) ----

/** Clamp a client-supplied offset to the real range of timezones. */
export function clampTz(tz: unknown): number {
  const n = typeof tz === "number" ? tz : parseInt(String(tz ?? ""), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.max(-840, Math.min(840, Math.round(n)));
}

/** YYYY-MM-DD of "now" in the client's timezone, given its offset. */
export function localTodayForOffset(tzMin: number, now = Date.now()): string {
  return new Date(now - tzMin * 60000).toISOString().slice(0, 10);
}

/** UTC instant (ISO) of local midnight for a day key in the client's timezone. */
export function dayStartUtcIso(dayKey: string, tzMin: number): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + tzMin * 60000).toISOString();
}
