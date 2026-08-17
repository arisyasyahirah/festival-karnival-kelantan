"use client";

import { useLanguage } from "./LanguageProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DepthText from "./DepthText";

const BUCKET = "gallery";
const SLIDE_COUNT = 4;

export default function Hero() {
  const { lang } = useLanguage();
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadSlides() {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: SLIDE_COUNT, sortBy: { column: "name", order: "asc" } });

      if (cancelled) return;

      if (error) {
        console.error("[Hero] Supabase gallery list() failed:", error.message);
        return;
      }
      if (!data) return;

      const urls = data
        .filter((f) => f.name && /\.(jpe?g|png|webp|gif)$/i.test(f.name))
        .slice(0, SLIDE_COUNT)
        .map((f) => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl);

      setSlides(urls);
    }

    loadSlides();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(() => setCurrent((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[103vh] w-full items-center justify-center overflow-hidden bg-walnut">
      {/* Background slideshow, pulled from the Supabase "gallery" bucket */}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-40" : "opacity-0"
          }`}
          alt=""
        />
      ))}
      <div className="absolute inset-0 bg-walnut/50" />

      {/* Simple geometric accent shapes instead of illustrations */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-crimson/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gold md:text-sm">
          {lang === "ms" ? "20 Ogos 2026" : "20 August 2026"}
        </p>
      <div className="mx-auto flex w-full flex-col items-center gap-1">
            <DepthText
            text="Festival Filem"
            layers={22}
            depth={1.8}
            faceColor="#F5EFE6"
            depthColor="#1A8C8C"
            tilt={5}
            pointerTracking
            smoothing={0.14}
            perspective={800}
            autoOrbit
            orbitSpeed={0.25}
            fontSize="clamp(1.15rem, 7vw, 6rem)"
            fontWeight={800}
            shadow ={true}
          />
          <DepthText
            text="Kelantan"
            layers={22}
            depth={1.8}
            faceColor="#F5EFE6"
            depthColor="#1A8C8C"
            tilt={5}
            pointerTracking
            smoothing={0.14}
            perspective={800}
            autoOrbit
            orbitSpeed={0.25}
            fontSize="clamp(1.15rem, 7vw, 5rem)"
            fontWeight={800}
            shadow={true}
          />
        </div>
        <p className="mt-3 text-xl font-bold text-teal md:text-2xl">(FFK26)</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-cream-light/70 md:text-base">
          {lang === "ms" ? "Peringkat Antarabangsa 2026" : "International Level 2026"}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#festival-info"
            className="rounded-full bg-teal px-6 py-3 text-sm font-bold text-cream-light shadow-lg shadow-teal/20 transition-transform hover:scale-105"
          >
            {lang === "ms" ? "Ketahui Lebih Lanjut" : "Learn More"}
          </a>
          <a
            href="/live"
            className="rounded-full border-2 border-gold px-6 py-3 text-sm font-bold text-gold transition-transform hover:scale-105"
          >
            {lang === "ms" ? "Siaran Langsung" : "Watch Live"}
          </a>
        </div>
      </div>

      <svg className="absolute -bottom-px left-0 block w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path fill="var(--color-cream)" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64V120H0Z" />
      </svg>
    </section>
  );
}
