"use client";

import Link from "next/link";
import { competitions } from "@/data/competitions";
import { useLanguage } from "./LanguageProvider";

const COLOR_CLASSES: Record<string, { bg: string; text: string; ring: string }> = {
  crimson: { bg: "bg-crimson", text: "text-crimson", ring: "ring-crimson/20" },
  teal: { bg: "bg-teal", text: "text-teal", ring: "ring-teal/20" },
  gold: { bg: "bg-gold", text: "text-gold", ring: "ring-gold/20" },
  indigo: { bg: "bg-indigo", text: "text-indigo", ring: "ring-indigo/20" },
};

export default function CompetitionsStack() {
  const { lang } = useLanguage();

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
          {lang === "ms" ? "Kategori Pertandingan" : "Competition Categories"}
        </p>
        <h2 className="mt-3 text-2xl font-extrabold text-walnut sm:text-3xl md:text-4xl">
          {lang === "ms" ? "4 Kategori, 1 Panggung" : "4 Categories, 1 Stage"}
        </h2>
        <p className="mt-3 text-sm text-ink/70 md:text-base">
          {lang === "ms"
            ? "Tekan mana-mana kategori untuk lihat syarat penyertaan penuh."
            : "Tap any category to see the full entry requirements."}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 md:px-8">
        {competitions.map((comp) => {
          const c = COLOR_CLASSES[comp.color];
          return (
            <Link
              key={comp.slug}
              href={comp.href}
              className={`group rounded-2xl bg-cream-light p-6 ring-1 ${c.ring} shadow-sm transition-all hover:-translate-y-1 hover:shadow-md md:p-8`}
            >
              <span
                className={`inline-block rounded-full ${c.bg} px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream-light`}
              >
                {comp.target[lang]}
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-walnut md:text-2xl">
                {comp.name[lang]}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{comp.tagline[lang]}</p>
              <div className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${c.text}`}>
                {lang === "ms" ? "Lihat Syarat" : "View Requirements"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14m0 0l-6-6m6 6l-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
