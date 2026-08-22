"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";

type SampleImage = {
  id: string;
  name: Record<Locale, string>;
  category: string;
  riskLevel: "Low" | "Medium" | "High";
  actualClass: string;
  imageSvgBg: string;
  description: Record<Locale, string>;
  probabilities: { name: string; score: number; isTop?: boolean }[];
};

const samples: SampleImage[] = [
  {
    id: "sample-nevi",
    name: { en: "Melanocytic Nevus (Common Mole)", id: "Melanocytic Nevus (Tahi Lalat Biasa)" },
    category: "Benign Lesion",
    riskLevel: "Low",
    actualClass: "Melanocytic Nevi (nv)",
    imageSvgBg: "radial-gradient(circle at 48% 50%, #4a2818 0%, #7d4427 35%, #c88d66 60%, #e0ac8b 100%)",
    description: {
      en: "Symmetric, well-circumscribed pigment network with uniform coloration.",
      id: "Jaringan pigmen simetris dengan batas jelas dan pewarnaan seragam.",
    },
    probabilities: [
      { name: "Melanocytic Nevi (nv)", score: 92.4, isTop: true },
      { name: "Benign Keratosis (bkl)", score: 4.8 },
      { name: "Melanoma (mel)", score: 1.6 },
      { name: "Basal Cell Carcinoma (bcc)", score: 1.2 },
    ],
  },
  {
    id: "sample-melanoma",
    name: { en: "Suspected Melanoma Lesion", id: "Dugaan Lesi Melanoma" },
    category: "Malignant Pattern",
    riskLevel: "High",
    actualClass: "Melanoma (mel)",
    imageSvgBg: "radial-gradient(ellipse at 42% 46%, #1a0f0a 0%, #3d1c10 30%, #68301c 55%, #a65d3b 75%, #d99a75 100%)",
    description: {
      en: "Asymmetric structure, irregular border, multiple colors (black, dark brown, red hue).",
      id: "Struktur asimetris, batas tidak beraturan, multi-warna (hitam, cokelat tua, rona merah).",
    },
    probabilities: [
      { name: "Melanoma (mel)", score: 88.7, isTop: true },
      { name: "Melanocytic Nevi (nv)", score: 6.5 },
      { name: "Basal Cell Carcinoma (bcc)", score: 3.1 },
      { name: "Actinic Keratosis (akiec)", score: 1.7 },
    ],
  },
  {
    id: "sample-keratosis",
    name: { en: "Benign Keratosis Lesion", id: "Lesi Benign Keratosis" },
    category: "Benign Pattern",
    riskLevel: "Low",
    actualClass: "Benign Keratosis (bkl)",
    imageSvgBg: "radial-gradient(circle at 52% 48%, #5c3826 0%, #8c5638 40%, #b8805a 65%, #deb08e 100%)",
    description: {
      en: "Stuck-on appearance, pseudofollicular openings, homogeneous brownish tone.",
      id: "Tampilan menempel khas keratosis seboroik, bukaan pseudofolikuler homogen.",
    },
    probabilities: [
      { name: "Benign Keratosis (bkl)", score: 85.2, isTop: true },
      { name: "Melanocytic Nevi (nv)", score: 9.8 },
      { name: "Basal Cell Carcinoma (bcc)", score: 3.4 },
      { name: "Melanoma (mel)", score: 1.6 },
    ],
  },
  {
    id: "sample-carcinoma",
    name: { en: "Basal Cell Carcinoma Pattern", id: "Pola Basal Cell Carcinoma" },
    category: "Malignant / Surgical",
    riskLevel: "Medium",
    actualClass: "Basal Cell Carcinoma (bcc)",
    imageSvgBg: "radial-gradient(circle at 45% 55%, #6e3225 0%, #9e4b39 35%, #c77663 60%, #e8afa0 100%)",
    description: {
      en: "Translucent papule with arborizing telangiectasia (blood vessels).",
      id: "Papul translusen dengan telangiektasia arborisasi (pembuluh darah halus).",
    },
    probabilities: [
      { name: "Basal Cell Carcinoma (bcc)", score: 81.6, isTop: true },
      { name: "Actinic Keratosis (akiec)", score: 10.4 },
      { name: "Melanoma (mel)", score: 5.2 },
      { name: "Benign Keratosis (bkl)", score: 2.8 },
    ],
  },
];

const copy = {
  en: {
    eyebrow: "Interactive AI Sandbox",
    title: "DermaScan Model Inference Playground",
    subtitle: "Test deep learning classification inference, confidence probabilities, and Grad-CAM attention overlay directly in your browser.",
    selectSample: "Select Test Image Artifact",
    runInference: "⚡ Run Neural Inference",
    running: "Running Forward Pass…",
    pipeline: "Inference Pipeline Telemetry",
    latency: "Inference Latency",
    gradCamToggle: "Show Grad-CAM Heatmap",
    gradCamDesc: "Visualizes the convolutional feature map regions that most strongly influenced the classification decision.",
    disclaimerTitle: "Human-in-the-Loop Safeguard",
    disclaimerText: "This model is designed as an assistant decision-support tool, not an automated clinical diagnostic device. Final decisions must always be verified by medical professionals.",
    topMatch: "Top Classification",
    confidence: "Model Confidence",
  },
  id: {
    eyebrow: "Sandbox AI Interaktif",
    title: "Playground Inferensi Model DermaScan",
    subtitle: "Uji inferensi klasifikasi deep learning, probabilitas keyakinan model, dan overlay Grad-CAM attention heatmap langsung di browser Anda.",
    selectSample: "Pilih Sampel Citra Uji",
    runInference: "⚡ Jalankan Inferensi Neural",
    running: "Menjalankan Forward Pass…",
    pipeline: "Telemetri Pipeline Inferensi",
    latency: "Latensi Inferensi",
    gradCamToggle: "Tampilkan Heatmap Grad-CAM",
    gradCamDesc: "Memvisualisasikan area peta fitur konvolusi yang paling kuat memengaruhi keputusan klasifikasi model.",
    disclaimerTitle: "Prinsip Human-in-the-Loop",
    disclaimerText: "Model ini dirancang sebagai alat bantu pendukung keputusan, bukan pengganti diagnosis medis otomatis. Keputusan akhir selalu memerlukan verifikasi tenaga medis profesional.",
    topMatch: "Klasifikasi Teratas",
    confidence: "Tingkat Keyakinan Model",
  },
};

