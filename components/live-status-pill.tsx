"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/portfolio";

export function LiveStatusPill({ locale }: { locale: Locale }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontSize: "0.78rem",
        color: "var(--foreground, #fff)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 8px #4ade80",
          display: "inline-block",
        }}
      />
      <span>
        {locale === "id"
          ? "Tersedia untuk Pekerjaan Full-time"
          : "Available for Full-time Roles"}
      </span>
      {time && (
        <span style={{ opacity: 0.5, fontSize: "0.72rem" }}>
          · Bandung {time} WIB
        </span>
      )}
    </div>
  );
}
