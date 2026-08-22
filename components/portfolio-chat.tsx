"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMode, PortfolioChatMessage, PortfolioSource } from "@/lib/ai/types";
import type { Locale } from "@/lib/portfolio";

const MAX_INPUT_LENGTH = 500;

const uiCopy = {
  en: {
    button: "Ask Reyy's AI guide",
    title: "Reyy's AI Guide",
    disclosure: "Portfolio assistant · not Reyy",
    intro: "Ask about role fit, technical decisions, projects, or certificates. Answers are grounded in verified portfolio evidence.",
    modes: { recruiter: "Recruiter", technical: "Technical", explore: "Explore" },
    modeLabel: "Conversation mode",
    prompts: {
      recruiter: ["Why should we interview Reyy?", "Which project best proves end-to-end ownership?"],
      technical: ["Explain the SCOVIS architecture.", "What are the limitations of the ML projects?"],
      explore: ["Which project should I open first?", "Show Reyy's strongest certificates."],
    },
    placeholder: "Ask about Reyy's work…",
    send: "Send",
    stop: "Stop",
    clear: "New chat",
    close: "Close assistant",
    thinking: "Reviewing portfolio evidence…",
    sourceTitle: "Verified sources",
    sourceCount: (count: number) => `${count} source${count === 1 ? "" : "s"}`,
    error: "The guide could not respond. Please wait a moment and try again.",
    privacy: "Conversations may be reviewed to improve this guide. No sensitive data is collected.",
    feedbackThanks: "Thanks for feedback!",
    leadPrompt: "Recruiting or hiring? Leave a note for Reyy:",
    leadName: "Your name",
    leadEmail: "Work email",
    leadMessage: "Message or role (optional)",
    leadSubmit: "Send Note",
    leadSuccess: "✓ Note sent to Reyy. Thank you!",
    leadDismiss: "Dismiss",
  },
  id: {
    button: "Tanya AI guide Reyy",
    title: "AI Guide Reyy",
    disclosure: "Asisten portofolio · bukan Reyy",
    intro: "Tanyakan kecocokan posisi, keputusan teknis, proyek, atau sertifikat. Jawaban berpijak pada bukti portofolio yang telah diverifikasi.",
    modes: { recruiter: "Recruiter", technical: "Teknis", explore: "Jelajahi" },
    modeLabel: "Mode percakapan",
    prompts: {
      recruiter: ["Mengapa Reyy layak diundang interview?", "Proyek mana yang paling membuktikan kemampuan end-to-end?"],
      technical: ["Jelaskan arsitektur SCOVIS.", "Apa keterbatasan proyek ML Reyy?"],
      explore: ["Proyek mana yang sebaiknya saya buka dulu?", "Tampilkan sertifikat terkuat Reyy."],
    },
    placeholder: "Tanya tentang karya Reyy…",
    send: "Kirim",
    stop: "Hentikan",
    clear: "Chat baru",
    close: "Tutup asisten",
    thinking: "Meninjau bukti portofolio…",
    sourceTitle: "Sumber terverifikasi",
    sourceCount: (count: number) => `${count} sumber`,
    error: "AI guide belum dapat merespons. Tunggu sebentar lalu coba kembali.",
    privacy: "Percakapan dapat ditinjau untuk meningkatkan panduan ini. Tidak ada data sensitif yang dikumpulkan.",
    feedbackThanks: "Terima kasih atas feedback Anda!",
    leadPrompt: "Sedang merekrut? Tinggalkan kontak untuk Reyy:",
    leadName: "Nama Anda",
    leadEmail: "Email kantor / kontak",
    leadMessage: "Pesan atau posisi (opsional)",
    leadSubmit: "Kirim Pesan",
    leadSuccess: "✓ Pesan terkirim ke Reyy. Terima kasih!",
    leadDismiss: "Tutup",
  },
} as const;

function AssistantMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.75 13.9 8.1 19.25 10 13.9 11.9 12 17.25l-1.9-5.35L4.75 10l5.35-1.9L12 2.75Z" />
      <path d="m18.2 15.2.85 2.35 2.35.85-2.35.85-.85 2.35-.85-2.35-2.35-.85 2.35-.85.85-2.35Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 15.5 15 5m-7.5 0H15v7.5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m3 3 14 7-14 7 2.4-7L3 3Z" />
      <path d="M5.4 10H17" />
    </svg>
  );
}

function welcomeMessage(locale: Locale): PortfolioChatMessage {
  return {
    id: `welcome-${locale}`,
    role: "assistant",
    parts: [{ type: "text", text: uiCopy[locale].intro }],
  };
}

function displayText(text: string, role: PortfolioChatMessage["role"]) {
  if (role === "user") return text;

  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[*-]\s+/gm, "• ")
    .replace(/\s*—\s*/g, ", ")
    .trim();
}

function safeStoredMessage(value: unknown): PortfolioChatMessage | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PortfolioChatMessage>;
  if (typeof candidate.id !== "string" || (candidate.role !== "user" && candidate.role !== "assistant") || !Array.isArray(candidate.parts)) return null;

  const parts: PortfolioChatMessage["parts"] = [];
  for (const part of candidate.parts) {
    if (part.type === "text" && typeof part.text === "string" && part.text.length <= 4_000) {
      parts.push({ type: "text", text: part.text });
      continue;
    }

    if (part.type === "data-sources" && Array.isArray(part.data)) {
      const sources = part.data.filter((source): source is PortfolioSource => (
        Boolean(source) &&
        typeof source.id === "string" &&
        typeof source.title === "string" &&
        typeof source.description === "string" &&
        typeof source.href === "string" &&
        (source.href.startsWith("/") || source.href.startsWith("https://")) &&
        ["case-study", "repository", "live-product", "certificate", "profile"].includes(source.kind)
      )).slice(0, 6);
      if (sources.length > 0) parts.push({ type: "data-sources", data: sources });
    }
  }

  if (parts.length === 0) return null;
  return { id: candidate.id.slice(0, 100), role: candidate.role, parts };
}

function SourceCards({ sources, locale }: { sources: PortfolioSource[]; locale: Locale }) {
  const content = uiCopy[locale];

  return (
    <details className="portfolio-chat-sources">
      <summary>
        <span>{content.sourceTitle}</span>
        <span>{content.sourceCount(sources.length)}</span>
      </summary>
      <div>
        {sources.map((source) => (
          <a href={source.href} target={source.href.startsWith("http") ? "_blank" : undefined} rel={source.href.startsWith("http") ? "noreferrer" : undefined} key={source.id}>
            <span><strong>{source.title}</strong><small>{source.description}</small></span>
            <ArrowIcon />
          </a>
        ))}
      </div>
    </details>
  );
}

function MessageFeedback({ messageId, messageContent, locale }: { messageId: string; messageContent?: string; locale: Locale }) {
  const content = uiCopy[locale];
  const [rated, setRated] = useState<"up" | "down" | null>(null);

  function sendRating(rating: "up" | "down") {
    if (rated) return;
    setRated(rating);
    fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, messageContent, rating }),
    }).catch(() => {});
  }

  if (rated) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", opacity: 0.6, marginTop: "0.4rem" }}>
        <span>{rated === "up" ? "👍" : "👎"}</span>
        <span>{content.feedbackThanks}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.4rem", opacity: 0.7 }}>
      <button
        type="button"
        onClick={() => sendRating("up")}
        title="Helpful response"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontSize: "0.8rem", borderRadius: 4 }}
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => sendRating("down")}
        title="Could be better"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontSize: "0.8rem", borderRadius: 4 }}
      >
        👎
      </button>
    </div>
  );
}

