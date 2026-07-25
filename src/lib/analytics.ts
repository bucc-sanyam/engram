import posthog from 'posthog-js';

/**
 * Funnel events for Week 1 growth playbook.
 * These 5 events form the core activation + retention funnel.
 */

/** Event 1: User landed on the app (first render) */
export function trackLanded() {
  if (typeof window === 'undefined') return;
  console.log('📊 Event: landed');
  posthog.capture('landed', {
    timestamp: new Date().toISOString(),
  });
}

/** Event 2: User enabled guest mode (clicked "Continue as guest") */
export function trackGuestStarted() {
  if (typeof window === 'undefined') return;
  console.log('📊 Event: guest_started');
  posthog.capture('guest_started', {
    timestamp: new Date().toISOString(),
  });
}

/** Event 3: User completed a recall quiz and received grading (the AHA moment) */
export function trackRecallGraded(score_pct: number) {
  if (typeof window === 'undefined') return;
  console.log('📊 Event: recall_graded', { score_pct });
  posthog.capture('recall_graded', {
    score_pct,
    timestamp: new Date().toISOString(),
  });
}

/** Event 4: User advanced their streak (completed a day of review) */
export function trackStreakAdvanced(streak: number) {
  if (typeof window === 'undefined') return;
  console.log('📊 Event: streak_advanced', { streak });
  posthog.capture('streak_advanced', {
    streak,
    timestamp: new Date().toISOString(),
  });
}

/** Event 5: User successfully authenticated */
export function trackSignedIn(userId: string) {
  if (typeof window === 'undefined') return;
  console.log('📊 Event: signed_in', { userId });
  posthog.identify(userId);
  posthog.capture('signed_in', {
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

/** Set person properties for segmentation */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined') return;
  console.log('📊 Properties: ', properties);
  posthog.register(properties);
}
