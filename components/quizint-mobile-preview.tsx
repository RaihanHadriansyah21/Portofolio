"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";

const copy = {
  en: {
    eyebrow: "Interactive Mobile Emulator",
    title: "QuizInt Flutter Role & Gameplay Sandbox",
    subtitle: "Experience the mobile learning flows: learner gamification with live power-ups, biometric verification, and instructor gradebook analytics.",
    roleLearner: "Learner Mode",
    roleInstructor: "Instructor Mode",
    activeRole: "Current Active Role",
    timer: "Time Left",
    powerups: "Gamified Power-ups",
    freezeTimer: "Freeze Timer",
    fiftyFifty: "50:50",
    doubleScore: "2× Score",
    secondChance: "Second Chance",
    questionNumber: "Question 03 of 10",
    questionText: "Which Flutter state management approach is used in QuizInt for role coordination?",
    options: ["Provider (ChangeNotifier)", "BLoC Pattern", "Riverpod", "Redux"],
    correctIdx: 0,
    score: "Current Score",
    leaderboardTitle: "Live Class Leaderboard",
    instructorTitle: "Instructor Analytics Surface",
    totalStudents: "Active Enrolled Learners",
    avgScore: "Class Average Score",
    exportPdf: "📄 Export PDF Gradebook",
    gClassroom: "Google Classroom Linked",
    biometricVerified: "✓ Biometric Fingerprint Authenticated",
  },
  id: {
    eyebrow: "Emulator Mobile Interaktif",
    title: "Sandbox Alur & Gamifikasi Flutter QuizInt",
    subtitle: "Uji coba alur antarmuka mobile: gamifikasi mahasiswa dengan power-up langsung, verifikasi biometrik, dan analitik gradebook dosen.",
    roleLearner: "Mode Mahasiswa",
    roleInstructor: "Mode Dosen",
    activeRole: "Peran Aktif Saat Ini",
    timer: "Sisa Waktu",
    powerups: "Power-up Gamifikasi",
    freezeTimer: "Freeze Timer",
    fiftyFifty: "50:50",
    doubleScore: "2× Skor",
    secondChance: "Second Chance",
    questionNumber: "Soal 03 dari 10",
    questionText: "Pendekatan state management Flutter apa yang digunakan pada QuizInt untuk koordinasi peran?",
    options: ["Provider (ChangeNotifier)", "BLoC Pattern", "Riverpod", "Redux"],
    correctIdx: 0,
    score: "Skor Saat Ini",
    leaderboardTitle: "Leaderboard Kelas Real-Time",
    instructorTitle: "Panel Analitik & Manajemen Dosen",
    totalStudents: "Total Mahasiswa Aktif",
    avgScore: "Rata-rata Nilai Kelas",
    exportPdf: "📄 Ekspor Gradebook PDF",
    gClassroom: "Terhubung Google Classroom",
    biometricVerified: "✓ Terautentikasi Biometrik Sidik Jari",
  },
} as const;

