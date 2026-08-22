"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";

type ArchitectureLayer = {
  id: string;
  step: string;
  title: Record<Locale, string>;
  role: Record<Locale, string>;
  tech: string[];
  description: Record<Locale, string>;
  safeguard: Record<Locale, string>;
  payloadSample?: string;
};

const scovisLayers: ArchitectureLayer[] = [
  {
    id: "product",
    step: "01",
    title: { en: "Product Surface", id: "Antarmuka Produk" },
    role: { en: "Multi-Role Web Application", id: "Aplikasi Web Multi-Peran" },
    tech: ["Next.js 16", "React 19", "TypeScript", "CSS Glassmorphism"],
    description: {
      en: "Provides specialized workflows for students (QR enroll, 24-section answer crop/upload, result tracking), lecturers (batch scoring, override, comments), and administrators.",
      id: "Menyediakan alur kerja khusus untuk mahasiswa (join kelas via QR/kode, crop & upload 24 bagian jawaban), dosen (batch scoring AI, override nilai, komentar), dan admin.",
    },
    safeguard: {
      en: "Role-based client routing, strict type safety, and real-time state feedback for long-running batch prediction jobs.",
      id: "Routing berbasis peran, validasi tipe ketat, dan feedback progres real-time untuk job prediksi batch.",
    },
  },
  {
    id: "services",
    step: "02",
    title: { en: "Services Boundary", id: "Batas Layanan & API" },
    role: { en: "Trusted API & Data Operations", id: "API Tepercaya & Operasi Data" },
    tech: ["FastAPI (31 Routes)", "Supabase Auth", "PostgreSQL RLS", "RPC Storage"],
    description: {
      en: "FastAPI acts as the trusted application boundary, verifying student submissions, enforcing permissions, and communicating with Supabase PostgreSQL and Storage buckets.",
      id: "FastAPI menjadi batas aplikasi tepercaya yang memvalidasi submission mahasiswa, menerapkan izin keamanan, serta mengelola data di Supabase PostgreSQL dan Storage.",
    },
    safeguard: {
      en: "Row-Level Security (RLS) policies prevent cross-tenant data leakage; answer images are stored securely with signed URLs.",
      id: "Row Level Security (RLS) mencegah kebocoran data antar mata kuliah; gambar jawaban disimpan aman dengan signed URL.",
    },
    payloadSample: `{\n  "submission_id": "sub_948f21",\n  "sections_count": 24,\n  "model_family": "resnet50_v2",\n  "status": "queued"\n}`,
  },
  {
    id: "queue",
    step: "03",
    title: { en: "Inference Queue", id: "Antrean Inferensi" },
    role: { en: "Asynchronous Job Orchestration", id: "Orkestrasi Job Asinkron" },
    tech: ["Redis", "RQ (Redis Queue)", "Worker Locks", "State Reconciliation"],
    description: {
      en: "Separates heavy deep learning inference from synchronous HTTP request paths. Manages task scheduling, per-submission locking, and retry handling.",
      id: "Memisahkan komputasi inferensi deep learning yang berat dari request HTTP utama. Mengelola antrean, locking per submission, dan retry otomatis.",
    },
    safeguard: {
      en: "Worker mutex locking prevents race conditions on duplicate uploads; stale jobs are auto-reconciled on timeout.",
      id: "Mutex lock mencegah race condition saat upload ganda; job yang macet direkonsiliasi otomatis jika melewati batas waktu.",
    },
  },
  {
    id: "worker",
    step: "04",
    title: { en: "Model Inference Worker", id: "Worker Inferensi Model" },
    role: { en: "Lazy-Loaded LRU Cache Registry", id: "Registry Cache LRU Lazy-Loading" },
    tech: ["TensorFlow / Keras", "72 H5 Model Artifacts", "LRU Cache Registry", "Python 3.11"],
    description: {
      en: "Lazily loads 72 pre-trained H5 model artifacts (3 backbone families across 24 structured answer sections) with an in-memory LRU cache to optimize GPU/RAM usage.",
      id: "Melakukan lazy loading pada 72 artefak model H5 (3 keluarga arsitektur untuk 24 bagian jawaban) dengan in-memory LRU cache guna menghemat RAM server.",
    },
    safeguard: {
      en: "Checksum validation and golden-regression tests guarantee runtime compatibility prior to inference serving.",
      id: "Validasi checksum dan uji golden-regression memastikan kompatibilitas artefak model sebelum melayani prediksi.",
    },
  },
  {
    id: "review",
    step: "05",
    title: { en: "Human-in-the-Loop Review", id: "Review Dosen (Human-in-the-Loop)" },
    role: { en: "Lecturer Final Decision & Release", id: "Keputusan Akhir Dosen & Perilisan" },
    tech: ["Review UI", "Score Override", "Re-upload Requests", "Controlled Export"],
    description: {
      en: "Core product invariant: Model recommendations are strictly advisory and never released as final grades without explicit lecturer review and approval.",
      id: "Prinsip utama sistem: Hasil AI bersifat rekomendasi asisten dan tidak pernah dirilis sebagai nilai akhir tanpa review dan persetujuan eksplisit dari dosen.",
    },
    safeguard: {
      en: "Audit trail records all score overrides, comments, and release actions before exporting to CSV/Excel.",
      id: "Audit trail mencatat setiap riwayat pengubahan nilai, komentar, dan aksi rilis sebelum diekspor ke format Excel/CSV.",
    },
  },
];

