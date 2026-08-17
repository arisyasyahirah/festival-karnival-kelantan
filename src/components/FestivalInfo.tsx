"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "gallery";

const STATS = [
  { value: "200+", label: { ms: "Institusi", en: "Institutions" } },
  { value: "2,380", label: { ms: "Murid", en: "Students" } },
  { value: "670", label: { ms: "Guru", en: "Teachers" } },
  { value: "4", label: { ms: "Kategori", en: "Categories" } },
];

export default function FestivalInfo() {
  const { lang } = useLanguage();
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedImage() {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 200, sortBy: { column: "name", order: "asc" } });

      if (cancelled || error || !data || data.length === 0) return;

      const images = data.filter((f) => f.name && /\.(jpe?g|png|webp|gif)$/i.test(f.name));
      const chosen = images.find((f) => /^photo-1\.[a-z]+$/i.test(f.name)) ?? images[0];
      if (!chosen) return;

      setFeaturedImage(supabase.storage.from(BUCKET).getPublicUrl(chosen.name).data.publicUrl);
    }

    loadFeaturedImage();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="festival-info" className="bg-cream-light py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-8 md:grid-cols-2 md:gap-16">
        <div className="flex justify-center md:justify-start">
          {featuredImage ? (
            <img
              src={featuredImage}
              className="w-full max-w-sm rounded-2xl shadow-xl neo-card md:max-w-none md:w-[85%]"
              alt="Peserta FLeP"
            />
          ) : (
            <div className="aspect-[4/3] w-full max-w-sm rounded-2xl bg-walnut/5 shadow-xl neo-card md:max-w-none md:w-[85%]" />
          )}
        </div>

        <div className="text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
            {lang === "ms" ? "Tentang Festival" : "About The Festival"}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-walnut sm:text-3xl md:text-4xl">
            {lang === "ms"
              ? "Memperkukuhkan Keramah Insaniah Melalui Produksi Kreatif"
              : "Strengthening Human Warmth Through Creative Production"}
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-ink/80 md:text-base">
            {lang === "ms"
              ? "Festival Filem Kelantan (FFK26) merupakan festival pendidikan digital bertaraf antarabangsa, dianjurkan oleh Sektor Sumber dan Teknologi Pendidikan (SSTP) dengan kerjasama Universiti Malaysia Kelantan (UMK). Menghimpunkan bakat murid dari Malaysia, Indonesia, Brunei dan pelbagai negara dalam bidang perfileman, video kreatif dan podcast."
              : "The Kelantan Film Festival (FFK26) is an international-level digital education festival, organised by the Education Resource and Technology Sector (SSTP) in collaboration with Universiti Malaysia Kelantan (UMK). It brings together student talent from Malaysia, Indonesia, Brunei and other countries in filmmaking, creative video, and podcasting."}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="neo-card px-4 py-6 text-center"
              >
                <p className="text-2xl font-extrabold text-crimson md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-walnut/70">
                  {stat.label[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}