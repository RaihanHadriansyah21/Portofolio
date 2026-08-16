import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { copy, credentials, isLocale, profile, projectBySlug, projects } from "@/lib/portfolio";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];
  const flagship = projectBySlug("scovis");
  if (!flagship) notFound();

  return (
    <main id="main-content">
      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="availability-pill"><span />{content.hero.availability}</div>
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1><span>Reyy.</span>{content.hero.title}</h1>
          <p className="hero-intro">{content.hero.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${lang}/projects`}>{content.hero.primary} <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" href={`/${lang}/about`}>{content.hero.secondary}</Link>
          </div>
          <div className="hero-status">
            <span>{content.hero.status}</span>
            <span>GitHub · LinkedIn · Vercel</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Portrait of Reyy">
          <div className="portrait-grid" aria-hidden="true" />
          <div className="portrait-orbit" aria-hidden="true" />
          <Image
            src="/images/reyy-profile.png"
            alt="Reyy, AI/ML Engineer and Full-Stack Developer"
            fill
            priority
            sizes="(max-width: 820px) 92vw, 42vw"
            className="portrait-image"
          />
          <div className="portrait-caption glass-panel"><span>01</span><p>Models → APIs → Products</p></div>
        </div>
      </section>

      <section className="proof-strip section-shell" aria-label="Core strengths">
        {content.proof.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
      </section>

      <section className="section-shell section-block flagship-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.flagship.eyebrow}</p><h2>{content.flagship.title}</h2></div>
          <p>{content.flagship.intro}</p>
        </div>
        <div className="flagship-grid">
          <ProjectCard project={flagship} locale={lang} featured />
          <div className="architecture-board glass-panel">
            <div className="architecture-head"><span>SCOVIS / SYSTEM MAP</span><span>HUMAN-IN-THE-LOOP</span></div>
            <div className="architecture-flow">
              <div><span>01</span><strong>Product</strong><small>Next.js · 3 roles</small></div><i aria-hidden="true">→</i>
              <div><span>02</span><strong>Services</strong><small>FastAPI · Supabase</small></div><i aria-hidden="true">→</i>
              <div><span>03</span><strong>Inference</strong><small>Redis/RQ · TensorFlow</small></div><i aria-hidden="true">→</i>
              <div><span>04</span><strong>Review</strong><small>Lecturer override</small></div>
            </div>
            <p>{flagship.context[lang]}</p>
            <div className="architecture-stats">
              <div><strong>31</strong><span>documented API routes</span></div>
              <div><strong>3 × 24</strong><span>backbones × sections</span></div>
              <div><strong>3</strong><span>role-based workflows</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-block">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.selected.eyebrow}</p><h2>{content.selected.title}</h2></div>
          <div><p>{content.selected.intro}</p><Link className="text-link" href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link></div>
        </div>
        <div className="projects-grid home-projects">
          {projects.slice(1, 4).map((project) => <ProjectCard project={project} locale={lang} key={project.slug} />)}
        </div>
      </section>

      <section className="section-shell section-block capabilities-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.capabilities.eyebrow}</p><h2>{content.capabilities.title}</h2></div>
          <p>AI / Backend / Frontend / Mobile / Delivery</p>
        </div>
        <div className="capability-grid">
          {content.capabilities.groups.map((group, index) => (
            <article key={group.title}><span>0{index + 1}</span><h3>{group.title}</h3><p>{group.body}</p></article>
          ))}
        </div>
      </section>

      <section className="section-shell section-block credentials-preview">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">{content.learning.eyebrow}</p><h2>{content.learning.title}</h2></div>
          <div><p>{content.learning.intro}</p><Link className="text-link" href={`/${lang}/credentials`}>{content.nav.credentials} ↗</Link></div>
        </div>
        <div className="credential-list glass-panel">
          {credentials.slice(0, 4).map((credential, index) => (
            <div className="credential-row" key={credential.title}>
              <span>0{index + 1}</span>
              <div><h3>{credential.title}</h3><p>{credential.issuer} · {credential.focus[lang]}</p></div>
              <div><strong>{credential.duration || credential.date}</strong><small>{credential.duration ? credential.date : "Credential"}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell section-block about-preview">
        <div><p className="eyebrow">{content.about.eyebrow}</p><h2>{content.about.title}</h2></div>
        <div><p>{content.about.body}</p><Link className="text-link" href={`/${lang}/about`}>{content.nav.about} ↗</Link></div>
      </section>

      <section className="section-shell section-block contact-section" id="contact">
        <p className="eyebrow">{content.contact.eyebrow}</p>
        <h2>{content.contact.title}</h2>
        <p>{content.contact.body}</p>
        <div className="hero-actions">
          <a className="button button-invert" href={profile.linkedin} target="_blank" rel="noreferrer">{content.contact.cta} ↗</a>
          <a className="button button-ghost" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </section>
    </main>
  );
}
