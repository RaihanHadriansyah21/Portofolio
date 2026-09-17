"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/portfolio";

export type CVType = "hybrid" | "ai-ml" | "software";

const MASTER_CV = {
  file: "/cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf",
  filename: "Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf",
  role: {
    en: "AI/ML Engineer & Full-Stack Developer",
    id: "AI/ML Engineer & Full-Stack Developer",
  },
  badge: {
    en: "Master Hybrid · 3 Pages ATS",
    id: "Master Hybrid · 3 Halaman ATS",
  },
  subtitle: {
    en: "AI/ML Engineer & Full-Stack Developer · Production Systems & Architecture",
    id: "AI/ML Engineer & Full-Stack Developer · Sistem Produksi & Arsitektur",
  },
};

const copy = {
  en: {
    title: "Curriculum Vitae",
    candidate: "Mohammad Raihan Hadriansyah Prasetya",
    updated: "Updated 2026 · ATS Compatible",
    download: "Download PDF",
    openTab: "Open in New Tab",
    close: "Close",
    loading: "Loading document preview…",
  },
  id: {
    title: "Curriculum Vitae",
    candidate: "Mohammad Raihan Hadriansyah Prasetya",
    updated: "Pembaruan 2026 · Kompatibel ATS",
    download: "Unduh PDF",
    openTab: "Buka di Tab Baru",
    close: "Tutup",
    loading: "Memuat pratinjau dokumen…",
  },
};

function CVModalContent({
  onClose,
  locale,
  initialType = "hybrid",
}: {
  onClose: () => void;
  locale: Locale;
  initialType?: CVType;
}) {
  const modalPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const t = copy[locale];

  useEffect(() => {
    // 1. Capture previously focused element for focus restoration on close
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // 2. Telemetry tracking for preview
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "cv_preview", metadata: { type: "master_hybrid", locale } }),
    }).catch(() => {});

    // 3. Scroll lock with scrollbar width compensation to avoid layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // 4. Initial focus placement into modal
    const focusTimer = requestAnimationFrame(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    });

    // 5. Global Escape key handling and Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalPanelRef.current) return;
        const focusableElements = modalPanelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalPanelRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;

      // 6. Restore focus to the element that triggered the modal
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [initialType, locale, onClose]);

  function handleDownload(type: string = "master_hybrid") {
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "cv_download", metadata: { type, locale } }),
    }).catch(() => {});
  }

  return (
    <div
      className="cv-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      aria-describedby="cv-modal-desc"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalPanelRef}
        className="glass-panel cv-modal-panel"
        tabIndex={-1}
      >
        {/* Header Bar */}
        <header className="cv-modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <h2 id="cv-modal-title" style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                {t.title}
              </h2>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: "rgba(74, 222, 128, 0.15)",
                  color: "#4ade80",
                  fontWeight: 600,
                }}
              >
                {t.updated}
              </span>
            </div>
            <p id="cv-modal-desc" style={{ fontSize: "0.8rem", opacity: 0.75, margin: "0.2rem 0 0" }}>
              <strong>{t.candidate}</strong> · {MASTER_CV.subtitle[locale]}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
                background: "rgba(59, 130, 246, 0.12)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>📄</span>
              <span>{MASTER_CV.badge[locale]}</span>
            </span>

            {/* Close Button with Clear Focus Indicators */}
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onClose}
              aria-label={t.close}
              className="cv-modal-close-btn"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        {/* PDF Document Previewer Frame */}
        <div
          id="cv-preview-panel"
          role="region"
          aria-label={`${t.candidate} - ${t.title}`}
          style={{ flex: 1, position: "relative", background: "#0a0a0c" }}
        >
          <iframe
            key={MASTER_CV.file}
            src={`${MASTER_CV.file}#toolbar=0&view=FitH`}
            title={`${t.candidate} - ${MASTER_CV.role[locale]} (${t.title})`}
            tabIndex={-1}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>

        {/* Footer Actions */}
        <footer className="cv-modal-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.78rem", opacity: 0.65, fontFamily: "var(--font-geist-mono), monospace" }}>
              {MASTER_CV.filename}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "0.15rem 0.45rem",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "inherit",
                opacity: 0.75,
              }}
            >
              Standard A4 · Vector PDF
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href={MASTER_CV.file}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
            >
              🔗 {t.openTab}
            </a>
            <a
              href={MASTER_CV.file}
              download={MASTER_CV.filename}
              onClick={() => handleDownload("master_hybrid")}
              className="button button-primary"
              style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
            >
              📥 {t.download}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function CVModal({
  isOpen,
  onClose,
  locale,
  initialType = "hybrid",
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialType?: CVType;
}) {
  if (!isOpen) return null;
  return <CVModalContent onClose={onClose} locale={locale} initialType={initialType} />;
}
