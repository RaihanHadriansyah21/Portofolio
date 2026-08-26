"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/portfolio";

type VehicleSample = {
  id: string;
  className: "Bus" | "Car" | "Motorcycle" | "Truck";
  name: Record<Locale, string>;
  icon: string;
  bgGradient: string;
  probabilities: { name: string; score: number }[];
  description: Record<Locale, string>;
  featuresDetected: Record<Locale, string[]>;
};

const samples: VehicleSample[] = [
  {
    id: "sample-bus",
    className: "Bus",
    name: { en: "Urban Transit Bus", id: "Bus Transportasi Kota" },
    icon: "🚌",
    bgGradient: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)",
    probabilities: [
      { name: "Bus", score: 97.2 },
      { name: "Truck", score: 1.9 },
      { name: "Car", score: 0.6 },
      { name: "Motorcycle", score: 0.3 },
    ],
    description: {
      en: "High rectangular aspect ratio, multiple window bays, and front boarding door geometry.",
      id: "Rasio aspek persegi panjang tinggi, jendela ganda memanjang, dan geometri pintu depan penumpang.",
    },
    featuresDetected: {
      en: ["Long horizontal roofline", "Multi-window passenger bay", "High clearance axle"],
      id: ["Garis atap horizontal panjang", "Kompartemen jendela penumpang", "Axle clearance tinggi"],
    },
  },
  {
    id: "sample-car",
    className: "Car",
    name: { en: "Passenger Sedan Vehicle", id: "Mobil Penumpang (Sedan)" },
    icon: "🚗",
    bgGradient: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
    probabilities: [
      { name: "Car", score: 95.8 },
      { name: "Truck", score: 2.4 },
      { name: "Bus", score: 1.1 },
      { name: "Motorcycle", score: 0.7 },
    ],
    description: {
      en: "Three-box configuration with distinct engine bay, passenger cabin, and rear trunk compartments.",
      id: "Konfigurasi three-box dengan kap mesin terpisah, kabin penumpang, dan bagasi belakang.",
    },
    featuresDetected: {
      en: ["Low aerodynamic profile", "4-wheel standard wheelbase", "Curved windshield rake"],
      id: ["Profil aerodinamis rendah", "Wheelbase standar 4-roda", "Kemiringan kaca depan"],
    },
  },
  {
    id: "sample-motorcycle",
    className: "Motorcycle",
    name: { en: "Two-Wheeled Motorbike", id: "Sepeda Motor Roda Dua" },
    icon: "🏍️",
    bgGradient: "linear-gradient(135deg, #3b2a1a 0%, #1c140d 100%)",
    probabilities: [
      { name: "Motorcycle", score: 98.4 },
      { name: "Car", score: 0.9 },
      { name: "Truck", score: 0.4 },
      { name: "Bus", score: 0.3 },
    ],
    description: {
      en: "Single inline two-wheel axis, exposed handlebar steering, and compact single-chassis silhouette.",
      id: "Sumbu inline roda dua, stang kemudi terbuka, dan siluet sasis tunggal kompak.",
    },
    featuresDetected: {
      en: ["Single-track wheelbase", "Visible handlebar fork", "Exposed powertrain frame"],
      id: ["Wheelbase single-track", "Garpu stang terlihat", "Rangka mesin terbuka"],
    },
  },
  {
    id: "sample-truck",
    className: "Truck",
    name: { en: "Heavy Cargo Transport Truck", id: "Truk Angkutan Barang Berat" },
    icon: "🚛",
    bgGradient: "linear-gradient(135deg, #374151 0%, #111827 100%)",
    probabilities: [
      { name: "Truck", score: 94.1 },
      { name: "Bus", score: 3.8 },
      { name: "Car", score: 1.6 },
      { name: "Motorcycle", score: 0.5 },
    ],
    description: {
      en: "Separate driver cabin, heavy-duty cargo container, and reinforced multi-axle chassis.",
      id: "Kabin pengemudi terpisah, bak muatan kargo berat, dan sasis multi-axle yang diperkuat.",
    },
    featuresDetected: {
      en: ["High vertical cab face", "Flat cargo bed geometry", "Heavy dual rear wheelset"],
      id: ["Wajah kabin vertikal tinggi", "Geometri bak kargo datar", "Roda ganda belakang kokoh"],
    },
  },
];

