"use client";

import { ReactNode, useEffect, useState } from "react";
import { Accordion } from "./Accordion";
import { generalTermsMs, generalTermsEn } from "@/data/generalTerms";
import { useLanguage } from "./LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "gallery";
const SLIDE_COUNT = 4;

interface CompetitionPageLayoutProps {
  name: { ms: string; en: string };
  colorClass: string; // e.g. "bg-crimson", "text-crimson"
  ringClass: string;
  eyebrow: { ms: string; en: string };
  description: { ms: string; en: string };
  quickFacts: { label: { ms: string; en: string }; value: { ms: string; en: string } }[];
  specificTermsMs: string[];
  specificTermsEn: string[];
  decorSrc?: string;
  decorAlt?: string;
  children?: ReactNode;
  posterSrc?: string;
  posterTitle?: { ms: string; en: string };
}

export default function CompetitionPageLayout({
  name,
  colorClass,
  ringClass,
  eyebrow,
  description,
  quickFacts,
  specificTermsMs,
  specificTermsEn,
  decorSrc,
  decorAlt,
  children,
  posterSrc,
  posterTitle,
}: CompetitionPageLayoutProps) {
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
        console.error("[CompetitionPageLayout] Supabase gallery list() failed:", error.message);
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


  const accordionItems = [
    {
      title: lang === "ms" ? "Syarat Khusus Kategori" : "Category-Specific Requirements",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          {(lang === "ms" ? specificTermsMs : specificTermsEn).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ),
    },
    {
      title: lang === "ms" ? "Syarat Umum (Semua Kategori)" : "General Terms (All Categories)",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          {(lang === "ms" ? generalTermsMs : generalTermsEn).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <main className="pb-24">
      {/* Header band - Hero style */}
      <section className={`relative overflow-hidden ${colorClass} py-16 md:py-24`}>
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
        {decorSrc && (
          <img
            src={decorSrc}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            alt={decorAlt ?? ""}
          />
        )}
        <div className={`absolute inset-0 ${colorClass} opacity-70`} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cream-light/80">
            {eyebrow[lang]}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-cream-light sm:text-4xl md:text-5xl">
            {name[lang]}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-light/90 md:text-base">
            {description[lang]}
          </p>
        </div>

        <svg className="absolute -bottom-px left-0 block w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--color-cream)" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64V120H0Z" />
        </svg>
      </section>

      {/* Quick facts */}
      <section className="mx-auto -mt-4 max-w-5xl px-6 relative z-10">
        <div
          className={`grid grid-cols-2 gap-4 rounded-2xl bg-cream-light p-6 shadow-lg shadow-walnut/10 ring-1 ${ringClass} md:grid-cols-4`}
        >
          {quickFacts.map((fact) => (
            <div key={fact.label.ms}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-walnut/60">
                {fact.label[lang]}
              </p>
              <p className="mt-1 text-sm font-bold text-ink md:text-base">
                {fact.value[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* T&C Accordion */}
      <section className="mx-auto mt-12 max-w-3xl px-6">
        <h2 className="mb-4 text-lg font-extrabold text-walnut md:text-xl">
          {lang === "ms" ? "Terma & Syarat" : "Terms & Conditions"}
        </h2>
        <Accordion items={accordionItems} />
      </section>

      {/* Poster */}
      {posterSrc && (
        <section className="mx-auto mt-12 max-w-md px-6 text-center">
          {posterTitle && (
            <h2 className="mb-4 text-lg font-extrabold text-walnut md:text-xl">
              {posterTitle[lang]}
            </h2>
          )}
          <img
            src={posterSrc}
            className="w-full rounded-2xl shadow-xl neo-card"
            alt={name[lang]}
          />
        </section>
      )}

      {children}
    </main>
  );
}