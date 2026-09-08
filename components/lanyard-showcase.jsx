'use client';

import { useSyncExternalStore, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="lanyard-loading" aria-hidden="true">
      <span>REYY</span>
    </div>
  ),
});

function subscribeResize(callback) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getMobileSnapshot() {
  return Boolean(
    window.innerWidth <= 768 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
}

function getServerMobileSnapshot() {
  return false;
}

function useIsMobile() {
  return useSyncExternalStore(subscribeResize, getMobileSnapshot, getServerMobileSnapshot);
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function LanyardShowcase({ locale }) {
  const isMobile = useIsMobile();
  const mounted = useMounted();
  const [enable3DOnMobile, setEnable3DOnMobile] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const shouldRender3D = !isMobile || enable3DOnMobile;

  return (
    <div className="lanyard-canvas" aria-hidden="true" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '460px' }}>
      {mounted && shouldRender3D ? (
        <Lanyard
          position={[0, 1.2, 5.5]}
          gravity={[0, -40, 0]}
          fov={26}
          frontImage="/react-bits/lanyard/reyy-pass-front.svg"
          backImage="/react-bits/lanyard/reyy-pass-back.svg"
          lanyardImage="/react-bits/lanyard/reyy-band.svg"
          lanyardWidth={1.6}
          cardScale={5.0}
          imageFit="cover"
        />
      ) : (
        /* Lightweight High-Fidelity CSS 3D Fallback Card for Mobile */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '1.5rem 1rem',
            position: 'relative',
          }}
        >
          {/* Lanyard Band Simulation */}
          <div
            style={{
              width: '28px',
              height: '90px',
              background: 'repeating-linear-gradient(45deg, #18191c, #18191c 8px, #2a2c33 8px, #2a2c33 16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '3px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              marginBottom: '-8px',
              zIndex: 1,
            }}
          />

          {/* Metal Clip */}
          <div
            style={{
              width: '38px',
              height: '16px',
              background: 'linear-gradient(180deg, #d1d5db 0%, #4b5563 50%, #9ca3af 100%)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              marginBottom: '-6px',
              zIndex: 2,
            }}
          />

          {/* 3D Perspective Flip Card */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            style={{
              width: '220px',
              height: '310px',
              perspective: '1000px',
              cursor: 'pointer',
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front Face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  background: '#0d0e11',
                }}
              >
                <Image
                  src="/react-bits/lanyard/reyy-pass-front.svg"
                  alt="Reyy Identity Pass Front"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Back Face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  background: '#0d0e11',
                }}
              >
                <Image
                  src="/react-bits/lanyard/reyy-pass-back.svg"
                  alt="Reyy Identity Pass Back"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          {/* Hint & Mobile 3D Toggle */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', zIndex: 4 }}>
            <span style={{ fontSize: '0.74rem', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
              {locale === 'id' ? '👆 Ketuk kartu untuk membalik' : '👆 Tap card to flip'}
            </span>
            <button
              type="button"
              onClick={() => setEnable3DOnMobile(true)}
              style={{
                fontSize: '0.72rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: 'var(--foreground, #fff)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {locale === 'id' ? '⚡ Aktifkan Fisika 3D' : '⚡ Enable 3D Physics'}
            </button>
          </div>
        </div>
      )}

      <span className="sr-only">
        {locale === 'id'
          ? 'Kartu identitas engineering Reyy interaktif.'
          : 'Interactive Reyy engineering identity card.'}
      </span>
    </div>
  );
}
