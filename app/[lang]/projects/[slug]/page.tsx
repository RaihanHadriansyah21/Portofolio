import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, isLocale, locales, projectBySlug, projects, siteUrl } from "@/lib/portfolio";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((project) => ({ lang, slug: project.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = projectBySlug(slug);
  if (!project) return {};
  const base = siteUrl();

  return {
    title: project.title,
    description: project.summary[lang],
    alternates: {
      canonical: `${base}/${lang}/projects/${slug}`,
      languages: { en: `${base}/en/projects/${slug}`, id: `${base}/id/projects/${slug}` },
    },
    openGraph: { type: "article", title: `${project.title} | Reyy`, description: project.summary[lang], images: [] },
    twitter: { card: "summary", title: `${project.title} | Reyy`, description: project.summary[lang], images: [] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = projectBySlug(slug);
  if (!project) notFound();
  const content = copy[lang];
  const externalLinks = [
    ...project.links.map((link) => ({ ...link, kind: "product" as const })),
    ...project.repositories.map((link) => ({ ...link, kind: "repository" as const })),
  ];
  const labels = lang === "en" ? {
    context: "Problem & product context",
    capabilities: "What the project delivers",
    decisions: "Engineering decisions",
    verified: "Verified against public source, repository history, and saved project outputs.",
    evidenceNote: "Numbers are shown with their original evaluation context; limitations are included so the work can be assessed without inflated claims.",
  } : {
    context: "Masalah & konteks produk",
    capabilities: "Kemampuan yang dibangun",
    decisions: "Keputusan engineering",
    verified: "Diverifikasi terhadap source publik, riwayat repository, dan output proyek yang tersimpan.",
    evidenceNote: "Angka ditampilkan dengan konteks evaluasi aslinya; batasan disertakan agar proyek dapat dinilai tanpa klaim yang dilebihkan.",
  };

  return (
    <main id="main-content" className="project-detail section-shell">
      <Link className="back-link" href={`/${lang}/projects`}>← {content.common.back}</Link>
      <header className="project-detail-hero">
        <div className="project-detail-meta"><span>{project.number}</span><p>{project.tier} · {project.categories.join(" · ")}</p></div>
        <h1>{project.title}</h1>
        <p>{project.summary[lang]}</p>
        <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="project-verification-note"><span aria-hidden="true">✓</span>{labels.verified}</p>
        <nav className="project-links" aria-label={lang === "en" ? "Project links" : "Tautan proyek"}>
          {externalLinks.map((link, index) => (
            <a
              className={index === 0 ? "button button-primary" : "button button-secondary"}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              key={link.href}
            >
              {link.kind === "repository" ? "GitHub · " : ""}{link.label[lang]} ↗
            </a>
          ))}
        </nav>
      </header>

      <section className="case-grid">
        <article className="case-main"><p className="eyebrow">01 / Context</p><h2>{labels.context}</h2><p>{project.context[lang]}</p></article>
        <figure className="case-evidence-visual glass-panel">
          <div className="case-evidence-frame">
            <Image
              className={`case-evidence-image is-${project.preview.fit}`}
              src={project.preview.src}
              alt={project.preview.alt[lang]}
              fill
              sizes="(max-width: 820px) min(100vw - 2rem, 24rem), 17rem"
              style={{ objectPosition: project.preview.position ?? "center" }}
            />
          </div>
          <figcaption>
            <span>{project.number}</span>
            <p>{lang === "en" ? "Real project artifact" : "Artefak proyek nyata"}</p>
          </figcaption>
        </figure>
      </section>
      <section className="case-section"><p className="eyebrow">02 / {content.common.role}</p><h2>{content.common.role}</h2><p>{project.role[lang]}</p></section>

      <section className="case-section">
        <p className="eyebrow">03 / Product</p>
        <h2>{labels.capabilities}</h2>
        <div className="case-feature-grid">
          {project.features.map((item, index) => (
            <article className="case-feature-card glass-panel" key={item.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-section"><p className="eyebrow">04 / System</p><h2>{content.common.architecture}</h2><div className="case-list">{project.architecture.map((item, index) => <div key={item.en}><span>{String(index + 1).padStart(2, "0")}</span><p>{item[lang]}</p></div>)}</div></section>

      <section className="case-section">
        <p className="eyebrow">05 / Decisions</p>
        <h2>{labels.decisions}</h2>
        <div className="case-list case-decision-list">
          {project.decisions.map((item, index) => <div key={item.en}><span>{String(index + 1).padStart(2, "0")}</span><p>{item[lang]}</p></div>)}
        </div>
      </section>

      <section className="case-section two-column-case">
        <div><p className="eyebrow">06 / {content.common.evidence}</p><h2>{content.common.evidence}</h2><ul>{project.evidence.map((item) => <li key={item.en}>{item[lang]}</li>)}</ul></div>
        <div><p className="eyebrow">07 / {content.common.limitations}</p><h2>{content.common.limitations}</h2><ul>{project.limitations.map((item) => <li key={item.en}>{item[lang]}</li>)}</ul></div>
        <p className="case-evidence-note">{labels.evidenceNote}</p>
      </section>
      <nav className="next-project glass-panel" aria-label="Project navigation">
        <span>{project.number} / 07</span>
        <div>
          {project.repositories.map((repository) => <a href={repository.href} target="_blank" rel="noreferrer" key={repository.href}>{repository.label[lang]} ↗</a>)}
          <Link href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link>
        </div>
      </nav>
    </main>
  );
}
