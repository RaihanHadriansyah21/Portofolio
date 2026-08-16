import type { MetadataRoute } from "next";
import { locales, projects, siteUrl } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const core = ["", "/projects", "/credentials", "/about"];
  const routes = locales.flatMap((lang) => [
    ...core.map((path) => ({ url: `${base}/${lang}${path}`, priority: path === "" ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: `${base}/${lang}/projects/${project.slug}`, priority: project.slug === "scovis" ? 0.9 : 0.7 })),
  ]);

  return routes.map((route) => ({ ...route, changeFrequency: "monthly" as const }));
}
