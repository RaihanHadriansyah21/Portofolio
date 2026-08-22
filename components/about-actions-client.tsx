"use client";

import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { copy, profile } from "@/lib/portfolio";
import { CopyEmailButton } from "./copy-email-button";
import { usePortfolio } from "./portfolio-provider";

export function AboutActionsClient({ locale }: { locale: Locale }) {
  const { openCV } = usePortfolio();
  const content = copy[locale];
  const isIndo = locale === "id";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginTop: "1rem" }}>
      <a className="button button-primary" href={profile.linkedin} target="_blank" rel="noreferrer">
        {content.contact.cta} ↗
      </a>
      <button
        type="button"
        onClick={() => openCV("ai-ml")}
        className="button button-secondary"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
      >
        <span>📄</span>
        <span>{isIndo ? "Preview CV Lengkap" : "Preview Full CV"}</span>
      </button>
      <CopyEmailButton locale={locale} className="button button-secondary">
        <span>📋</span>
        <span>{isIndo ? "Salin Email" : "Copy Email"}</span>
      </CopyEmailButton>
      <a className="text-link" href={profile.instagram} target="_blank" rel="noreferrer">
        Instagram ↗
      </a>
      <Link className="text-link" href={`/${locale}/projects`}>
        {content.common.viewAll} ↗
      </Link>
    </div>
  );
}
