"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/portfolio";

export type CVType = "ai-ml" | "software";

const cvFiles: Record<CVType, { file: string; label: Record<Locale, string>; subtitle: Record<Locale, string> }> = {
  "ai-ml": {
    file: "/cv/Mohammad_Raihan_CV_AI_ML_Engineer.pdf",
    label: {
      en: "AI / ML Engineer",
      id: "AI / ML Engineer",
    },
    subtitle: {
      en: "Specialized in Applied AI, Model Serving, & Data Systems",
      id: "Fokus pada AI Terapan, Model Serving, & Sistem Data",
    },
  },
  software: {
    file: "/cv/Mohammad_Raihan_CV_Software_Engineer.pdf",
    label: {
      en: "Full-Stack / Software",
      id: "Full-Stack / Software",
    },
    subtitle: {
      en: "Specialized in Next.js, FastAPI, Cloud, & Backend APIs",
      id: "Fokus pada Next.js, FastAPI, Cloud, & Backend API",
    },
  },
};

const copy = {
  en: {
    title: "Curriculum Vitae",
    candidate: "Mohammad Raihan Hadriansyah",
    updated: "Updated 2026 · ATS Compatible",
    download: "Download PDF",
    openTab: "Open in New Tab",
    close: "Close",
    loading: "Loading document preview…",
  },
  id: {
    title: "Curriculum Vitae",
    candidate: "Mohammad Raihan Hadriansyah",
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
  initialType = "ai-ml",
}: {
  onClose: () => void;
  locale: Locale;
  initialType?: CVType;
}) {
  const [activeType, setActiveType] = useState<CVType>(initialType);
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
      body: JSON.stringify({ eventType: "cv_preview", metadata: { type: initialType, locale } }),
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

  function handleDownload(type: CVType) {
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "cv_download", metadata: { type, locale } }),
    }).catch(() => {});
  }

  const currentCV = cvFiles[activeType];

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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
            <p id="cv-modal-desc" style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.15rem 0 0" }}>
              {t.candidate} · {currentCV.subtitle[locale]}
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div
            role="tablist"
            aria-label={t.title}
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "3px",
              borderRadius: "8px",
              gap: "4px",
            }}
          >
            {(Object.keys(cvFiles) as CVType[]).map((type) => {
              const isSelected = activeType === type;
              return (
                <button
                  key={type}
                  id={`cv-tab-${type}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls="cv-preview-panel"
                  onClick={() => setActiveType(type)}
                  className="cv-modal-tab"
                >
                  {cvFiles[type].label[locale]}
                </button>
              );
            })}
          </div>

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
        </header>

        {/* PDF Document Previewer Frame */}
        <div
          id="cv-preview-panel"
          role="tabpanel"
          aria-labelledby={`cv-tab-${activeType}`}
          style={{ flex: 1, position: "relative", background: "#0a0a0c" }}
        >
          <iframe
            key={currentCV.file}
            src={`${currentCV.file}#toolbar=0&view=FitH`}
            title={`${t.candidate} - ${currentCV.label[locale]} (${t.title})`}
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
          <span style={{ fontSize: "0.78rem", opacity: 0.5 }}>
            {activeType === "ai-ml"
              ? "Mohammad_Raihan_CV_AI_ML_Engineer.pdf"
              : "Mohammad_Raihan_CV_Software_Engineer.pdf"}
          </span>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href={currentCV.file}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
            >
              🔗 {t.openTab}
            </a>
            <a
              href={currentCV.file}
              download={currentCV.file.split("/").pop()}
              onClick={() => handleDownload(activeType)}
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
  initialType = "ai-ml",
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialType?: CVType;
}) {
  if (!isOpen) return null;
  return <CVModalContent onClose={onClose} locale={locale} initialType={initialType} />;
}
