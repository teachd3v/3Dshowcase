import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ShowcaseMediaItem } from '../data/mediaItems';

interface MediaDetailLightboxProps {
  readonly item: ShowcaseMediaItem | null;
  readonly originRect: DOMRect | null;
  readonly totalCount: number;
  readonly reducedMotion: boolean;
  readonly onClose: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function MediaDetailLightbox({
  item,
  originRect,
  totalCount,
  reducedMotion,
  onClose,
  onPrev,
  onNext,
}: MediaDetailLightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const isClosingRef = useRef(false);
  const hasPlayedEntryFlipRef = useRef<string | null>(null);

  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [erroredId, setErroredId] = useState<string | null>(null);

  const fullLoaded = item !== null && loadedId === item.id;
  const fullErrored = item !== null && erroredId === item.id;

  const triggerClose = useCallback(() => {
    if (!item || isClosingRef.current) return;
    isClosingRef.current = true;

    const viewer = viewerRef.current;
    const backdrop = backdropRef.current;
    const header = headerRef.current;
    const targetCard = document.querySelector<HTMLElement>(
      `[data-card-index="${item.index}"]`,
    );
    const destRect = targetCard?.getBoundingClientRect() ?? originRect;

    if (
      reducedMotion ||
      !viewer ||
      !destRect ||
      typeof viewer.animate !== 'function'
    ) {
      isClosingRef.current = false;
      hasPlayedEntryFlipRef.current = null;
      onClose();
      return;
    }

    const currentRect = viewer.getBoundingClientRect();
    const dx =
      destRect.left +
      destRect.width / 2 -
      (currentRect.left + currentRect.width / 2);
    const dy =
      destRect.top +
      destRect.height / 2 -
      (currentRect.top + currentRect.height / 2);
    const sx = Math.max(0.15, destRect.width / Math.max(1, currentRect.width));
    const sy = Math.max(0.15, destRect.height / Math.max(1, currentRect.height));

    header?.animate(
      [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(6px)' },
      ],
      { duration: 150, easing: 'ease-out', fill: 'forwards' },
    );

    backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 240,
      easing: 'ease-out',
      fill: 'forwards',
    });

    const anim = viewer.animate(
      [
        {
          transform: 'perspective(1100px) translate3d(0px, 0px, 0px) scale(1, 1)',
          opacity: 1,
        },
        {
          transform: `perspective(1100px) translate3d(${dx}px, ${dy}px, -90px) scale(${sx}, ${sy})`,
          opacity: 0.92,
        },
      ],
      {
        duration: 250,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      },
    );

    anim.onfinish = () => {
      isClosingRef.current = false;
      hasPlayedEntryFlipRef.current = null;
      onClose();
    };
  }, [item, onClose, originRect, reducedMotion]);

  useLayoutEffect(() => {
    if (!item) {
      hasPlayedEntryFlipRef.current = null;
      isClosingRef.current = false;
      return;
    }

    const viewer = viewerRef.current;
    const backdrop = backdropRef.current;
    const header = headerRef.current;

    if (!viewer) return;

    // Only run the 3D FLIP flight from the card on initial open, not on Prev/Next step.
    if (
      originRect &&
      hasPlayedEntryFlipRef.current === null &&
      !reducedMotion &&
      typeof viewer.animate === 'function'
    ) {
      hasPlayedEntryFlipRef.current = item.id;
      const lastRect = viewer.getBoundingClientRect();
      const dx =
        originRect.left +
        originRect.width / 2 -
        (lastRect.left + lastRect.width / 2);
      const dy =
        originRect.top +
        originRect.height / 2 -
        (lastRect.top + lastRect.height / 2);
      const sx = Math.max(0.15, originRect.width / Math.max(1, lastRect.width));
      const sy = Math.max(0.15, originRect.height / Math.max(1, lastRect.height));

      backdrop?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 260,
        easing: 'ease-out',
      });

      viewer.animate(
        [
          {
            transform: `perspective(1100px) translate3d(${dx}px, ${dy}px, -110px) scale(${sx}, ${sy})`,
          },
          {
            transform: 'perspective(1100px) translate3d(0px, 0px, 0px) scale(1, 1)',
          },
        ],
        {
          duration: 440,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      );

      header?.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0px)' },
        ],
        {
          duration: 340,
          delay: 90,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        },
      );
    } else if (hasPlayedEntryFlipRef.current === null) {
      hasPlayedEntryFlipRef.current = item.id;
    }
  }, [item, originRect, reducedMotion]);

  useEffect(() => {
    if (!item) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        triggerClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href]',
          ),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onNext, onPrev, triggerClose]);

  if (!item) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        ref={backdropRef}
        onClick={triggerClose}
        aria-hidden="true"
        className="lightbox-backdrop fixed inset-0"
      />

      <div className="relative z-10 flex w-full max-w-[min(92vw,720px)] flex-col gap-3.5">
        <div
          ref={headerRef}
          className="flex flex-wrap items-end justify-between gap-3 px-1"
        >
          <div className="min-w-0 flex-1">
            <h2
              id="lightbox-title"
              className="truncate text-[clamp(1.15rem,2vw,1.55rem)] font-medium tracking-[-0.03em] text-[var(--ink-primary)]"
            >
              {item.title}
            </h2>
            <p className="mt-0.5 text-xs font-normal text-[var(--ink-muted)] sm:text-sm">
              {item.timestampLabel} · {item.index + 1} / {totalCount}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={triggerClose}
            aria-label="Tutup pratinjau foto"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-black/14 bg-white/95 px-4 py-2 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:bg-white"
          >
            <span aria-hidden="true">✕</span>
            <span>Tutup</span>
          </button>
        </div>

        <div
          ref={viewerRef}
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
          className="showcase-viewer-shape relative w-full overflow-hidden border border-[var(--surface-viewer-border)] bg-[var(--surface-placeholder)]"
        >
          <img
            key={`thumb-${item.id}`}
            src={item.thumbSrc}
            alt=""
            aria-hidden="true"
            width={item.width}
            height={item.height}
            className="h-full w-full object-cover"
          />

          {!fullErrored && (
            <img
              key={`full-${item.id}`}
              src={item.fullSrc}
              alt={item.alt}
              width={item.width}
              height={item.height}
              onLoad={() => setLoadedId(item.id)}
              onError={() => setErroredId(item.id)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                fullLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Foto sebelumnya"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/14 bg-white/95 px-4 py-2 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:bg-white"
          >
            <span aria-hidden="true">←</span>
            <span>Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Foto berikutnya"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/14 bg-white/95 px-4 py-2 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:bg-white"
          >
            <span>Berikutnya</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
