"use client";

import Hero from "@/components/Hero";
import FestivalInfo from "@/components/FestivalInfo";
import CompetitionsStack from "@/components/CompetitionsStack";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { lang } = useLanguage();

  return (
    <main>
      <Hero />

      {/* Video section right after Hero */}
      <section className="relative bg-cream py-16">
        <div className="mx-auto max-w-4xl px-6 pb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
            {lang === "ms" ? "Video Pelancaran" : "Launch Video"}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-walnut md:text-3xl">
            {lang === "ms"
              ? "Video Pelancaran Festival Filem Kelantan 2026"
              : "Festival Filem Kelantan 2026 Launch Video"}
          </h2>

          <video controls className="mt-8 w-full rounded-2xl neo-card shadow-xl">
            <source src="/videos/launch.mp4" type="video/mp4" />
          </video>
        </div>

        <svg className="absolute -bottom-px left-0 block w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--color-cream-light)" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64V120H0Z" />
        </svg>
      </section>

      {/* Promo banner: all live sessions at a glance */}
      <section className="bg-cream-light py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-extrabold text-walnut sm:text-3xl md:text-4xl">
            {lang === "ms" ? "Jom sertai FFK26!" : "Join FFK26!"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70 md:text-base">
            {lang === "ms"
              ? "3 platform, 1 acara penuh ilmu, inspirasi & kecemerlangan."
              : "3 platforms, 1 event full of knowledge, inspiration & excellence."}
          </p>
          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/live-banner.webp"
              alt={lang === "ms" ? "Banner FFK26" : "FFK26 Banner"}
              className="w-full"
            />
          </div>
          <a
            href="/live"
            className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 text-sm font-bold text-cream-light shadow-lg shadow-crimson/20 transition-transform hover:scale-105"
          >
            {lang === "ms" ? "Lihat Semua Siaran Langsung" : "See All Live Sessions"}
          </a>
        </div>
      </section>

      <FestivalInfo />
      <CompetitionsStack />
    </main>
  );
}