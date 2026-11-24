interface NavbarProps {
  readonly isOrbitPaused: boolean;
  readonly onToggleOrbit: () => void;
  readonly reducedMotion: boolean;
}

export function Navbar({
  isOrbitPaused,
  onToggleOrbit,
  reducedMotion,
}: NavbarProps) {
  return (
    <header className="nav-backdrop sticky top-0 z-900 border-b border-black/6">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-3.5"
      >
        <a
          href="#top"
          aria-label="Kongres Kemandirian Dompet Dhuafa - ke awal halaman"
          className="inline-flex min-h-11 items-center rounded-lg px-1"
        >
          <img
            src="/logo/logo.svg"
            alt="Logo Dompet Dhuafa Kongres Kemandirian"
            width={100}
            height={40}
            className="h-8 w-auto select-none sm:h-9"
          />
        </a>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!reducedMotion && (
            <button
              type="button"
              onClick={onToggleOrbit}
              aria-pressed={isOrbitPaused}
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--surface-pill-border)] bg-white/90 px-3 py-2 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:bg-neutral-100 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  isOrbitPaused ? 'bg-neutral-400' : 'bg-[var(--brand-green)]'
                }`}
              />
              <span>{isOrbitPaused ? 'Putar Orbit' : 'Jeda Orbit'}</span>
            </button>
          )}

          <a
            href="https://kongreskemandirian.dompetdhuafa.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full bg-[var(--accent-cta)] px-3.5 py-2 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:bg-[var(--accent-cta-hover)] sm:gap-1.5 sm:px-5 sm:text-sm"
          >
            <span>Portal Kongres</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
