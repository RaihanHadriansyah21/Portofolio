import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copy, credentials, isLocale, siteUrl } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = siteUrl();
  return {
    title: lang === "id" ? "Kredensial" : "Credentials",
    description: "Selected technical learning credentials supporting Reyy's AI and software engineering practice.",
    alternates: {
      canonical: `${base}/${lang}/credentials`,
      languages: { en: `${base}/en/credentials`, id: `${base}/id/credentials` },
    },
  };
}

export default async function CredentialsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];

  return (
    <main id="main-content" className="page-shell section-shell">
      <header className="page-hero">
        <p className="eyebrow">{content.learning.eyebrow} / 2026</p>
        <h1>{content.learning.title}</h1>
        <p>{content.learning.intro}</p>
      </header>
      <div className="credentials-page-list">
        {credentials.map((credential, index) => (
          <article className="credential-card glass-panel" key={credential.title}>
            <div><span>0{index + 1}</span><p>{credential.issuer}</p></div>
            <h2>{credential.title}</h2>
            <p>{credential.focus[lang]}</p>
            <footer><span>{credential.date}</span><strong>{credential.duration || "Technical credential"}</strong></footer>
          </article>
        ))}
      </div>
      <div className="editorial-note">
        <p className="eyebrow">Curation note</p>
        <p>{lang === "en" ? "The homepage prioritizes six high-signal technical credentials. Workshops, organization, leadership, and attendance records will be added only after privacy-safe asset review." : "Halaman utama memprioritaskan enam kredensial teknis dengan sinyal kuat. Workshop, organisasi, kepemimpinan, dan catatan kehadiran akan ditambahkan setelah peninjauan aset yang aman untuk privasi."}</p>
      </div>
    </main>
  );
}
