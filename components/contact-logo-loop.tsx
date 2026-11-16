'use client';

import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import type { LogoNodeItem } from '@/components/LogoLoop';
import type { Locale } from '@/lib/portfolio';
import { profile } from '@/lib/portfolio';

const contactLogos: readonly LogoNodeItem[] = [
  {
    node: (
      <span className="contact-logo-chip">
        <FaLinkedinIn aria-hidden="true" />
        <span>LinkedIn</span>
      </span>
    ),
    title: 'LinkedIn',
    ariaLabel: "Open Reyy's LinkedIn profile",
    href: profile.linkedin
  },
  {
    node: (
      <span className="contact-logo-chip">
        <FaGithub aria-hidden="true" />
        <span>GitHub</span>
      </span>
    ),
    title: 'GitHub',
    ariaLabel: "Open Reyy's GitHub profile",
    href: profile.github
  },
  {
    node: (
      <span className="contact-logo-chip">
        <FaInstagram aria-hidden="true" />
        <span>Instagram</span>
      </span>
    ),
    title: 'Instagram',
    ariaLabel: "Open Reyy's Instagram profile",
    href: profile.instagram
  },
  {
    node: (
      <span className="contact-logo-chip">
        <FaEnvelope aria-hidden="true" />
        <span>Email</span>
      </span>
    ),
    title: 'Email',
    ariaLabel: 'Email Reyy',
    href: `mailto:${profile.email}`
  }
];

export interface ContactLogoLoopProps {
  locale: Locale;
}

export function ContactLogoLoop({ locale }: ContactLogoLoopProps) {
  return (
    <nav className="contact-loop-shell" aria-label={locale === 'id' ? 'Tautan kontak Reyy' : 'Reyy contact links'}>
      <ul className="contact-links">
        {contactLogos.map((logo) => (
          <li key={logo.title}>
            <a href={logo.href} aria-label={locale === 'id' ? `Hubungi Reyy melalui ${logo.title}` : logo.ariaLabel}>
              {logo.node}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