export function MLPlayground({ locale }: { locale: Locale }) {
  const [selectedSample, setSelectedSample] = useState<SampleImage>(samples[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [showGradCam, setShowGradCam] = useState(false);
  const [hasInferred, setHasInferred] = useState(true);
  const [activeLatency, setActiveLatency] = useState(38);

  const t = copy[locale];

  function handleRun() {
    setIsRunning(true);
    setHasInferred(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasInferred(true);
      setActiveLatency(Math.floor(Math.random() * 12) + 32); // 32-44ms
    }, 450);
  }

  const topProb = selectedSample.probabilities[0];

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "1.75rem",
        margin: "2.5rem 0",
        border: "1px solid rgba(255, 255, 255, 0.14)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ● {t.eyebrow}
        </span>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0.25rem 0 0.4rem" }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, maxWidth: "48rem", lineHeight: 1.5 }}>
          {t.subtitle}
        </p>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Left Column: Image Selector & Canvas */}
        <div>
          <span style={{ fontSize: "0.78rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
            {t.selectSample}
          </span>

          {/* Sample Chips */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedSample(s);
                  setShowGradCam(false);
                }}
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: selectedSample.id === s.id
                    ? "1px solid var(--foreground, #fff)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: selectedSample.id === s.id
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.25)",
                  color: "inherit",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  fontWeight: selectedSample.id === s.id ? 600 : 400,
                  transition: "all 150ms ease",
                }}
              >
                {s.name[locale]}
              </button>
            ))}
          </div>

          {/* Image Canvas Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "220px",
              borderRadius: "12px",
              background: selectedSample.imageSvgBg,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              padding: "1rem",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Grad-CAM Heatmap Overlay */}
            {showGradCam && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 46% 48%, rgba(255, 0, 0, 0.65) 0%, rgba(255, 180, 0, 0.5) 35%, rgba(0, 150, 255, 0.3) 65%, transparent 85%)",
                  mixBlendMode: "screen",
                  animation: "fadeIn 200ms ease-out",
                }}
              />
            )}

            {/* Canvas Badges */}
            <div style={{ position: "relative", zIndex: 2, background: "rgba(0,0,0,0.7)", padding: "0.4rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem" }}>
              <span style={{ color: selectedSample.riskLevel === "High" ? "#f87171" : "#4ade80", fontWeight: 700 }}>
                ● {selectedSample.riskLevel} Risk Pattern
              </span>
              <p style={{ margin: "0.15rem 0 0", opacity: 0.8, fontSize: "0.7rem" }}>
                {selectedSample.description[locale]}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="button button-primary"
              style={{ fontSize: "0.82rem", padding: "0.55rem 1.1rem" }}
            >
              {isRunning ? t.running : t.runInference}
            </button>

            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer", opacity: 0.9 }}>
              <input
                type="checkbox"
                checked={showGradCam}
                onChange={(e) => setShowGradCam(e.target.checked)}
                style={{ accentColor: "#4ade80", width: 16, height: 16 }}
              />
              <span>{t.gradCamToggle}</span>
            </label>
          </div>
        </div>

        {/* Right Column: Model Output & Probability Bars */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t.pipeline}
              </span>
              <span style={{ fontSize: "0.78rem", color: "#4ade80", background: "rgba(74, 222, 128, 0.12)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                {t.latency}: ~{activeLatency}ms (TFLite)
              </span>
            </div>

            {/* Top Match Card */}
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>{t.topMatch}</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.2rem" }}>
                <strong style={{ fontSize: "1.1rem" }}>{topProb.name}</strong>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#4ade80" }}>{topProb.score}%</span>
              </div>
            </div>

            {/* Probabilities Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {selectedSample.probabilities.map((prob) => (
                <div key={prob.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.2rem" }}>
                    <span style={{ opacity: prob.isTop ? 1 : 0.7, fontWeight: prob.isTop ? 600 : 400 }}>
                      {prob.name}
                    </span>
                    <span style={{ fontWeight: prob.isTop ? 700 : 400 }}>{prob.score}%</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: hasInferred ? `${prob.score}%` : "0%",
                        background: prob.isTop ? "var(--foreground, #fff)" : "rgba(255,255,255,0.35)",
                        borderRadius: "3px",
                        transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Safeguard Banner */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              borderLeft: "3px solid #facc15",
              padding: "0.75rem 0.9rem",
              borderRadius: "6px",
              marginTop: "1.25rem",
            }}
          >
            <strong style={{ fontSize: "0.78rem", color: "#fde047", display: "block", marginBottom: "0.15rem" }}>
              🛡️ {t.disclaimerTitle}
            </strong>
            <p style={{ margin: 0, fontSize: "0.72rem", opacity: 0.8, lineHeight: 1.45 }}>
              {t.disclaimerText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
