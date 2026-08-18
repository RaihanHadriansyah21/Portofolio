import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanyardShowcase } from "@/components/lanyard-showcase";
import { copy, isLocale, profile, siteUrl } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = siteUrl();
  return {
    title: lang === "id" ? "Tentang Reyy" : "About Reyy",
    description: "The story, engineering focus, and career direction behind Reyy's applied AI and full-stack work.",
    alternates: {
      canonical: `${base}/${lang}/about`,
      languages: { en: `${base}/en/about`, id: `${base}/id/about` },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];

  const principles = lang === "en" ? [
    ["Evidence over adjectives", "I prefer showing implementation, measured results, and honest constraints instead of inflated labels."],
    ["Models need products", "Useful AI depends on data contracts, APIs, interfaces, human review, and reliable delivery—not only model code."],
    ["Range with a center", "My range spans AI, backend, web, and mobile, while the center remains applied AI product engineering."],
  ] : [
    ["Bukti di atas kata sifat", "Saya memilih menunjukkan implementasi, hasil terukur, dan batasan jujur daripada label yang dilebihkan."],
    ["Model membutuhkan produk", "AI yang berguna bergantung pada kontrak data, API, antarmuka, human review, dan delivery yang andal—bukan hanya kode model."],
    ["Luas dengan pusat yang jelas", "Rentang saya mencakup AI, backend, web, dan mobile, dengan applied AI product engineering sebagai pusatnya."],
  ];

  const journey = lang === "en" ? {
    eyebrow: "Experience / identity",
    title: "Technical range grounded in real environments.",
    body: "My path combines structured AI training, startup technology work, organizational leadership, and a telecommunications foundation. Each setting strengthened a different part of how I build and collaborate.",
    hint: "Drag the badge to interact with it.",
    items: [
      ["2026", "AI Engineer Cohort · Coding Camp powered by DBS Foundation"],
      ["2025", "Technology Intern · CV. Bima Technologies"],
      ["2025–26", "Head of Commission 3 · HM TT Telkom University"],
      ["2022–26", "Telecommunication Engineering · Telkom University"],
    ],
  } : {
    eyebrow: "Pengalaman / identitas",
    title: "Rentang teknis yang berpijak pada lingkungan nyata.",
    body: "Perjalanan saya memadukan pelatihan AI terstruktur, pengalaman teknologi di startup, kepemimpinan organisasi, dan fondasi telekomunikasi. Setiap lingkungan memperkuat cara saya membangun dan berkolaborasi.",
    hint: "Tarik kartu identitas untuk berinteraksi.",
    items: [
      ["2026", "AI Engineer Cohort · Coding Camp powered by DBS Foundation"],
      ["2025", "Technology Intern · CV. Bima Technologies"],
      ["2025–26", "Ketua Komisi 3 · HM TT Telkom University"],
      ["2022–26", "S1 Teknik Telekomunikasi · Telkom University"],
    ],
  };

  return (
    <main id="main-content" className="page-shell section-shell about-page">
      <header className="page-hero about-hero">
        <p className="eyebrow">{content.about.eyebrow} / {profile.displayName}</p>
        <h1>{content.about.title}</h1>
        <p>{content.about.body}</p>
      </header>
      <section className="identity-showcase">
        <div className="identity-copy">
          <p className="eyebrow">{journey.eyebrow}</p>
          <h2>{journey.title}</h2>
          <p>{journey.body}</p>
          <div className="identity-timeline">
            {journey.items.map(([year, item]) => <div key={item}><span>{year}</span><p>{item}</p></div>)}
          </div>
          <p className="identity-hint">↗ {journey.hint}</p>
        </div>
        <div className="identity-lanyard glass-panel">
          <LanyardShowcase locale={lang} />
        </div>
      </section>
      <section className="about-quote glass-panel">
        <span>“</span>
        <blockquote>{lang === "en" ? "I want to be the engineer who can understand the model, design the service around it, and make the result usable for real people." : "Saya ingin menjadi engineer yang memahami model, merancang layanan di sekelilingnya, dan membuat hasilnya dapat digunakan oleh manusia nyata."}</blockquote>
      </section>
      <section className="principles-grid">
        {principles.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <section className="about-next">
        <div><p className="eyebrow">Next chapter</p><h2>{content.contact.title}</h2></div>
        <div><p>{content.contact.body}</p><a className="button button-primary" href={profile.linkedin} target="_blank" rel="noreferrer">{content.contact.cta} ↗</a><a className="text-link" href={profile.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><Link className="text-link" href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link></div>
      </section>
    </main>
  );
}
