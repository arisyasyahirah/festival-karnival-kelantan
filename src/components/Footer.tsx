"use client";

import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="mt-auto border-t border-walnut/10 bg-walnut py-8 text-cream-light">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-sm font-bold tracking-wide">
          Festival Filem Kelantan &ldquo;Festival Lensa Pendidikan Kelantan&rdquo; (FleP26)
        </p>
        <p className="mt-1 text-xs text-cream-light/70">
          {lang === "ms"
            ? "Anjuran Sektor Sumber dan Teknologi Pendidikan, Jabatan Pendidikan Negeri Kelantan, dengan kerjasama Universiti Malaysia Kelantan."
            : "Organised by the Education Resource and Technology Sector, Kelantan State Education Department, in collaboration with Universiti Malaysia Kelantan."}
        </p>
        <p className="mt-4 text-xs text-cream-light/50">
          19&ndash;20 Ogos 2026 &middot; Dewan Utama, Universiti Malaysia Kelantan, Kampus Jeli
        </p>
      </div>
    </footer>
  );
}
