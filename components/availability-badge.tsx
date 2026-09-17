"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "./portfolio-provider";
import type { Locale } from "@/lib/portfolio";
import { copy } from "@/lib/portfolio";

interface AvailabilityBadgeProps {
  locale: Locale;
}

export function AvailabilityBadge({ locale }: AvailabilityBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { openCV } = usePortfolio();
  const modalRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";
  const content = copy[locale];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const copyRecruiterInfo = async () => {
    const summary = isEn
      ? `Reyy (Mohammad Raihan Hadriansyah) - AI/ML Engineer & Full-Stack Developer
• Status: Available Immediately for Full-Time roles
• Work Model: Bandung Base · Open for On-site/Hybrid (Jakarta/Surabaya) or Remote
• Core Stack: Python, FastAPI, Next.js, TypeScript, Supabase, TensorFlow/TFLite, Redis
• Portfolio: https://portoreyy.vercel.app
• Email: reyyhadri@gmail.com`
      : `Reyy (Mohammad Raihan Hadriansyah) - AI/ML Engineer & Full-Stack Developer
• Status: Siap Kerja Segera untuk Posisi Full-Time
• Model Kerja: Domisili Bandung · Terbuka On-site/Hybrid (Jakarta/Surabaya) atau Remote
• Tech Stack: Python, FastAPI, Next.js, TypeScript, Supabase, TensorFlow/TFLite, Redis
• Portofolio: https://portoreyy.vercel.app
• Email: reyyhadri@gmail.com`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <>
      <button
        type="button"
        className="availability-pill is-interactive"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title={isEn ? "Click to view full work availability and relocation preferences" : "Klik untuk melihat detail ketersediaan kerja & preferensi lokasi"}
      >
        <span className="live-dot" />
        <span>{content.hero.availability}</span>
        <small className="pill-detail-hint">↗</small>
      </button>

      {isOpen && (
        <div
          className="cv-modal-backdrop availability-modal-backdrop"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="availability-modal-title"
        >
          <div
            className="availability-modal-card glass-panel"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="avail-modal-header">
              <div className="avail-header-badge">
                <span className="live-dot" />
                <span className="eyebrow">{isEn ? "RECRUITER OVERVIEW" : "RINGKASAN REKRUTMEN"}</span>
              </div>
              <button
                type="button"
                className="cv-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label={isEn ? "Close dialog" : "Tutup dialog"}
              >
                ✕
              </button>
            </div>

            <div className="avail-modal-body">
              <h2 id="availability-modal-title">
                {isEn ? "Work Availability & Hiring Details" : "Ketersediaan Kerja & Detail Rekrutmen"}
              </h2>
              <p className="avail-lead-sub">
                {isEn
                  ? "Key candidate logistics for HR, Technical Recruiters, and Engineering Hiring Managers."
                  : "Informasi logistik kandidat untuk HR, Technical Recruiter, dan Hiring Manager."}
              </p>

              <div className="avail-specs-grid">
                {/* 1. Availability */}
                <div className="avail-spec-item glass-panel">
                  <span className="spec-item-icon">⚡</span>
                  <div>
                    <strong>{isEn ? "Notice Period / Timeline" : "Waktu Mulai Kerja"}</strong>
                    <p>{isEn ? "Available immediately for full-time employment" : "Siap mulai segera untuk posisi full-time"}</p>
                  </div>
                </div>

                {/* 2. Location & Work Model */}
                <div className="avail-spec-item glass-panel">
                  <span className="spec-item-icon">📍</span>
                  <div>
                    <strong>{isEn ? "Location & Flexibility" : "Lokasi & Fleksibilitas"}</strong>
                    <p>{isEn ? "Bandung base · Open for On-site / Hybrid (Jakarta, Jabodetabek, Surabaya) or Remote" : "Domisili Bandung · Terbuka untuk On-site / Hybrid (Jakarta, Jabodetabek, Surabaya) atau Remote"}</p>
                  </div>
                </div>

                {/* 3. Academic Status */}
                <div className="avail-spec-item glass-panel">
                  <span className="spec-item-icon">🎓</span>
                  <div>
                    <strong>{isEn ? "Education & Graduation" : "Status Pendidikan"}</strong>
                    <p>{isEn ? "Graduated from Telkom University (S.T. · Yudisium Completed) · 100% ready for full-time work" : "Lulusan Telkom University (S.T. · Lulus Yudisium) · 100% siap bekerja full-time"}</p>
                  </div>
                </div>

                {/* 4. Target Roles */}
                <div className="avail-spec-item glass-panel">
                  <span className="spec-item-icon">🎯</span>
                  <div>
                    <strong>{isEn ? "Target Engineering Roles" : "Target Posisi Engineering"}</strong>
                    <p>AI/ML Engineer, Full-Stack Developer, Backend Engineer (Python / FastAPI / TypeScript)</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="avail-actions-row">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setIsOpen(false);
                    openCV();
                  }}
                >
                  {isEn ? "Preview ATS CV" : "Buka CV ATS"} ↗
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={copyRecruiterInfo}
                >
                  {copied ? (isEn ? "✓ Copied Summary!" : "✓ Ringkasan Tersalin!") : (isEn ? "Copy Quick Summary" : "Salin Ringkasan Cepat")}
                </button>
                <a
                  href="#contact"
                  className="button button-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  {isEn ? "Direct Contact" : "Hubungi Langsung"} ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
