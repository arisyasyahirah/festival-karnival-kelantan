"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const SESSIONS = [
  {
    id: "forum",
    videoId: "hP4OF0EVbZw",
    date: { ms: "18 Ogos 2026", en: "18 August 2026" },
    title: { ms: "Forum Antarabangsa AI", en: "International AI Forum" },
    poster: "/brand/forum-poster.webp",
  },
  {
    id: "simposium",
    videoId: "wgoK0NBlKx0",
    date: { ms: "19 Ogos 2026", en: "19 August 2026" },
    title: { ms: "Simposium Antarabangsa AI", en: "International AI Symposium" },
    poster: "/brand/simposium-poster.webp",
  },
  {
    id: "anugerah",
    videoId: "1tpqKprTLCc",
    date: { ms: "20 Ogos 2026", en: "20 August 2026" },
    title: { ms: "Majlis Anugerah FFK26", en: "FFK26 Awards Ceremony" },
    poster: null as string | null,
  },
];

export default function LivePage() {
  const { lang } = useLanguage();
  const [active, setActive] = useState(SESSIONS[2].id); // default to Majlis Anugerah

  const current = SESSIONS.find((s) => s.id === active)!;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-crimson">
          {lang === "ms" ? "Siaran Langsung" : "Live Stream"}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-walnut md:text-4xl">
          {lang === "ms" ? "3 Platform, 1 Acara" : "3 Platforms, 1 Event"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70 md:text-base">
          {lang === "ms"
            ? "Pilih sesi di bawah untuk menonton siaran langsung."
            : "Pick a session below to watch the live stream."}
        </p>
      </div>

      {/* Session tabs */}
      <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
        {SESSIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active === s.id
                ? "bg-crimson text-cream-light"
                : "bg-cream-light text-walnut ring-1 ring-walnut/15 hover:bg-walnut/5"
            }`}
          >
            {s.title[lang]}
          </button>
        ))}
      </div>

      {/* Active session */}
      <div className="mt-8">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-walnut/60">
          {current.date[lang]}
        </p>
        <div className="mx-auto mt-3 aspect-video w-full overflow-hidden rounded-2xl bg-walnut shadow-lg">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${current.videoId}`}
            title={current.title[lang]}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {current.poster && (
          <div className="mx-auto mt-6 max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.poster}
              alt={current.title[lang]}
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}
      </div>

      {/* QR codes */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-6 border-t border-walnut/10 pt-10 text-center">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/qr-live-streaming.webp"
            alt="QR Siaran Langsung"
            className="mx-auto w-32 rounded-lg shadow-sm md:w-40"
          />
          <p className="mt-2 text-xs font-bold text-walnut/70">
            {lang === "ms" ? "Imbas untuk Siaran Langsung" : "Scan for Live Streaming"}
          </p>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/qr-yt-playlist.webp"
            alt="QR Playlist YouTube"
            className="mx-auto w-32 rounded-lg shadow-sm md:w-40"
          />
          <p className="mt-2 text-xs font-bold text-walnut/70">
            {lang === "ms" ? "Imbas untuk Playlist FFK" : "Scan for FFK Playlist"}
          </p>
        </div>
      </div>
    </main>
  );
}
