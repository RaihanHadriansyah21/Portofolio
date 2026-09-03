import Link from "next/link";
import { copy, profile, type Locale } from "@/lib/portfolio";

export function SiteFooter({ locale }: { locale: Locale }) {
  const content = copy[locale];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="wordmark" href={`/${locale}`}>
          Reyy<span>.</span>
        </Link>
        <p>AI/ML Engineer &amp; Full-Stack Developer</p>
        <div className="footer-status-pill">
          <span className="footer-status-dot" />
          <span>
            {locale === "id"
              ? "Siap Bekerja Segera · Bandung / Remote"
              : "Immediate Full-Time Availability · Bandung / Remote"}
          </span>
        </div>
      </div>
      <div className="footer-columns">
        <div className="footer-nav-col">
          <span className="footer-col-title">{locale === "id" ? "Navigasi" : "Navigation"}</span>
          <div className="footer-links">
            <Link href={`/${locale}/projects`}>{content.nav.work}</Link>
            <Link href={`/${locale}/credentials`}>{content.nav.credentials}</Link>
            <Link href={`/${locale}/about`}>{content.nav.about}</Link>
            <Link href={`/${locale}#contact`}>{content.nav.contact}</Link>
          </div>
        </div>
        <div className="footer-nav-col">
          <span className="footer-col-title">{locale === "id" ? "Terhubung" : "Connect"}</span>
          <div className="footer-links">
            <a href={`mailto:${profile.email}`}>Email ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profile.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
          </div>
        </div>
      </div>
      <p className="footer-meta">© {new Date().getFullYear()} {profile.legalName} · Bandung, Indonesia (WIB / UTC+7)</p>
    </footer>
  );
}
