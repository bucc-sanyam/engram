'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only init once, and only if key is set
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      // Check if already initialized to prevent double-init (posthog-js sets window.__POSTHOG_LOADED__)
      if (!(window as any).__POSTHOG_LOADED__) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
          person_profiles: 'identified_only', // Only track identified users as persons
          capture_pageview: false, // We'll handle pageviews manually if needed
          loaded: (ph) => {
            // Set capture mode (demo/guest/auth) based on cookie + auth state
            if (typeof window !== 'undefined') {
              const isGuest = document.cookie.includes('knovis_guest=1');
              ph.register({ mode: isGuest ? 'guest' : 'auth' });
            }
          },
        });
        (window as any).__POSTHOG_LOADED__ = true;
      }
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
}
