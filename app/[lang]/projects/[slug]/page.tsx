import type { Metadata } from "next";
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
    openGraph: { type: "article", title: `${project.title} — Reyy`, description: project.summary[lang], images: [] },
    twitter: { card: "summary", title: `${project.title} — Reyy`, description: project.summary[lang], images: [] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = projectBySlug(slug);
  if (!project) notFound();
  const content = copy[lang];

  return (
    <main id="main-content" className="project-detail section-shell">
      <Link className="back-link" href={`/${lang}/projects`}>← {content.common.back}</Link>
      <header className="project-detail-hero">
        <div className="project-detail-meta"><span>{project.number}</span><p>{project.tier} · {project.categories.join(" · ")}</p></div>
        <h1>{project.title}</h1>
        <p>{project.summary[lang]}</p>
        <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="project-links">
          {project.links.map((link, index) => (
            <a className={index === 0 ? "button button-primary" : "button button-secondary"} href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>
          ))}
        </div>
      </header>

      <section className="case-grid">
        <article className="case-main"><p className="eyebrow">01 / Context</p><h2>{lang === "en" ? "The problem and product context" : "Masalah dan konteks produk"}</h2><p>{project.context[lang]}</p></article>
        <aside className="case-note glass-panel"><span>{project.number}</span><p>Evidence before adjectives.</p></aside>
      </section>
      <section className="case-section"><p className="eyebrow">02 / {content.common.role}</p><h2>{content.common.role}</h2><p>{project.role[lang]}</p></section>
      <section className="case-section"><p className="eyebrow">03 / System</p><h2>{content.common.architecture}</h2><div className="case-list">{project.architecture.map((item, index) => <div key={item.en}><span>0{index + 1}</span><p>{item[lang]}</p></div>)}</div></section>
      <section className="case-section two-column-case">
        <div><p className="eyebrow">04 / {content.common.evidence}</p><h2>{content.common.evidence}</h2><ul>{project.evidence.map((item) => <li key={item.en}>{item[lang]}</li>)}</ul></div>
        <div><p className="eyebrow">05 / {content.common.limitations}</p><h2>{content.common.limitations}</h2><ul>{project.limitations.map((item) => <li key={item.en}>{item[lang]}</li>)}</ul></div>
      </section>
      <nav className="next-project glass-panel" aria-label="Project navigation">
        <span>{project.number} / 07</span>
        <Link href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link>
      </nav>
    </main>
  );
}
