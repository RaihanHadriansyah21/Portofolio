import type { MetadataRoute } from "next";
import { locales, projects, siteUrl } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const core = ["", "/projects", "/credentials", "/about"];
  const alternates = (path: string) => ({
    languages: {
      en: `${base}/en${path}`,
      id: `${base}/id${path}`,
    },
  });
  const routes = locales.flatMap((lang) => [
    ...core.map((path) => ({ url: `${base}/${lang}${path}`, priority: path === "" ? 1 : 0.8, alternates: alternates(path) })),
    ...projects.map((project) => {
      const path = `/projects/${project.slug}`;
      return { url: `${base}/${lang}${path}`, priority: project.slug === "scovis" ? 0.9 : 0.7, alternates: alternates(path) };
    }),
  ]);

  return routes.map((route) => ({ ...route, changeFrequency: "monthly" as const }));
}