export function QuizIntMobilePreview({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [role, setRole] = useState<"learner" | "instructor">("learner");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(320);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  function handleSelectAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === t.correctIdx) {
      const multiplier = activePowerUp === "double" ? 2 : 1;
      setScore((prev) => prev + 100 * multiplier);
    }
  }

  function handlePowerUp(type: string) {
    if (activePowerUp === type) {
      setActivePowerUp(null);
      if (type === "fifty") setHiddenOptions([]);
      return;
    }
    setActivePowerUp(type);
    if (type === "fifty") {
      setHiddenOptions([1, 3]);
    } else {
      setHiddenOptions([]);
    }
  }

  function resetQuiz() {
    setSelectedAnswer(null);
    setActivePowerUp(null);
    setHiddenOptions([]);
    setScore(320);
  }

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "2rem",
        margin: "2rem 0",
        border: "1px solid rgba(255, 255, 255, 0.14)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#4ade80",
            display: "inline-block",
            marginBottom: "0.3rem",
          }}
        >
          ● {t.eyebrow}
        </span>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.35rem" }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, lineHeight: 1.5, maxWidth: "50rem" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Role Switcher */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem" }}>
        <button
          type="button"
          onClick={() => {
            setRole("learner");
            resetQuiz();
          }}
          style={{
            padding: "0.55rem 1.1rem",
            borderRadius: "999px",
            border: role === "learner" ? "1px solid var(--foreground, #fff)" : "1px solid rgba(255, 255, 255, 0.12)",
            background: role === "learner" ? "var(--foreground, #fff)" : "rgba(0, 0, 0, 0.25)",
            color: role === "learner" ? "var(--background, #000)" : "inherit",
            fontSize: "0.82rem",
            fontWeight: role === "learner" ? 700 : 500,
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          📱 {t.roleLearner}
        </button>
        <button
          type="button"
          onClick={() => {
            setRole("instructor");
            resetQuiz();
          }}
          style={{
            padding: "0.55rem 1.1rem",
            borderRadius: "999px",
            border: role === "instructor" ? "1px solid var(--foreground, #fff)" : "1px solid rgba(255, 255, 255, 0.12)",
            background: role === "instructor" ? "var(--foreground, #fff)" : "rgba(0, 0, 0, 0.25)",
            color: role === "instructor" ? "var(--background, #000)" : "inherit",
            fontSize: "0.82rem",
            fontWeight: role === "instructor" ? 700 : 500,
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          📊 {t.roleInstructor}
        </button>
      </div>

      {/* Emulator Frame Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Left: Mobile Phone Device Frame */}
        <div className="quizint-device-frame">
          {/* Status Bar */}
          <div className="quizint-status-bar">
            <span>09:41</span>
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* App Content */}
          <div style={{ padding: "1.25rem", flex: 1 }}>
            {role === "learner" ? (
              <div>
                {/* Learner Top Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.72rem", opacity: 0.6, textTransform: "uppercase" }}>{t.questionNumber}</span>
                  <strong style={{ fontSize: "0.85rem", color: "#4ade80" }}>{score} PTS</strong>
                </div>

                {/* Progress Bar */}
                <div style={{ height: "4px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div style={{ width: "30%", height: "100%", background: "#4ade80" }} />
                </div>

                {/* Question */}
                <p style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.4, margin: "0 0 1rem" }}>
                  {t.questionText}
                </p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1rem" }}>
                  {t.options.map((opt, idx) => {
                    if (hiddenOptions.includes(idx)) return null;
                    const isPicked = selectedAnswer === idx;
                    const isCorrect = idx === t.correctIdx;
                    let bg = "rgba(255, 255, 255, 0.04)";
                    let border = "1px solid rgba(255, 255, 255, 0.1)";
                    let color = "inherit";

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        bg = "rgba(74, 222, 128, 0.2)";
                        border = "1px solid #4ade80";
                        color = "#4ade80";
                      } else if (isPicked) {
                        bg = "rgba(239, 68, 68, 0.2)";
                        border = "1px solid #ef4444";
                        color = "#ef4444";
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        style={{
                          padding: "0.65rem 0.75rem",
                          minHeight: "44px",
                          borderRadius: "8px",
                          background: bg,
                          border: border,
                          color: color,
                          fontSize: "0.78rem",
                          textAlign: "left",
                          cursor: selectedAnswer === null ? "pointer" : "default",
                          transition: "all 120ms ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isCorrect && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Power-up Pills */}
                <div>
                  <span style={{ fontSize: "0.68rem", opacity: 0.5, textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>
                    {t.powerups}
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
                    <button
                      type="button"
                      onClick={() => handlePowerUp("double")}
                      style={{
                        padding: "0.5rem 0.5rem",
                        minHeight: "40px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        border: activePowerUp === "double" ? "1px solid #facc15" : "1px solid rgba(255,255,255,0.08)",
                        background: activePowerUp === "double" ? "rgba(250, 204, 21, 0.2)" : "rgba(255,255,255,0.03)",
                        color: activePowerUp === "double" ? "#facc15" : "inherit",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ {t.doubleScore}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePowerUp("fifty")}
                      style={{
                        padding: "0.5rem 0.5rem",
                        minHeight: "40px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        border: activePowerUp === "fifty" ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.08)",
                        background: activePowerUp === "fifty" ? "rgba(96, 165, 250, 0.2)" : "rgba(255,255,255,0.03)",
                        color: activePowerUp === "fifty" ? "#60a5fa" : "inherit",
                        cursor: "pointer",
                      }}
                    >
                      ✂️ {t.fiftyFifty}
                    </button>
                  </div>
                </div>

                {selectedAnswer !== null && (
                  <button
                    type="button"
                    onClick={resetQuiz}
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      padding: "0.6rem 0.75rem",
                      minHeight: "40px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "inherit",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    ⟳ Reset Question
                  </button>
                )}
              </div>
            ) : (
              /* Instructor View */
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <strong style={{ fontSize: "0.85rem" }}>Course: TEL-302</strong>
                  <span style={{ fontSize: "0.68rem", padding: "0.15rem 0.4rem", borderRadius: "4px", background: "rgba(74, 222, 128, 0.2)", color: "#4ade80" }}>
                    Active
                  </span>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "0.75rem", borderRadius: "8px", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{t.totalStudents}</span>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0.2rem 0 0" }}>48 Learners</h4>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{t.avgScore}</span>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#4ade80", margin: "0.2rem 0 0" }}>88.4% (A)</h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ fontSize: "0.75rem", padding: "0.5rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {t.exportPdf}
                  </div>
                  <div style={{ fontSize: "0.75rem", padding: "0.5rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    🔗 {t.gClassroom}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Nav Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0.6rem 0.5rem",
              background: "rgba(0, 0, 0, 0.4)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "0.75rem",
            }}
          >
            <span style={{ color: "#4ade80" }}>🏠 Home</span>
            <span style={{ opacity: 0.5 }}>🏆 Ranks</span>
            <span style={{ opacity: 0.5 }}>⚙️ Settings</span>
          </div>
        </div>

        {/* Right: Architecture & Security Badges */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0 0 0.5rem" }}>
              🏆 {t.leaderboardTitle}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)" }}>
                <span>🥇 1. Raihan (You)</span>
                <strong style={{ color: "#4ade80" }}>{score} pts</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.02)", opacity: 0.8 }}>
                <span>🥈 2. Dika Pratama</span>
                <span>310 pts</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.6rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.02)", opacity: 0.8 }}>
                <span>🥉 3. Alisha Putri</span>
                <span>280 pts</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "0.8rem",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ display: "block", marginBottom: "0.4rem", color: "#4ade80" }}>
              {t.biometricVerified}
            </strong>
            <p style={{ opacity: 0.75, margin: 0 }}>
              {locale === "id"
                ? "State didelegasikan ke Provider ChangeNotifier dengan fallback sinkronisasi SharedPreferences lokal saat offline."
                : "State is coordinated via Provider ChangeNotifier modules with offline SharedPreferences local persistence."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
