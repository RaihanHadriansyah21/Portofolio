"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";
import { profile } from "@/lib/portfolio";
import { showToast } from "./toast-notification";

export function CopyEmailButton({
  locale,
  className,
  children,
}: {
  locale: Locale;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    showToast(
      locale === "id"
        ? `Email ${profile.email} berhasil disalin ke clipboard!`
        : `Email ${profile.email} copied to clipboard!`,
      "✓"
    );

    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "copy_email", metadata: { locale } }),
    }).catch(() => {});

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className || "text-link"}
      title={locale === "id" ? "Salin email ke clipboard" : "Copy email to clipboard"}
      style={{
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      }}
    >
      {children || (
        <>
          <span>{copied ? (locale === "id" ? "Tersalin!" : "Copied!") : "Email"}</span>
          <span aria-hidden="true">{copied ? "✓" : "📋"}</span>
        </>
      )}
    </button>
  );
}
