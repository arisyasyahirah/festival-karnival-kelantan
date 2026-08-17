"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

export default function RsvpPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (data.session) {
          router.replace("/profile");
          return;
        }
        setChecking(false);
      })
      .catch((err) => {
        // Don't hang forever if Supabase is unreachable/misconfigured —
        // just show the picker; registering will surface the real error.
        console.error("Session check failed:", err);
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center text-sm text-ink/50">
        {lang === "ms" ? "Memuatkan..." : "Loading..."}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
          {lang === "ms" ? "Pengesahan Kehadiran" : "Attendance Confirmation"}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-walnut md:text-3xl">
          {lang === "ms" ? "Majlis Anugerah FFK" : "FFK Awards Ceremony"}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          20 Ogos 2026 · Dewan Utama, UMK Kampus Bachok
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/register?role=student"
          className="rounded-2xl border-2 border-teal/20 bg-cream-light p-6 text-left transition-colors hover:border-teal hover:bg-teal/5"
        >
          <p className="text-lg font-extrabold text-walnut">
            {lang === "ms" ? "Murid" : "Student"}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {lang === "ms"
              ? "Peserta dari institusi berdaftar"
              : "Participant from a registered institution"}
          </p>
        </Link>
        <Link
          href="/login"
          className="rounded-2xl border-2 border-crimson/20 bg-cream-light p-6 text-left transition-colors hover:border-crimson hover:bg-crimson/5"
        >
          <p className="text-lg font-extrabold text-walnut">
            {lang === "ms" ? "Guru" : "Teacher"}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {lang === "ms"
              ? "Log masuk dengan akaun guru yang diberikan"
              : "Log in with your assigned teacher account"}
          </p>
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        {lang === "ms" ? "Sudah ada akaun murid?" : "Already have a student account?"}{" "}
        <Link href="/login" className="font-bold text-teal underline">
          {lang === "ms" ? "Log Masuk" : "Log In"}
        </Link>
      </p>
    </main>
  );
}
