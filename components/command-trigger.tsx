"use client";

import type { Locale } from "@/lib/portfolio";

export function CommandTrigger({ locale }: { locale: Locale }) {
  function handleClick() {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        bubbles: true,
      })
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={locale === "id" ? "Buka Menu Perintah (Ctrl+K)" : "Open Command Menu (Ctrl+K)"}
      title={locale === "id" ? "Cari / Menu Cepat (Ctrl+K)" : "Search / Quick Menu (Ctrl+K)"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        background: "transparent",
        border: "1px solid var(--border-subtle, rgba(255,255,255,0.12))",
        borderRadius: "999px",
        padding: "0.35rem 0.65rem",
        color: "inherit",
        fontSize: "0.78rem",
        cursor: "pointer",
        opacity: 0.85,
        transition: "all 150ms ease",
      }}
    >
      <span style={{ fontSize: "0.85rem" }}>🔍</span>
      <kbd
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.65rem",
          opacity: 0.7,
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}
