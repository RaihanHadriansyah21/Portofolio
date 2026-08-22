"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { profile } from "@/lib/portfolio";
import { showToast } from "./toast-notification";

type RoleProfile = {
  id: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  coreTech: string[];
  matchedProjects: { slug: string; title: string; highlight: Record<Locale, string> }[];
  matchedCertificates: { title: string; issuer: string }[];
};

const roleProfiles: RoleProfile[] = [
  {
    id: "ai-engineer",
    title: { en: "AI / Machine Learning Engineer", id: "AI / Machine Learning Engineer" },
    subtitle: {
      en: "Specializing in applied deep learning, asynchronous model serving, and CV/NLP pipelines.",
      id: "Spesialisasi pada deep learning terapan, serving model asinkron, dan pipeline Computer Vision.",
    },
    coreTech: ["TensorFlow", "FastAPI", "Redis/RQ", "Python", "Supabase", "Computer Vision", "Docker"],
    matchedProjects: [
      {
        slug: "scovis",
        title: "SCOVIS",
        highlight: {
          en: "72 cached neural network models with Redis/RQ worker queue.",
          id: "72 model neural network ter-cache dengan antrean worker Redis/RQ.",
        },
      },
      {
        slug: "dermascan",
        title: "DermaScan",
        highlight: {
          en: "TFLite skin lesion classification with FastAPI and Grad-CAM visualization.",
          id: "Klasifikasi lesi kulit TFLite dengan FastAPI dan visualisasi Grad-CAM.",
        },
      },
    ],
    matchedCertificates: [
      { title: "Coding Camp 2026 - AI Engineer", issuer: "DBS Foundation × Dicoding" },
      { title: "Membangun Proyek Deep Learning Tingkat Mahir", issuer: "Dicoding Indonesia" },
    ],
  },
  {
    id: "fullstack",
    title: { en: "Full-Stack Developer", id: "Full-Stack Developer" },
    subtitle: {
      en: "Connecting modern Next.js/React frontends with robust Python/PostgreSQL backends.",
      id: "Menghubungkan frontend modern Next.js/React dengan backend Python/PostgreSQL yang tangguh.",
    },
    coreTech: ["Next.js", "React", "TypeScript", "FastAPI", "PostgreSQL", "Supabase", "Tailwind CSS"],
    matchedProjects: [
      {
        slug: "scovis",
        title: "SCOVIS",
        highlight: {
          en: "Multi-role student/lecturer workflow with Next.js 16 & Supabase RLS.",
          id: "Alur multi-peran mahasiswa/dosen dengan Next.js 16 & Supabase RLS.",
        },
      },
      {
        slug: "e-mathtoco",
        title: "E-MathToco",
        highlight: {
          en: "Interactive mathematics learning platform with game mechanics.",
          id: "Platform pembelajaran matematika interaktif dengan mekanik game.",
        },
      },
    ],
    matchedCertificates: [
      { title: "Belajar Dasar Pemrograman Web", issuer: "Dicoding Indonesia" },
      { title: "Belajar Membuat Aplikasi Web dengan React", issuer: "Dicoding Indonesia" },
    ],
  },
  {
    id: "backend-api",
    title: { en: "Backend & Systems Engineer", id: "Backend & Systems Engineer" },
    subtitle: {
      en: "Designing scalable APIs, background job workers, database contracts, and RLS security.",
      id: "Merancang REST API scalable, worker antrean job, kontrak database, dan keamanan RLS.",
    },
    coreTech: ["FastAPI", "PostgreSQL", "Redis/RQ", "Supabase", "Python", "Docker", "REST API"],
    matchedProjects: [
      {
        slug: "scovis",
        title: "SCOVIS Backend",
        highlight: {
          en: "31 FastAPI routes, worker locks, and audited SQL schema.",
          id: "31 route FastAPI, lock worker antrean, dan schema SQL teruji.",
        },
      },
      {
        slug: "dermascan",
        title: "DermaScan API",
        highlight: {
          en: "Fast inference endpoints deployed on containerized Railway infrastructure.",
          id: "Endpoint inferensi cepat yang dideploy di infrastruktur container Railway.",
        },
      },
    ],
    matchedCertificates: [
      { title: "Belajar Penerapan Data Science dengan Microsoft Fabric", issuer: "Microsoft" },
      { title: "Belajar Dasar Git dengan GitHub", issuer: "Dicoding Indonesia" },
    ],
  },
  {
    id: "ai-product",
    title: { en: "AI Product Engineer", id: "AI Product Engineer" },
    subtitle: {
      en: "Human-in-the-loop product delivery, grounded AI assistants, and enterprise UX.",
      id: "Penyusunan produk human-in-the-loop, asisten AI berdasar fakta, dan UX enterprise.",
    },
    coreTech: ["Next.js", "FastAPI", "Gemini API", "Supabase", "Human-in-the-Loop", "TypeScript"],
    matchedProjects: [
      {
        slug: "scovis",
        title: "SCOVIS AI Assistant",
        highlight: {
          en: "Lecturer decision invariant: AI recommendations remain strictly editable.",
          id: "Invariant dosen: Rekomendasi AI tetap dapat diubah sepenuhnya.",
        },
      },
    ],
    matchedCertificates: [
      { title: "Merancang Percakapan Cerdas di Azure AI Foundry", issuer: "Microsoft" },
      { title: "Dicoding Membangun Aplikasi Gen AI", issuer: "Dicoding Indonesia" },
    ],
  },
];

