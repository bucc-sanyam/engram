"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getProfile, getTopics, getUserEmail, isDemo, signOut, updateProfile } from "@/lib/data";
import type { Profile } from "@/lib/types";
import { levelForXp, levelTitle } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [topicCount, setTopicCount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setName(p.display_name ?? "");
      })
      .catch(() => {});
    getUserEmail().then(setEmail).catch(() => {});
    getTopics().then((t) => setTopicCount(t.length)).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const p = await updateProfile({ display_name: trimmed });
      setProfile(p);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your name");
    } finally {
      setSaving(false);
    }
  }

  const level = profile ? levelForXp(profile.xp).level : 1;
  const initial = (profile?.display_name?.trim()[0] ?? "?").toUpperCase();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-10 sm:px-6 md:pb-16">
        <div className="rise mb-8">
          <p className="micro mb-2">Your account</p>
          <h1 className="text-warm-gradient text-4xl font-bold">Profile</h1>
        </div>

        {isDemo && (
          <div className="rise mb-6 rounded-2xl bg-[#f5b95f]/[0.08] px-5 py-4 text-sm text-[#f5d9a8]">
            You&apos;re in demo mode — changes stay in this tab.{" "}
            <Link href="/login" className="font-semibold underline underline-offset-2">
              Create an account
            </Link>{" "}
            to keep your brain forever.
          </div>
        )}

        {!profile ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <div className="space-y-6">
            {/* Identity */}
            <section className="glass rise rise-1 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] text-2xl font-bold text-[#1a120e] shadow-[0_0_36px_rgba(255,122,92,0.4)]">
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-xl font-bold">
                    {profile.display_name || "Unnamed learner"}
                  </div>
                  {email && <div className="truncate text-sm text-muted">{email}</div>}
                </div>
              </div>

              <form onSubmit={save} className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="display-name-input"
                  type="text"
                  required
                  maxLength={60}
                  placeholder="Display name"
                  className="input flex-1"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                />
                <button
                  id="save-name-btn"
                  type="submit"
                  disabled={saving || name.trim() === (profile.display_name ?? "")}
                  className="btn-primary sm:shrink-0"
                >
                  {saving ? "Saving…" : "Save name"}
                </button>
              </form>
              {error && <p className="mt-3 text-sm text-danger">{error}</p>}
              {saved && (
                <p className="mt-3 text-sm text-success">
                  Saved — the dashboard will greet you properly now.
                </p>
              )}
              <p className="mt-3 text-xs text-faint">
                This is the name Engram greets you with on the Today page.
              </p>
            </section>

            {/* Journey stats */}
            <section className="glass rise rise-2 p-6 sm:p-8">
              <p className="micro mb-4">Your journey</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                <ProfileStat label={levelTitle(level)} value={`LV ${level}`} />
                <ProfileStat label="Total XP" value={profile.xp.toLocaleString()} />
                <ProfileStat label="Day streak" value={profile.streak} accent />
                <ProfileStat label="Longest streak" value={profile.longest_streak} />
              </div>
              {topicCount !== null && (
                <p className="mt-6 text-sm text-muted">
                  {topicCount} topic{topicCount === 1 ? "" : "s"} in your brain.{" "}
                  <Link href="/brain" className="text-[#7fe5cb] hover:underline">
                    Explore the graph →
                  </Link>
                </p>
              )}
            </section>

            {!isDemo && (
              <div className="rise rise-3">
                <button
                  onClick={() => signOut()}
                  className="btn-ghost w-full py-3 text-sm text-danger"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function ProfileStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div>
      <div className={`display text-2xl font-bold ${accent ? "text-[#ff9a80]" : ""}`}>{value}</div>
      <div className="micro mt-1">{label}</div>
    </div>
  );
}
