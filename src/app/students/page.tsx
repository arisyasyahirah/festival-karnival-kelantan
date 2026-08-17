"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type Student = {
  id: string;
  full_name: string | null;
  institution: string | null;
  category: string | null;
  phone: string | null;
  email: string | null;
  seat_number: number | null;
  attending: boolean | null;
};

const CATEGORY_LABEL: Record<string, { ms: string; en: string }> = {
  "filem-pendek": { ms: "Filem Pendek", en: "Short Film" },
  "video-tv-pss": { ms: "Video TV PSS", en: "TV PSS Video" },
  "video-kreatif": { ms: "Video Kreatif", en: "Creative Video" },
  podcast: { ms: "Podcast", en: "Podcast" },
  tiada: { ms: "Tiada / Tetamu Sahaja", en: "None / Guest Only" },
};

async function downloadPdf(
  students: Student[],
  lang: "ms" | "en",
  title: string,
  filenamePrefix: string,
  includeStatusColumn: boolean
) {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text(`${title} - FFK`, 14, 16);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString(), 14, 22);

  // Seat number is now permanent, so it's always shown. Status is only
  // useful on the full-roster export, where attendance still varies.
  const head = [
    [
      lang === "ms" ? "No. Tempat" : "Seat #",
      ...(includeStatusColumn ? [lang === "ms" ? "Status" : "Status"] : []),
      lang === "ms" ? "Nama" : "Name",
      lang === "ms" ? "Institusi" : "Institution",
      lang === "ms" ? "Kategori" : "Category",
      lang === "ms" ? "Telefon" : "Phone",
      "Email",
    ],
  ];

  const body = students.map((s) => [
    s.seat_number != null ? `#${s.seat_number}` : "—",
    ...(includeStatusColumn
      ? [
          s.attending === true
            ? lang === "ms" ? "Hadir" : "Attending"
            : s.attending === false
            ? lang === "ms" ? "Tidak Hadir" : "Not Attending"
            : lang === "ms" ? "Belum Jawab" : "Not Answered",
        ]
      : []),
    s.full_name || "—",
    s.institution || "—",
    s.category && CATEGORY_LABEL[s.category] ? CATEGORY_LABEL[s.category][lang] : s.category || "—",
    s.phone || "—",
    s.email || "—",
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 28,
    headStyles: { fillColor: [15, 118, 110] },
    styles: { fontSize: 9 },
  });

  doc.save(`${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function StudentsPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          router.replace("/login");
          return;
        }

        const { data: me, error: meError } = await supabase
          .from("profiles")
          .select("is_teacher")
          .eq("id", sessionData.session.user.id)
          .single();

        if (cancelled) return;

        if (meError) {
          setErrorMsg(meError.message);
          setLoading(false);
          return;
        }

        if (!me.is_teacher) {
          router.replace("/profile");
          return;
        }

        setAuthorized(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, institution, category, phone, email, seat_number, attending")
          .eq("role", "student")
          .order("seat_number", { ascending: true, nullsFirst: false });

        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message);
        } else {
          setStudents((data ?? []) as Student[]);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : String(err));
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

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-24 text-center text-sm text-ink/50">
        {lang === "ms" ? "Memuatkan..." : "Loading..."}
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-sm text-crimson">{errorMsg}</p>
      </main>
    );
  }

  const attending = students.filter((s) => s.attending === true);
  const roster = students; // everyone, regardless of RSVP status

  function statusLabel(s: Student) {
    if (s.attending === true) return { text: lang === "ms" ? "Hadir" : "Attending", cls: "text-teal" };
    if (s.attending === false) return { text: lang === "ms" ? "Tidak Hadir" : "Not Attending", cls: "text-crimson" };
    return { text: lang === "ms" ? "Belum Jawab" : "Not Answered", cls: "text-ink/40" };
  }

  function renderTable(list: Student[], includeStatus: boolean) {
    return (
      <>
        {/* Desktop / tablet: normal table */}
        <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-walnut/10 md:block">
          <table className="w-full text-left text-base">
            <thead className="border-b-2 border-walnut/20 bg-walnut/10 text-sm font-bold uppercase tracking-wide text-walnut">
              <tr>
                <th className="px-5 py-4">{lang === "ms" ? "No. Tempat" : "Seat #"}</th>
                {includeStatus && <th className="px-5 py-4">{lang === "ms" ? "Status" : "Status"}</th>}
                <th className="px-5 py-4">{lang === "ms" ? "Nama" : "Name"}</th>
                <th className="px-5 py-4">{lang === "ms" ? "Institusi" : "Institution"}</th>
                <th className="px-5 py-4">{lang === "ms" ? "Kategori" : "Category"}</th>
                <th className="px-5 py-4">{lang === "ms" ? "Telefon" : "Phone"}</th>
                <th className="px-5 py-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const status = statusLabel(s);
                return (
                  <tr key={s.id} className="border-t border-walnut/10 even:bg-walnut/[0.04] hover:bg-teal/5">
                    <td className="px-5 py-4 text-lg font-extrabold text-teal">
                      {s.seat_number != null ? `#${s.seat_number}` : "—"}
                    </td>
                    {includeStatus && (
                      <td className={`px-5 py-4 text-base font-bold ${status.cls}`}>{status.text}</td>
                    )}
                    <td className="px-5 py-4 text-base font-semibold text-walnut">{s.full_name}</td>
                    <td className="px-5 py-4 text-base text-ink/70">{s.institution || "—"}</td>
                    <td className="px-5 py-4 text-base text-ink/70">
                      {s.category && CATEGORY_LABEL[s.category] ? CATEGORY_LABEL[s.category][lang] : s.category || "—"}
                    </td>
                    <td className="px-5 py-4 text-base text-ink/70">{s.phone || "—"}</td>
                    <td className="px-5 py-4 text-base text-ink/70">{s.email || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards instead of a cramped sideways-scrolling table */}
        <div className="mt-4 space-y-3 md:hidden">
          {list.map((s) => {
            const status = statusLabel(s);
            return (
              <div key={s.id} className="rounded-2xl border border-walnut/10 bg-cream-light p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl font-extrabold text-teal">
                    {s.seat_number != null ? `#${s.seat_number}` : "—"}
                  </span>
                  {includeStatus && (
                    <span className={`text-sm font-bold ${status.cls}`}>{status.text}</span>
                  )}
                </div>
                <p className="mt-2 text-base font-semibold text-walnut">{s.full_name || "—"}</p>

                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-ink/50">{lang === "ms" ? "Institusi" : "Institution"}</dt>
                  <dd className="text-ink/80">{s.institution || "—"}</dd>

                  <dt className="text-ink/50">{lang === "ms" ? "Kategori" : "Category"}</dt>
                  <dd className="text-ink/80">
                    {s.category && CATEGORY_LABEL[s.category] ? CATEGORY_LABEL[s.category][lang] : s.category || "—"}
                  </dd>

                  <dt className="text-ink/50">{lang === "ms" ? "Telefon" : "Phone"}</dt>
                  <dd className="text-ink/80">
                    {s.phone ? (
                      <a href={`tel:${s.phone}`} className="underline">
                        {s.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>

                  <dt className="text-ink/50">Email</dt>
                  <dd className="truncate text-ink/80">
                    {s.email ? (
                      <a href={`mailto:${s.email}`} className="underline">
                        {s.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </dl>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
            {lang === "ms" ? "Akses Guru" : "Teacher Access"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-walnut md:text-3xl">
            {lang === "ms" ? "Senarai Murid" : "Student Lists"}
          </h1>
        </div>
        <Link
          href="/profile"
          className="rounded-full border border-walnut/20 px-4 py-2 text-xs font-bold text-walnut hover:bg-walnut/10"
        >
          {lang === "ms" ? "← Kembali" : "← Back"}
        </Link>
      </div>

      {errorMsg && (
        <p className="mt-6 rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson">
          {errorMsg}
        </p>
      )}

      {/* Table 1: confirmed attending, with seat numbers */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-walnut">
              {lang === "ms" ? "Murid Hadir (Ya)" : "Attending Students (Yes)"}
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {attending.length}{" "}
              {lang === "ms" ? "murid telah mengesahkan kehadiran" : "students confirmed attending"}
            </p>
          </div>
          {attending.length > 0 && (
            <button
              onClick={() =>
                downloadPdf(
                  attending,
                  lang,
                  lang === "ms" ? "Senarai Murid Hadir" : "Attending Students",
                  "flep26-senarai-hadir",
                  false
                )
              }
              className="rounded-full bg-teal px-4 py-2 text-xs font-bold text-cream-light hover:opacity-90"
            >
              {lang === "ms" ? "⬇ Muat Turun PDF" : "⬇ Download PDF"}
            </button>
          )}
        </div>

        {attending.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink/50">
            {lang === "ms" ? "Tiada murid mengesahkan Ya lagi." : "No students have confirmed Yes yet."}
          </p>
        ) : (
          renderTable(attending, false)
        )}
      </div>

      {/* Table 2: full roster, everyone regardless of RSVP status */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-walnut">
              {lang === "ms" ? "Semua Murid Berdaftar" : "All Registered Students"}
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {roster.length} {lang === "ms" ? "jumlah pendaftaran" : "total registrations"}
            </p>
          </div>
          {roster.length > 0 && (
            <button
              onClick={() =>
                downloadPdf(
                  roster,
                  lang,
                  lang === "ms" ? "Semua Murid Berdaftar" : "All Registered Students",
                  "flep26-semua-murid",
                  true
                )
              }
              className="rounded-full border border-teal px-4 py-2 text-xs font-bold text-teal hover:bg-teal/5"
            >
              {lang === "ms" ? "⬇ Muat Turun PDF" : "⬇ Download PDF"}
            </button>
          )}
        </div>

        {roster.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink/50">
            {lang === "ms" ? "Tiada murid berdaftar lagi." : "No students registered yet."}
          </p>
        ) : (
          renderTable(roster, true)
        )}
      </div>
    </main>
  );
}
