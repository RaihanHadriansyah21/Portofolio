"use client";

import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { copy } from "@/lib/portfolio";
import { usePortfolio } from "./portfolio-provider";

export function HeroActionsClient({ locale }: { locale: Locale }) {
  const { openCV } = usePortfolio();
  const content = copy[locale];
  const isIndo = locale === "id";

  return (
    <div className="hero-actions">
      <Link className="button button-primary" href={`/${locale}/projects`}>
        {content.hero.primary} <span aria-hidden="true">↗</span>
      </Link>
      <button
        type="button"
        onClick={() => openCV("ai-ml")}
        className="button button-secondary"
      >
        {isIndo ? "Preview CV" : "Preview CV"} <span aria-hidden="true">↗</span>
      </button>
      <Link className="button button-secondary" href={`/${locale}/about`}>
        {content.hero.secondary}
      </Link>
    </div>
  );
}
