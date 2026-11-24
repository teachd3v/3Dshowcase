export interface ShowcaseMediaItem {
  readonly id: string;
  readonly index: number;
  readonly thumbSrc: string;
  readonly fullSrc: string;
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly timestampLabel: string;
  readonly alt: string;
}

interface RawMediaSeed {
  readonly file: string;
  readonly width: number;
  readonly height: number;
  readonly time: string;
  readonly customAlt?: string;
}

const RAW_MEDIA_SEEDS: readonly RawMediaSeed[] = [
  {
    file: 'foto-01.jpg',
    width: 2560,
    height: 1922,
    time: '08:20 WIB',
    customAlt: 'Enam tokoh peserta berfoto bersama di depan backdrop Kongres Kemandirian Dompet Dhuafa',
  },
  { file: 'foto-02.jpg', width: 2560, height: 1922, time: '08:30 WIB' },
  { file: 'foto-03.jpg', width: 2560, height: 1922, time: '08:39 WIB' },
  {
    file: 'foto-04.jpg',
    width: 2560,
    height: 1707,
    time: '09:10 WIB',
    customAlt: 'Dua tokoh berbincang hangat dengan senyum di sela penyambutan peserta Kongres Kemandirian',
  },
  { file: 'foto-05.jpg', width: 2560, height: 1922, time: '09:12 WIB' },
  { file: 'foto-06.jpg', width: 2560, height: 1922, time: '09:33 WIB' },
  { file: 'foto-07.jpg', width: 2560, height: 1707, time: '09:34 WIB' },
  { file: 'foto-08.jpg', width: 2560, height: 1707, time: '09:54 WIB' },
  { file: 'foto-09.jpg', width: 2560, height: 1707, time: '11:57 WIB' },
  { file: 'foto-10.jpg', width: 2560, height: 1707, time: '12:35 WIB' },
  { file: 'foto-11.jpg', width: 2560, height: 1707, time: '13:45 WIB' },
  { file: 'foto-12.jpg', width: 2560, height: 1707, time: '13:50 WIB' },
  { file: 'foto-13.jpg', width: 2560, height: 1707, time: '14:16 WIB' },
  {
    file: 'foto-14.jpg',
    width: 2560,
    height: 1707,
    time: '14:32 WIB',
    customAlt: 'Narasumber menyampaikan gagasan dengan mikrofon di panggung diskusi Kongres Kemandirian',
  },
  { file: 'foto-15.jpg', width: 2560, height: 1707, time: '15:02 WIB' },
  { file: 'foto-16.jpg', width: 2560, height: 1706, time: '10:35 WIB' },
  { file: 'foto-17.jpg', width: 2560, height: 1707, time: '16:19 WIB' },
  { file: 'foto-18.jpg', width: 2560, height: 1707, time: '17:01 WIB' },
  { file: 'foto-19.jpg', width: 2560, height: 1707, time: '17:04 WIB' },
  { file: 'foto-20.jpg', width: 2560, height: 1707, time: '17:29 WIB' },
  { file: 'foto-21.jpg', width: 2560, height: 1707, time: '17:49 WIB' },
  { file: 'foto-22.jpg', width: 2560, height: 1707, time: '17:49 WIB' },
  { file: 'foto-23.jpg', width: 2560, height: 1707, time: '17:51 WIB' },
  { file: 'foto-24.jpg', width: 2560, height: 1707, time: '17:52 WIB' },
  { file: 'foto-25.jpg', width: 2560, height: 1707, time: '17:52 WIB' },
  { file: 'foto-26.jpg', width: 2560, height: 1707, time: '17:54 WIB' },
  { file: 'foto-27.jpg', width: 2560, height: 1707, time: '15:11 WIB' },
  { file: 'foto-28.jpg', width: 2560, height: 1707, time: '15:12 WIB' },
];

export const SHOWCASE_MEDIA_ITEMS: readonly ShowcaseMediaItem[] = RAW_MEDIA_SEEDS.map(
  (seed, idx) => {
    const numberLabel = String(idx + 1).padStart(2, '0');
    return {
      id: `kongres-${numberLabel}`,
      index: idx,
      thumbSrc: `/thumbs/${seed.file}`,
      fullSrc: `/media/${seed.file}`,
      width: seed.width,
      height: seed.height,
      title: `Dokumentasi Kongres Kemandirian #${numberLabel}`,
      timestampLabel: `29 Agustus 2026 · ${seed.time}`,
      alt:
        seed.customAlt ??
        `Dokumentasi momen Kongres Kemandirian Dompet Dhuafa #${numberLabel} pukul ${seed.time}`,
    };
  },
);
