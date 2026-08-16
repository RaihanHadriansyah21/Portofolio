import Link from "next/link";
import { copy, type Locale, type Project } from "@/lib/portfolio";

export function ProjectCard({ project, locale, featured = false }: { project: Project; locale: Locale; featured?: boolean }) {
  const content = copy[locale];

  return (
    <article className={`project-card glass-panel ${featured ? "project-card-featured" : ""}`}>
      <div className="project-card-top">
        <span className="project-number">{project.number}</span>
        <span className="project-tier">{project.tier}</span>
      </div>
      <div className="project-signal" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="project-card-copy">
        <p className="eyebrow">{project.categories.join(" · ")}</p>
        <h3>{project.title}</h3>
        <p>{project.summary[locale]}</p>
      </div>
      <div className="tag-list" aria-label="Technology stack">
        {project.stack.slice(0, featured ? 6 : 4).map((item) => <span key={item}>{item}</span>)}
      </div>
      <Link className="text-link" href={`/${locale}/projects/${project.slug}`}>
        {content.common.viewCase} <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
