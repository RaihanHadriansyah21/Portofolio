import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PortfolioChat } from "@/components/portfolio-chat";
import { copy, isLocale, locales, siteUrl } from "@/lib/portfolio";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = copy[lang];
  const base = siteUrl();

  return {
    title: "AI/ML Engineer & Full-Stack Developer",
    description: content.hero.intro,
    alternates: {
      canonical: `${base}/${lang}`,
      languages: { en: `${base}/en`, id: `${base}/id` },
    },
    openGraph: {
      type: "website",
      title: "Reyy — AI/ML Engineer & Full-Stack Developer",
      description: content.hero.intro,
      locale: lang === "en" ? "en_US" : "id_ID",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reyy — AI/ML Engineer & Full-Stack Developer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reyy — AI/ML Engineer & Full-Stack Developer",
      description: content.hero.intro,
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const languageScript = `document.documentElement.lang=${JSON.stringify(lang)}`;

  return (
    <div className="site-frame" lang={lang}>
      <script dangerouslySetInnerHTML={{ __html: languageScript }} />
      <SiteHeader locale={lang} />
      {children}
      <SiteFooter locale={lang} />
      <PortfolioChat locale={lang} />
    </div>
  );
}
