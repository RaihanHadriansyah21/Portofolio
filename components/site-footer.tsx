import Link from "next/link";
import { copy, profile, type Locale } from "@/lib/portfolio";

export function SiteFooter({ locale }: { locale: Locale }) {
  const content = copy[locale];

  return (
    <footer className="site-footer">
      <div>
        <Link className="wordmark" href={`/${locale}`}>
          Reyy<span>.</span>
        </Link>
        <p>AI/ML Engineer &amp; Full-Stack Developer</p>
      </div>
      <div className="footer-links">
        <a href={`mailto:${profile.email}`}>Email ↗</a>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={profile.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
        <Link href={`/${locale}/projects`}>{content.nav.work}</Link>
      </div>
      <p className="footer-meta">© {new Date().getFullYear()} {profile.legalName}</p>
    </footer>
  );
}
