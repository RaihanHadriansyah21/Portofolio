'use client';

import { useEffect, useRef, useSyncExternalStore, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { Locale } from '@/lib/portfolio';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => (
    <div className="lanyard-loading" aria-hidden="true">
      <span>REYY</span>
    </div>
  ),
});

function subscribeResize(callback: () => void): () => void {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getMobileSnapshot(): boolean {
  return Boolean(
    window.innerWidth <= 768 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
}

function getServerMobileSnapshot(): boolean {
  return false;
}

function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeResize, getMobileSnapshot, getServerMobileSnapshot);
}

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Returns true once the observed element is within `rootMargin` of the
 * viewport. Uses IntersectionObserver with a 400 px pre-load margin so the
 * Three.js / Rapier WASM chunk is fetched and initialized slightly before the
 * user scrolls the section fully into view, avoiding a visible delay.
 *
 * Falls back to `true` immediately in environments where IntersectionObserver
 * is unavailable (e.g. very old browsers), preserving existing behaviour.
 */
function useNearViewport(ref: React.RefObject<HTMLElement | null>): boolean {
  // If IntersectionObserver is unavailable (very old browsers, some test envs),
  // initialise to true so the 3D component mounts immediately — same as before.
  // The lazy initializer runs once on mount, not inside an effect, so it does not
  // trigger the react-hooks/set-state-in-effect lint rule.
  const [isNear, setIsNear] = useState<boolean>(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    // Already near (either pre-initialised above, or IO already fired).
    if (isNear) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      // 400 px pre-load margin: start initialising while still off-screen.
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return isNear;
}

export interface LanyardShowcaseProps {
  locale: Locale;
}

export function LanyardShowcase({ locale }: LanyardShowcaseProps) {
  const isMobile = useIsMobile();
  // `mounted` is kept for SSR/client boundary safety on mobile path only.
  // For the desktop 3D path, `isNearViewport` is the authoritative gate.
  const mounted = useMounted();
  const [enable3DOnMobile, setEnable3DOnMobile] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Ref attached to the outermost container so IntersectionObserver can watch
  // the section boundary without depending on any inner DOM structure.
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useNearViewport(containerRef);

  const shouldRender3D = !isMobile || enable3DOnMobile;

  return (
    <div ref={containerRef} className="lanyard-canvas" aria-hidden="true">
      {/*
       * Render order:
       * 1. SSR / before hydration   → nothing (aria-hidden wrapper present for layout)
       * 2. Client, out of viewport  → lanyard-loading skeleton (existing CSS, no JS weight)
       * 3. Client, near viewport    → Lanyard dynamic import fires; loading fallback shown
       *                               briefly while chunk arrives, then full 3D experience
       * Mobile path is unchanged and bypasses the IntersectionObserver gate entirely.
       */}
      {mounted && isNearViewport && shouldRender3D ? (
        <Lanyard
          position={[0, 1.2, 10]}
          gravity={[0, -40, 0]}
          fov={18}
          frontImage="/react-bits/lanyard/reyy-pass-front.svg"
          backImage="/react-bits/lanyard/reyy-pass-back.svg"
          lanyardImage="/react-bits/lanyard/reyy-band.svg"
          lanyardWidth={1.0}
          cardScale={2.4}
          imageFit="cover"
        />
      ) : mounted && !isNearViewport && !isMobile ? (
        /* Pre-viewport skeleton: same visual as the dynamic loading fallback,
           same fixed height as the canvas — zero layout shift on mount. */
        <div className="lanyard-loading" aria-hidden="true">
          <span>REYY</span>
        </div>
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
