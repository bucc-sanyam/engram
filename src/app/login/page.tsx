"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrainIcon } from "@/components/Nav";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_48px_rgba(255,122,92,0.5)]">
            <BrainIcon className="h-9 w-9 text-[#1a120e]" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Engram</h1>
          <p className="mt-2 text-sm text-muted max-w-xs">
            Your second brain — log what you learn, and never forget it again.
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

          <div className="relative my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-xs text-faint">or</span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <button
            id="google-signin-btn"
            onClick={google}
            className="btn-ghost w-full flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        {/* Guest link */}
        <p className="mt-5 text-center text-sm text-faint">
          Just exploring?{" "}
          <Link href="/" className="font-medium text-muted hover:text-white transition-colors underline underline-offset-2">
            Continue as guest (demo mode)
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
