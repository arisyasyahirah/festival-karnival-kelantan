"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LivePage() {
  const { lang } = useLanguage();
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-crimson">
          {lang === "ms" ? "Siaran Langsung" : "Live Stream"}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-walnut md:text-4xl">
          {lang === "ms"
            ? "Tayangan Perdana & Majlis Penutup"
            : "Premiere Screening & Closing Ceremony"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink/70 md:text-base">
          {lang === "ms"
            ? "20 Ogos 2026 · Dewan Utama, Universiti Malaysia Kelantan (Kampus Jeli)"
            : "20 August 2026 · Dewan Utama, Universiti Malaysia Kelantan (Jeli Campus)"}
        </p>
      </div>

      <div className="mx-auto mt-10 aspect-video w-full overflow-hidden rounded-2xl bg-walnut shadow-lg">
        {/* Replace VIDEO_ID with the actual YouTube live video/stream ID when available */}
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/live_stream?channel=REPLACE_WITH_CHANNEL_ID"
          title="FleP26 Live Stream"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-center text-xs text-ink/50">
        {lang === "ms"
          ? "Pautan siaran langsung akan diaktifkan lebih dekat dengan tarikh acara."
          : "The live stream link will go live closer to the event date."}
      </p>
    </main>
  );
}
