"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";
import { profile } from "@/lib/portfolio";
import { showToast } from "./toast-notification";

export function RecruiterSummaryButton({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const isIndo = locale === "id";

  const summaryMarkdown = `**Mohammad Raihan Hadriansyah Prasetya** — AI/ML Engineer & Full-Stack Developer
• Core Stack: Python, TensorFlow, Next.js, FastAPI, Supabase, PostgreSQL, Docker
• Key Projects: SCOVIS (Flagship Applied AI / Thesis), DermaScan (Medical ML), Vehicle Classification (MobileNetV2), QuizInt (Mobile Flutter)
• Credentials: 44 verified certifications (Dicoding, DBS Foundation Coding Camp 2026 AI Cohort, Microsoft)
• Education: B.Eng Telecommunication Engineering (Telkom University)
• Contact: ${profile.email} | Bandung, Indonesia | Portfolio: https://portoreyy.vercel.app`;

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(summaryMarkdown);
    setCopied(true);
    showToast(
      isIndo
        ? "Ringkasan profil untuk HR/Recruiter berhasil disalin!"
        : "Candidate summary for HR/Recruiter copied to clipboard!",
      "📋"
    );

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "cv_preview", metadata: { type: "recruiter_summary", locale } }),
    }).catch(() => {});

    setTimeout(() => setCopied(false), 2400);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className || "button button-secondary"}
      title={isIndo ? "Salin ringkasan profil kandidat untuk HR/Recruiter" : "Copy candidate profile summary for HR/Recruiter"}
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      <span>{copied ? "✓" : "📋"}</span>
      <span>
        {copied
          ? isIndo
            ? "Ringkasan Tersalin!"
            : "Summary Copied!"
          : isIndo
            ? "Salin Ringkasan HR"
            : "Copy HR Summary"}
      </span>
    </button>
  );
}
