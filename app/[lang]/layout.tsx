import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { PortfolioProvider } from "@/components/portfolio-provider";
import { PortfolioChat } from "@/components/portfolio-chat";
import { RouteProgressBar } from "@/components/route-progress-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, isLocale, locales, siteUrl } from "@/lib/portfolio";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = copy[lang];
  const base = siteUrl();
  const ogImageUrl = `${base}/api/og?title=Reyy%20%C2%B7%20AI%2FML%20Engineer%20%26%20Full-Stack&subtitle=Portfolio%202026`;

  return {
    title: "AI/ML Engineer & Full-Stack Developer",
    description: content.hero.intro,
    alternates: {
      canonical: `${base}/${lang}`,
      languages: { en: `${base}/en`, id: `${base}/id` },
    },
    openGraph: {
      type: "website",
      title: "Reyy | AI/ML Engineer & Full-Stack Developer",
      description: content.hero.intro,
      locale: lang === "en" ? "en_US" : "id_ID",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "Reyy | AI/ML Engineer & Full-Stack Developer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reyy | AI/ML Engineer & Full-Stack Developer",
      description: content.hero.intro,
      images: [ogImageUrl],
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
      <PortfolioProvider locale={lang}>
        <RouteProgressBar />
        <SiteHeader locale={lang} />
        <PageTransition>{children}</PageTransition>
        <SiteFooter locale={lang} />
        <PortfolioChat locale={lang} />
      </PortfolioProvider>
    </div>
  );
}
