"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("error");
        setErrorMsg(
          error.message === "Invalid login credentials"
            ? lang === "ms"
              ? "Email atau kata laluan salah. Sila cuba lagi."
              : "Incorrect email or password. Please try again."
            : error.message
        );
        return;
      }

      // If they registered before confirming their email, the profile row only
      // has an email on it — apply the draft they filled in at registration now.
      const pendingRaw = localStorage.getItem("flep26_pending_profile");
      if (pendingRaw && data.user) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.email === data.user.email) {
            const { email: _drop, ...fields } = pending;
            await supabase.from("profiles").update(fields).eq("id", data.user.id);
          }
        } catch {
          // ignore malformed draft
        }
        localStorage.removeItem("flep26_pending_profile");
      }

      router.push("/profile");
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

  return (
    <main className="mx-auto max-w-md px-6 py-16 md:py-24">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
          {lang === "ms" ? "Log Masuk" : "Log In"}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-walnut md:text-3xl">
          FFK
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-walnut/70">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-walnut/20 bg-cream-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>
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
              ? "Log masuk..."
              : "Logging in..."
            : lang === "ms"
            ? "Log Masuk"
            : "Log In"}
        </button>

        <p className="text-center text-sm text-ink/60">
          {lang === "ms" ? "Belum ada akaun?" : "Don't have an account?"}{" "}
          <Link href="/rsvp" className="font-bold text-teal underline">
            {lang === "ms" ? "Daftar di sini" : "Register here"}
          </Link>
        </p>
      </form>
    </main>
  );
}
