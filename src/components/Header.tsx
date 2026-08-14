"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

const NAV_ITEMS = [
  { href: "/", label: { ms: "Utama", en: "Home" } },
  { href: "/filem-pendek", label: { ms: "Filem Pendek", en: "Short Film" } },
  { href: "/video-tv-pss", label: { ms: "Video TV PSS", en: "TV PSS Video" } },
  { href: "/video-kreatif", label: { ms: "Video Kreatif", en: "Creative Video" } },
  { href: "/podcast", label: { ms: "Podcast", en: "Podcast" } },
  { href: "/gallery", label: { ms: "Galeri", en: "Gallery" } },
  { href: "/live", label: { ms: "Siaran Langsung", en: "Live Stream" } },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setLoggedIn(!!data.session))
      .catch(() => setLoggedIn(false));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const rsvpItem = loggedIn
    ? { href: "/profile", label: { ms: "Profil", en: "Profile" } }
    : { href: "/rsvp", label: { ms: "Pengesahan Kehadiran", en: "RSVP" } };

  return (
    <header className="sticky top-0 z-50 border-b border-walnut/10 bg-cream-light/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-walnut md:text-xl">
            FleP<span className="text-crimson">26</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-teal text-cream-light"
                    : "text-walnut hover:bg-teal/10"
                }`}
              >
                {item.label[lang]}
              </Link>
            );
          })}
          <Link
            href={rsvpItem.href}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              pathname === rsvpItem.href
                ? "bg-teal text-cream-light"
                : "text-walnut hover:bg-teal/10"
            }`}
          >
            {rsvpItem.label[lang]}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ms" ? "en" : "ms")}
            className="rounded-full border border-walnut/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-walnut transition-colors hover:bg-walnut/10"
            aria-label="Toggle language"
          >
            {lang === "ms" ? "BM / EN" : "EN / BM"}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-full text-walnut lg:hidden"
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-walnut" />
              <span className="block h-0.5 w-5 bg-walnut" />
              <span className="block h-0.5 w-5 bg-walnut" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-walnut/10 bg-cream-light px-4 py-3 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  active ? "bg-teal text-cream-light" : "text-walnut hover:bg-teal/10"
                }`}
              >
                {item.label[lang]}
              </Link>
            );
          })}
          <Link
            href={rsvpItem.href}
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              pathname === rsvpItem.href
                ? "bg-teal text-cream-light"
                : "text-walnut hover:bg-teal/10"
            }`}
          >
            {rsvpItem.label[lang]}
          </Link>
        </nav>
      )}
    </header>
  );
}
