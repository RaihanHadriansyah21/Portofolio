'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => <div className="lanyard-loading" aria-hidden="true"><span>REYY</span></div>
});

export function LanyardShowcase({ locale }) {
  // Start with the accessible, lightweight pass. The 3D bundle is only
  // requested after the browser confirms that motion is welcome.
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  if (reduceMotion) {
    return (
      <div className="lanyard-static-pass" role="img" aria-label="Reyy engineering identity badge">
        <span>01 / REYY</span>
        <strong>AI/ML</strong>
        <p>FULL-STACK ENGINEER</p>
      </div>
    );
  }

  return (
    <div className="lanyard-canvas" aria-hidden="true">
      <Lanyard
        position={[0, 0, 24]}
        gravity={[0, -40, 0]}
        fov={22}
        frontImage="/react-bits/lanyard/reyy-pass-front.svg"
        backImage="/react-bits/lanyard/reyy-pass-back.svg"
        lanyardImage="/react-bits/lanyard/reyy-band.svg"
        lanyardWidth={0.82}
        imageFit="cover"
      />
      <span className="sr-only">
        {locale === 'id' ? 'Kartu identitas engineering Reyy interaktif.' : 'Interactive Reyy engineering identity card.'}
      </span>
    </div>
  );
}
