import CompetitionPageLayout from "@/components/CompetitionPageLayout";

const specificTermsMs = [
  "Terbuka kepada sekolah berdaftar di bawah KPM, di bawah JPN Kelantan.",
  "Peserta: murid sekolah rendah dan menengah (Tahun 1 - Tingkatan 5).",
  "Pertandingan secara individu. Setiap sekolah hanya boleh menghantar satu video.",
  "Calon perlu telah membuat perekodan bacaan sekurang-kurangnya 200 bahan bacaan melalui AINS (Advance Integrated Nilam System).",
  "Sub tema: 'Ilmu di Hati, Teknologi Memperkasa Generasi'.",
  "Video mestilah dalam Bahasa Melayu, dihasilkan pada tahun 2026 sahaja.",
  "Mesti mematuhi format TV PSS seperti dalam KIT TV PSS Kebangsaan.",
  "Durasi: minimum 3.00 minit, maksimum 5.00 minit.",
  "Genre bebas: dokumentari, temu bual, tutorial, PdP dan lain-lain.",
  "Video mesti dimuat naik ke saluran YouTube TV PSS sekolah masing-masing sahaja.",
  "Hak cipta video adalah hak milik Kementerian Pendidikan Malaysia untuk tujuan promosi.",
];

const specificTermsEn = [
  "Open to schools registered under MOE, under JPN Kelantan.",
  "Participants: primary and secondary school students (Year 1 - Form 5).",
  "Individual competition. Each school may only submit one video.",
  "Candidates must have logged at least 200 reading records via AINS (Advance Integrated Nilam System).",
  "Sub-theme: 'Knowledge in the Heart, Technology Empowers Generations'.",
  "Video must be in Bahasa Melayu, produced in 2026 only.",
  "Must follow the TV PSS format as set out in the National TV PSS KIT.",
  "Duration: minimum 3.00 minutes, maximum 5.00 minutes.",
  "Free genre: documentary, interview, tutorial, teaching & learning, and others.",
  "Video must be uploaded only to the respective school's TV PSS YouTube channel.",
  "Video copyright belongs to the Ministry of Education Malaysia for promotional purposes.",
];

export default function VideoKreatifPage() {
  return (
    <CompetitionPageLayout
      name={{ ms: "Video Kreatif", en: "Creative Video" }}
      colorClass="bg-gold"
      ringClass="ring-gold/20"
      eyebrow={{ ms: "Pertandingan Individu", en: "Individual Competition" }}
      description={{
        ms: "Pertandingan individu untuk murid sekolah rendah dan menengah, bertemakan 'Ilmu di Hati, Teknologi Memperkasa Generasi'.",
        en: "An individual competition for primary and secondary students, themed 'Knowledge in the Heart, Technology Empowers Generations'.",
      }}
      quickFacts={[
        { label: { ms: "Peringkat", en: "Level" }, value: { ms: "Tahun 1 - Ting. 5", en: "Year 1 - Form 5" } },
        { label: { ms: "Penyertaan", en: "Entry" }, value: { ms: "Individu", en: "Individual" } },
        { label: { ms: "Durasi", en: "Duration" }, value: { ms: "3 - 5 minit", en: "3 - 5 min" } },
        { label: { ms: "Institusi Sasaran", en: "Target Institutions" }, value: { ms: "100 Institusi", en: "100 Institutions" } },
      ]}
      specificTermsMs={specificTermsMs}
      specificTermsEn={specificTermsEn}
      posterSrc="/posters/general.jpeg"
      posterTitle={{ ms: "Poster Video Kreatif", en: "Creative Video Poster" }}
    />
  );
}
