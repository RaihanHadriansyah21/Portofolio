import {
  certificateCategoryLabels,
  certificateKindLabels,
  certificates,
} from "@/lib/certificates";
import {
  copy,
  profile,
  projects,
  type Locale,
  type Project,
} from "@/lib/portfolio";
import type { ChatMode, PortfolioSource } from "@/lib/ai/types";

type KnowledgeSection = {
  id: string;
  title: string;
  tags: string[];
  body: string;
  sources: PortfolioSource[];
  priority: number;
};

const aliases: Record<string, string[]> = {
  ai: ["artificial intelligence", "kecerdasan buatan", "machine learning", "ml"],
  backend: ["api", "fastapi", "flask", "server", "database", "redis", "supabase"],
  certificate: ["credential", "credentials", "sertifikat", "certification", "course", "kelas"],
  frontend: ["react", "next.js", "nextjs", "ui", "web", "interface", "antarmuka"],
  mobile: ["flutter", "dart", "aplikasi mobile"],
  project: ["projects", "proyek", "portfolio", "portofolio", "karya"],
  recruiter: ["hire", "hiring", "rekrut", "recruiter", "strength", "kelebihan", "fit"],
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandedTerms(query: string) {
  const normalized = normalize(query);
  const terms = new Set(
    normalized
      .split(" ")
      .map((term) => term.replace(/^[.\-]+|[.\-]+$/g, ""))
      .filter((term) => term.length > 2),
  );
  const paddedQuery = ` ${normalized} `;

  for (const [key, values] of Object.entries(aliases)) {
    const phrases = [key, ...values].map(normalize);
    if (phrases.some((phrase) => paddedQuery.includes(` ${phrase} `))) {
      terms.add(key);
      values.flatMap((value) => normalize(value).split(" ")).forEach((term) => {
        if (term.length > 2) terms.add(term);
      });
    }
  }

  return [...terms];
}

function localizedList(items: { en: string; id: string }[], locale: Locale) {
  return items.map((item) => `- ${item[locale]}`).join("\n");
}

function projectSection(project: Project, locale: Locale): KnowledgeSection {
  const route = `/${locale}/projects/${project.slug}`;
  const sources: PortfolioSource[] = [
    {
      id: `case-${project.slug}`,
      title: `${project.title} case study`,
      description: locale === "id" ? "Konteks, arsitektur, bukti, dan batasan proyek." : "Project context, architecture, evidence, and limitations.",
      href: route,
      kind: "case-study",
    },
    ...project.repositories.map((repository, index) => ({
      id: `repo-${project.slug}-${index}`,
      title: repository.label[locale],
      description: `${project.title} · GitHub`,
      href: repository.href,
      kind: "repository" as const,
    })),
    ...project.links.map((link, index) => ({
      id: `live-${project.slug}-${index}`,
      title: link.label[locale],
      description: project.title,
      href: link.href,
      kind: "live-product" as const,
    })),
  ];

  return {
    id: `project-${project.slug}`,
    title: project.title,
    tags: [project.slug, project.tier, ...project.categories, ...project.stack],
    priority: project.number === "01" ? 12 : project.number === "02" ? 9 : 5,
    sources,
    body: [
      `PROJECT: ${project.title} (${project.tier})`,
      `SUMMARY: ${project.summary[locale]}`,
      `CONTEXT: ${project.context[locale]}`,
      `REYY'S CONTRIBUTION: ${project.role[locale]}`,
      `STACK: ${project.stack.join(", ")}`,
      `CAPABILITIES:\n${localizedList(project.features, locale)}`,
      `ARCHITECTURE:\n${localizedList(project.architecture, locale)}`,
      `ENGINEERING DECISIONS:\n${localizedList(project.decisions, locale)}`,
      `VERIFIED EVIDENCE:\n${localizedList(project.evidence, locale)}`,
      `LIMITATIONS:\n${localizedList(project.limitations, locale)}`,
    ].join("\n"),
  };
}

function profileSection(locale: Locale): KnowledgeSection {
  const content = copy[locale];

  return {
    id: "profile-reyy",
    title: "Reyy profile",
    tags: ["Reyy", "Mohammad Raihan", "AI ML Engineer", "Full Stack Developer", "Indonesia", "Telkom University"],
    priority: 20,
    sources: [
      { id: "profile-about", title: locale === "id" ? "Tentang Reyy" : "About Reyy", description: content.about.title, href: `/${locale}/about`, kind: "profile" },
      { id: "profile-github", title: "GitHub", description: "RaihanHadriansyah21", href: profile.github, kind: "profile" },
      { id: "profile-linkedin", title: "LinkedIn", description: "reyhadri", href: profile.linkedin, kind: "profile" },
    ],
    body: [
      `PROFILE: ${profile.legalName}, usually called ${profile.displayName}.`,
      `POSITIONING: AI/ML Engineer and Full-Stack Developer focused on moving machine-learning work beyond notebooks into APIs, data systems, interfaces, and deployment-ready workflows.`,
      `CURRENT STATUS: Thesis defense in Telecommunication Engineering is complete. Reyy is transitioning toward full-time work while awaiting formal commencement/yudisium. Do not describe him as formally graduated or use an engineering degree title yet.`,
      `OPPORTUNITIES: Open to full-time AI/ML, backend, frontend, and full-stack roles at startups or larger technology companies in Indonesia and beyond.`,
      `ABOUT: ${content.about.body}`,
      `CORE STRENGTHS: ${content.proof.join("; ")}.`,
      `CONTACT: GitHub ${profile.github}; LinkedIn ${profile.linkedin}; Instagram ${profile.instagram}.`,
    ].join("\n"),
  };
}

function certificateSections(locale: Locale): KnowledgeSection[] {
  return certificates.map((certificate) => {
    const category = certificateCategoryLabels[certificate.category][locale];
    const kind = certificateKindLabels[certificate.kind][locale];
    const credentialPage = `/${locale}/credentials`;
    const sources: PortfolioSource[] = [
      {
        id: `certificate-${certificate.slug}`,
        title: certificate.title,
        description: `${certificate.issuer} · ${certificate.issuedAt}`,
        href: certificate.verificationUrl || credentialPage,
        kind: "certificate",
      },
    ];

    return {
      id: `certificate-${certificate.slug}`,
      title: certificate.title,
      tags: [certificate.title, certificate.issuer, category, kind, certificate.category, certificate.kind],
      priority: certificate.featured ? 6 : certificate.kind === "course" || certificate.kind === "program" ? 3 : 1,
      sources,
      body: [
        `CERTIFICATE: ${certificate.title}`,
        `ISSUER: ${certificate.issuer}`,
        `ISSUED: ${certificate.issuedAt}`,
        `CATEGORY: ${category}`,
        `TYPE: ${kind}`,
        `OFFICIAL VERIFICATION: ${certificate.verificationUrl ? "Available through the supplied source card." : "No direct public issuer verification link is recorded."}`,
        `PRIVACY: The public website uses a reviewed preview and never exposes the raw PDF.`,
      ].join("\n"),
    };
  });
}

function scoreSection(section: KnowledgeSection, terms: string[], mode: ChatMode) {
  const title = normalize(section.title);
  const tags = normalize(section.tags.join(" "));
  const body = normalize(section.body);
  let score = section.priority * 0.08;

  for (const term of terms) {
    if (title.includes(term)) score += 8;
    if (tags.includes(term)) score += 4;
    if (body.includes(term)) score += 1;
  }

  if (mode === "recruiter" && section.id.startsWith("project-")) score += section.priority * 0.22;
  if (mode === "technical" && section.id.startsWith("project-")) score += 2;
  if (mode === "explore" && (section.id === "project-scovis" || section.id === "project-dermascan")) score += 1.5;

  return score;
}

function uniqueSources(sections: KnowledgeSection[]) {
  const seen = new Set<string>();

  return sections
    .flatMap((section) => section.sources)
    .filter((source) => {
      if (seen.has(source.href)) return false;
      seen.add(source.href);
      return true;
    })
    .slice(0, 6);
}

export function retrievePortfolioKnowledge(query: string, locale: Locale, mode: ChatMode) {
  const profileKnowledge = profileSection(locale);
  const projectKnowledge = projects.map((project) => projectSection(project, locale));
  const allSections = [...projectKnowledge, ...certificateSections(locale)];
  const terms = expandedTerms(query);
  const ranked = allSections
    .map((section) => ({ section, score: scoreSection(section, terms, mode) }))
    .sort((a, b) => b.score - a.score);

  const hasCertificateIntent = terms.some((term) => ["certificate", "credential", "sertifikat", "course", "kelas"].includes(term));
  const candidates = hasCertificateIntent ? ranked : ranked.filter((item) => item.section.id.startsWith("project-"));
  const minimumScore = terms.length === 0 ? Number.POSITIVE_INFINITY : 2;
  const normalizedQuery = normalize(query);
  const explicitlyNamedProjects = projectKnowledge.filter((section) =>
    [section.title, section.id.replace("project-", "")].some((name) => normalizedQuery.includes(normalize(name))),
  );
  const selected = explicitlyNamedProjects.length > 0
    ? explicitlyNamedProjects.slice(0, 2)
    : candidates
        .filter((item) => item.score >= minimumScore)
        .slice(0, hasCertificateIntent ? 5 : 3)
        .map((item) => item.section);

  if (selected.length === 0) {
    selected.push(projectKnowledge[0], projectKnowledge[1]);
  }

  const sections = [profileKnowledge, ...selected.filter((section) => section.id !== profileKnowledge.id)];

  return {
    context: sections.map((section) => section.body).join("\n\n---\n\n"),
    sources: uniqueSources([...selected, profileKnowledge]),
  };
}
