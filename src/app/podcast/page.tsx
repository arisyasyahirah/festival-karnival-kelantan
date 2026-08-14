import CompetitionPageLayout from "@/components/CompetitionPageLayout";

const specificTermsMs = [
  "Terbuka kepada Sekolah Rendah dan Sekolah Menengah (KPM) di bawah JPN Kelantan, dan Yayasan Islam Kelantan (YIK) sahaja.",
  "Setiap pasukan: 4 murid (Tahun 3 - Tingkatan 6) termasuk kru produksi, dan 2 guru pembimbing. Hos mesti dari kalangan murid.",
  "Durasi (termasuk montaj & kredit) — Sekolah Rendah: 8-10 minit. Sekolah Menengah: 12-15 minit.",
  "Penghantaran video secara MP4 melalui Google Form bersama sinopsis perbualan.",
  "Pihak SSTP JPN Kelantan berhak menggunakan, menyunting dan menerbitkan semula kandungan untuk tujuan promosi dan pendidikan tanpa royalti.",
];

const specificTermsEn = [
  "Open only to Primary and Secondary Schools (MOE) under JPN Kelantan, and Yayasan Islam Kelantan (YIK).",
  "Each team: 4 students (Year 3 - Form 6) including production crew, and 2 supervising teachers. The host must be a student.",
  "Duration (including montage & credits) — Primary: 8-10 minutes. Secondary: 12-15 minutes.",
  "Submit video as MP4 via the provided Google Form together with a conversation synopsis.",
  "SSTP JPN Kelantan reserves the right to use, edit and republish content for promotional and educational purposes without royalty.",
];

export default function PodcastPage() {
  return (
    <CompetitionPageLayout
      name={{ ms: "Podcast", en: "Podcast" }}
      colorClass="bg-indigo-flep"
      ringClass="ring-indigo-flep/20"
      eyebrow={{ ms: "Sekolah & YIK", en: "Schools & YIK" }}
      description={{
        ms: "Pertandingan podcast untuk sekolah arus perdana dan Yayasan Islam Kelantan, meraikan suara dan perbualan murid.",
        en: "A podcast competition for mainstream schools and Yayasan Islam Kelantan, celebrating student voices and conversation.",
      }}
      quickFacts={[
        { label: { ms: "Peringkat", en: "Level" }, value: { ms: "Tahun 3 - Ting. 6", en: "Year 3 - Form 6" } },
        { label: { ms: "Pasukan", en: "Team" }, value: { ms: "4 murid + 2 guru", en: "4 students + 2 teachers" } },
        { label: { ms: "Durasi", en: "Duration" }, value: { ms: "8 - 15 minit", en: "8 - 15 min" } },
        { label: { ms: "Institusi Sasaran", en: "Target Institutions" }, value: { ms: "200 Institusi", en: "200 Institutions" } },
      ]}
      specificTermsMs={specificTermsMs}
      specificTermsEn={specificTermsEn}
      posterSrc="/posters/forum.jpeg"
      posterTitle={{ ms: "Poster Forum", en: "Forum Poster" }}
    />
  );
}