import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AboutActionsClient } from "@/components/about-actions-client";
import { LanyardShowcase } from "@/components/lanyard-showcase";
import { copy, isLocale, profile, siteUrl } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = siteUrl();
  const titleText = lang === "id" ? "Tentang Reyy" : "About Reyy";
  const descText =
    lang === "id"
      ? "Kisah perjalanan teknis, fokus engineering, dan arah karier di balik karya applied AI dan full-stack Reyy."
      : "The story, engineering focus, and career direction behind Reyy's applied AI and full-stack work.";
  const ogImageUrl = `${base}/api/og?title=${encodeURIComponent(titleText)}&subtitle=${encodeURIComponent("AI/ML Engineer & Full-Stack Developer")}&tags=${encodeURIComponent("Applied AI · Full-Stack · Principles · Telkom University")}&badge=ABOUT`;

  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: `${base}/${lang}/about`,
      languages: { en: `${base}/en/about`, id: `${base}/id/about` },
    },
    openGraph: {
      type: "profile",
      title: `${titleText} | Reyy`,
      description: descText,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: titleText }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleText} | Reyy`,
      description: descText,
      images: [ogImageUrl],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];

  const principles = lang === "en" ? [
    ["Evidence over adjectives", "I prefer showing implementation, measured results, and honest constraints instead of inflated labels."],
    ["Models need products", "Useful AI depends on data contracts, APIs, interfaces, human review, and reliable delivery, not only model code."],
    ["Range with a center", "My range spans AI, backend, web, and mobile, while the center remains applied AI product engineering."],
  ] : [
    ["Bukti di atas kata sifat", "Saya memilih menunjukkan implementasi, hasil terukur, dan batasan jujur daripada label yang dilebihkan."],
    ["Model membutuhkan produk", "AI yang berguna bergantung pada kontrak data, API, antarmuka, human review, dan delivery yang andal, bukan hanya kode model."],
    ["Luas dengan pusat yang jelas", "Rentang saya mencakup AI, backend, web, dan mobile, dengan applied AI product engineering sebagai pusatnya."],
  ];

  const journey = lang === "en" ? {
    eyebrow: "Experience / identity",
    title: "Technical range grounded in real environments.",
    body: "My path combines structured AI training, industry technology work, organizational leadership, field telecommunications experience, and an undergraduate engineering foundation. Each setting strengthened a different part of how I build and collaborate.",
    hint: "Drag the badge to interact with it.",
    items: [
      ["2026", "AI Engineer Cohort · Coding Camp powered by DBS Foundation"],
      ["2026", "English proficiency · EPrT 490 (CEFR B1)"],
      ["2025", "Information Technology Intern · CV. Bima Technologies"],
      ["2025–26", "Head of Commission 3 · HMTT Telkom University"],
      ["2022–26", "B.Eng in Telecommunication Engineering (S.T.) · Telkom University"],
      ["2021", "Telecommunication Installation Intern · PT Telkom Indonesia (IndiHome)"],
    ],
  } : {
    eyebrow: "Pengalaman / identitas",
    title: "Rentang teknis yang berpijak pada lingkungan nyata.",
    body: "Perjalanan saya memadukan pelatihan AI terstruktur, pengalaman teknologi di lingkungan industri, kepemimpinan organisasi, pengalaman telekomunikasi lapangan, dan fondasi engineering tingkat sarjana. Setiap lingkungan memperkuat cara saya membangun dan berkolaborasi.",
    hint: "Tarik kartu identitas untuk berinteraksi.",
    items: [
      ["2026", "AI Engineer Cohort · Coding Camp powered by DBS Foundation"],
      ["2026", "Kemampuan bahasa Inggris · EPrT 490 (CEFR B1)"],
      ["2025", "Information Technology Intern · CV. Bima Technologies"],
      ["2025–26", "Kepala Komisi 3 · HMTT Telkom University"],
      ["2022–26", "S1 Teknik Telekomunikasi (S.T.) · Telkom University"],
      ["2021", "Telecommunication Installation Intern · PT Telkom Indonesia (IndiHome)"],
    ],
  };

  return (
    <main id="main-content" className="page-shell section-shell about-page">
      <header className="page-hero about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">{content.about.eyebrow} / {profile.displayName}</p>
          <h1>{content.about.title}</h1>
          <p>{content.about.body}</p>
        </div>
        <div className="about-hero-portrait">
          <div className="about-portrait-frame glass-panel">
            <Image
              src="/images/reyy-professional.webp"
              alt="Mohammad Raihan Hadriansyah Prasetya"
              width={260}
              height={325}
              priority
              className="about-portrait-image"
            />
            <div className="about-portrait-status">
              <span className="about-status-dot" />
              <span>{lang === "id" ? "Siap Bekerja Segera" : "Immediate Full-Time Availability"}</span>
            </div>
          </div>
        </div>
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
        <div className="identity-lanyard">
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
        <div>
          <p>{content.contact.body}</p>
          <AboutActionsClient locale={lang} />
        </div>
      </section>
    </main>
  );
}
