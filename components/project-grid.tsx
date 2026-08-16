"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { copy, type Locale, type Project } from "@/lib/portfolio";

const categories = ["All", "Applied AI", "Machine Learning", "Full Stack", "Mobile", "Backend"];

export function ProjectGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const [filter, setFilter] = useState("All");
  const content = copy[locale];
  const visible = useMemo(
    () => filter === "All" ? projects : projects.filter((project) => project.categories.includes(filter)),
    [filter, projects],
  );

  return (
    <>
      <div className="filter-bar" aria-label="Filter projects">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={filter === category ? "active" : ""}
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category === "All" ? content.common.all : category}
          </button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="projects-grid">
          {visible.map((project) => <ProjectCard project={project} locale={locale} key={project.slug} />)}
        </div>
      ) : <p>{content.common.noResults}</p>}
    </>
  );
}
