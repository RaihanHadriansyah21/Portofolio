"use client";

import { useEffect, useState } from "react";

export type ToastMessage = {
  id: string;
  text: string;
  icon?: string;
};

let toastCallback: ((msg: ToastMessage) => void) | null = null;

export function showToast(text: string, icon = "✓") {
  if (toastCallback) {
    toastCallback({ id: Math.random().toString(), text, icon });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastCallback = (msg) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 3200);
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.75rem 1.1rem",
            borderRadius: "10px",
            background: "rgba(18, 19, 22, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "var(--foreground, #fff)",
            fontSize: "0.85rem",
            fontWeight: 500,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            animation: "slideInUp 200ms ease-out",
          }}
        >
          {toast.icon && <span style={{ color: "#4ade80", fontWeight: 700 }}>{toast.icon}</span>}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
