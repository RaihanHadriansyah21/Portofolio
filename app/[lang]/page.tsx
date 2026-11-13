import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroActionsClient } from "@/components/hero-actions-client";
import { AvailabilityBadge } from "@/components/availability-badge";
import { SkillMatrix } from "@/components/skill-matrix";
import { ContactForm } from "@/components/contact-form";
import { ContactLogoLoop } from "@/components/contact-logo-loop";
import { HeroProfileCard } from "@/components/hero-profile-card";
import { ProjectCard } from "@/components/project-card";
import { copy, credentials, isLocale, profile, projectBySlug, projects } from "@/lib/portfolio";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];
  const home = lang === "id" ? {
    flagship: "SCOVIS: rekomendasi AI, keputusan di tangan dosen.",
    selected: "Proyek lain yang saya bangun.",
    selectedIntro: "Eksplorasi computer vision, integrasi backend, dan pengalaman belajar mobile.",
    capabilities: "Teknologi di balik proyek.",
    exploreSkills: "Jelajahi teknologi dan proyek terkait",
    learning: "Pelatihan yang mendukung karya.",
    about: "Kenali Reyy lebih dekat.",
    contact: "Mari membangun produk yang berguna.",
  } : {
    flagship: "SCOVIS: AI recommendations, lecturer decisions.",
    selected: "More projects I’ve built.",
    selectedIntro: "Explore computer vision, backend integration, and mobile learning experiences.",
    capabilities: "The tools behind the projects.",
    exploreSkills: "Explore technologies and related projects",
    learning: "Training that supports the work.",
    about: "A little more about Reyy.",
    contact: "Let’s build something useful.",
  };
  const flagship = projectBySlug("scovis");
  if (!flagship) notFound();
  const architectureLabels = lang === "id"
    ? {
        title: "PETA SISTEM",
        workflow: "DENGAN PENINJAUAN MANUSIA",
        product: "Produk",
        services: "Layanan",
        inference: "Inferensi",
        review: "Tinjauan",
        lecturerOverride: "Override dosen",
        documentedRoutes: "rute API terdokumentasi",
        backbonesSections: "backbone × bagian",
        roleWorkflows: "alur kerja berdasarkan peran",
      }
    : {
        title: "SYSTEM MAP",
        workflow: "HUMAN-IN-THE-LOOP",
        product: "Product",
        services: "Services",
        inference: "Inference",
        review: "Review",
        lecturerOverride: "Lecturer override",
        documentedRoutes: "documented API routes",
        backbonesSections: "backbones × sections",
        roleWorkflows: "role-based workflows",
      };

  return (
    <main id="main-content" className="home-page">
      <section className="hero section-shell">
        <div className="hero-copy">
          <AvailabilityBadge locale={lang} />
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1><span>Reyy.</span>{content.hero.title}</h1>
          <p className="hero-intro">{content.hero.intro}</p>
          <HeroActionsClient locale={lang} />
          <div className="hero-status">
            <span>{content.hero.status}</span>
            <span className="hero-social-links">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a> ·{" "}
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> ·{" "}
              <a href={profile.instagram} target="_blank" rel="noreferrer">Instagram</a> ·{" "}
              <a href="https://portoreyy.vercel.app" target="_blank" rel="noreferrer">Vercel</a>
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Portrait of Reyy">
          <div className="portrait-grid" aria-hidden="true" />
          <div className="portrait-orbit" aria-hidden="true" />
          <HeroProfileCard locale={lang} />
        </div>
      </section>

      <section className="section-shell section-block flagship-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.flagship.eyebrow}</p><h2>{home.flagship}</h2></div>
          <p>{content.flagship.intro}</p>
        </div>
        <div className="flagship-grid">
          <ProjectCard project={flagship} locale={lang} featured />
          <div className="architecture-board glass-panel">
            <div className="architecture-head"><span>SCOVIS / {architectureLabels.title}</span><span>{architectureLabels.workflow}</span></div>
            <div className="architecture-flow">
              <div><span>01</span><strong>{architectureLabels.product}</strong><small>Next.js · 3 {lang === "id" ? "peran" : "roles"}</small></div><i aria-hidden="true">→</i>
              <div><span>02</span><strong>{architectureLabels.services}</strong><small>FastAPI · Supabase</small></div><i aria-hidden="true">→</i>
              <div><span>03</span><strong>{architectureLabels.inference}</strong><small>Redis/RQ · TensorFlow</small></div><i aria-hidden="true">→</i>
              <div><span>04</span><strong>{architectureLabels.review}</strong><small>{architectureLabels.lecturerOverride}</small></div>
            </div>
            <p>{flagship.context[lang]}</p>
            <div className="architecture-stats">
              <div><strong>31</strong><span>{architectureLabels.documentedRoutes}</span></div>
              <div><strong>3 × 24</strong><span>{architectureLabels.backbonesSections}</span></div>
              <div><strong>3</strong><span>{architectureLabels.roleWorkflows}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-block">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.selected.eyebrow}</p><h2>{home.selected}</h2></div>
          <div><p>{home.selectedIntro}</p><Link className="text-link" href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link></div>
        </div>
        <div className="projects-grid home-projects">
          {projects.slice(1, 4).map((project) => <ProjectCard project={project} locale={lang} key={project.slug} />)}
        </div>
      </section>

      <section className="section-shell section-block capabilities-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.capabilities.eyebrow}</p><h2>{home.capabilities}</h2></div>
          <p>AI / Backend / Frontend / Mobile / Delivery</p>
        </div>
        <details className="home-skill-details glass-panel">
          <summary>{home.exploreSkills}</summary>
          <div className="capability-grid">
            {content.capabilities.groups.map((group, index) => (
              <article key={group.title}><span>0{index + 1}</span><h3>{group.title}</h3><p>{group.body}</p></article>
            ))}
          </div>
          <SkillMatrix locale={lang} />
        </details>
      </section>

      <section className="section-shell section-block credentials-preview">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.learning.eyebrow}</p><h2>{home.learning}</h2></div>
          <div><p>{content.learning.intro}</p><Link className="text-link" href={`/${lang}/credentials`}>{content.nav.credentials} ↗</Link></div>
        </div>
        <div className="credential-list glass-panel">
          {credentials.slice(0, 3).map((credential, index) => (
            <div className="credential-row" key={credential.title}>
              <span>0{index + 1}</span>
              <div><h3>{credential.title}</h3><p>{credential.issuer} · {credential.focus[lang]}</p></div>
              <div><strong>{credential.duration || credential.date}</strong><small>{credential.duration ? credential.date : lang === "id" ? "Sertifikat" : "Certificate"}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell section-block about-preview">
        <div><p className="eyebrow">{content.about.eyebrow}</p><h2>{home.about}</h2></div>
        <div><p>{content.about.body}</p><Link className="text-link" href={`/${lang}/about`}>{content.nav.about} ↗</Link></div>
      </section>

      <section className="section-shell section-block contact-section" id="contact">
        <p className="eyebrow">{content.contact.eyebrow}</p>
        <h2>{home.contact}</h2>
        <p>{content.contact.body}</p>
        <ContactLogoLoop locale={lang} />
        <ContactForm locale={lang} />
      </section>
    </main>
  );
}
