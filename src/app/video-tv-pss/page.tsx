import CompetitionPageLayout from "@/components/CompetitionPageLayout";

const specificTermsMs = [
  "Terbuka kepada Sekolah Rendah dan Sekolah Menengah (KPM) di bawah JPN Kelantan sahaja.",
  "Penyertaan berkumpulan: 4 murid (Tahun 3 - Tingkatan 6) termasuk kru produksi, dan 2 guru pembimbing.",
  "Pasukan digalakkan dianggotai pelbagai kaum.",
  "Genre: Dokumentari sahaja.",
  "Pilih satu sub tema: Lestari Alam Sekitar, atau Warisan Kita.",
  "Wajib patuh format TV PSS: dibuka dengan montaj TV PSS sekolah, ada tajuk, pengacara murid sebenar (bukan voice over) di pendahuluan dan penutup, logo TV PSS sekolah, lower third, sedikit behind-the-scene.",
  "Durasi: tidak lebih 5.00 minit.",
  "Sedutan pihak lain dibenarkan sebanyak 5% dengan sumber dinyatakan jelas dan bebas hak cipta.",
  "Tidak dibenarkan disiar di media sosial lain kecuali pratonton (teaser) di channel TV PSS masing-masing.",
  "Penghantaran secara MP4 melalui Google Form bersama skrip dalam bentuk PDF.",
];

const specificTermsEn = [
  "Open only to Primary and Secondary Schools (MOE) under JPN Kelantan.",
  "Group entry: 4 students (Year 3 - Form 6) including production crew, and 2 supervising teachers.",
  "Teams are encouraged to include participants of diverse ethnicities.",
  "Genre: Documentary only.",
  "Choose one sub-theme: Sustainable Environment, or Our Heritage.",
  "Must follow TV PSS format: opens with school's TV PSS montage, has a title, real student host (no voice-over) in intro and closing, school's TV PSS logo, lower third, some behind-the-scenes footage.",
  "Duration: no more than 5.00 minutes.",
  "Excerpts from other sources allowed up to 5% with clear sourcing and copyright-free material.",
  "May not be published on other social media except as a teaser on the respective school's TV PSS channel.",
  "Submit as MP4 via the provided Google Form together with the script as a PDF.",
];

export default function VideoTvPssPage() {
  return (
    <CompetitionPageLayout
      name={{ ms: "Video TV PSS", en: "TV PSS Video" }}
      colorClass="bg-teal"
      ringClass="ring-teal/20"
      eyebrow={{ ms: "Sekolah Arus Perdana", en: "Mainstream Schools" }}
      description={{
        ms: "Pertandingan dokumentari untuk sekolah rendah dan menengah di bawah JPN Kelantan, mengangkat kisah alam sekitar atau warisan tempatan.",
        en: "A documentary competition for primary and secondary schools under JPN Kelantan, spotlighting environmental or local heritage stories.",
      }}
      quickFacts={[
        { label: { ms: "Peringkat", en: "Level" }, value: { ms: "Tahun 3 - Ting. 6", en: "Year 3 - Form 6" } },
        { label: { ms: "Pasukan", en: "Team" }, value: { ms: "4 murid + 2 guru", en: "4 students + 2 teachers" } },
        { label: { ms: "Durasi", en: "Duration" }, value: { ms: "Maks 5 minit", en: "Max 5 min" } },
        { label: { ms: "Institusi Sasaran", en: "Target Institutions" }, value: { ms: "300 Institusi", en: "300 Institutions" } },
      ]}
      specificTermsMs={specificTermsMs}
      specificTermsEn={specificTermsEn}
      posterSrc="/posters/bengkel.jpeg"
      posterTitle={{ ms: "Poster TV PSS", en: "TV PSS Poster" }}
    />
  );
}