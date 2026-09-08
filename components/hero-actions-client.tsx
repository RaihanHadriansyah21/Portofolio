"use client";

import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { copy } from "@/lib/portfolio";
import { usePortfolio } from "./portfolio-provider";
import { ShareProfileButton } from "./share-profile-button";

export function HeroActionsClient({ locale }: { locale: Locale }) {
  const { openCV } = usePortfolio();
  const content = copy[locale];
  const isIndo = locale === "id";

  return (
    <div className="hero-cta-wrapper">
      {/* Primary Actions: Clear, High-Contrast CTAs */}
      <div className="hero-actions">
        <Link className="button button-primary" href={`/${locale}/projects`}>
          <span>{content.hero.primary}</span> <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          onClick={() => openCV("ai-ml")}
          className="button button-secondary"
          aria-haspopup="dialog"
          aria-label={isIndo ? "Buka Pratinjau Curriculum Vitae" : "Open Curriculum Vitae Preview"}
        >
          <span>{isIndo ? "Pratinjau CV" : "Preview CV"}</span> <span aria-hidden="true">↗</span>
        </button>
      </div>

      {/* Secondary Utility Row: Accessible, Restrained, Non-Competing */}
      <div
        className="hero-secondary-actions"
        aria-label={isIndo ? "Navigasi cepat profil" : "Profile quick navigation"}
      >
        <Link className="hero-secondary-link" href={`/${locale}/about`}>
          <span>{content.hero.secondary}</span>
          <span className="hero-secondary-arrow" aria-hidden="true">→</span>
        </Link>
        <span className="hero-secondary-dot" aria-hidden="true">·</span>
        <ShareProfileButton locale={locale} variant="pill" />
      </div>
    </div>
  );
}
