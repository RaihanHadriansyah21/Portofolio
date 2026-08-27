"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";
import { siteUrl } from "@/lib/portfolio";

interface ShareProfileButtonProps {
  locale: Locale;
  className?: string;
  variant?: "primary" | "secondary" | "pill";
}

export function ShareProfileButton({ locale, className = "", variant = "secondary" }: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);
  const isEn = locale === "en";

  const handleShare = async () => {
    const url = `${siteUrl()}/${locale}`;
    const title = "Reyy · AI/ML Engineer & Full-Stack Developer Portfolio";
    const text = isEn
      ? "Check out Reyy's portfolio featuring applied AI projects, system architectures, and live ML models."
      : "Lihat portofolio Reyy: sistem AI terapan, arsitektur full-stack, dan model ML interaktif.";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const btnClass = variant === "pill"
    ? `share-pill-btn ${className}`
    : `button button-${variant} ${className}`;

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleShare}
      title={isEn ? "Share portfolio profile" : "Bagikan profil portofolio"}
      aria-label={isEn ? "Share portfolio profile" : "Bagikan profil portofolio"}
    >
      <span className="share-icon" aria-hidden="true">
        {copied ? "✓" : "↗"}
      </span>
      <span>
        {copied
          ? (isEn ? "Link Copied!" : "Tautan Disalin!")
          : (isEn ? "Share Profile" : "Bagikan Profil")}
      </span>
    </button>
  );
}
