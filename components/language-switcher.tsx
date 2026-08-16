"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/portfolio";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const targetLocale: Locale = locale === "en" ? "id" : "en";
  const segments = pathname.split("/");
  segments[1] = targetLocale;
  const targetPath = segments.join("/") || `/${targetLocale}`;

  return (
    <Link
      className="control-button"
      href={targetPath}
      aria-label={targetLocale === "id" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
      title={targetLocale === "id" ? "Bahasa Indonesia" : "English"}
    >
      {targetLocale.toUpperCase()}
    </Link>
  );
}
