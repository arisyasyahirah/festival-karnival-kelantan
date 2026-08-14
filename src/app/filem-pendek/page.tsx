import CompetitionPageLayout from "@/components/CompetitionPageLayout";

const specificTermsMs = [
  "Terbuka kepada semua institusi pendidikan Malaysia dan antarabangsa.",
  "Penyertaan terbuka kepada peserta berusia 12 hingga 25 tahun.",
  "Filem mestilah dalam Bahasa Ibunda (mother tongue) dengan sarikata terjemahan Bahasa Inggeris.",
  "Penyertaan secara berkumpulan: 4 orang murid (termasuk pelakon & kru) dan 2 orang guru pembimbing.",
  "Pasukan digalakkan dianggotai pelbagai kaum.",
  "Tema: Memperkukuhkan Keramah Insaniah Melalui Produksi Kreatif.",
  "Durasi filem: minimum 8.00 minit, maksimum 10.00 minit (termasuk montaj dan kredit).",
  "Sertakan sinopsis tidak lebih 100 patah perkataan dalam bentuk PDF, bersama filem dalam bentuk MP4.",
  "Wajib disertakan 'The Making Of' (TMO) selepas scene kredit, dengan durasi 2-3 minit.",
];

const specificTermsEn = [
  "Open to all Malaysian and international education institutions.",
  "Open to participants aged 12 to 25 years old.",
  "Films must be in the mother tongue with English subtitles.",
  "Group entry: 4 students (including cast & crew) and 2 supervising teachers.",
  "Teams are encouraged to include participants of diverse ethnicities.",
  "Theme: Strengthening Human Warmth Through Creative Production.",
  "Film duration: minimum 8.00 minutes, maximum 10.00 minutes (including montage and credits).",
  "Include a synopsis of no more than 100 words as a PDF, alongside the film in MP4 format.",
  "A 'Making Of' (TMO) segment is mandatory after the credits scene, 2-3 minutes long.",
];

export default function FilemPendekPage() {
  return (
    <CompetitionPageLayout
      name={{ ms: "Filem Pendek", en: "Short Film" }}
      colorClass="bg-crimson"
      ringClass="ring-crimson/20"
      eyebrow={{ ms: "Kategori Terbuka", en: "Open Category" }}
      description={{
        ms: "Pertandingan filem pendek terbuka kepada semua institusi pendidikan Malaysia dan antarabangsa, meraikan kreativiti murid dalam bahasa ibunda masing-masing.",
        en: "The short film competition is open to all Malaysian and international education institutions, celebrating student creativity in their own mother tongue.",
      }}
      quickFacts={[
        { label: { ms: "Umur", en: "Age" }, value: { ms: "12 - 25 tahun", en: "12 - 25 years" } },
        { label: { ms: "Pasukan", en: "Team" }, value: { ms: "4 murid + 2 guru", en: "4 students + 2 teachers" } },
        { label: { ms: "Durasi", en: "Duration" }, value: { ms: "8 - 10 minit", en: "8 - 10 min" } },
        { label: { ms: "Institusi Sasaran", en: "Target Institutions" }, value: { ms: "70 Institusi", en: "70 Institutions" } },
      ]}
      specificTermsMs={specificTermsMs}
      specificTermsEn={specificTermsEn}
      posterSrc="/posters/simposium.jpeg"
      posterTitle={{ ms: "Poster Simposium", en: "Simposium Poster" }}
      />
  );
}
