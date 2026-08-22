"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Certificate, CertificateCategory } from "@/lib/certificates";
import { certificateCategoryLabels, certificateKindLabels } from "@/lib/certificates";
import type { Locale } from "@/lib/portfolio";

type Filter = "all" | CertificateCategory;

const filters: Filter[] = ["all", "ai-ml", "software-cloud", "language", "events", "leadership"];

const galleryCopy = {
  en: {
    all: "All",
    featured: "Featured",
    verified: "Official verification",
    privacy: "Privacy-safe preview",
    view: "View certificate",
    close: "Close certificate preview",
    verify: "Verify on issuer site",
    showing: "Showing",
    of: "of",
    results: "credentials",
    dialogLabel: "Certificate preview",
    searchPlaceholder: "Search 44 certificates (e.g. TensorFlow, Python, Google, Deep Learning)…",
    noResults: "No certificates match your search query.",
    clearSearch: "Clear search",
  },
  id: {
    all: "Semua",
    featured: "Unggulan",
    verified: "Verifikasi resmi",
    privacy: "Preview aman privasi",
    view: "Lihat sertifikat",
    close: "Tutup preview sertifikat",
    verify: "Verifikasi di situs penerbit",
    showing: "Menampilkan",
    of: "dari",
    results: "sertifikat",
    dialogLabel: "Preview sertifikat",
    searchPlaceholder: "Cari 44 sertifikat (contoh: TensorFlow, Python, Google, Deep Learning)…",
    noResults: "Tidak ada sertifikat yang cocok dengan pencarian Anda.",
    clearSearch: "Hapus pencarian",
  },
} as const;

function formatIssueDate(value: string, lang: Locale) {
  if (/^\d{4}$/.test(value)) return value;

  const locale = lang === "id" ? "id-ID" : "en-US";
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" })
      .format(new Date(`${value}-01T00:00:00Z`));
  }

  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export function CertificateGallery({ items, lang }: { items: Certificate[]; lang: Locale }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Certificate | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const copy = galleryCopy[lang];

  const visibleItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((certificate) => {
      // Category filter
      if (activeFilter !== "all" && certificate.category !== activeFilter) {
        return false;
      }
      // Keyword search
      if (q) {
        const text = `${certificate.title} ${certificate.issuer} ${certificate.kind} ${certificate.slug}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [items, activeFilter, searchQuery]);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [selected]);

  return (
    <>
      {/* Search Bar & Filter Controls */}
      <div
        className="certificate-toolbar"
        aria-label={lang === "id" ? "Filter sertifikat" : "Certificate filters"}
        role="region"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Live Search Input */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            style={{
              width: "100%",
              padding: "0.75rem 2.5rem 0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "var(--surface-sunken, rgba(0, 0, 0, 0.25))",
              color: "inherit",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label={copy.clearSearch}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "inherit",
                opacity: 0.6,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div className="certificate-filter-list" role="group">
            {filters.map((filter) => {
              const label = filter === "all" ? copy.all : certificateCategoryLabels[filter][lang];
              const count = filter === "all" ? items.length : items.filter((item) => item.category === filter).length;

              return (
                <button
                  aria-pressed={activeFilter === filter}
                  className={activeFilter === filter ? "active" : undefined}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  <span>{label}</span>
                  <small>{count.toString().padStart(2, "0")}</small>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" style={{ margin: 0, fontSize: "0.82rem", opacity: 0.7 }}>
            {copy.showing} {visibleItems.length} {copy.of} {items.length} {copy.results}
          </p>
        </div>
      </div>

      {/* Grid of Certificates */}
      {visibleItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem 1.5rem", textAlign: "center", borderRadius: "12px", margin: "2rem 0" }}>
          <p style={{ fontSize: "1rem", opacity: 0.7, margin: 0 }}>{copy.noResults}</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            style={{ marginTop: "1rem", fontSize: "0.85rem" }}
          >
            {copy.clearSearch}
          </button>
        </div>
      ) : (
        <div className="certificate-gallery-grid">
          {visibleItems.map((certificate, index) => (
            <article className="certificate-gallery-card glass-panel" key={certificate.slug}>
              <button
                aria-haspopup="dialog"
                aria-label={`${copy.view}: ${certificate.title}`}
                className="certificate-preview-button"
                onClick={(event) => {
                  lastTriggerRef.current = event.currentTarget;
                  setSelected(certificate);
                }}
                type="button"
              >
                <span className="certificate-image-frame">
                  <Image
                    alt={`${copy.dialogLabel}: ${certificate.title}`}
                    height={certificate.height}
                    loading={index < 3 ? "eager" : "lazy"}
                    quality={75}
                    sizes="(max-width: 720px) calc(100vw - 2rem), (max-width: 1100px) 46vw, 31vw"
                    src={certificate.preview}
                    width={certificate.width}
                  />
                  <span className="certificate-view-cue">{copy.view} ↗</span>
                </span>
              </button>
              <div className="certificate-card-meta">
                <div>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                  <span>{certificateCategoryLabels[certificate.category][lang]}</span>
                </div>
                <h2>{certificate.title}</h2>
                <p>{certificate.issuer}</p>
                <footer>
                  <span>{formatIssueDate(certificate.issuedAt, lang)}</span>
                  <span>{certificateKindLabels[certificate.kind][lang]}</span>
                </footer>
                <div className="certificate-badges">
                  {certificate.featured ? <span>{copy.featured}</span> : null}
                  {certificate.verificationUrl ? <span>{copy.verified}</span> : null}
                  {certificate.privacyRedacted ? <span>{copy.privacy}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Lightbox / Modal */}
      {selected ? (
        <div
          aria-label={copy.dialogLabel}
          aria-modal="true"
          className="certificate-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          role="dialog"
        >
          <div className="certificate-modal glass-panel">
            <div className="certificate-modal-topbar">
              <p>{certificateKindLabels[selected.kind][lang]} / {formatIssueDate(selected.issuedAt, lang)}</p>
              <button
                aria-label={copy.close}
                className="certificate-modal-close"
                onClick={() => setSelected(null)}
                ref={closeButtonRef}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="certificate-modal-image">
              <Image
                alt={`${copy.dialogLabel}: ${selected.title}`}
                height={selected.height}
                quality={75}
                sizes="(max-width: 820px) 94vw, 76vw"
                src={selected.preview}
                width={selected.width}
              />
            </div>
            <div className="certificate-modal-copy">
              <div>
                <p className="eyebrow">{selected.issuer}</p>
                <h2>{selected.title}</h2>
              </div>
              <div className="certificate-modal-actions">
                {selected.privacyRedacted ? <span>{copy.privacy}</span> : null}
                {selected.verificationUrl ? (
                  <a href={selected.verificationUrl} rel="noreferrer" target="_blank">
                    {copy.verify} ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
