"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A dictation button for open-answer questions. Uses the browser-native Web
 * Speech API (SpeechRecognition) — zero dependencies, no network round-trip of
 * our own. Speaking answers doubles as spoken-English practice (see the tip on
 * the recall page). Renders nothing on browsers without the API.
 *
 * `onTranscript` receives each finalised chunk of speech; the caller decides how
 * to merge it into the answer (we append with a space).
 */
export default function MicButton({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const cbRef = useRef(onTranscript);
  cbRef.current = onTranscript;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US"; // English recall + spoken-English practice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
      }
      finalText = finalText.trim();
      if (finalText) cbRef.current(finalText);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    recRef.current = rec;
    setSupported(true);

    return () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  // Stop listening if the field gets disabled mid-dictation (e.g. on save).
  useEffect(() => {
    if (disabled && listening) {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
      setListening(false);
    }
  }, [disabled, listening]);

  function toggle() {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        /* start() throws if already started — ignore */
      }
    }
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-label={listening ? "Stop dictation" : "Answer with your voice"}
      aria-pressed={listening}
      title={listening ? "Listening… tap to stop" : "Answer with your voice"}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all disabled:opacity-40 ${
        listening
          ? "border-[#ff6b5c]/60 bg-[#ff6b5c]/[0.14] text-[#ff8f7c]"
          : "border-white/[0.1] bg-white/[0.05] text-white/70 hover:border-white/[0.2] hover:bg-white/[0.09] hover:text-white"
      }`}
    >
      {listening && (
        <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-[#ff6b5c]/25" />
      )}
      <MicIcon />
    </button>
  );
}

function MicIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11z" />
    </svg>
  );
}
