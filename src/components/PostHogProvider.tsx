'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Try both build-time and runtime env vars (for .env.local)
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || (window as any).__POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com';

    console.log('🔍 PostHog init check:', {
      hasBuildTimeKey: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
      hasRuntimeKey: !!(window as any).__POSTHOG_KEY,
      finalKey: apiKey ? apiKey.substring(0, 10) + '...' : 'NONE',
    });

    if (apiKey && !(window as any).__POSTHOG_LOADED__) {
      console.log('✨ Initializing PostHog with key:', apiKey.substring(0, 10) + '...');
      posthog.init(apiKey, {
        api_host: apiHost,
        person_profiles: 'identified_only',
        capture_pageview: false,
        loaded: (ph) => {
          console.log('✅ PostHog initialized successfully');
          const isGuest = document.cookie.includes('knovis_guest=1');
          ph.register({ mode: isGuest ? 'guest' : 'auth' });
        },
      });
      (window as any).__POSTHOG_LOADED__ = true;
    } else if (!apiKey) {
      console.warn('⚠️ PostHog: No API key found. Add NEXT_PUBLIC_POSTHOG_KEY to .env.local and restart the server.');
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