const allSkills = [
  "Next.js",
  "React",
  "TypeScript",
  "FastAPI",
  "Python",
  "TensorFlow",
  "PyTorch",
  "Supabase",
  "PostgreSQL",
  "Redis/RQ",
  "Docker",
  "Computer Vision",
  "Gemini API",
];

const copy = {
  en: {
    eyebrow: "Recruiter Fast-Track",
    title: "Assess Reyy's Fit for Your Open Role",
    subtitle: "Select your target position and required technologies to calculate the instant match score with verified project and certificate citations.",
    selectRole: "Target Engineering Role",
    selectTech: "Your Company's Tech Stack Requirements",
    matchScore: "Match Score",
    proofProjects: "Verified Project Implementations",
    proofCertificates: "Relevant Verified Certificates",
    inviteCta: "✉️ Schedule Interview / Connect",
    invitedToast: "Opening contact dialog with Reyy…",
  },
  id: {
    eyebrow: "Jalur Cepat Rekruter",
    title: "Uji Kecocokan Reyy dengan Posisi Perusahaan Anda",
    subtitle: "Pilih posisi yang Anda cari dan centang kebutuhan teknologi untuk melihat skor kecocokan instan beserta bukti proyek dan sertifikat yang terverifikasi.",
    selectRole: "Posisi Engineering yang Dicari",
    selectTech: "Kebutuhan Tech Stack Perusahaan",
    matchScore: "Skor Kecocokan",
    proofProjects: "Bukti Implementasi Proyek",
    proofCertificates: "Sertifikat Terverifikasi Relevan",
    inviteCta: "✉️ Hubungi / Jadwalkan Interview",
    invitedToast: "Membuka dialog kontak dengan Reyy…",
  },
};

