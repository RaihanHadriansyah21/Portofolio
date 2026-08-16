import Link from "next/link";
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
      <div className="header-shell glass-panel">
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
    </header>
  );
}
