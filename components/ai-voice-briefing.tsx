"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/portfolio";

const briefingScripts = {
  en: "Hello, and welcome to Mohammad Raihan's portfolio. Reyy is an AI and Machine Learning Engineer and Full-Stack Developer from Telkom University. His core focus is taking deep learning models out of notebooks and deploying them into production web applications. His flagship project, SCOVIS, orchestrates neural network inference with human-in-the-loop validation. Feel free to explore his projects, download his CV, or ask our AI guide any questions.",
  id: "Halo, selamat datang di portofolio Mohammad Raihan. Reyy adalah seorang AI dan Machine Learning Engineer serta Full-Stack Developer dari Telkom University. Fokus utamanya adalah membawa model deep learning keluar dari notebook, dan mengintegrasikannya ke sistem web siap pakai. Proyek unggulannya, SCOVIS, mengorkestrasi inferensi puluhan model neural network dengan validasi dosen secara human-in-the-loop. Silakan eksplorasi proyek dan sertifikat terverifikasi Reyy, atau tanyakan apa saja pada asisten AI kami.",
};

export function AIVoiceBriefing({ locale }: { locale: Locale }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported] = useState(() =>
    typeof window !== "undefined" ? "speechSynthesis" in window : true
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

    utterance.rate = 0.94;
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

  if (!isPlaying && !isPaused) {
    return (
      <button
        type="button"
        onClick={handlePlay}
        title={locale === "id" ? "Dengarkan Ringkasan Suara 30 Detik" : "Listen to 30s Voice Briefing"}
        aria-label={locale === "id" ? "Dengarkan Ringkasan Suara" : "Listen to Voice Briefing"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          cursor: "pointer",
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ opacity: 0.8 }}
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        <span>AUDIO</span>
      </button>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.5rem",
        borderRadius: "999px",
        background: "rgba(74, 222, 128, 0.1)",
        border: "1px solid #4ade80",
        color: "#4ade80",
        minHeight: "2.35rem",
      }}
    >
      {/* Animated Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "10px", padding: "0 2px" }}>
        <span style={{ width: 2, height: isPlaying ? "10px" : "3px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out infinite alternate" : "none" }} />
        <span style={{ width: 2, height: isPlaying ? "7px" : "3px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out 150ms infinite alternate" : "none" }} />
        <span style={{ width: 2, height: isPlaying ? "12px" : "3px", background: "#4ade80", borderRadius: 1, animation: isPlaying ? "wave 600ms ease-in-out 300ms infinite alternate" : "none" }} />
      </div>

      <button
        type="button"
        onClick={isPlaying ? handlePause : handlePlay}
        title={isPlaying ? "Pause" : "Play"}
        style={{
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontSize: "0.72rem",
          padding: "0 0.15rem",
          minHeight: "unset",
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <button
        type="button"
        onClick={handleStop}
        title="Stop"
        style={{
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontSize: "0.72rem",
          padding: "0 0.15rem",
          minHeight: "unset",
        }}
      >
        ⏹
      </button>
    </div>
  );
}
