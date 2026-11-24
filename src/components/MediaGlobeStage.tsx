import { useCallback, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ShowcaseMediaItem } from '../data/mediaItems';
import { HEADLINE_Z_INDEX } from '../engine/sphereMath';
import { useSphereOrbit } from '../hooks/useSphereOrbit';
import { MediaCard } from './MediaCard';

interface MediaGlobeStageProps {
  readonly items: readonly ShowcaseMediaItem[];
  readonly activeItemId: string | null;
  readonly isPaused: boolean;
  readonly reducedMotion: boolean;
  readonly onSelectMedia: (
    item: ShowcaseMediaItem,
    sourceEl: HTMLButtonElement,
  ) => void;
}

const MOBILE_INITIAL_EAGER_COUNT = 12;

export function MediaGlobeStage({
  items,
  activeItemId,
  isPaused,
  reducedMotion,
  onSelectMedia,
}: MediaGlobeStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { registerCard, getCardButtons } = useSphereOrbit({
    items,
    stageRef,
    isManuallyPaused: isPaused,
    isLightboxOpen: activeItemId !== null,
    reducedMotion,
  });

  const handleStageKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const focused = document.activeElement;
      const buttons = getCardButtons();
      if (buttons.length === 0) return;

      const visibleFront = buttons.filter(
        (btn) => Number.parseFloat(btn.dataset.zNorm ?? '0') >= -0.15,
      );
      const pool = (visibleFront.length >= 3 ? visibleFront : buttons).slice().sort(
        (a, b) =>
          Number.parseFloat(a.dataset.screenX ?? '0') -
          Number.parseFloat(b.dataset.screenX ?? '0'),
      );

      const currentIdx = pool.indexOf(focused as HTMLButtonElement);
      if (currentIdx === -1) return;

      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const nextIdx = (currentIdx + step + pool.length) % pool.length;
      pool[nextIdx]?.focus();
    },
    [getCardButtons],
  );

  return (
    <main
      id="top"
      className="relative flex flex-1 flex-col items-center justify-center overflow-x-clip bg-[var(--bg-canvas)]"
    >
      <section
        aria-labelledby="showcase-title"
        className="relative flex w-full flex-1 flex-col items-center justify-center"
      >
        <div
          ref={stageRef}
          role="group"
          aria-roledescription="Galeri bola foto 3D"
          aria-label="Bola dokumentasi Kongres Kemandirian. Seret untuk memutar, pilih foto untuk memperbesar, atau tekan panah kiri dan kanan saat fokus berada pada foto."
          onKeyDown={handleStageKeyDown}
          className="globe-stage relative flex h-[calc(100dvh-6.75rem)] min-h-[480px] w-full items-center justify-center"
        >
          {/* Headline sits at z-index 0; back cards (< 0) render behind it and front cards (>= 0) pass over it */}
          <div
            style={{ zIndex: HEADLINE_Z_INDEX }}
            className="pointer-events-none relative flex flex-col items-center px-4 text-center"
          >
            <h1
              id="showcase-title"
              style={{ fontFamily: 'var(--font-display)' }}
              className="m-0 text-[clamp(2.75rem,8vw,7.75rem)] font-bold leading-[0.88] tracking-[-0.04em] text-[var(--ink-primary)]"
            >
              <span className="block">Kongres</span>
              <span className="block">Kemandirian</span>
            </h1>
            <p className="mt-4 max-w-[min(90vw,31rem)] text-[clamp(0.95rem,1.2vw,1.125rem)] font-medium leading-[1.42] tracking-[-0.012em] text-[#3d3a35] sm:mt-5">
              Temu Tokoh Cendekiawan Indonesia
            </p>
          </div>

          {items.length === 0 ? (
            <div className="relative z-10 mt-4 rounded-2xl border border-black/10 bg-white/95 px-5 py-3 text-sm text-[var(--ink-muted)]">
              Belum ada media dokumentasi yang dimuat.
            </div>
          ) : (
            <ul className="orbit-list">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  isLightboxSource={activeItemId === item.id}
                  isLazy={item.index >= MOBILE_INITIAL_EAGER_COUNT}
                  registerCard={registerCard}
                  onSelect={onSelectMedia}
                />
              ))}
            </ul>
          )}
        </div>

        <p className="pb-2 px-4 text-center text-xs font-normal tracking-[-0.01em] text-[var(--ink-muted)] sm:text-sm">
          {reducedMotion
            ? 'Mode gerak minimal aktif · Seret untuk memutar atau klik foto untuk melihat detail'
            : 'Seret bola foto untuk memutar · Klik salah satu foto untuk pratinjau penuh'}
        </p>
      </section>
    </main>
  );
}
