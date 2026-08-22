"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/portfolio";

const briefingScripts = {
  en: "Hello, and welcome to Mohammad Raihan's portfolio. Reyy is an AI and Machine Learning Engineer and Full-Stack Developer from Telkom University. His core focus is taking deep learning models out of notebooks and deploying them into production web applications. His flagship project, SCOVIS, orchestrates neural network inference with human-in-the-loop validation. Feel free to explore his projects, download his CV, or ask our AI guide any questions.",
  id: "Halo, selamat datang di portofolio Mohammad Raihan. Reyy adalah seorang AI dan Machine Learning Engineer serta Full-Stack Developer dari Telkom University. Fokus utamanya adalah membawa model deep learning keluar dari notebook, dan mengintegrasikannya ke sistem web siap pakai. Proyek unggulannya, SCOVIS, mengorkestrasi inferensi puluhan model neural network dengan validasi dosen secara human-in-the-loop. Silakan eksplorasi proyek dan sertifikat terverifikasi Reyy, atau tanyakan apa saja pada asisten AI kami.",
};

const copy = {
  en: {
    play: "🎙️ Listen to 30s Briefing",
    pause: "⏸ Pause",
    stop: "⏹ Stop",
    playing: "Playing Natural Audio Guide…",
  },
  id: {
    play: "🎙️ Dengarkan Ringkasan 30 Detik",
    pause: "⏸ Jeda",
    stop: "⏹ Berhenti",
    playing: "Memutar Audio Guide Natural…",
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

  function getBestVoice(lang: Locale): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const targetPrefix = lang === "id" ? "id" : "en";
    const matchingVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(targetPrefix)
    );

    if (matchingVoices.length === 0) {
      return voices.find((v) => v.lang.toLowerCase().startsWith("en")) || voices[0] || null;
    }

    // Rank voices: Neural / Natural / Google / Online voices score higher
    return matchingVoices.sort((a, b) => {
      const getScore = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();
        let score = 0;
        if (name.includes("natural")) score += 10;
        if (name.includes("neural")) score += 10;
        if (name.includes("google")) score += 8;
        if (name.includes("online")) score += 6;
        if (name.includes("premium")) score += 5;
        if (name.includes("enhanced")) score += 4;
        if (voice.default) score += 2;
        return score;
      };
      return getScore(b) - getScore(a);
    })[0];
  }

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

    const bestVoice = getBestVoice(locale);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = locale === "id" ? "id-ID" : "en-US";
    }

    utterance.rate = 0.94; // Calm, articulate cadence
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
        padding: "0.3rem 0.75rem",
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
            fontSize: "0.75rem",
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

          <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{isPlaying ? t.playing : t.pause}</span>

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
