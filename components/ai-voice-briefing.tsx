"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/portfolio";

const briefingScripts = {
  en: "Hello! I am Reyy's AI Portfolio Guide. Reyy is an AI and Machine Learning Engineer who bridges deep learning models with production web products. His flagship project, SCOVIS, orchestrates 72 cached neural network models with human-in-the-loop validation. Feel free to explore his projects, download his CV, or chat with me for any questions!",
  id: "Halo! Saya asisten AI portofolio Reyy. Reyy adalah AI dan Machine Learning Engineer yang menghubungkan model kecerdasan buatan ke produk web produksi. Proyek unggulannya, SCOVIS, mengelola 72 model neural network dengan validasi dosen. Silakan jelajahi karya Reyy, unduh CV, atau tanyakan apa saja kepada saya!",
};

const copy = {
  en: {
    play: "🎙️ Listen to 30s AI Briefing",
    pause: "⏸ Pause Briefing",
    stop: "⏹ Stop",
    playing: "Playing Audio Guide…",
    unsupported: "Speech synthesis not supported in this browser.",
  },
  id: {
    play: "🎙️ Dengarkan Ringkasan 30 Detik",
    pause: "⏸ Jeda Audio",
    stop: "⏹ Berhenti",
    playing: "Memutar Audio Guide…",
    unsupported: "Speech synthesis tidak didukung pada browser ini.",
  },
};

export function AIVoiceBriefing({ locale }: { locale: Locale }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported] = useState(() =>
    typeof window !== "undefined" ? "speechSynthesis" in window : true
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const t = copy[locale];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handlePlay() {
    if (!isSupported || typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const text = briefingScripts[locale];
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Pick suitable voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = locale === "id" ? "id-ID" : "en-US";
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang)) || voices.find((v) => v.lang.startsWith("en"));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.98; // Natural pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "voice_briefing", metadata: { locale } }),
      }).catch(() => {});
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function handlePause() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }

  function handleStop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }

  if (!isSupported) return null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.35rem 0.75rem",
        borderRadius: "999px",
        background: isPlaying ? "rgba(74, 222, 128, 0.12)" : "rgba(255, 255, 255, 0.05)",
        border: isPlaying ? "1px solid #4ade80" : "1px solid rgba(255, 255, 255, 0.1)",
        color: isPlaying ? "#4ade80" : "var(--foreground, #fff)",
        transition: "all 180ms ease",
      }}
    >
      {!isPlaying && !isPaused ? (
        <button
          type="button"
          onClick={handlePlay}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          {t.play}
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Animated Waveform */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "12px" }}>
            <span style={{ width: 2, height: isPlaying ? "12px" : "4px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out infinite alternate" : "none" }} />
            <span style={{ width: 2, height: isPlaying ? "8px" : "4px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out 150ms infinite alternate" : "none" }} />
            <span style={{ width: 2, height: isPlaying ? "14px" : "4px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out 300ms infinite alternate" : "none" }} />
          </div>

          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{isPlaying ? t.playing : t.pause}</span>

          <button
            type="button"
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "0.75rem",
              padding: "0 0.2rem",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            type="button"
            onClick={handleStop}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "0.75rem",
              padding: "0 0.2rem",
            }}
          >
            ⏹
          </button>
        </div>
      )}
    </div>
  );
}
