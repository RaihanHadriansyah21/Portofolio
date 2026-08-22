"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { Locale } from "@/lib/portfolio";

type AnalyticsData = {
  overview: {
    total_sessions: number;
    today: number;
    week: number;
    month: number;
  };
  total_messages: number;
  mode_distribution: { mode: string; count: number }[];
  locale_distribution: { locale: string; count: number }[];
  peak_hours: { hour: number; count: number }[];
  top_questions: { question: string; count: number }[];
  token_usage_30d: number;
  recent_sessions: {
    id: string;
    locale: string;
    mode: string;
    created_at: string;
    first_question: string | null;
  }[];
  feedback_summary: {
    total: number;
    up: number;
    down: number;
  };
  recent_leads: {
    id: string;
    name: string;
    email: string;
    message: string | null;
    session_id: string | null;
    created_at: string;
  }[];
  low_rated: {
    message_id: string;
    content: string;
    created_at: string;
  }[];
  engagement_events?: {
    cv_previews: number;
    cv_downloads: number;
    email_copies: number;
    command_palette: number;
    role_matcher?: number;
    voice_briefing?: number;
  };
};

const STORAGE_KEY = "reyy_admin_auth_token";

const copy = {
  en: {
    portalTitle: "Private Analytics Portal",
    portalDesc: "Enter secret key to access bot intelligence & visitor metrics.",
    secretPlaceholder: "Admin Secret Key...",
    verifying: "Verifying...",
    accessBtn: "Access Dashboard",
    invalidKey: "Invalid credentials.",
    networkErr: "Network error occurred.",
    fetchErr: "Failed to load analytics data.",
    telemetry: "LIVE TELEMETRY",
    title: "Reyy's AI Guide Intelligence",
    lastUpdated: "Last updated: ",
    refreshBtn: "⟳ Refresh",
    refreshingBtn: "⟳ Refreshing...",
    logoutBtn: "Log out",
    today: "TODAY",
    last7Days: "LAST 7 DAYS",
    last30Days: "LAST 30 DAYS",
    allMessages: "ALL TIME MESSAGES",
    satisfaction: "SATISFACTION",
    sessionsUnit: "sessions",
    msgsUnit: "user & bot msgs",
    noRatings: "No ratings yet",
    breakdownTitle: "Mode & Language Breakdown",
    modesLabel: "Conversation Modes",
    langLabel: "Language Preference",
    tokenHealthTitle: "Token Health & Gemini Free Tier",
    estToken: "Estimated 30d Token Consumption",
    freeTierSafe: "Free Tier limit: 1,000,000 tokens/min & 1,500 requests/day. Status: 100% Free Tier Safe.",
    peakHoursTitle: "Peak Activity Hours (WIB / GMT+7)",
    noHourly: "No hourly telemetry yet",
    engagementTitle: "📄 CV & Visitor Engagement Telemetry",
    engagementDesc: "Real-time metrics on CV previews, downloads, and interactive shortcuts.",
    cvViews: "CV In-Browser Previews",
    cvDownloads: "CV PDF Downloads",
    emailCopies: "1-Click Email Copies",
    cmdPalette: "Command Palette (Ctrl+K)",
    roleMatcher: "Role Fit Matcher Uses",
    voiceBriefing: "AI Voice Briefings Played",
    leadsTitle: "💼 Recruiter Contacts & Leads",
    leadsDesc: "Contacts left by visitors after chatting with the AI.",
    noLeads: "No recruiter leads submitted yet.",
    leadsCount: (n: number) => `${n} lead${n === 1 ? "" : "s"}`,
    topQuestionsTitle: "🔥 Top Inquired Questions",
    topQuestionsDesc: "Use these insights to prepare for technical and cultural interview questions.",
    noQuestions: "No question history yet.",
    recentSessionsTitle: "🕒 Recent Conversation Sessions",
    recentSessionsDesc: "Latest 20 recorded visitor sessions.",
    noSessions: "No recorded sessions yet.",
    noPrompt: "No prompt text",
    modeNames: {
      recruiter: "Recruiter",
      technical: "Technical",
      explore: "Explore",
    },
    langNames: {
      en: "English (EN)",
      id: "Bahasa Indonesia (ID)",
    },
  },
  id: {
    portalTitle: "Portal Analytics Privat",
    portalDesc: "Masukkan secret key untuk mengakses intelijen bot & metrik pengunjung.",
    secretPlaceholder: "Admin Secret Key...",
    verifying: "Memverifikasi...",
    accessBtn: "Buka Dashboard",
    invalidKey: "Password / secret key salah.",
    networkErr: "Terjadi kesalahan jaringan.",
    fetchErr: "Gagal memuat data analytics.",
    telemetry: "TELEMETRI REAL-TIME",
    title: "Dashboard AI Guide Reyy",
    lastUpdated: "Pembaruan terakhir: ",
    refreshBtn: "⟳ Segarkan Data",
    refreshingBtn: "⟳ Menyegarkan...",
    logoutBtn: "Keluar",
    today: "HARI INI",
    last7Days: "7 HARI TERAKHIR",
    last30Days: "30 HARI TERAKHIR",
    allMessages: "TOTAL PESAN",
    satisfaction: "KEPUASAN PENGUNJUNG",
    sessionsUnit: "sesi percakapan",
    msgsUnit: "pesan user & bot",
    noRatings: "Belum ada rating",
    breakdownTitle: "Distribusi Mode & Preferensi Bahasa",
    modesLabel: "Mode Percakapan",
    langLabel: "Pilihan Bahasa",
    tokenHealthTitle: "Kesehatan Kuota & Penggunaan Token",
    estToken: "Perkiraan Konsumsi Token (30 Hari)",
    freeTierSafe: "Batas Free Tier: 1.000.000 token/menit & 1.500 request/hari. Status: 100% Aman di Free Tier.",
    peakHoursTitle: "Jam Puncak Aktivitas (WIB / UTC+7)",
    noHourly: "Belum ada data jam aktivitas",
    engagementTitle: "📄 Telemetri CV & Interaksi Pengunjung",
    engagementDesc: "Metrik real-time pembacaan CV, download PDF, dan interaksi shortcut.",
    cvViews: "Preview CV di Browser",
    cvDownloads: "Download PDF CV",
    emailCopies: "Salin Email (1-Klik)",
    cmdPalette: "Command Menu (Ctrl+K)",
    roleMatcher: "Penggunaan Role Fit Matcher",
    voiceBriefing: "Pemutaran AI Voice Briefing",
    leadsTitle: "💼 Kontak Rekruter & Pesan Masuk",
    leadsDesc: "Kontak yang ditinggalkan pengunjung setelah berdiskusi dengan AI.",
    noLeads: "Belum ada rekruter yang meninggalkan kontak.",
    leadsCount: (n: number) => `${n} kontak`,
    topQuestionsTitle: "🔥 Pertanyaan Paling Sering Ditanyakan",
    topQuestionsDesc: "Gunakan wawasan ini untuk persiapan interview dan portofolio.",
    noQuestions: "Belum ada riwayat pertanyaan.",
    recentSessionsTitle: "🕒 Sesi Percakapan Terbaru",
    recentSessionsDesc: "Daftar 20 sesi percakapan pengunjung terakhir.",
    noSessions: "Belum ada sesi percakapan yang tercatat.",
    noPrompt: "Tidak ada teks pertanyaan",
    modeNames: {
      recruiter: "Rekruter",
      technical: "Teknis",
      explore: "Jelajahi",
    },
    langNames: {
      en: "Bahasa Inggris (EN)",
      id: "Bahasa Indonesia (ID)",
    },
  },
} as const;

