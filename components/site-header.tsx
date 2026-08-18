import GlassSurface from "@/components/GlassSurface";
import { LanguageSwitcher } from "@/components/language-switcher";
import PillNav from "@/components/PillNav";
import { ThemeToggle } from "@/components/theme-toggle";
import { copy, type Locale } from "@/lib/portfolio";

export function SiteHeader({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const home = `/${locale}`;

  const links = [
    { label: locale === "id" ? "Beranda" : "Home", href: home },
    { label: content.nav.work, href: `${home}/projects` },
    { label: content.nav.credentials, href: `${home}/credentials` },
    { label: content.nav.about, href: `${home}/about` },
    { label: content.nav.contact, href: `${home}#contact` },
  ];

  return (
    <header className="site-header">
      <GlassSurface
        width="100%"
        height="var(--header-height)"
        borderRadius={999}
        borderWidth={0.045}
        brightness={58}
        opacity={0.52}
        blur={9}
        displace={1.4}
        backgroundOpacity={0.06}
        saturation={0.25}
        distortionScale={-115}
        redOffset={0}
        greenOffset={2}
        blueOffset={4}
        mixBlendMode="screen"
        className="header-glass"
      >
        <div className="header-shell">
          <PillNav
            logo="/reyy-mark.svg"
            logoAlt="Reyy portfolio mark"
            items={links}
            className="portfolio-pill-nav"
            ease="power2.out"
            baseColor="var(--foreground)"
            pillColor="var(--surface)"
            hoveredPillTextColor="var(--background)"
            pillTextColor="var(--foreground)"
            initialLoadAnimation
          />

          <div className="header-controls" aria-label="Display preferences">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
