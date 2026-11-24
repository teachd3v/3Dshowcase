import { memo, useEffect, useRef, useState } from 'react';
import type { ShowcaseMediaItem } from '../data/mediaItems';

interface MediaCardProps {
  readonly item: ShowcaseMediaItem;
  readonly isLightboxSource: boolean;
  readonly isLazy: boolean;
  readonly registerCard: (
    index: number,
    refs: {
      el: HTMLLIElement;
      btn: HTMLButtonElement;
      img: HTMLImageElement;
    } | null,
  ) => void;
  readonly onSelect: (item: ShowcaseMediaItem, sourceEl: HTMLButtonElement) => void;
}

export const MediaCard = memo(function MediaCard({
  item,
  isLightboxSource,
  isLazy,
  registerCard,
  onSelect,
}: MediaCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const liRef = useRef<HTMLLIElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = liRef.current;
    const btn = btnRef.current;
    const img = imgRef.current;
    if (el && btn && img) {
      registerCard(item.index, { el, btn, img });
    }
    return () => registerCard(item.index, null);
  }, [item.index, registerCard]);

  return (
    <li ref={liRef} className="orbit-item">
      <button
        ref={btnRef}
        type="button"
        data-card-index={item.index}
        data-lightbox-source={isLightboxSource ? 'true' : undefined}
        aria-haspopup="dialog"
        aria-label={`${item.title} (${item.timestampLabel}). Buka pratinjau ukuran penuh`}
        onClick={(event) => onSelect(item, event.currentTarget)}
        style={{ visibility: isLightboxSource ? 'hidden' : 'visible' }}
        className="orbit-card"
      >
        {errored ? (
          <span className="flex h-full w-full items-center justify-center bg-[var(--surface-placeholder)] p-2 text-center text-xs font-medium text-[var(--ink-muted)]">
            Foto tidak tersedia
          </span>
        ) : (
          <img
            ref={imgRef}
            src={item.thumbSrc}
            alt={item.alt}
            width={item.width}
            height={item.height}
            loading={isLazy ? 'lazy' : 'eager'}
            decoding="async"
            draggable={false}
            fetchPriority={item.index < 6 ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={loaded ? 'is-loaded' : undefined}
          />
        )}
      </button>
    </li>
  );
});
