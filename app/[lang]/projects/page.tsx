import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectGrid } from "@/components/project-grid";
import { copy, isLocale, projects } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: lang === "en" ? "Projects" : "Proyek",
    description: lang === "en" ? "Seven evidence-led projects across applied AI, machine learning, full-stack, mobile, and backend engineering." : "Tujuh proyek berbasis bukti dalam applied AI, machine learning, full-stack, mobile, dan backend engineering.",
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];

  return (
    <main id="main-content" className="page-shell section-shell">
      <header className="page-hero">
        <p className="eyebrow">{content.selected.eyebrow} / 01—07</p>
        <h1>{lang === "en" ? "Engineering stories, not a technology list." : "Cerita engineering, bukan sekadar daftar teknologi."}</h1>
        <p>{content.selected.intro}</p>
      </header>
      <ProjectGrid projects={projects} locale={lang} />
    </main>
  );
}
