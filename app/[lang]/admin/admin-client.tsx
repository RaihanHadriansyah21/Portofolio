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
};

const STORAGE_KEY = "reyy_admin_auth_token";

export function AdminDashboardClient({ locale }: { locale: Locale }) {
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) || "" : "",
  );
  const [inputToken, setInputToken] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const executeFetch = useCallback(async (authToken: string) => {
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
          setError(locale === "id" ? "Password salah." : "Invalid credentials.");
          window.sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
          return;
        }

        if (!res.ok) {
          setError(locale === "id" ? "Gagal memuat data analytics." : "Failed to load analytics data.");
          return;
        }

        const json = await res.json();
        setData(json.data);
        setLastUpdated(new Date());
        window.sessionStorage.setItem(STORAGE_KEY, authToken);
      } catch (err) {
        console.error(err);
        setError(locale === "id" ? "Terjadi kesalahan jaringan." : "Network error occurred.");
      }
    });
  }, [locale]);

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
          setError(locale === "id" ? "Password salah." : "Invalid credentials.");
          window.sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
          return;
        }
        if (!res.ok) {
          setError(locale === "id" ? "Gagal memuat data analytics." : "Failed to load analytics data.");
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
          setError(locale === "id" ? "Terjadi kesalahan jaringan." : "Network error occurred.");
        }
      }
    }

    void load();
    return () => {
      ignore = true;
    };
  }, [token, locale]);

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
      <main className="section-shell" style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "6.5rem", paddingBottom: "4rem" }}>
        <div className="glass-panel" style={{ maxWidth: 420, width: "100%", padding: "2.5rem 2rem", borderRadius: 16 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "1.75rem", display: "inline-block", marginBottom: "0.5rem" }}>🔒</span>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {locale === "id" ? "Portal Analytics Privat" : "Private Analytics Portal"}
            </h1>
            <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
              {locale === "id" ? "Masukkan secret key untuk mengakses statistik bot." : "Enter secret key to access bot intelligence."}
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <input
                type="password"
                placeholder={locale === "id" ? "Admin Secret Key..." : "Admin Secret Key..."}
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

            {error && (
              <p style={{ color: "#ff6b6b", fontSize: "0.82rem", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !inputToken.trim()}
              className="button button-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            >
              {isPending ? (locale === "id" ? "Memverifikasi..." : "Verifying...") : (locale === "id" ? "Buka Dashboard" : "Access Dashboard")}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const upRate = data.feedback_summary.total > 0
    ? Math.round((data.feedback_summary.up / data.feedback_summary.total) * 100)
    : 0;

  return (
    <main className="section-shell" style={{ paddingTop: "6.5rem", paddingBottom: "5rem" }}>
      {/* Top Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <p className="eyebrow" style={{ margin: 0 }}>LIVE TELEMETRY</p>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", marginTop: "0.25rem" }}>
            {locale === "id" ? "Dashboard AI Guide Reyy" : "Reyy's AI Guide Intelligence"}
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: 0 }}>
              {locale === "id" ? "Pembaruan terakhir: " : "Last updated: "}
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
            {isPending ? "⟳ Refreshing..." : "⟳ Refresh"}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", opacity: 0.8 }}
          >
            {locale === "id" ? "Keluar" : "Log out"}
          </button>
        </div>
      </header>

      {/* KPI Overview Grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>TODAY</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.today}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>sessions</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>LAST 7 DAYS</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.week}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>sessions</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>LAST 30 DAYS</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.overview.month}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>sessions</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>ALL TIME MESSAGES</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0" }}>{data.total_messages}</h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>user & bot msgs</span>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, margin: 0, textTransform: "uppercase" }}>SATISFACTION</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0", color: data.feedback_summary.total > 0 && upRate >= 80 ? "#4ade80" : "inherit" }}>
            {data.feedback_summary.total > 0 ? `${upRate}%` : "—"}
          </h2>
          <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
            {data.feedback_summary.total > 0
              ? `${data.feedback_summary.up} 👍 · ${data.feedback_summary.down} 👎`
              : (locale === "id" ? "Belum ada rating" : "No ratings yet")}
          </span>
        </div>
      </section>

      {/* Two Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Mode & Language Distribution */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1.25rem" }}>
            {locale === "id" ? "Distribusi Mode & Bahasa" : "Mode & Language Breakdown"}
          </h3>

          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}>Conversation Modes</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {data.mode_distribution.map((item) => {
              const pct = data.overview.total_sessions > 0
                ? Math.round((item.count / data.overview.total_sessions) * 100)
                : 0;
              return (
                <div key={item.mode}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    <span style={{ textTransform: "capitalize" }}>{item.mode}</span>
                    <span>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--foreground, #fff)", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}>Language Preference</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.locale_distribution.map((item) => {
              const pct = data.overview.total_sessions > 0
                ? Math.round((item.count / data.overview.total_sessions) * 100)
                : 0;
              return (
                <div key={item.locale}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    <span>{item.locale === "id" ? "Bahasa Indonesia (ID)" : "English (EN)"}</span>
                    <span>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--foreground, #fff)", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Token Usage & Free Tier Health */}
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem" }}>
            {locale === "id" ? "Kesehatan Kuota & Token" : "Token Health & Gemini Free Tier"}
          </h3>

          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>Estimated 30d Token Consumption</span>
              <strong style={{ fontSize: "1.25rem" }}>{data.token_usage_30d.toLocaleString()} tokens</strong>
            </div>
            <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: "0.25rem 0 0" }}>
              Free Tier limit: 1,000,000 tokens/min & 1,500 requests/day. Status: <span style={{ color: "#4ade80" }}>100% Free Tier Safe</span>.
            </p>
          </div>

          <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.75rem" }}>
            {locale === "id" ? "Jam Puncak Aktivitas (WIB)" : "Peak Activity Hours (WIB / GMT+7)"}
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {data.peak_hours.length === 0 ? (
              <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>No hourly telemetry yet</span>
            ) : (
              data.peak_hours.map((item) => (
                <div key={item.hour} style={{ background: "rgba(255,255,255,0.08)", padding: "0.35rem 0.65rem", borderRadius: 6, fontSize: "0.8rem" }}>
                  <strong>{String(item.hour).padStart(2, "0")}:00 WIB</strong> · {item.count} {locale === "id" ? "sesi" : "chats"}
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
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
              💼 {locale === "id" ? "Kontak Rekruter / Leads Masuk" : "Recruiter Contacts & Leads"}
            </h3>
            <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.2rem 0 0" }}>
              {locale === "id" ? "Kontak yang ditinggalkan pengunjung setelah mengobrol dengan bot." : "Contacts left by visitors after chatting with the AI."}
            </p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: 12, fontSize: "0.8rem" }}>
            {data.recent_leads.length} leads
          </span>
        </div>

        {data.recent_leads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0", opacity: 0.5, fontSize: "0.85rem" }}>
            {locale === "id" ? "Belum ada rekruter yang meninggalkan kontak." : "No recruiter leads submitted yet."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {data.recent_leads.map((lead) => (
              <div key={lead.id} style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{lead.name}</strong>
                  <small style={{ opacity: 0.5 }}>{new Date(lead.created_at).toLocaleDateString()}</small>
                </div>
                <a href={`mailto:${lead.email}`} style={{ color: "var(--foreground, #fff)", fontSize: "0.85rem", textDecoration: "underline", opacity: 0.9 }}>
                  {lead.email}
                </a>
                {lead.message && (
                  <p style={{ fontSize: "0.85rem", opacity: 0.75, marginTop: "0.5rem", fontStyle: "italic", background: "rgba(255,255,255,0.04)", padding: "0.5rem", borderRadius: 4 }}>
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
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          🔥 {locale === "id" ? "Pertanyaan Terpopuler" : "Top Inquired Questions"}
        </h3>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1rem" }}>
          {locale === "id" ? "Gunakan wawasan ini untuk memperkuat CV, portofolio, atau persiapan interview." : "Use these insights to prepare for technical and cultural interview questions."}
        </p>

        {data.top_questions.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>No question history yet.</p>
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
                  <span style={{ opacity: 0.4, fontWeight: 700, fontSize: "0.8rem" }}>{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item.question}</span>
                </div>
                <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.15rem 0.5rem", borderRadius: 12, fontSize: "0.75rem" }}>
                  {item.count}×
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent 20 Sessions */}
      <section className="glass-panel" style={{ padding: "1.5rem", borderRadius: 12 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          🕒 {locale === "id" ? "Sesi Percakapan Terbaru" : "Recent Conversation Sessions"}
        </h3>
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1rem" }}>
          {locale === "id" ? "Daftar 20 percakapan pengunjung terakhir." : "Latest 20 recorded visitor sessions."}
        </p>

        {data.recent_sessions.length === 0 ? (
          <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>No recorded sessions yet.</p>
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
                    <span style={{ textTransform: "uppercase", fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: 4, background: "rgba(255,255,255,0.1)" }}>
                      {session.mode}
                    </span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>{session.locale.toUpperCase()}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                      {new Date(session.created_at).toLocaleString(locale === "id" ? "id-ID" : "en-US")}
                    </span>
                  </div>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    {session.first_question ? `"${session.first_question}"` : <span style={{ opacity: 0.4 }}>No prompt text</span>}
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
