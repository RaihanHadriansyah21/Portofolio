'use client';

import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => <div className="lanyard-loading" aria-hidden="true"><span>REYY</span></div>
});

export function LanyardShowcase({ locale }) {
  return (
    <div className="lanyard-canvas" aria-hidden="true">
      <Lanyard
        position={[0, 1.2, 15]}
        gravity={[0, -40, 0]}
        fov={18}
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
