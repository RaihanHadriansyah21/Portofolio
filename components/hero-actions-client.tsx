"use client";

import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { copy } from "@/lib/portfolio";
import { usePortfolio } from "./portfolio-provider";
import { LiveStatusPill } from "./live-status-pill";

export function HeroActionsClient({ locale }: { locale: Locale }) {
  const { openCV } = usePortfolio();
  const content = copy[locale];
  const isIndo = locale === "id";

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <LiveStatusPill locale={locale} />
      </div>

      <div className="hero-actions" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <Link className="button button-primary" href={`/${locale}/projects`}>
          {content.hero.primary} <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          onClick={() => openCV("ai-ml")}
          className="button button-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
        >
          <span>📄</span>
          <span>{isIndo ? "Preview CV" : "Preview CV"}</span>
        </button>
        <Link className="button button-secondary" href={`/${locale}/about`}>
          {content.hero.secondary}
        </Link>
      </div>
    </>
  );
}
