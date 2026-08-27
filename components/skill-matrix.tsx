"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/portfolio";
import { projects } from "@/lib/portfolio";

interface SkillMatrixProps {
  locale: Locale;
}

interface SkillDefinition {
  name: string;
  category: "ai-ml" | "fullstack" | "backend-cloud" | "mobile";
  projects: string[]; // project slugs
  certs?: string[];
}

const SKILLS: SkillDefinition[] = [
  {
    name: "FastAPI",
    category: "ai-ml",
    projects: ["scovis", "dermascan"],
    certs: ["Membangun Proyek Deep Learning Tingkat Mahir"],
  },
  {
    name: "TensorFlow / Keras",
    category: "ai-ml",
    projects: ["scovis", "vehicle-classification", "bitcoin-forecasting", "gojek-sentiment"],
    certs: ["Membangun Proyek Deep Learning Tingkat Mahir", "Belajar Fundamental Deep Learning"],
  },
  {
    name: "TensorFlow Lite",
    category: "ai-ml",
    projects: ["dermascan", "vehicle-classification"],
    certs: ["Belajar Fundamental Deep Learning"],
  },
  {
    name: "Next.js 16 / React 19",
    category: "fullstack",
    projects: ["scovis"],
    certs: [],
  },
  {
    name: "TypeScript",
    category: "fullstack",
    projects: ["scovis"],
    certs: [],
  },
  {
    name: "Supabase & PostgreSQL",
    category: "backend-cloud",
    projects: ["scovis", "quizint"],
    certs: [],
  },
  {
    name: "Redis & RQ Workers",
    category: "backend-cloud",
    projects: ["scovis"],
    certs: [],
  },
  {
    name: "MobileNetV2 / Computer Vision",
    category: "ai-ml",
    projects: ["vehicle-classification"],
    certs: ["Belajar Fundamental Deep Learning"],
  },
  {
    name: "Flutter & Dart",
    category: "mobile",
    projects: ["quizint"],
    certs: [],
  },
  {
    name: "Seq2Seq & Attention",
    category: "ai-ml",
    projects: ["bitcoin-forecasting"],
    certs: ["Membangun Proyek Deep Learning Tingkat Mahir"],
  },
  {
    name: "scikit-learn & NLP",
    category: "ai-ml",
    projects: ["gojek-sentiment"],
    certs: ["Belajar Machine Learning untuk Pemula"],
  },
  {
    name: "Flask & MongoDB",
    category: "backend-cloud",
    projects: ["cloud-inventory-api"],
    certs: [],
  },
  {
    name: "Python (Advanced)",
    category: "ai-ml",
    projects: ["scovis", "dermascan", "vehicle-classification", "bitcoin-forecasting", "gojek-sentiment", "cloud-inventory-api"],
    certs: ["Memulai Pemrograman dengan Python", "Belajar Penerapan Data Science dengan Microsoft Fabric"],
  },
];

export function SkillMatrix({ locale }: SkillMatrixProps) {
  const [selectedSkill, setSelectedSkill] = useState<string>("FastAPI");
  const isEn = locale === "en";

  const activeSkillDef = useMemo(
    () => SKILLS.find((s) => s.name === selectedSkill) || SKILLS[0],
    [selectedSkill]
  );

  const matchedProjects = useMemo(
    () => projects.filter((p) => activeSkillDef.projects.includes(p.slug)),
    [activeSkillDef]
  );

  return (
    <section className="skill-matrix-container glass-panel" aria-label="Interactive Skill & Tech Stack Matrix">
      <div className="matrix-header">
        <div>
          <span className="eyebrow">{isEn ? "Cross-Project Tech Radar" : "Radar Keterampilan Lintas Proyek"}</span>
          <h3>{isEn ? "Explore Stack Implementation by Technology" : "Eksplorasi Implementasi per Teknologi"}</h3>
        </div>
        <p className="matrix-sub">
          {isEn
            ? "Click any technology to inspect where it is verified in production codebases and credentials."
            : "Klik teknologi apa pun untuk melihat bukti penerapannya pada codebase proyek dan sertifikasi."}
        </p>
      </div>

      {/* Skill Pills Cloud */}
      <div className="skills-pills-cloud" role="group" aria-label="Technology filter">
        {SKILLS.map((skill) => {
          const isSelected = skill.name === selectedSkill;
          return (
            <button
              key={skill.name}
              type="button"
              className={`skill-matrix-pill ${isSelected ? "is-active" : ""}`}
              onClick={() => setSelectedSkill(skill.name)}
              aria-pressed={isSelected}
            >
              <span>{skill.name}</span>
              <span className="usage-count">{skill.projects.length}</span>
            </button>
          );
        })}
      </div>

      {/* Matched Project & Certificate Drawer */}
      <div className="skill-details-box glass-panel">
        <div className="skill-details-head">
          <div className="skill-title-badge">
            <span className="live-dot" />
            <strong>{activeSkillDef.name}</strong>
            <small>{isEn ? `Verified across ${matchedProjects.length} project(s)` : `Diverifikasi di ${matchedProjects.length} proyek`}</small>
          </div>
        </div>

        <div className="skill-projects-grid">
          {matchedProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/projects/${p.slug}`}
              className="skill-project-card glass-panel"
            >
              <div className="spc-top">
                <span className="spc-num">{p.number}</span>
                <span className="spc-tier">{p.tier}</span>
              </div>
              <h4>{p.title}</h4>
              <p>{p.summary[locale]}</p>
              <div className="spc-footer">
                <span>{isEn ? "Inspect Case Study" : "Buka Case Study"} ↗</span>
              </div>
            </Link>
          ))}
        </div>

        {activeSkillDef.certs && activeSkillDef.certs.length > 0 && (
          <div className="skill-certs-linked">
            <span className="certs-linked-label">
              {isEn ? "Related Credential:" : "Sertifikasi Terkait:"}
            </span>
            <div className="certs-chips">
              {activeSkillDef.certs.map((c) => (
                <Link key={c} href={`/${locale}/credentials`} className="cert-link-chip">
                  📜 {c} ↗
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
