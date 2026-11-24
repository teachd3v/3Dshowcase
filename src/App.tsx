import { useCallback, useEffect, useRef, useState } from 'react';
import { MediaDetailLightbox } from './components/MediaDetailLightbox';
import { MediaGlobeStage } from './components/MediaGlobeStage';
import { Navbar } from './components/Navbar';
import { SHOWCASE_MEDIA_ITEMS } from './data/mediaItems';
import type { ShowcaseMediaItem } from './data/mediaItems';
import { useReducedMotion } from './hooks/useReducedMotion';

export function App() {
  const reducedMotion = useReducedMotion();
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const pendingReturnIndexRef = useRef<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeItem: ShowcaseMediaItem | null =
    selectedIndex !== null ? (SHOWCASE_MEDIA_ITEMS[selectedIndex] ?? null) : null;

  useEffect(() => {
    if (selectedIndex !== null || pendingReturnIndexRef.current === null) return;

    const returnIndex = pendingReturnIndexRef.current;
    pendingReturnIndexRef.current = null;

    const cardBtn = document.querySelector<HTMLButtonElement>(
      `[data-card-index="${returnIndex}"]`,
    );
    if (cardBtn) {
      cardBtn.focus();
      return;
    }
    lastTriggerRef.current?.focus();
  }, [selectedIndex]);

  const handleSelectMedia = useCallback(
    (item: ShowcaseMediaItem, sourceEl: HTMLButtonElement) => {
      lastTriggerRef.current = sourceEl;
      pendingReturnIndexRef.current = null;
      setOriginRect(sourceEl.getBoundingClientRect());
      setSelectedIndex(item.index);
    },
    [],
  );

  const handleCloseLightbox = useCallback(() => {
    setSelectedIndex((current) => {
      pendingReturnIndexRef.current = current;
      return null;
    });
    setOriginRect(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + SHOWCASE_MEDIA_ITEMS.length) % SHOWCASE_MEDIA_ITEMS.length;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % SHOWCASE_MEDIA_ITEMS.length;
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      <Navbar
        isOrbitPaused={isOrbitPaused}
        onToggleOrbit={() => setIsOrbitPaused((prev) => !prev)}
        reducedMotion={reducedMotion}
      />

      <MediaGlobeStage
        items={SHOWCASE_MEDIA_ITEMS}
        activeItemId={activeItem?.id ?? null}
        isPaused={isOrbitPaused}
        reducedMotion={reducedMotion}
        onSelectMedia={handleSelectMedia}
      />

      <MediaDetailLightbox
        item={activeItem}
        originRect={originRect}
        totalCount={SHOWCASE_MEDIA_ITEMS.length}
        reducedMotion={reducedMotion}
        onClose={handleCloseLightbox}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}

export default App;