function RecruiterLeadCapture({ locale, onDismiss }: { locale: Locale; onDismiss: () => void }) {
  const content = uiCopy[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: 8, padding: "0.75rem", fontSize: "0.82rem", color: "#4ade80", margin: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{content.leadSuccess}</span>
        <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.8 }}>×</button>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.75rem", margin: "0.5rem 0.75rem", fontSize: "0.82rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <strong style={{ fontSize: "0.8rem" }}>{content.leadPrompt}</strong>
        <button type="button" onClick={onDismiss} style={{ background: "none", border: "none", opacity: 0.5, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <input
            type="text"
            placeholder={content.leadName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: 4, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", color: "inherit", fontSize: "0.8rem" }}
          />
          <input
            type="email"
            placeholder={content.leadEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: 4, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", color: "inherit", fontSize: "0.8rem" }}
          />
        </div>
        <input
          type="text"
          placeholder={content.leadMessage}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: 4, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", color: "inherit", fontSize: "0.8rem" }}
        />
        <button
          type="submit"
          disabled={sending || !name.trim() || !email.trim()}
          style={{ padding: "0.4rem 0.8rem", borderRadius: 4, background: "var(--foreground, #fff)", color: "var(--background, #000)", border: "none", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", marginTop: "0.2rem" }}
        >
          {sending ? "Sending..." : content.leadSubmit}
        </button>
      </form>
    </div>
  );
}

export function PortfolioChat({ locale }: { locale: Locale }) {
  const content = uiCopy[locale];
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("recruiter");
  const [input, setInput] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLElement>(null);
  const storageKey = `reyy-portfolio-chat-${locale}`;
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", credentials: "same-origin" }),
    [],
  );
  const initialMessages = useMemo(() => [welcomeMessage(locale)], [locale]);
  const { messages, sendMessage, status, error, stop, setMessages } = useChat<PortfolioChatMessage>({
    id: `reyy-portfolio-assistant-${locale}`,
    messages: initialMessages,
    transport,
    throttle: 35,
  });
  const previousStatusRef = useRef(status);

  const busy = status === "submitted" || status === "streaming";
  const showPrompts = messages.length <= 1;
  const showLeadPrompt = !leadDismissed && messages.filter((m) => m.role === "user").length >= 2;
  const latestAssistantId = [...messages].reverse().find((message) => message.role === "assistant")?.id;

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored && stored.length <= 50_000) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const restored = parsed.map(safeStoredMessage).filter((message): message is PortfolioChatMessage => message !== null).slice(-8);
          if (restored.length > 0) setMessages(restored);
        }
      }
    } catch {
      window.sessionStorage.removeItem(storageKey);
    } finally {
      setSessionReady(true);
    }
  }, [setMessages, storageKey]);

  useEffect(() => {
    if (!sessionReady) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-8)));
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, [messages, sessionReady, storageKey]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      previousStatusRef.current = status;
      return;
    }

    const wasBusy = previousStatusRef.current === "submitted" || previousStatusRef.current === "streaming";
    if (status === "submitted" || status === "streaming") {
      messageEndRef.current?.scrollIntoView({ behavior: status === "streaming" ? "auto" : "smooth" });
    } else if (wasBusy) {
      latestAssistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    previousStatusRef.current = status;
  }, [messages, open, status]);

  function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy || trimmed.length > MAX_INPUT_LENGTH) return;
    void sendMessage({ text: trimmed }, { body: { locale, mode } });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitQuestion(input);
    }
  }

  function resetChat() {
    if (busy) stop();
    const resetMessages = [welcomeMessage(locale)];
    setMessages(resetMessages);
    window.sessionStorage.removeItem(storageKey);
    setInput("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className={`portfolio-chat-root${open ? " is-open" : ""}`}>
      {!open && (
        <button className="portfolio-chat-launcher glass-panel" type="button" onClick={() => setOpen(true)} aria-label={content.button} aria-haspopup="dialog">
          <span className="portfolio-chat-launcher-icon"><AssistantMark /></span>
          <span className="portfolio-chat-launcher-label">AI GUIDE</span>
          <span className="portfolio-chat-launcher-status" aria-hidden="true" />
        </button>
      )}

      {open && (
        <section className="portfolio-chat-panel glass-panel" role="dialog" aria-modal="false" aria-labelledby="portfolio-chat-title">
          <header className="portfolio-chat-header">
            <div className="portfolio-chat-identity">
              <span><AssistantMark /></span>
              <div><h2 id="portfolio-chat-title">{content.title}</h2><p>{content.disclosure}</p></div>
            </div>
            <div className="portfolio-chat-header-actions">
              <button type="button" onClick={resetChat} title={content.clear}>{content.clear}</button>
              <button className="portfolio-chat-close" type="button" onClick={() => setOpen(false)} aria-label={content.close}>×</button>
            </div>
          </header>

          <div className="portfolio-chat-mode" role="tablist" aria-label={content.modeLabel}>
            {(Object.keys(content.modes) as ChatMode[]).map((item) => (
              <button key={item} type="button" role="tab" aria-selected={mode === item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
                {content.modes[item]}
              </button>
            ))}
          </div>

          <div className="portfolio-chat-messages" aria-live="polite" aria-busy={busy}>
            {messages.map((message, idx) => {
              const textParts = message.parts.filter((part) => part.type === "text");
              const sourceParts = message.parts.filter((part) => part.type === "data-sources");
              const isAssistant = message.role === "assistant";
              const isWelcome = idx === 0;
              const hasText = textParts.some((part) => part.text.trim().length > 0);
              const isStreamingThis = busy && message.id === latestAssistantId;

              return (
                <article
                  className={`portfolio-chat-message ${message.role}`}
                  key={message.id}
                  ref={message.id === latestAssistantId ? latestAssistantRef : undefined}
                >
                  <span className="portfolio-chat-role">{message.role === "user" ? "YOU" : "REYY.AI"}</span>
                  <div className="portfolio-chat-bubble">
                    {isAssistant && !hasText && isStreamingThis && (
                      <div className="portfolio-chat-thinking" role="status" style={{ margin: "0.2rem 0 0.5rem" }}>
                        <span /><span /><span />
                        <p>{content.thinking}</p>
                      </div>
                    )}
                    {textParts.map((part, index) => <p key={`${message.id}-text-${index}`}>{displayText(part.text, message.role)}</p>)}
                    {sourceParts.map((part, index) => <SourceCards sources={part.data} locale={locale} key={`${message.id}-sources-${index}`} />)}
                    {isAssistant && !isWelcome && hasText && !isStreamingThis && (
                      <MessageFeedback
                        messageId={message.id}
                        messageContent={textParts.map((p) => p.text).join(" ")}
                        locale={locale}
                      />
                    )}
                  </div>
                </article>
              );
            })}

            {(status === "submitted" || (busy && messages.at(-1)?.role === "user")) && (
              <div className="portfolio-chat-thinking" role="status"><span /><span /><span /><p>{content.thinking}</p></div>
            )}

            {error && <p className="portfolio-chat-error" role="alert">{content.error}</p>}
            <div ref={messageEndRef} />
          </div>

          {showLeadPrompt && (
            <RecruiterLeadCapture locale={locale} onDismiss={() => setLeadDismissed(true)} />
          )}

          {showPrompts && (
            <div className="portfolio-chat-prompts" aria-label={locale === "id" ? "Pertanyaan contoh" : "Suggested questions"}>
              {content.prompts[mode].map((prompt) => (
                <button type="button" onClick={() => submitQuestion(prompt)} disabled={busy} key={prompt}>{prompt}<span aria-hidden="true">↗</span></button>
              ))}
            </div>
          )}

          <form className="portfolio-chat-composer" onSubmit={handleSubmit}>
            <div>
              <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleInputKeyDown} placeholder={content.placeholder} maxLength={MAX_INPUT_LENGTH} rows={2} disabled={busy} aria-label={content.placeholder} />
              <span>{input.length}/{MAX_INPUT_LENGTH}</span>
            </div>
            {busy ? (
              <button className="portfolio-chat-send" type="button" onClick={stop} aria-label={content.stop}><span className="portfolio-chat-stop-icon" /> <span className="sr-only">{content.stop}</span></button>
            ) : (
              <button className="portfolio-chat-send" type="submit" disabled={!input.trim()} aria-label={content.send}><SendIcon /></button>
            )}
          </form>
          <p className="portfolio-chat-privacy">{content.privacy}</p>
        </section>
      )}
    </div>
  );
}
