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
      className="control-button"
      type="button"
      onClick={handleClick}
      aria-label={locale === "id" ? "Buka Menu Perintah (Ctrl+K)" : "Open Command Menu (Ctrl+K)"}
      title={locale === "id" ? "Cari / Menu Cepat (Ctrl+K)" : "Search / Quick Menu (Ctrl+K)"}
    >
      <span className="control-label-stack" aria-hidden="true">
        <span className="control-label">⌘K</span>
        <span className="control-label-hover">⌘K</span>
      </span>
    </button>
  );
}
