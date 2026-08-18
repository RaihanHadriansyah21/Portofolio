import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { copy, type Locale } from "@/lib/portfolio";

export function SiteHeader({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const home = `/${locale}`;

  const links = [
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
          <Link className="wordmark" href={home} aria-label="Reyy home">
            Reyy<span>.</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-controls" aria-label="Display preferences">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
            <details className="mobile-menu">
              <summary aria-label="Open navigation">MENU</summary>
              <nav aria-label="Mobile navigation">
                {links.map((link) => (
                  <Link href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </GlassSurface>
    </header>
  );
}
