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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];

  useEffect(() => {
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "cv_preview", metadata: { type: initialType, locale } }),
    }).catch(() => {});

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 200ms ease-out",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "880px",
          height: "90vh",
          maxHeight: "920px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "var(--surface, #121316)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Header Bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        >
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
            <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.15rem 0 0" }}>
              {t.candidate} · {currentCV.subtitle[locale]}
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "3px",
              borderRadius: "8px",
              gap: "4px",
            }}
          >
            {(Object.keys(cvFiles) as CVType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: activeType === type ? "var(--foreground, #fff)" : "transparent",
                  color: activeType === type ? "var(--background, #000)" : "inherit",
                  opacity: activeType === type ? 1 : 0.7,
                  transition: "all 160ms ease",
                }}
              >
                {cvFiles[type].label[locale]}
              </button>
            ))}
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t.close}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "inherit",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}
          >
            ×
          </button>
        </header>

        {/* PDF Document Previewer Frame */}
        <div style={{ flex: 1, position: "relative", background: "#0a0a0c" }}>
          <iframe
            key={currentCV.file}
            src={`${currentCV.file}#toolbar=0&view=FitH`}
            title={`Preview ${currentCV.label[locale]}`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </div>

        {/* Footer Actions */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "0.85rem 1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        >
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