export function AdminDashboardClient({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) || "" : "",
  );
  const [inputToken, setInputToken] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const executeFetch = useCallback(
    async (authToken: string) => {
      setError(null);
      startTransition(async () => {
        try {
          const res = await fetch("/api/admin/analytics", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (res.status === 401) {
            setError(t.invalidKey);
            window.sessionStorage.removeItem(STORAGE_KEY);
            setToken("");
            return;
          }

          if (!res.ok) {
            setError(t.fetchErr);
            return;
          }

          const json = await res.json();
          setData(json.data);
          setLastUpdated(new Date());
          window.sessionStorage.setItem(STORAGE_KEY, authToken);
        } catch (err) {
          console.error(err);
          setError(t.networkErr);
        }
      });
    },
    [t],
  );

  useEffect(() => {
    if (!token) return;

    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ignore) return;
        if (res.status === 401) {
          setError(t.invalidKey);
          window.sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
          return;
        }
        if (!res.ok) {
          setError(t.fetchErr);
          return;
        }
        const json = await res.json();
        if (!ignore) {
          setData(json.data);
          setLastUpdated(new Date());
          window.sessionStorage.setItem(STORAGE_KEY, token);
        }
      } catch {
        if (!ignore) {
          setError(t.networkErr);
        }
      }
    }

    void load();
    return () => {
      ignore = true;
    };
  }, [token, t]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setToken(inputToken.trim());
    void executeFetch(inputToken.trim());
  }

  function handleLogout() {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setData(null);
    setInputToken("");
  }

  if (!data) {
    return (
      <main
        className="section-shell"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "7.5rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="glass-panel" style={{ maxWidth: 420, width: "100%", padding: "2.5rem 2rem", borderRadius: 16 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "1.75rem", display: "inline-block", marginBottom: "0.5rem" }}>🔒</span>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}>{t.portalTitle}</h1>
            <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>{t.portalDesc}</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <input
                type="password"
                placeholder={t.secretPlaceholder}
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                disabled={isPending}
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle, rgba(255,255,255,0.15))",
                  background: "var(--surface-sunken, rgba(0,0,0,0.2))",
                  color: "inherit",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            {error && <p style={{ color: "#ff6b6b", fontSize: "0.82rem", margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={isPending || !inputToken.trim()}
              className="button button-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            >
              {isPending ? t.verifying : t.accessBtn}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const hasFeedback = data.feedback_summary.total > 0;
  const upRate = hasFeedback
    ? Math.round((data.feedback_summary.up / data.feedback_summary.total) * 100)
    : 0;

  const events = data.engagement_events || {
    cv_previews: 0,
    cv_downloads: 0,
    email_copies: 0,
    command_palette: 0,
  };

  return (
    <main className="section-shell" style={{ paddingTop: "7.5rem", paddingBottom: "5rem" }}>
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <p className="eyebrow" style={{ margin: 0 }}>{t.telemetry}</p>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", marginTop: "0.25rem" }}>
            {t.title}
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: 0 }}>
              {t.lastUpdated}
              {lastUpdated.toLocaleTimeString(locale === "id" ? "id-ID" : "en-US")}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => void executeFetch(token)}
            disabled={isPending}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          >
            {isPending ? t.refreshingBtn : t.refreshBtn}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", opacity: 0.8 }}
          >
            {t.logoutBtn}
          </button>
        </div>
      </header>

      {/* KPI Overview Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>
            {t.today}
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.today}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.sessionsUnit}</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>
            {t.last7Days}
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.week}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.sessionsUnit}</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>
            {t.last30Days}
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.month}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.sessionsUnit}</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>
            {t.allMessages}
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.total_messages}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.msgsUnit}</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>
            {t.satisfaction}
          </p>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              margin: "0.5rem 0 0",
              color: hasFeedback ? (upRate >= 80 ? "#4ade80" : upRate >= 50 ? "#facc15" : "#f87171") : "inherit",
            }}
          >
            {hasFeedback ? `${upRate}%` : "—"}
          </h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
            {hasFeedback
              ? `${data.feedback_summary.up} 👍 · ${data.feedback_summary.down} 👎`
              : t.noRatings}
          </span>
        </div>
      </section>

      {/* Engagement & CV Telemetry Section */}
      <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12, marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{t.engagementTitle}</h3>
          <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.2rem 0 0" }}>{t.engagementDesc}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.cvViews}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.cv_previews}</h4>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.cvDownloads}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.cv_downloads}</h4>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.emailCopies}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.email_copies}</h4>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.cmdPalette}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.command_palette}</h4>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.roleMatcher}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.role_matcher ?? 0}</h4>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8 }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>{t.voiceBriefing}</span>
            <h4 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.3rem 0 0" }}>{events.voice_briefing ?? 0}</h4>
          </div>
        </div>
      </section>

      {/* Two Column Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Mode & Language Distribution */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1.25rem" }}>{t.breakdownTitle}</h3>

          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}>{t.modesLabel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {data.mode_distribution.map((item) => {
              const pct =
                data.overview.total_sessions > 0
                  ? Math.round((item.count / data.overview.total_sessions) * 100)
                  : 0;
              const modeKey = item.mode as keyof typeof t.modeNames;
              const modeLabel = t.modeNames[modeKey] || item.mode;
              return (
                <div key={item.mode}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    <span>{modeLabel}</span>
                    <span>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--foreground, #fff)",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}>{t.langLabel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.locale_distribution.map((item) => {
              const pct =
                data.overview.total_sessions > 0
                  ? Math.round((item.count / data.overview.total_sessions) * 100)
                  : 0;
              const langKey = item.locale as keyof typeof t.langNames;
              const langLabel = t.langNames[langKey] || item.locale.toUpperCase();
              return (
                <div key={item.locale}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    <span>{langLabel}</span>
                    <span>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--foreground, #fff)",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Token Usage & Free Tier Health */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem" }}>{t.tokenHealthTitle}</h3>

          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>{t.estToken}</span>
              <strong style={{ fontSize: "1.25rem" }}>{data.token_usage_30d.toLocaleString()} tokens</strong>
            </div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: "0.25rem 0 0" }}>{t.freeTierSafe}</p>
          </div>

          <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.75rem" }}>
            {t.peakHoursTitle}
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {data.peak_hours.length === 0 ? (
              <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>{t.noHourly}</span>
            ) : (
              data.peak_hours.map((item) => (
                <div
                  key={item.hour}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "0.35rem 0.65rem",
                    borderRadius: 6,
                    fontSize: "0.8rem",
                  }}
                >
                  <strong>{String(item.hour).padStart(2, "0")}:00 WIB</strong> · {item.count} {t.sessionsUnit}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Leads Section */}
      <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12, marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{t.leadsTitle}</h3>
            <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.2rem 0 0" }}>{t.leadsDesc}</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: 12, fontSize: "0.8rem" }}>
            {t.leadsCount(data.recent_leads.length)}
          </span>
        </div>

        {data.recent_leads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0", opacity: 0.5, fontSize: "0.85rem" }}>{t.noLeads}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {data.recent_leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: "rgba(0,0,0,0.25)",
                  padding: "1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{lead.name}</strong>
                  <small style={{ opacity: 0.5 }}>{new Date(lead.created_at).toLocaleDateString()}</small>
                </div>
                <a
                  href={`mailto:${lead.email}`}
                  style={{
                    color: "var(--foreground, #fff)",
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                    opacity: 0.9,
                  }}
                >
                  {lead.email}
                </a>
                {lead.message && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.75,
                      marginTop: "0.5rem",
                      fontStyle: "italic",
                      background: "rgba(255,255,255,0.04)",
                      padding: "0.5rem",
                      borderRadius: 4,
                    }}
                  >
                    &ldquo;{lead.message}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Questions Ranking */}
      <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12, marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>{t.topQuestionsTitle}</h3>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1rem" }}>{t.topQuestionsDesc}</p>

        {data.top_questions.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>{t.noQuestions}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {data.top_questions.map((item, idx) => (
              <div
                key={`${item.question}-${idx}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.6rem 0.85rem",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  fontSize: "0.88rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ opacity: 0.4, fontWeight: 700, fontSize: "0.8rem" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{item.question}</span>
                </div>
                <span
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: 12,
                    fontSize: "0.75rem",
                  }}
                >
                  {item.count}×
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent 20 Sessions */}
      <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>{t.recentSessionsTitle}</h3>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1rem" }}>{t.recentSessionsDesc}</p>

        {data.recent_sessions.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>{t.noSessions}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {data.recent_sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span
                      style={{
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        padding: "0.1rem 0.4rem",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.1)",
                      }}
                    >
                      {session.mode}
                    </span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>{session.locale.toUpperCase()}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                      {new Date(session.created_at).toLocaleString(locale === "id" ? "id-ID" : "en-US")}
                    </span>
                  </div>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    {session.first_question ? (
                      `"${session.first_question}"`
                    ) : (
                      <span style={{ opacity: 0.4 }}>{t.noPrompt}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