export function RoleFitMatcher({ locale }: { locale: Locale }) {
  const [selectedRole, setSelectedRole] = useState<string>("ai-engineer");
  const [selectedTech, setSelectedTech] = useState<string[]>([
    "FastAPI",
    "TensorFlow",
    "Python",
    "Next.js",
    "PostgreSQL",
  ]);

  const t = copy[locale];
  const activeRole = roleProfiles.find((r) => r.id === selectedRole) || roleProfiles[0];

  function toggleTech(tech: string) {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((item) => item !== tech) : [...prev, tech]
    );
  }

  // Calculate Match Score based on tech overlaps
  const matchPercentage = useMemo(() => {
    if (selectedTech.length === 0) return 60;
    const matches = selectedTech.filter((t) => activeRole.coreTech.includes(t)).length;
    const base = Math.round((matches / selectedTech.length) * 45);
    return Math.min(98, Math.max(72, 55 + base));
  }, [selectedTech, activeRole]);

  function handleInvite() {
    fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "role_matcher",
        metadata: { role: selectedRole, score: matchPercentage, tech: selectedTech, locale },
      }),
    }).catch(() => {});

    showToast(t.invitedToast, "✉️");

    // Open chat launcher or mailto
    const chatBtn = document.querySelector(".portfolio-chat-launcher") as HTMLButtonElement;
    if (chatBtn) {
      chatBtn.click();
    } else {
      window.location.href = `mailto:${profile.email}?subject=Interview%20Inquiry%20for%20${encodeURIComponent(activeRole.title[locale])}`;
    }
  }

  return (
    <section
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "2rem",
        margin: "3rem 0",
        border: "1px solid rgba(255, 255, 255, 0.14)",
      }}
    >
      {/* Top Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ● {t.eyebrow}
        </span>
        <h2 style={{ fontSize: "1.45rem", fontWeight: 700, margin: "0.3rem 0 0.4rem" }}>
          {t.title}
        </h2>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, maxWidth: "48rem", lineHeight: 1.5 }}>
          {t.subtitle}
        </p>
      </div>

      {/* Role Picker Pills */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.78rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
          {t.selectRole}
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {roleProfiles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "999px",
                border: selectedRole === role.id
                  ? "1px solid var(--foreground, #fff)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                background: selectedRole === role.id
                  ? "var(--foreground, #fff)"
                  : "rgba(0, 0, 0, 0.2)",
                color: selectedRole === role.id
                  ? "var(--background, #000)"
                  : "inherit",
                fontSize: "0.82rem",
                fontWeight: selectedRole === role.id ? 700 : 500,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              {role.title[locale]}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.82rem", opacity: 0.8, marginTop: "0.6rem", fontStyle: "italic" }}>
          &ldquo;{activeRole.subtitle[locale]}&rdquo;
        </p>
      </div>

      {/* Tech Stack Checkboxes */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.78rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
          {t.selectTech}
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {allSkills.map((skill) => {
            const isSelected = selectedTech.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleTech(skill)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  border: isSelected
                    ? "1px solid #4ade80"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isSelected
                    ? "rgba(74, 222, 128, 0.15)"
                    : "rgba(255, 255, 255, 0.03)",
                  color: isSelected ? "#4ade80" : "inherit",
                  fontSize: "0.78rem",
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                {isSelected ? "✓ " : "+ "}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Match Results Card */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.35)",
          borderRadius: "12px",
          padding: "1.5rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        {/* Left: Score Badge */}
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {t.matchScore}
          </span>
          <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "#4ade80", letterSpacing: "-0.04em", margin: "0.2rem 0" }}>
            {matchPercentage}%
          </div>
          <span style={{ fontSize: "0.8rem", opacity: 0.8, color: "#4ade80", fontWeight: 600 }}>
            ● Highly Recommended Candidate
          </span>

          <div style={{ marginTop: "1.25rem" }}>
            <button
              type="button"
              onClick={handleInvite}
              className="button button-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "0.7rem 1.2rem" }}
            >
              {t.inviteCta}
            </button>
          </div>
        </div>

        {/* Right: Concrete Proof Citations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <strong style={{ fontSize: "0.82rem", opacity: 0.8, display: "block", marginBottom: "0.4rem" }}>
              📁 {t.proofProjects}
            </strong>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {activeRole.matchedProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/projects/${p.slug}`}
                  style={{
                    display: "block",
                    padding: "0.55rem 0.8rem",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "inherit",
                    textDecoration: "none",
                    fontSize: "0.8rem",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <strong style={{ color: "var(--foreground, #fff)" }}>{p.title} ↗</strong> ·{" "}
                  <span style={{ opacity: 0.75 }}>{p.highlight[locale]}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <strong style={{ fontSize: "0.82rem", opacity: 0.8, display: "block", marginBottom: "0.4rem" }}>
              📜 {t.proofCertificates}
            </strong>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {activeRole.matchedCertificates.map((c) => (
                <div
                  key={c.title}
                  style={{
                    fontSize: "0.78rem",
                    opacity: 0.75,
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  ✓ <strong>{c.title}</strong> ({c.issuer})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
