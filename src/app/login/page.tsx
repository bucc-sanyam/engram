"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearGuestMode, enableGuestMode } from "@/lib/demo";
import { hasSeenTour, startTour } from "@/lib/tour";
import { BrainIcon } from "@/components/Nav";


export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);

  // A browser's very first visit gets the guided tour before anything else:
  // demo mode powers the pages the tour points at, and the tour hands the
  // visitor back here when it finishes or is skipped.
  useEffect(() => {
    if (!hasSeenTour()) {
      enableGuestMode();
      startTour("first");
      window.location.assign("/");
      return;
    }
    setFirstVisit(false);
  }, []);

  if (firstVisit) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_48px_rgba(255,122,92,0.5)]">
          <BrainIcon className="h-9 w-9 text-[#1a120e]" />
        </span>
      </main>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        // `name` lands in raw_user_meta_data; the handle_new_user trigger
        // copies it into profiles.display_name.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        setMessage("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Real session replaces any guest session. Full page load (not SPA
        // navigation) so the data layer re-evaluates demo mode.
        clearGuestMode();
        window.location.assign("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_48px_rgba(255,122,92,0.5)]">
            <BrainIcon className="h-9 w-9 text-[#1a120e]" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Knovis</h1>
          <p className="mt-2 max-w-sm text-sm text-faint">
            <em>Knovis</em>{" "}
            — knowledge plus vision. It sounds like &ldquo;novice,&rdquo;
            which is fitting: every real learner stays one. Knovis helps you
            see what you know, and keep seeing it.
          </p>
        </div>

        <div className="glass rise p-8 sm:p-10">
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-white/[0.04] p-1 gap-1">
            <button
              id="tab-signin"
              onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "signin"
                  ? "bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] text-[#1a120e] shadow-[0_2px_12px_rgba(255,122,92,0.35)]"
                  : "text-muted hover:text-white"
              }`}
            >
              Sign in
            </button>
            <button
              id="tab-signup"
              onClick={() => { setMode("signup"); setError(null); setMessage(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] text-[#1a120e] shadow-[0_2px_12px_rgba(255,122,92,0.35)]"
                  : "text-muted hover:text-white"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input
                id="name-input"
                type="text"
                required
                maxLength={60}
                placeholder="Your name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              id="email-input"
              type="email"
              required
              placeholder="you@example.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password-input"
              type="password"
              required
              minLength={6}
              placeholder={mode === "signup" ? "Choose a password (6+ chars)" : "Password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

        </div>

        {/* Guest link — sets the guest cookie so the proxy lets us through,
            then hard-navigates so demo mode activates in the data layer. */}
        <p className="mt-5 text-center text-sm text-faint">
          Just exploring?{" "}
          <button
            type="button"
            onClick={() => {
              enableGuestMode();
              // Every demo entry replays the guided tour, per design.
              startTour("demo");
              window.location.assign("/");
            }}
            className="font-medium text-muted hover:text-white transition-colors underline underline-offset-2"
          >
            Continue as guest (demo mode)
          </button>
        </p>
      </div>
    </main>
  );
}


