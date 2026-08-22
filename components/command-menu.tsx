"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/portfolio";
import { projects, profile } from "@/lib/portfolio";
import { CVType } from "./cv-modal";

type CommandItem = {
  id: string;
  category: "navigation" | "projects" | "actions";
  label: Record<Locale, string>;
  shortcut?: string;
  icon: string;
  perform: () => void;
};

function CommandMenuModal({
  locale,
  onClose,
  onOpenCV,
  onOpenChat,
  onCopyEmail,
}: {
  locale: Locale;
  onClose: () => void;
  onOpenCV: (type: CVType) => void;
  onOpenChat?: () => void;
  onCopyEmail?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isIndo = locale === "id";

  const items: CommandItem[] = [
    // Actions
    {
      id: "cv-ai",
      category: "actions",
      label: {
        en: "Preview CV · AI/ML Engineer",
        id: "Lihat CV · AI/ML Engineer",
      },
      shortcut: "CV",
      icon: "📄",
      perform: () => {
        onClose();
        onOpenCV("ai-ml");
      },
    },
    {
      id: "cv-se",
      category: "actions",
      label: {
        en: "Preview CV · Software / Full-Stack",
        id: "Lihat CV · Software / Full-Stack",
      },
      icon: "📄",
      perform: () => {
        onClose();
        onOpenCV("software");
      },
    },
    {
      id: "copy-email",
      category: "actions",
      label: {
        en: "Copy Email (reyyhadri@gmail.com)",
        id: "Salin Email (reyyhadri@gmail.com)",
      },
      shortcut: "EMAIL",
      icon: "📋",
      perform: () => {
        onClose();
        if (onCopyEmail) {
          onCopyEmail();
        } else {
          navigator.clipboard.writeText(profile.email);
        }
      },
    },
    {
      id: "ask-ai",
      category: "actions",
      label: {
        en: "Ask AI Guide Chatbot",
        id: "Tanya AI Guide Chatbot",
      },
      shortcut: "AI",
      icon: "🤖",
      perform: () => {
        onClose();
        onOpenChat?.();
      },
    },
    {
      id: "ml-playground",
      category: "actions",
      label: {
        en: "Open ML Model Inference Playground",
        id: "Buka Playground Inferensi Model ML",
      },
      shortcut: "ML",
      icon: "🧠",
      perform: () => {
        onClose();
        router.push(`/${locale}/projects/dermascan`);
      },
    },
    {
      id: "role-matcher",
      category: "actions",
      label: {
        en: "Recruiter Role Fit Matcher",
        id: "Kalkulator Kecocokan Lowongan (Role Fit)",
      },
      shortcut: "FIT",
      icon: "🎯",
      perform: () => {
        onClose();
        router.push(`/${locale}#role-matcher`);
      },
    },
    // Navigation
    {
      id: "nav-home",
      category: "navigation",
      label: { en: "Go to Home", id: "Buka Beranda" },
      icon: "🏠",
      perform: () => {
        onClose();
        router.push(`/${locale}`);
      },
    },
    {
      id: "nav-projects",
      category: "navigation",
      label: { en: "Go to Projects (All Work)", id: "Buka Semua Proyek" },
      icon: "💼",
      perform: () => {
        onClose();
        router.push(`/${locale}/projects`);
      },
    },
    {
      id: "nav-credentials",
      category: "navigation",
      label: { en: "Go to Credentials (44 Certificates)", id: "Buka Sertifikat (44 Bukti)" },
      icon: "📜",
      perform: () => {
        onClose();
        router.push(`/${locale}/credentials`);
      },
    },
    {
      id: "nav-about",
      category: "navigation",
      label: { en: "Go to About Reyy", id: "Buka Tentang Reyy" },
      icon: "👤",
      perform: () => {
        onClose();
        router.push(`/${locale}/about`);
      },
    },
    {
      id: "nav-contact",
      category: "navigation",
      label: { en: "Go to Contact / Let's Talk Section", id: "Buka Bagian Kontak / Mari Berbicara" },
      icon: "✉️",
      perform: () => {
        onClose();
        const el = document.getElementById("contact");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(`/${locale}#contact`);
        }
      },
    },
    // Projects Direct Jump
    ...projects.map((p) => ({
      id: `proj-${p.slug}`,
      category: "projects" as const,
      label: {
        en: `${p.title} · ${p.categories.join(", ")}`,
        id: `${p.title} · ${p.categories.join(", ")}`,
      },
      icon: "⚡",
      perform: () => {
        onClose();
        router.push(`/${locale}/projects/${p.slug}`);
      },
    })),
  ];

  const filtered = items.filter((item) => {
    const text = (item.label[locale] + " " + item.id + " " + item.category).toLowerCase();
    return text.includes(query.toLowerCase().trim());
  });

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "command_palette", metadata: { locale } }),
    }).catch(() => {});

    return () => {
      document.body.style.overflow = "";
    };
  }, [locale]);

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].perform();
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        animation: "fadeIn 160ms ease-out",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "580px",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          background: "var(--surface, #141518)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Search Input Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.9rem 1.2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span style={{ fontSize: "1.1rem", opacity: 0.6 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={isIndo ? "Ketik perintah, proyek, atau navigasi…" : "Type a command, project, or page…"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "inherit",
              fontSize: "0.95rem",
            }}
          />
          <kbd
            style={{
              fontSize: "0.7rem",
              padding: "0.2rem 0.45rem",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              opacity: 0.7,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "0.5rem" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center", opacity: 0.5, fontSize: "0.85rem" }}>
              {isIndo ? "Tidak ada hasil yang cocok" : "No matching commands found"}
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.perform}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: selectedIndex === idx ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  color: selectedIndex === idx ? "var(--foreground, #fff)" : "inherit",
                  transition: "background 100ms ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.88rem", fontWeight: selectedIndex === idx ? 600 : 400 }}>
                    {item.label[locale]}
                  </span>
                </div>
                {item.shortcut && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.06)",
                      opacity: 0.6,
                    }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: "0.72rem",
            opacity: 0.5,
            background: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <span>↑↓ {isIndo ? "untuk navigasi" : "to navigate"} · ↵ {isIndo ? "untuk memilih" : "to select"}</span>
          <span>Reyy Portfolio v2.0</span>
        </footer>
      </div>
    </div>
  );
}

export function CommandMenu({
  locale,
  onOpenCV,
  onOpenChat,
  onCopyEmail,
}: {
  locale: Locale;
  onOpenCV: (type: CVType) => void;
  onOpenChat?: () => void;
  onCopyEmail?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <CommandMenuModal
      locale={locale}
      onClose={() => setIsOpen(false)}
      onOpenCV={onOpenCV}
      onOpenChat={onOpenChat}
      onCopyEmail={onCopyEmail}
    />
  );
}