export function ArchitectureVisualizer({ locale }: { locale: Locale }) {
  const [selectedId, setSelectedId] = useState<string>("product");
  const selected = scovisLayers.find((l) => l.id === selectedId) || scovisLayers[0];
  const isIndo = locale === "id";

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "14px",
        padding: "1.5rem",
        margin: "2rem 0",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", opacity: 0.6, textTransform: "uppercase" }}>
            {isIndo ? "Arsitektur Interaktif" : "Interactive Architecture Flow"}
          </span>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0.2rem 0 0" }}>
            SCOVIS / Human-in-the-Loop Pipeline
          </h3>
        </div>
        <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
          {isIndo ? "Klik blok untuk melihat detail teknis" : "Click any stage to inspect technical specs"}
        </span>
      </div>

      {/* Step Blocks Navigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {scovisLayers.map((layer) => {
          const isSelected = layer.id === selectedId;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setSelectedId(layer.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0.75rem 0.85rem",
                borderRadius: "8px",
                border: isSelected
                  ? "1px solid var(--foreground, #fff)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                background: isSelected ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.2)",
                color: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 150ms ease",
              }}
            >
              <span style={{ fontSize: "0.7rem", opacity: 0.5, fontWeight: 700 }}>
                {layer.step}
              </span>
              <strong style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {layer.title[locale]}
              </strong>
              <small style={{ fontSize: "0.68rem", opacity: 0.6, marginTop: "0.15rem" }}>
                {layer.tech[0]}
              </small>
            </button>
          );
        })}
      </div>

      {/* Inspector Panel for Selected Layer */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.35)",
          borderRadius: "10px",
          padding: "1.25rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 600 }}>
              STAGE {selected.step} · {selected.role[locale]}
            </span>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0.2rem 0 0" }}>
              {selected.title[locale]}
            </h4>
          </div>

          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {selected.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "0.88rem", lineHeight: 1.6, opacity: 0.9, margin: "0 0 0.85rem" }}>
          {selected.description[locale]}
        </p>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 1rem", borderRadius: "6px", borderLeft: "3px solid #60a5fa" }}>
          <strong style={{ fontSize: "0.78rem", color: "#93c5fd", display: "block", marginBottom: "0.2rem" }}>
            🛡️ {isIndo ? "Safeguard & Ketahanan Sistem" : "Engineering Resilience Safeguard"}
          </strong>
          <span style={{ fontSize: "0.82rem", opacity: 0.85 }}>
            {selected.safeguard[locale]}
          </span>
        </div>

        {selected.payloadSample && (
          <div style={{ marginTop: "0.85rem" }}>
            <span style={{ fontSize: "0.72rem", opacity: 0.5, textTransform: "uppercase" }}>
              {isIndo ? "Contoh Kontrak Data (JSON)" : "Sample Data Contract (JSON)"}
            </span>
            <pre
              style={{
                background: "#08080a",
                padding: "0.6rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "#e5e7eb",
                overflowX: "auto",
                margin: "0.25rem 0 0",
              }}
            >
              {selected.payloadSample}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
