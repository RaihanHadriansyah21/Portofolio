'use client';

import ProfileCard from './ProfileCard';
import type { Locale } from '@/lib/portfolio';

const LINKEDIN_URL = 'https://www.linkedin.com/in/reyhadri';

export interface HeroProfileCardProps {
  locale: Locale;
}

export function HeroProfileCard({ locale }: HeroProfileCardProps) {
  const isIndonesian = locale === 'id';

  const openLinkedIn = (): void => {
    const profileWindow = window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer');
    if (profileWindow) profileWindow.opener = null;
  };

  return (
    <div className="hero-profile-card">
      <ProfileCard
        avatarUrl="/images/reyy-professional.webp"
        miniAvatarUrl="/images/reyy-professional.webp"
        iconUrl=""
        grainUrl=""
        name="Reyy"
        title="AI/ML Engineer · Full Stack"
        handle="reyhadri"
        status={isIndonesian ? 'Terbuka untuk kerja' : 'Open to work'}
        contactText={isIndonesian ? 'Terhubung' : 'Connect'}
        showUserInfo
        enableTilt
        enableMobileTilt={false}
        behindGlowEnabled={false}
        innerGradient="linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 56%, rgba(0,0,0,0.72) 100%)"
        onContactClick={openLinkedIn}
      />
    </div>
  );
}
