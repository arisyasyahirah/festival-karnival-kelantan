"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "gallery";

export default function GalleryPage() {
  const { lang } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 200, sortBy: { column: "name", order: "asc" } });

      if (cancelled) return;

      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      const files = (data ?? [])
        .filter((f) => f.name && /\.(jpe?g|png|webp|gif)$/i.test(f.name))
        .map((f) => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl);

      setImages(files);
      setLoading(false);
    }

    loadImages();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
        {lang === "ms" ? "Galeri" : "Gallery"}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-walnut md:text-4xl">
        {lang === "ms" ? "Gambar Festival" : "Festival Photos"}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-ink/70 md:text-base">
        {lang === "ms"
          ? "Gambar-gambar acara akan dimuat naik di sini."
          : "Event photos will be uploaded here."}
      </p>

      {loadError && (
        <p className="mt-6 text-sm text-crimson">
          {lang === "ms" ? "Ralat memuatkan gambar: " : "Error loading photos: "}
          {loadError}
        </p>
      )}

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {loading || images.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-cream-light ring-1 ring-walnut/10"
              />
            ))
          : images.map((src) => (
              <img
                key={src}
                src={src}
                className="aspect-square w-full rounded-2xl object-cover ring-1 ring-walnut/10"
                alt=""
              />
            ))}
      </div>
    </main>
  );
}
