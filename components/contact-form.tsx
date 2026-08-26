"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";
import { showToast } from "./toast-notification";

const copy = {
  en: {
    badge: "Direct Communication",
    title: "Send a Direct Message",
    subtitle: "Recruiter, hiring manager, or technical collaborator? Leave your details below for an instant notification and fast response.",
    nameLabel: "Your Name",
    namePlaceholder: "e.g. Sarah Jenkins",
    emailLabel: "Work / Contact Email",
    emailPlaceholder: "e.g. sarah@company.com",
    roleLabel: "Company / Target Role",
    rolePlaceholder: "e.g. Tech Lead @ Startup, AI Recruiter (Optional)",
    messageLabel: "Message",
    messagePlaceholder: "Brief overview of the role, project, or inquiry…",
    submitBtn: "Send Message ✉️",
    sendingBtn: "Sending Message…",
    successTitle: "Message Delivered Successfully!",
    successSubtitle: "Thank you for reaching out. A real-time alert was sent to Reyy's personal inbox, and he will reply shortly.",
    sendAnother: "Send another message",
    errorRequired: "Please fill in both your name and email address.",
    errorEmail: "Please provide a valid email address.",
    errorFailed: "Failed to send message. Please try again or copy the email directly.",
    toastSuccess: "Message sent directly to Reyy!",
  },
  id: {
    badge: "Komunikasi Langsung",
    title: "Kirim Pesan Langsung",
    subtitle: "Rekruter, hiring manager, atau rekan kolaborasi teknis? Tinggalkan detail Anda di bawah untuk notifikasi instan dan respon cepat.",
    nameLabel: "Nama Anda",
    namePlaceholder: "contoh: Sarah Jenkins",
    emailLabel: "Email Kantor / Kontak",
    emailPlaceholder: "contoh: sarah@perusahaan.com",
    roleLabel: "Perusahaan / Posisi yang Ditawarkan",
    rolePlaceholder: "contoh: Tech Lead @ Startup, AI Recruiter (Opsional)",
    messageLabel: "Pesan",
    messagePlaceholder: "Gambaran singkat mengenai lowongan, proyek, atau keperluan…",
    submitBtn: "Kirim Pesan ✉️",
    sendingBtn: "Mengirim Pesan…",
    successTitle: "Pesan Berhasil Terkirim!",
    successSubtitle: "Terima kasih telah menghubungi. Notifikasi real-time telah dikirimkan ke inbox pribadi Reyy, dan beliau akan segera membalas.",
    sendAnother: "Kirim pesan lainnya",
    errorRequired: "Mohon lengkapi nama dan alamat email Anda.",
    errorEmail: "Mohon masukkan alamat email yang valid.",
    errorFailed: "Gagal mengirim pesan. Silakan coba lagi atau salin email secara langsung.",
    toastSuccess: "Pesan berhasil terkirim langsung ke Reyy!",
  },
} as const;

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleOrOrg, setRoleOrOrg] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot detection
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    if (!name.trim() || !email.trim()) {
      setErrorMessage(t.errorRequired);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage(t.errorEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = roleOrOrg.trim()
        ? `[Role/Org: ${roleOrOrg.trim()}]\n\n${message.trim()}`
        : message.trim();

      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: fullMessage || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit lead");
      }

      setIsSuccess(true);
      showToast(t.toastSuccess, "✉️");
    } catch {
      setErrorMessage(t.errorFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setName("");
    setEmail("");
    setRoleOrOrg("");
    setMessage("");
    setIsSuccess(false);
    setErrorMessage(null);
  }

  if (isSuccess) {
    return (
      <div
        className="glass-panel"
        style={{
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          maxWidth: "680px",
          margin: "2rem auto 0",
          border: "1px solid #4ade80",
          background: "var(--surface)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          animation: "fadeIn 250ms ease-out",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(74, 222, 128, 0.15)",
            color: "#4ade80",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            fontWeight: 700,
            margin: "0 auto 1.25rem",
            border: "1px solid rgba(74, 222, 128, 0.4)",
          }}
        >
          ✓
        </div>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)" }}>
          {t.successTitle}
        </h3>
        <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
          {t.successSubtitle}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="button button-secondary"
          style={{ fontSize: "0.88rem", padding: "0.65rem 1.4rem", cursor: "pointer" }}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "2.25rem 2rem",
        maxWidth: "680px",
        margin: "2rem auto 0",
        border: "1px solid var(--line-strong)",
        background: "var(--surface)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ marginBottom: "1.75rem" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#4ade80",
            display: "inline-block",
            marginBottom: "0.4rem",
          }}
        >
          ● {t.badge}
        </span>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.4rem", color: "var(--foreground)" }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: 0, lineHeight: 1.55 }}>
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Anti-spam honeypot - hidden from real visitors */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website-trap">Website</label>
          <input
            id="website-trap"
            type="text"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* 2-Column Row for Name & Email */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              htmlFor="contact-name"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "0.45rem",
                color: "var(--foreground)",
              }}
            >
              {t.nameLabel} <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              maxLength={100}
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem 0.95rem",
                borderRadius: "10px",
                border: "1px solid var(--line-strong)",
                background: "var(--surface-raised)",
                color: "var(--foreground)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 150ms ease",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "0.45rem",
                color: "var(--foreground)",
              }}
            >
              {t.emailLabel} <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={120}
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem 0.95rem",
                borderRadius: "10px",
                border: "1px solid var(--line-strong)",
                background: "var(--surface-raised)",
                color: "var(--foreground)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 150ms ease",
              }}
            />
          </div>
        </div>

        {/* Role / Organization Input */}
        <div>
          <label
            htmlFor="contact-role"
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "0.45rem",
              color: "var(--foreground)",
            }}
          >
            {t.roleLabel}
          </label>
          <input
            id="contact-role"
            type="text"
            maxLength={120}
            placeholder={t.rolePlaceholder}
            value={roleOrOrg}
            onChange={(e) => setRoleOrOrg(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem 0.95rem",
              borderRadius: "10px",
              border: "1px solid var(--line-strong)",
              background: "var(--surface-raised)",
              color: "var(--foreground)",
              fontSize: "0.9rem",
              outline: "none",
              transition: "all 150ms ease",
            }}
          />
        </div>

        {/* Message Textarea */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
            <label
              htmlFor="contact-message"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              {t.messageLabel}
            </label>
            <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{message.length} / 500</span>
          </div>
          <textarea
            id="contact-message"
            rows={4}
            maxLength={500}
            placeholder={t.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem 0.95rem",
              borderRadius: "10px",
              border: "1px solid var(--line-strong)",
              background: "var(--surface-raised)",
              color: "var(--foreground)",
              fontSize: "0.9rem",
              lineHeight: 1.55,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              transition: "all 150ms ease",
            }}
          />
        </div>

        {errorMessage && (
          <p style={{ color: "#ef4444", fontSize: "0.84rem", margin: "0.2rem 0 0", fontWeight: 500 }}>
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !email.trim()}
          className="button button-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "0.85rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: isSubmitting || !name.trim() || !email.trim() ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
          }}
        >
          {isSubmitting ? t.sendingBtn : t.submitBtn}
        </button>
      </form>
    </div>
  );
}
