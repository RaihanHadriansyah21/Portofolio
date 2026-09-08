import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateGallery } from "@/components/certificate-gallery";
import { certificates } from "@/lib/certificates";
import { copy, isLocale, siteUrl } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = siteUrl();
  const titleText = lang === "id" ? "Sertifikat & Kredensial" : "Certificates & Credentials";
  const totalCerts = certificates.length;
  const descText =
    lang === "id"
      ? `Galeri lengkap ${totalCerts} sertifikat teknis terverifikasi, asesmen bahasa, jam belajar, dan submission proyek Reyy.`
      : `Reyy's complete verified gallery of ${totalCerts} technical certificates, coursework hours, and project submissions.`;
  const ogImageUrl = `${base}/api/og?title=${encodeURIComponent(titleText)}&subtitle=${encodeURIComponent(`${totalCerts} Verified Technical Credentials`)}&tags=${encodeURIComponent("Deep Learning · Azure GenAI · Microsoft Fabric · Dicoding")}&badge=CREDENTIALS`;

  return {
    title: lang === "id" ? "Sertifikat" : "Certificates",
    description: descText,
    alternates: {
      canonical: `${base}/${lang}/credentials`,
      languages: { en: `${base}/en/credentials`, id: `${base}/id/credentials` },
    },
    openGraph: {
      type: "website",
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

export default async function CredentialsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = copy[lang];
  const verifiedCount = certificates.filter((certificate) => certificate.verificationUrl).length;
  const privacySafeCount = certificates.filter((certificate) => certificate.privacyRedacted).length;

  return (
    <main id="main-content" className="page-shell section-shell">
      <header className="page-hero">
        <p className="eyebrow">{content.learning.eyebrow} / {certificates.length} {lang === "id" ? "bukti unik" : "unique proofs"}</p>
        <h1>{content.learning.title}</h1>
        <p>{lang === "id"
          ? "Kumpulan kelulusan program, kelas teknis, asesmen bahasa, workshop, event, dan aktivitas kepemimpinan. Setiap preview ditinjau untuk privasi; PDF mentah tidak dipublikasikan."
          : "A collection of program completions, technical courses, language assessments, workshops, events, and leadership activities. Every preview is privacy-reviewed; raw PDFs are not published."}</p>
      </header>
      <div className="certificate-proof-strip glass-panel" aria-label={lang === "id" ? "Ringkasan sertifikat" : "Certificate summary"} role="region">
        <div><strong>{certificates.length}</strong><span>{lang === "id" ? "Sertifikat unik" : "Unique credentials"}</span></div>
        <div><strong>{verifiedCount}</strong><span>{lang === "id" ? "Link verifikasi resmi" : "Official verification links"}</span></div>
        <div><strong>{privacySafeCount}</strong><span>{lang === "id" ? "Preview disensor" : "Redacted previews"}</span></div>
        <div><strong>0</strong><span>{lang === "id" ? "PDF mentah publik" : "Raw public PDFs"}</span></div>
      </div>
      <CertificateGallery items={certificates} lang={lang} />
      <div className="editorial-note">
        <p className="eyebrow">{lang === "id" ? "Catatan kurasi" : "Curation note"}</p>
        <p>{lang === "en"
          ? "Course and program completions are positioned as stronger technical evidence. Attendance records are labeled honestly and shown as continuous-learning signals, not substitutes for project proof. Official verification is linked only when the issuer provides a direct public page."
          : "Kelulusan kelas dan program diposisikan sebagai bukti teknis yang lebih kuat. Catatan kehadiran diberi label secara jujur sebagai sinyal belajar berkelanjutan, bukan pengganti bukti proyek. Verifikasi resmi hanya ditautkan saat penerbit menyediakan halaman publik langsung."}</p>
      </div>
    </main>
  );
}
