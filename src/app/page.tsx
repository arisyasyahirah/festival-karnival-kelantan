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
              ? "Video Pelancaran Festival Lensa Pendidikan Kelantan 2026"
              : "Festival Lensa Pendidikan Kelantan 2026 Launch Video"}
          </h2>

          <video controls className="mt-8 w-full rounded-2xl neo-card shadow-xl">
            <source src="/videos/launch.mp4" type="video/mp4" />
          </video>
        </div>

        <svg className="absolute -bottom-px left-0 block w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--color-cream-light)" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64V120H0Z" />
        </svg>
      </section>

      <FestivalInfo />
      <CompetitionsStack />
    </main>
  );
}