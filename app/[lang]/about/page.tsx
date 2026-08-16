import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, isLocale, profile } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "id" ? "Tentang Reyy" : "About Reyy", description: "The story, engineering focus, and career direction behind Reyy's applied AI and full-stack work." };
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

  return (
    <main id="main-content" className="page-shell section-shell about-page">
      <header className="page-hero about-hero">
        <p className="eyebrow">{content.about.eyebrow} / {profile.displayName}</p>
        <h1>{content.about.title}</h1>
        <p>{content.about.body}</p>
      </header>
      <section className="about-quote glass-panel">
        <span>“</span>
        <blockquote>{lang === "en" ? "I want to be the engineer who can understand the model, design the service around it, and make the result usable for real people." : "Saya ingin menjadi engineer yang memahami model, merancang layanan di sekelilingnya, dan membuat hasilnya dapat digunakan oleh manusia nyata."}</blockquote>
      </section>
      <section className="principles-grid">
        {principles.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <section className="about-next">
        <div><p className="eyebrow">Next chapter</p><h2>{content.contact.title}</h2></div>
        <div><p>{content.contact.body}</p><a className="button button-primary" href={profile.linkedin} target="_blank" rel="noreferrer">{content.contact.cta} ↗</a><Link className="text-link" href={`/${lang}/projects`}>{content.common.viewAll} ↗</Link></div>
      </section>
    </main>
  );
}