const runtimes = [
  {
    name: "SavedModel (Python / FastAPI)",
    target: "Backend API Server",
    latency: "28 ms",
    size: "14.2 MB",
    precision: "FP32",
    badge: "Server Production",
  },
  {
    name: "TFLite (Mobile / Edge)",
    target: "Android / iOS Device",
    latency: "11 ms",
    size: "8.8 MB",
    precision: "FP32 / Converted",
    badge: "Edge Ready",
  },
  {
    name: "TensorFlow.js (WebGL)",
    target: "Web Browser Client",
    latency: "18 ms",
    size: "8.9 MB",
    precision: "Web Graph",
    badge: "Browser Native",
  },
];

const copy = {
  en: {
    eyebrow: "Interactive Model Inspector",
    title: "MobileNetV2 4-Class Inference Sandbox",
    subtitle: "Explore transfer learning feature extraction across four vehicle categories with interactive confidence threshold tuning and multi-runtime export benchmarks.",
    selectSample: "Select Test Image Class",
    confidenceSlider: "Confidence Acceptance Threshold",
    thresholdDesc: "Predictions below threshold trigger fallback review in production systems.",
    topMatch: "Predicted Class",
    confidence: "Model Confidence",
    statusAccepted: "✓ Accepted Classification",
    statusFallback: "⚠️ Below Threshold (Fallback Review)",
    keyFeatures: "Detected Visual Feature Signals",
    runtimesTitle: "Multi-Runtime Portability Benchmarks",
    runtimesSubtitle: "Trained once, exported for cloud servers, edge mobile devices, and browser runtimes.",
    targetEnv: "Target Runtime",
    avgLatency: "Avg Latency",
    modelSize: "Model Weight",
  },
  id: {
    eyebrow: "Inspektor Model Interaktif",
    title: "Sandbox Inferensi 4-Kelas MobileNetV2",
    subtitle: "Jelajahi ekstraksi fitur transfer learning pada empat kategori kendaraan dengan simulasi ambang batas keyakinan dan perbandingan benchmark ekspor multi-runtime.",
    selectSample: "Pilih Sampel Kelas Kendaraan",
    confidenceSlider: "Ambang Batas Keyakinan (Confidence Threshold)",
    thresholdDesc: "Prediksi di bawah threshold akan memicu review fallback pada sistem produksi.",
    topMatch: "Kelas Terprediksi",
    confidence: "Keyakinan Model",
    statusAccepted: "✓ Klasifikasi Diterima",
    statusFallback: "⚠️ Di Bawah Ambang Batas (Pemicu Fallback)",
    keyFeatures: "Sinyal Fitur Visual Terdeteksi",
    runtimesTitle: "Benchmark Portabilitas Multi-Runtime",
    runtimesSubtitle: "Dilatih satu kali, diekspor untuk server cloud, perangkat mobile edge, dan browser client.",
    targetEnv: "Target Runtime",
    avgLatency: "Latensi Rata-rata",
    modelSize: "Ukuran Model",
  },
} as const;

