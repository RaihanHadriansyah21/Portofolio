"use client";

import Image from "next/image";
import Link from "next/link";
import { copy, type Locale, type Project } from "@/lib/portfolio";

function fireProjectClick(slug: string, title: string, source: "image" | "cta") {
  fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "project_click",
      metadata: { slug, title, source },
    }),
  }).catch(() => {
    // fire-and-forget — never block navigation
  });
}

export function ProjectCard({
  project,
  locale,
  featured = false,
  headingLevel = 3,
}: {
  project: Project;
  locale: Locale;
  featured?: boolean;
  headingLevel?: 2 | 3;
}) {
  const content = copy[locale];
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className={`project-card glass-panel ${featured ? "project-card-featured" : ""}`}>
      <div className="project-card-top">
        <span className="project-number">{project.number}</span>
        <span className="project-tier">{project.tier}</span>
      </div>
      <Link
        aria-label={`${content.common.viewCase}: ${project.title}`}
        className="project-preview-link"
        href={`/${locale}/projects/${project.slug}`}
        onClick={() => fireProjectClick(project.slug, project.title, "image")}
      >
        <Image
          alt={project.preview.alt[locale]}
          className={`project-preview-image is-${project.preview.fit}`}
          fill
          sizes={featured ? "(max-width: 820px) calc(100vw - 2rem), 58vw" : "(max-width: 580px) calc(100vw - 2rem), (max-width: 1100px) 48vw, 32vw"}
          src={project.preview.src}
          style={{ objectPosition: project.preview.position ?? "center" }}
          unoptimized={project.preview.src.endsWith(".svg")}
        />
        <span className="project-preview-cue">{content.common.viewCase} ↗</span>
      </Link>
      <div className="project-card-copy">
        <p className="eyebrow">{project.categories.join(" · ")}</p>
        <Heading>{project.title}</Heading>
        <p>{project.summary[locale]}</p>
      </div>
      <div className="tag-list" role="list" aria-label="Technology stack">
        {project.stack.slice(0, featured ? 6 : 4).map((item) => <span role="listitem" key={item}>{item}</span>)}
      </div>
      <div className="project-card-actions">
        <div className="project-repository-links" role="group" aria-label={locale === "en" ? "GitHub repositories" : "Repository GitHub"}>
          {project.repositories.map((repository) => (
            <a href={repository.href} target="_blank" rel="noreferrer" key={repository.href}>
              GitHub{project.repositories.length > 1 ? ` · ${repository.label[locale].replace(/ repository|Repository /g, "")}` : ""} ↗
            </a>
          ))}
        </div>
        <Link
          className="text-link"
          href={`/${locale}/projects/${project.slug}`}
          onClick={() => fireProjectClick(project.slug, project.title, "cta")}
        >
          {content.common.viewCase} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
