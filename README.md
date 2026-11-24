# Kongres Kemandirian · 3D Media Showcase

Galeri dokumentasi interaktif 3D untuk **Kongres Kemandirian — Temu Tokoh Cendekiawan Indonesia** (Dompet Dhuafa), dibangun menggunakan Vite, React, TypeScript, dan Tailwind CSS v4.

## Fitur Utama

- **3D Photo Globe**: Distribusi bola Fibonacci + proyeksi elipsoid dengan perspektif skala dinamis (`~0.73x` hingga `~1.61x`), sumbu putar miring, mouse parallax, dan blur kedalaman 3 tingkat.
- **Interaksi Responsif**: Drag-to-rotate dengan inersia lepas, perlambatan otomatis saat hover, kontrol `Jeda Orbit` / `Putar Orbit`, serta navigasi keyboard (`Tab`, `ArrowLeft`, `ArrowRight`, `Enter`, `Escape`).
- **3D FLIP Lightbox**: Transisi pembesaran kartu ke pratinjau resolusi penuh dengan navigasi `Sebelumnya` / `Berikutnya` dan pemulihan fokus otomatis saat ditutup.

## Pengembangan Lokal

```bash
npm install
npm run dev
```

## Pengujian & Build Produksi

```bash
npm run lint
npm test
npm run build
```

## Deploy ke Cloudflare Pages

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: diatur melalui `.node-version` (`22`)