export function VehicleModelInspector({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selectedId, setSelectedId] = useState<string>("sample-car");
  const [threshold, setThreshold] = useState<number>(85);

  const activeSample = useMemo(
    () => samples.find((s) => s.id === selectedId) || samples[0],
    [selectedId]
  );

  const topPrediction = activeSample.probabilities[0];
  const isAccepted = topPrediction.score >= threshold;

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "2rem",
        margin: "2rem 0",
        border: "1px solid rgba(255, 255, 255, 0.14)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#4ade80",
            display: "inline-block",
            marginBottom: "0.3rem",
          }}
        >
          ● {t.eyebrow}
        </span>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.35rem" }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, lineHeight: 1.5, maxWidth: "50rem" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Class Selector Buttons */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span style={{ fontSize: "0.78rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
          {t.selectSample}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem" }}>
          {samples.map((s) => {
            const isSelected = selectedId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: isSelected
                    ? "1px solid var(--foreground, #fff)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isSelected
                    ? "var(--foreground, #fff)"
                    : "rgba(0, 0, 0, 0.25)",
                  color: isSelected ? "var(--background, #000)" : "inherit",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                <span>{s.className}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Main Visualizer Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Left: Synthetic Feature Map & Visual Card */}
        <div
          style={{
            borderRadius: "12px",
            background: activeSample.bgGradient,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                MobileNetV2 Feature Map
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: isAccepted ? "rgba(74, 222, 128, 0.2)" : "rgba(250, 204, 21, 0.2)",
                  color: isAccepted ? "#4ade80" : "#facc15",
                  fontWeight: 600,
                }}
              >
                {isAccepted ? t.statusAccepted : t.statusFallback}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {activeSample.icon}
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                  {activeSample.name[locale]}
                </h4>
                <p style={{ fontSize: "0.8rem", opacity: 0.75, margin: "0.2rem 0 0" }}>
                  Actual Class: <strong>{activeSample.className}</strong>
                </p>
              </div>
            </div>

            <p style={{ fontSize: "0.82rem", opacity: 0.8, lineHeight: 1.5, fontStyle: "italic", margin: "0 0 1rem" }}>
              &ldquo;{activeSample.description[locale]}&rdquo;
            </p>
          </div>

          <div>
            <strong style={{ fontSize: "0.75rem", opacity: 0.6, display: "block", marginBottom: "0.35rem", textTransform: "uppercase" }}>
              {t.keyFeatures}
            </strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {activeSample.featuresDetected[locale].map((feat) => (
                <span
                  key={feat}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Confidence Threshold Slider & Softmax Distribution */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Threshold Slider */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
              <label htmlFor="conf-slider" style={{ fontSize: "0.78rem", fontWeight: 600, opacity: 0.85 }}>
                {t.confidenceSlider}
              </label>
              <strong style={{ fontSize: "0.95rem", color: "#4ade80" }}>{threshold}%</strong>
            </div>
            <input
              id="conf-slider"
              type="range"
              min={50}
              max={98}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{
                width: "100%",
                cursor: "pointer",
                accentColor: "#4ade80",
              }}
            />
            <p style={{ fontSize: "0.72rem", opacity: 0.55, margin: "0.25rem 0 0" }}>
              {t.thresholdDesc}
            </p>
          </div>

          {/* Softmax Probability Bars */}
          <div>
            <span style={{ fontSize: "0.75rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem", textTransform: "uppercase" }}>
              Softmax Probability Output
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {activeSample.probabilities.map((p, idx) => {
                const isTop = idx === 0;
                return (
                  <div key={p.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: isTop ? 700 : 400, opacity: isTop ? 1 : 0.7 }}>
                        {p.name}
                      </span>
                      <strong style={{ color: isTop ? (isAccepted ? "#4ade80" : "#facc15") : "inherit", opacity: isTop ? 1 : 0.6 }}>
                        {p.score.toFixed(1)}%
                      </strong>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        borderRadius: "3px",
                        background: "rgba(255, 255, 255, 0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p.score}%`,
                          borderRadius: "3px",
                          background: isTop
                            ? isAccepted
                              ? "#4ade80"
                              : "#facc15"
                            : "rgba(255, 255, 255, 0.3)",
                          transition: "width 250ms ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Runtime Benchmark Table */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: "1.5rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
            {t.runtimesTitle}
          </h4>
          <p style={{ fontSize: "0.78rem", opacity: 0.6, margin: "0.2rem 0 0" }}>
            {t.runtimesSubtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {runtimes.map((rt) => (
            <div
              key={rt.name}
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                padding: "0.9rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontWeight: 600,
                  }}
                >
                  {rt.badge}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4ade80" }}>
                  {rt.latency}
                </span>
              </div>
              <strong style={{ fontSize: "0.85rem", display: "block" }}>{rt.name}</strong>
              <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: "0.2rem 0 0" }}>
                {rt.target} · {rt.size} ({rt.precision})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
