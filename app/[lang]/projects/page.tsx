import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectGrid } from "@/components/project-grid";
import { copy, isLocale, projects, siteUrl } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = siteUrl();
  const titleText = lang === "en" ? "Engineering Projects & Case Studies" : "Studi Kasus & Proyek Engineering";
  const descText =
    lang === "en"
      ? "Evidence-led projects across applied AI, machine learning, full-stack, mobile, and backend engineering."
      : "Proyek berbasis bukti dalam applied AI, machine learning, full-stack, mobile, dan backend engineering.";
  const ogImageUrl = `${base}/api/og?title=${encodeURIComponent(titleText)}&subtitle=${encodeURIComponent("Applied AI · Full-Stack · Machine Learning")}&tags=${encodeURIComponent("SCOVIS · DermaScan · QuizInt · Bitcoin Forecast")}&badge=CASE%20STUDIES`;

  return {
    title: lang === "en" ? "Projects" : "Proyek",
    description: descText,
    alternates: {
      canonical: `${base}/${lang}/projects`,
      languages: { en: `${base}/en/projects`, id: `${base}/id/projects` },
    },
    openGraph: {
      type: "website",
      title: `${lang === "en" ? "Projects" : "Proyek"} | Reyy`,
      description: descText,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: titleText }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lang === "en" ? "Projects" : "Proyek"} | Reyy`,
      description: descText,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];
  const totalProjects = String(projects.length).padStart(2, "0");

  return (
    <main id="main-content" className="page-shell section-shell">
      <header className="page-hero">
        <p className="eyebrow">{content.selected.eyebrow} / 01 / {totalProjects}</p>
        <h1>{lang === "en" ? "Engineering stories, not a technology list." : "Cerita engineering, bukan sekadar daftar teknologi."}</h1>
        <p>{content.selected.intro}</p>
      </header>
      <ProjectGrid projects={projects} locale={lang} />
    </main>
  );
}
