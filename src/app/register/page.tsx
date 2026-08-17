"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type Status = "idle" | "submitting" | "error" | "check-email";

const CATEGORIES = [
  { value: "filem-pendek", label: { ms: "Filem Pendek", en: "Short Film" } },
  { value: "video-tv-pss", label: { ms: "Video TV PSS", en: "TV PSS Video" } },
  { value: "video-kreatif", label: { ms: "Video Kreatif", en: "Creative Video" } },
  { value: "podcast", label: { ms: "Podcast", en: "Podcast" } },
  { value: "tiada", label: { ms: "Tiada", en: "None" } },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts Malaysian mobile numbers AND international numbers (with country code).
// Malaysia: 01X-XXXXXXX(X), with or without +60. International: + followed by
// 7-15 digits (E.164-style), covering students from other countries.
const MY_PHONE_RE = /^(0|\+?60)1[0-46-9]\d{7,8}$/;
const INTL_PHONE_RE = /^\+[1-9]\d{6,14}$/;
// 8+ chars, at least one lowercase, one uppercase, one digit
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function isValidPhone(raw: string) {
  const cleaned = raw.replace(/[\s-]/g, "");
  return MY_PHONE_RE.test(cleaned) || INTL_PHONE_RE.test(cleaned);
}

function RegisterForm() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [category, setCategory] = useState("tiada");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg(
        lang === "ms"
          ? "Format e-mel tidak sah. Contoh: nama@contoh.com"
          : "Invalid email format. Example: name@example.com"
      );
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMsg(
        lang === "ms"
          ? "Format no. telefon tidak sah. Malaysia: 012-3456789. Antarabangsa: +[kod negara][nombor], cth. +6591234567"
          : "Invalid phone format. Malaysia: 012-3456789. International: +[country code][number], e.g. +6591234567"
      );
      return;
    }

    if (!PASSWORD_RE.test(password)) {
      setErrorMsg(
        lang === "ms"
          ? "Kata laluan mesti sekurang-kurangnya 8 aksara, dengan huruf besar, huruf kecil, dan nombor."
          : "Password must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        lang === "ms" ? "Kata laluan tidak sepadan." : "Passwords do not match."
      );
      return;
    }

    setStatus("submitting");

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
        return;
      }

      const profileFields = {
        role: "student",
        full_name: fullName,
        institution,
        category,
        phone,
      };

      if (data.session && data.user) {
        // Email confirmation is off — we're logged in immediately, save profile now
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileFields)
          .eq("id", data.user.id);

        if (updateError) {
          setStatus("error");
          setErrorMsg(updateError.message);
          return;
        }

        router.push("/profile");
      } else {
        // Email confirmation required — stash the profile draft for after they confirm + log in
        localStorage.setItem(
          "flep26_pending_profile",
          JSON.stringify({ email, ...profileFields })
        );
        setStatus("check-email");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        lang === "ms"
          ? "Ralat rangkaian. Sila semak sambungan internet dan cuba lagi."
          : "Network error. Please check your connection and try again."
      );
      console.error(err);
    }
  }

  if (status === "check-email") {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-walnut">
          {lang === "ms" ? "Semak E-mel Anda" : "Check Your Email"}
        </h1>
        <p className="mt-3 text-sm text-ink/70">
          {lang === "ms"
            ? "Kami telah menghantar pautan pengesahan ke e-mel anda. Sahkan, kemudian log masuk untuk lengkapkan profil anda."
            : "We've sent a confirmation link to your email. Confirm it, then log in to finish setting up your profile."}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-teal px-6 py-3 text-sm font-bold text-cream-light"
        >
          {lang === "ms" ? "Ke Halaman Log Masuk" : "Go to Login"}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
          {lang === "ms" ? "Daftar Akaun" : "Create Account"}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-walnut md:text-3xl">
          {lang === "ms" ? "Pendaftaran Murid" : "Student Registration"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "Nama Penuh" : "Full Name"}
          </label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "Institusi / Sekolah" : "Institution / School"}
          </label>
          <input
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "Kategori Pertandingan" : "Competition Category"}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label[lang]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            {lang === "ms" ? "No. Telefon" : "Phone Number"}
          </label>
          <input
            required
            type="tel"
            placeholder="012-3456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink/50">
            {lang === "ms"
              ? "Malaysia: 012-3456789 · Antarabangsa: +[kod negara][nombor]"
              : "Malaysia: 012-3456789 · International: +[country code][number]"}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            Email
          </label>
          <input
            required
            type="email"
            placeholder="nama@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
              {lang === "ms" ? "Kata Laluan" : "Password"}
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink/50">
              {lang === "ms"
                ? "8+ aksara, huruf besar, huruf kecil & nombor"
                : "8+ chars, uppercase, lowercase & a number"}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
              {lang === "ms" ? "Sahkan Kata Laluan" : "Confirm Password"}
            </label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
            />
          </div>
        </div>

        {status === "error" && (
          <p className="rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson">
            {lang === "ms" ? "Ralat: " : "Error: "}
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-teal py-3 text-sm font-bold text-cream-light shadow-lg shadow-teal/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "submitting"
            ? lang === "ms"
              ? "Mendaftar..."
              : "Registering..."
            : lang === "ms"
            ? "Daftar"
            : "Register"}
        </button>

        <p className="text-center text-sm text-ink/60">
          {lang === "ms" ? "Sudah ada akaun?" : "Already have an account?"}{" "}
          <Link href="/login" className="font-bold text-teal underline">
            {lang === "ms" ? "Log Masuk" : "Log In"}
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
