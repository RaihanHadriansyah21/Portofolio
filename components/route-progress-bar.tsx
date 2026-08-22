"use client";

import { usePathname } from "next/navigation";

export function RouteProgressBar() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2.5px",
        zIndex: 99999,
        background: "linear-gradient(90deg, transparent, #4ade80, #ffffff, #60a5fa, transparent)",
        boxShadow: "0 0 12px rgba(74, 222, 128, 0.8), 0 0 4px #fff",
        animation: "laserSwipe 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        pointerEvents: "none",
      }}
    />
  );
}
