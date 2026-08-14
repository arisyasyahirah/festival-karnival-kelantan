"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  email: string | null;
  role: "student" | "guest" | null;
  full_name: string | null;
  institution: string | null;
  category: string | null;
  phone: string | null;
  attending: boolean | null;
  seat_number: number | null;
  is_teacher: boolean | null;
};

type Status = "idle" | "saving" | "saved" | "error";

export default function ProfilePage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Separate status/error for the two independent actions
  const [infoStatus, setInfoStatus] = useState<Status>("idle");
  const [infoError, setInfoError] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<Status>("idle");
  const [rsvpError, setRsvpError] = useState("");
  // Once true, the Ya/Tidak choice is final — set the moment we learn the
  // student has already answered (either from initial load or right after
  // their first successful submit).
  const [lockedIn, setLockedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single();

        if (cancelled) return;

        if (error) {
          setInfoError(error.message);
        } else {
          setProfile(data as Profile);
          setLockedIn((data as Profile).attending !== null);
        }
      } catch (err) {
        if (!cancelled) {
          setInfoError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Update Profile: name / institution / phone only. Never touches attending.
  async function handleUpdateInfo(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setInfoStatus("saving");
    setInfoError("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        institution: profile.institution,
        phone: profile.phone,
      })
      .eq("id", profile.id);

    if (error) {
      setInfoStatus("error");
      setInfoError(error.message);
      return;
    }

    setInfoStatus("saved");
    setTimeout(() => setInfoStatus("idle"), 2500);
  }

  // Hantar: RSVP only. Requires Ya/Tidak to be picked first. Once sent, the
  // answer locks — this function can't be called again after lockedIn is true
  // (the button is hidden), and the DB trigger blocks it too as a backstop.
  async function handleSendRsvp() {
    if (!profile) return;

    if (profile.attending === null) {
      setRsvpStatus("error");
      setRsvpError(
        lang === "ms"
          ? "Sila pilih Ya atau Tidak dahulu."
          : "Please choose Yes or No first."
      );
      return;
    }

    setRsvpStatus("saving");
    setRsvpError("");

    const { error } = await supabase
      .from("profiles")
      .update({ attending: profile.attending })
      .eq("id", profile.id);

    if (error) {
      setRsvpStatus("error");
      setRsvpError(error.message);
      return;
    }

    // Re-fetch: the seat_number is assigned server-side by a trigger, so pull
    // the fresh row to reflect whatever number just got assigned/released.
    const { data: fresh } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();

    if (fresh) {
      setProfile(fresh as Profile);
      setLockedIn((fresh as Profile).attending !== null);
    }

    setRsvpStatus("saved");
    setTimeout(() => setRsvpStatus("idle"), 2500);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center text-sm text-ink/50">
        {lang === "ms" ? "Memuatkan..." : "Loading..."}
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-sm text-crimson">{infoError}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
            {lang === "ms" ? "Profil Saya" : "My Profile"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-walnut md:text-3xl">
            {profile.full_name || profile.email}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-walnut/20 px-4 py-2 text-xs font-bold text-walnut hover:bg-walnut/10"
        >
          {lang === "ms" ? "Log Keluar" : "Log Out"}
        </button>
      </div>

      {/* Section 1: profile info, its own form + its own button */}
      <form onSubmit={handleUpdateInfo} className="mt-10 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "Nama Penuh" : "Full Name"}
          </label>
          <input
            required
            value={profile.full_name ?? ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "Institusi / Sekolah" : "Institution / School"}
          </label>
          <input
            value={profile.institution ?? ""}
            onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "No. Telefon" : "Phone Number"}
          </label>
          <input
            required
            type="tel"
            value={profile.phone ?? ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            Email
          </label>
          <input
            disabled
            value={profile.email ?? ""}
            className="w-full rounded-xl border border-walnut/10 bg-walnut/5 px-4 py-3 text-sm text-ink/50"
          />
        </div>

        {infoStatus === "error" && (
          <p className="rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson">
            {lang === "ms" ? "Ralat: " : "Error: "}
            {infoError}
          </p>
        )}
        {infoStatus === "saved" && (
          <p className="rounded-lg bg-teal/10 px-4 py-3 text-sm text-teal">
            {lang === "ms" ? "Profil dikemaskini!" : "Profile updated!"}
          </p>
        )}

        <button
          type="submit"
          disabled={infoStatus === "saving"}
          className="w-full rounded-full bg-walnut py-3 text-sm font-bold text-cream-light shadow-lg shadow-walnut/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {infoStatus === "saving"
            ? lang === "ms"
              ? "Mengemaskini..."
              : "Updating..."
            : lang === "ms"
            ? "Kemaskini Profil"
            : "Update Profile"}
        </button>
      </form>

      {/* Section 2: RSVP, completely separate action */}
      {profile.role === "student" && (
        <div className="mt-8 rounded-2xl border-2 border-teal/20 bg-teal/5 p-5">
          <p className="text-sm font-extrabold text-walnut">
            {lang === "ms"
              ? "Adakah anda hadir secara fizikal ke acara ini?"
              : "Are you coming to the event physically?"}
          </p>

          {lockedIn ? (
            // Final answer already submitted — read-only, no more changes.
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-5 py-2 text-sm font-bold ${
                  profile.attending === true
                    ? "bg-teal text-cream-light"
                    : "bg-crimson text-cream-light"
                }`}
              >
                {profile.attending === true
                  ? lang === "ms" ? "Ya, saya hadir" : "Yes, I'm attending"
                  : lang === "ms" ? "Tidak hadir" : "Not attending"}
              </span>
              <p className="mt-2 text-xs text-ink/50">
                {lang === "ms"
                  ? "Jawapan ini muktamad dan tidak boleh diubah."
                  : "This answer is final and can't be changed."}
              </p>

              {profile.attending === true && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-cream-light px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-walnut/70">
                    {lang === "ms" ? "Nombor Tempat Duduk Anda" : "Your Seat Number"}
                  </span>
                  <span className="text-2xl font-extrabold text-teal">
                    {profile.seat_number != null
                      ? `#${profile.seat_number}`
                      : lang === "ms"
                      ? "Menunggu..."
                      : "Pending..."}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, attending: true })}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    profile.attending === true
                      ? "bg-teal text-cream-light"
                      : "border border-teal/30 text-walnut"
                  }`}
                >
                  {lang === "ms" ? "Ya" : "Yes"}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, attending: false })}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    profile.attending === false
                      ? "bg-crimson text-cream-light"
                      : "border border-crimson/30 text-walnut"
                  }`}
                >
                  {lang === "ms" ? "Tidak" : "No"}
                </button>
              </div>

              <p className="mt-3 text-xs text-ink/50">
                {lang === "ms"
                  ? "Amaran: pilihan ini muktamad sebaik sahaja dihantar dan tidak boleh diubah."
                  : "Note: once submitted, this choice is final and can't be changed."}
              </p>

              {rsvpStatus === "error" && (
                <p className="mt-4 rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson">
                  {lang === "ms" ? "Ralat: " : "Error: "}
                  {rsvpError}
                </p>
              )}

              <button
                type="button"
                onClick={handleSendRsvp}
                disabled={rsvpStatus === "saving" || profile.attending === null}
                className="mt-4 w-full rounded-full bg-teal py-3 text-sm font-bold text-cream-light shadow-lg shadow-teal/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {rsvpStatus === "saving"
                  ? lang === "ms"
                    ? "Menghantar..."
                    : "Sending..."
                  : lang === "ms"
                  ? "Hantar"
                  : "Send"}
              </button>
            </>
          )}
        </div>
      )}

      {profile.is_teacher && (
        <div className="mt-8 rounded-2xl border-2 border-teal/20 bg-teal/5 p-5">
          <p className="text-sm font-extrabold text-walnut">
            {lang === "ms" ? "Akses Guru" : "Teacher Access"}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {lang === "ms"
              ? "Lihat senarai penuh murid yang telah mengesahkan kehadiran."
              : "View the full list of students who've confirmed attendance."}
          </p>
          <Link
            href="/students"
            className="mt-3 inline-block rounded-full bg-teal px-5 py-2 text-sm font-bold text-cream-light"
          >
            {lang === "ms" ? "Senarai Pelajar →" : "Student List →"}
          </Link>
        </div>
      )}
    </main>
  );
}
