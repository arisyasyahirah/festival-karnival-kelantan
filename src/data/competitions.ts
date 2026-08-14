export interface Competition {
  slug: string;
  href: string;
  name: { ms: string; en: string };
  tagline: { ms: string; en: string };
  target: { ms: string; en: string };
  color: string; // tailwind color token used as accent for this competition
}

export const competitions: Competition[] = [
  {
    slug: "filem-pendek",
    href: "/filem-pendek",
    name: { ms: "Filem Pendek", en: "Short Film" },
    tagline: {
      ms: "Terbuka kepada semua institusi pendidikan Malaysia dan antarabangsa.",
      en: "Open to all Malaysian and international education institutions.",
    },
    target: { ms: "13 - 25 tahun · 70 Institusi", en: "Ages 13-25 · 70 Institutions" },
    color: "crimson",
  },
  {
    slug: "video-tv-pss",
    href: "/video-tv-pss",
    name: { ms: "Video TV PSS", en: "TV PSS Video" },
    tagline: {
      ms: "Genre dokumentari untuk sekolah rendah dan menengah arus perdana.",
      en: "Documentary genre for mainstream primary and secondary schools.",
    },
    target: { ms: "Tahun 3 - Ting. 6 · 300 Institusi", en: "Year 3 - Form 6 · 300 Institutions" },
    color: "teal",
  },
  {
    slug: "video-kreatif",
    href: "/video-kreatif",
    name: { ms: "Video Kreatif", en: "Creative Video" },
    tagline: {
      ms: "Pertandingan individu bertemakan 'Ilmu di Hati, Teknologi Memperkasa Generasi'.",
      en: "Individual competition themed 'Knowledge in the Heart, Technology Empowers Generations'.",
    },
    target: { ms: "Tahun 1 - Ting. 5 · 100 Institusi", en: "Year 1 - Form 5 · 100 Institutions" },
    color: "gold",
  },
  {
    slug: "podcast",
    href: "/podcast",
    name: { ms: "Podcast", en: "Podcast" },
    tagline: {
      ms: "Untuk sekolah arus perdana dan Yayasan Islam Kelantan (YIK).",
      en: "For mainstream schools and Yayasan Islam Kelantan (YIK).",
    },
    target: { ms: "Tahun 3 - Ting. 6 · 200 Institusi", en: "Year 3 - Form 6 · 200 Institutions" },
    color: "indigo",
  },
];
