"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ExternalLink, Loader2, LogIn, Minus, Plus, ShieldCheck, TriangleAlert, UserPlus, X } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { ProfilePreview, RobloxAvatar } from "./RobloxProfile";
import { useRobloxLookup } from "@/lib/roblox";
import { useWebUser, webApi, type Order } from "@/lib/web";
import { robuxPrice } from "@/lib/pricing";
import Image from "next/image";
import { API_URL, PAY_METHODS, number, rupiah, type PayMethod } from "@/lib/store";

type Line = { robux: number; username: string; display: string; avatar: string };

const MIN = 10;
const MAX = 10000;
const STEP = 5;
const PRESETS: { amount: number; tag?: string }[] = [
  { amount: 100, tag: "Murah" },
  { amount: 200 },
  { amount: 400, tag: "Populer" },
  { amount: 500 },
  { amount: 1000, tag: "Best seller" },
  { amount: 2000 },
  { amount: 5000 },
];
const TAG: Record<string, string> = {
  Murah: "bg-ice-soft text-[#0d1626]",
  Populer: "bg-blush text-[#3a1426]",
  "Best seller": "bg-violet-soft text-[#1d1240]",
};

function Step({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line-strong bg-surface p-5 sm:p-6" aria-labelledby={`langkah-${n}`}>
      <header className="flex items-center gap-3">
        <span className="chrome-chip grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-extrabold tabular">{n}</span>
        <div>
          <h2 id={`langkah-${n}`} className="text-lg font-bold tracking-tight">{title}</h2>
          {sub && <p className="text-sm text-ink-muted">{sub}</p>}
        </div>
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export function OrderForm({
  initialRate,
  initialStock,
  initialRobux,
  initialUsername,
}: {
  initialRate: number;
  initialStock: number;
  initialRobux: number;
  initialUsername: string;
}) {
  const router = useRouter();
  const user = useWebUser();
  const [rate, setRate] = useState(initialRate);
  const [stock, setStock] = useState(initialStock);
  const [robux, setRobux] = useState(initialRobux);
  const [username, setUsername] = useState(initialUsername);
  const [twoStep, setTwoStep] = useState(false);
  const [age, setAge] = useState<"adult" | "minor">("adult");
  const [pay, setPay] = useState<PayMethod>("qris");
  const [extra, setExtra] = useState<Line[]>([]);
  const [note, setNote] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { uname, valid, status, profile } = useRobloxLookup(username);

  // Harga dan stok terbaru tiap 30 detik
  useEffect(() => {
    const load = () =>
      fetch(`${API_URL}/api/rates`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.rate) setRate(Number(d.rate));
          if (d && d.stock !== undefined) setStock(Number(d.stock));
        })
        .catch(() => {});
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  // Penerima tambahan (misalnya teman) + penerima yang sedang diisi
  const current: Line | null =
    robux < MIN || !valid
      ? null
      : profile
        ? { robux, username: profile.name, display: profile.displayName, avatar: profile.avatar }
        : status === "error"
          ? { robux, username: uname, display: uname, avatar: "" }
          : null;
  const lines = current ? [...extra, current] : extra;
  const totalRobux = lines.reduce((n, l) => n + l.robux, 0);
  const max = Math.max(MIN, Math.min(stock, MAX));
  const subtotal = lines.reduce((n, l) => n + robuxPrice(l.robux, rate), 0);
  const currentPrice = robux >= MIN ? robuxPrice(robux, rate) : 0;
  const discount = promo ? Math.min(promo.discount, subtotal) : 0;
  const total = subtotal - discount;
  const overStock = totalRobux + (current ? 0 : robux) > stock;

  // Potongan promo dihitung ulang kalau jumlah Robux berubah
  const appliedCode = promo?.code;
  useEffect(() => {
    if (!appliedCode) return;
    const t = setTimeout(async () => {
      const r = await webApi<{ code: string; discount: number }>("promo", {
        method: "POST",
        body: JSON.stringify({ code: appliedCode, robux: totalRobux }),
      });
      if (r.ok) setPromo({ code: r.data.code, discount: r.data.discount });
      else {
        setPromo(null);
        setPromoMsg(r.data.error || "Kode promo tidak berlaku untuk jumlah ini.");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [totalRobux, appliedCode]);

  async function applyPromo() {
    setPromoMsg("");
    const code = promoInput.trim();
    if (!code) return;
    const r = await webApi<{ code: string; discount: number }>("promo", { method: "POST", body: JSON.stringify({ code, robux: totalRobux }) });
    if (!r.ok) return setPromoMsg(r.data.error || "Kode promo tidak bisa dipakai.");
    setPromo({ code: r.data.code, discount: r.data.discount });
  }

  const problems: string[] = [];
  if (rate <= 0) problems.push("Harga belum bisa dimuat.");
  if (robux < MIN) problems.push(`Minimal ${MIN} Robux.`);
  if (overStock) problems.push(`Stok sekarang cuma ${number(stock)} Robux.`);
  if (status === "notfound") problems.push("Username Roblox belum ketemu.");
  else if (!lines.length) problems.push("Isi username Roblox penerima.");
  if (!twoStep) problems.push("Centang konfirmasi 2-Step Verification.");
  const ready = problems.length === 0 && status !== "loading";

  function addRecipient() {
    if (!current || extra.length >= 9) return;
    setExtra((x) => [...x, current]);
    setUsername("");
  }

  async function submit() {
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    const r = await webApi<{ order: Order }>("orders", {
      method: "POST",
      body: JSON.stringify({
        lines: lines.map((l) => ({ robux: l.robux, username: l.username })),
        age_group: age,
        two_step: twoStep,
        note,
        payment_method: pay,
        promo_code: promo?.code ?? "",
      }),
    });
    if (r.status === 401) {
      setBusy(false);
      return router.push(loginHref);
    }
    if (!r.ok) {
      setBusy(false);
      return setError(r.data.error || "Pesanan gagal dibuat. Coba lagi.");
    }
    router.push(`/pesanan/${r.data.order.invoice}`);
  }

  const back = `/robux?${new URLSearchParams({ jumlah: String(robux), username: uname })}`;
  const loginHref = `/masuk?${new URLSearchParams({ next: back })}`;
  const setAmount = (n: number) => setRobux(Math.max(MIN, Math.min(MAX, Math.round(n) || MIN)));
  const soldOut = stock < MIN;
  const fill = max > MIN ? ((Math.min(robux, max) - MIN) / (max - MIN)) * 100 : 0;
  const payName = PAY_METHODS.find((m) => m.id === pay)?.name ?? "QRIS";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="grid grid-cols-1 gap-5">
        <Step n={1} title="Pilih nominal Robux" sub={rate > 0 ? `Harga ${rupiah(rate)} per Robux` : undefined}>
          {soldOut && (
            <p className="mb-4 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
              Stok Robux lagi habis. Tanya admin kapan restock, ya.
            </p>
          )}
          <div className="rounded-2xl border border-line-strong bg-ground/70 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAmount(robux - STEP)}
                disabled={robux <= MIN}
                aria-label={`Kurangi ${STEP} Robux`}
                className="chrome-chip grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-40"
              >
                <Minus size={20} aria-hidden />
              </button>
              <label className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
                <span className="sr-only">Jumlah Robux</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ice/15 text-ice">
                  <RobuxIcon className="h-6 w-6" />
                </span>
                <input
                  inputMode="numeric"
                  value={robux ? String(robux) : ""}
                  onChange={(e) => setRobux(Math.min(MAX, Number(e.target.value.replace(/\D/g, "").slice(0, 5)) || 0))}
                  onBlur={() => setAmount(robux)}
                  className="w-full min-w-0 max-w-[7ch] bg-transparent text-center text-4xl font-extrabold tracking-[-0.03em] tabular focus:outline-none sm:text-5xl"
                />
              </label>
              <button
                type="button"
                onClick={() => setAmount(robux + STEP)}
                disabled={robux + STEP > max}
                aria-label={`Tambah ${STEP} Robux`}
                className="chrome-chip grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-40"
              >
                <Plus size={20} aria-hidden />
              </button>
            </div>
            <div className="mt-3 flex items-baseline justify-center gap-2">
              <span className="text-sm text-ink-muted">Total</span>
              <span className="text-2xl font-extrabold text-ice tabular">{rupiah(currentPrice)}</span>
            </div>
            <input
              type="range"
              min={MIN}
              max={max}
              step={STEP}
              value={Math.min(robux, max)}
              disabled={soldOut}
              onChange={(e) => setRobux(Number(e.target.value))}
              aria-label="Geser jumlah Robux"
              className="rbx-range mt-5"
              style={{ "--p": `${fill}%` } as React.CSSProperties}
            />
            <div className="mt-2 flex justify-between text-xs text-ink-faint tabular">
              <span>Min {MIN}</span>
              <span>Tombol plus minus per {STEP} Robux</span>
              <span>Maks {number(max)}</span>
            </div>
          </div>

          <p className="mt-5 text-sm text-ink-muted">Pilihan cepat</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => {
              const selected = robux === p.amount;
              const disabled = p.amount > stock;
              return (
                <button
                  key={p.amount}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => setRobux(p.amount)}
                  className={`rounded-xl border px-3 pb-3 pt-2 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 ${
                    selected ? "metal border-transparent shadow-[0_12px_24px_-14px_rgb(188_214_255/0.7)]" : "border-line bg-raised/60 hover:border-line-strong"
                  }`}
                >
                  <span className="block h-4">
                    {p.tag && <span className={"inline-block rounded-full px-1.5 text-[10px] font-bold leading-4 " + TAG[p.tag]}>{p.tag}</span>}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-base font-extrabold tabular">
                    <RobuxIcon className={`h-3.5 w-3.5 ${selected ? "" : "text-ice"}`} /> {number(p.amount)}
                  </span>
                  <span className={`block text-xs tabular ${selected ? "text-[#3b3f47]" : "text-ink-muted"}`}>
                    {rate > 0 ? rupiah(p.amount * rate) : "-"}
                  </span>
                </button>
              );
            })}
          </div>
          {overStock && !soldOut && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
              Stok sekarang cuma {number(stock)} Robux. Kurangi jumlahnya atau tanya admin kapan restock.
            </p>
          )}
        </Step>

        <Step n={2} title="Data akun Roblox" sub="Cukup username, Robux dikirim tanpa password.">
          <label className="block">
            <span className="text-sm text-ink-muted">Username Roblox penerima <span className="text-ink-faint">(bukan display name)</span></span>
            <input
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Contoh: builderman"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              aria-invalid={status === "notfound"}
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn"
            />
          </label>
          <ProfilePreview status={status} profile={profile} username={uname} />

          {extra.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-2" aria-label="Penerima lain">
              {extra.map((l, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-raised/50 p-2.5 pr-3">
                  <RobloxAvatar src={l.avatar} size="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.display}</p>
                    <p className="truncate text-xs text-ink-muted">@{l.username}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold tabular">
                    <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(l.robux)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setExtra((x) => x.filter((_, j) => j !== i))}
                    aria-label={`Hapus pesanan untuk @${l.username}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-ink-faint hover:bg-ink/5 hover:text-ink"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={addRecipient}
            disabled={!current || extra.length >= 9}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:border-ice hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <UserPlus size={16} aria-hidden /> Tambah penerima lain (misalnya teman)
          </button>
          <p className="mt-1.5 text-xs text-ink-faint">
            Isi jumlah dan username, lalu tekan tombol ini. Penerima berikutnya bisa beda jumlah Robux.
          </p>

          <div className="mt-5 rounded-2xl border border-warn/30 bg-warn/[0.07] p-4">
            <p className="flex items-center justify-between gap-3 font-semibold">
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-warn" aria-hidden /> Nyalakan 2-Step Verification
              </span>
              <span className="rounded-full bg-warn/20 px-2 py-0.5 text-[11px] font-bold text-warn">Wajib</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Roblox membatasi Robux yang bisa masuk ke akun tanpa verifikasi 2 langkah. Nyalakan dulu (cukup sekali) supaya Robux
              nggak tertahan.
            </p>
            <ol className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-medium">
              {["Settings", "Security", "2-Step Verification", "Pilih Email"].map((s, i) => (
                <li key={s} className="flex items-center gap-1.5">
                  {i > 0 && <ArrowRight size={12} className="text-ink-faint" aria-hidden />}
                  <span className="rounded-full border border-line-strong px-2.5 py-1">{s}</span>
                </li>
              ))}
            </ol>
            <a
              href="https://www.roblox.com/my/account#!/security"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ice hover:underline"
            >
              Buka pengaturan keamanan Roblox <ExternalLink size={14} aria-hidden />
            </a>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line-strong bg-ground/60 p-3">
              <input type="checkbox" checked={twoStep} onChange={(e) => setTwoStep(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#22c55e]" />
              <span className="text-sm">
                Aku sudah memastikan 2-Step Verification (Email) aktif di akun penerima. Aku setuju, kalau Robux nggak bisa
                dikirim karena akun belum siap, pesanan <b>tidak bisa di-refund</b>.
              </span>
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm text-ink-muted">Umur akun Roblox penerima</legend>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(
                [
                  ["adult", "18 tahun ke atas", "Robux bisa langsung masuk."],
                  ["minor", "Di bawah 18 tahun", "Roblox bisa minta persetujuan orang tua lewat email dulu sebelum Robux masuk."],
                ] as const
              ).map(([value, title, desc]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors ${
                    age === value ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                  }`}
                >
                  <input type="radio" name="umur" checked={age === value} onChange={() => setAge(value)} className="mt-1 h-4 w-4 accent-[#bcd6ff]" />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block">
            <span className="text-sm text-ink-muted">Catatan untuk admin (opsional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 300))}
              rows={3}
              placeholder="Contoh: kirim setelah jam 7 malam"
              className="mt-1.5 w-full resize-none rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
        </Step>

        <Step n={3} title="Cara bayar" sub="Pilih yang paling gampang buat kamu. Nanti masih bisa diganti di halaman pesanan.">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Metode pembayaran">
            {PAY_METHODS.map((m) => {
              const selected = pay === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPay(m.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    selected ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                  } ${m.id === "qris" ? "sm:col-span-2" : ""}`}
                >
                  <span className="grid h-11 w-20 shrink-0 place-items-center rounded-lg bg-white px-2">
                    <Image src={m.logo} alt="" width={m.w} height={m.h} className="h-auto max-h-7 w-auto max-w-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {m.id === "qris" ? "QRIS" : `E-wallet ${m.name}`}
                      {m.id === "qris" && <span className="rounded-full bg-live/15 px-2 py-0.5 text-[10px] font-bold text-live">Paling gampang</span>}
                    </span>
                    <span className="block text-xs text-ink-muted">{m.hint}</span>
                  </span>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${selected ? "border-ice bg-ice-soft text-[#0d1626]" : "border-line-strong"}`}
                    aria-hidden
                  >
                    {selected && <Check size={14} />}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 rounded-xl border border-line bg-raised/50 px-3.5 py-3 text-sm text-ink-muted">
            Pesanan baru diproses setelah kamu upload bukti bayar atau kabari admin di chat kalau sudah transfer. Pembayaran dicek
            manual oleh admin.
          </p>
        </Step>
      </div>

      <aside className="glow-card rounded-[var(--radius-card)] border border-line-strong px-5 pt-5 sm:px-6 sm:pt-6 lg:sticky lg:top-24" aria-label="Ringkasan pesanan">
        <h2 className="text-lg font-bold tracking-tight">Ringkasan pesanan</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2">
          {lines.length === 0 ? (
            <li className="flex items-center gap-3 rounded-xl border border-line bg-ground/50 p-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised text-xs font-bold text-ink-faint">RBX</span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{valid ? uname : "Username belum diisi"}</p>
                <p className="truncate text-xs text-ink-muted">Akun Roblox penerima</p>
              </div>
            </li>
          ) : (
            lines.map((l, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-ground/50 p-2.5">
                <RobloxAvatar src={l.avatar} size="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.display}</p>
                  <p className="truncate text-xs text-ink-muted">@{l.username}</p>
                </div>
                <div className="text-right text-sm tabular">
                  <p className="inline-flex items-center gap-1 font-bold">
                    <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(l.robux)}
                  </p>
                  <p className="text-xs text-ink-muted">{rupiah(robuxPrice(l.robux, rate))}</p>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="mt-3 divide-y divide-line">
          <Row label="Layanan">Robux via Username</Row>
          <Row label={lines.length > 1 ? `Jumlah (${lines.length} penerima)` : "Jumlah"}>
            <span className="inline-flex items-center gap-1 tabular">
              <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(lines.length ? totalRobux : robux)}
            </span>
          </Row>
          <Row label="Umur akun">{age === "adult" ? "18+ tahun" : "Di bawah 18"}</Row>
          <Row label="Metode bayar">{payName}</Row>
          <Row label="Harga">
            <span className="tabular">{rupiah(subtotal)}</span>
          </Row>
          {promo && (
            <Row label={`Promo ${promo.code}`}>
              <span className="text-live tabular">-{rupiah(discount)}</span>
            </Row>
          )}
        </div>

        <div className="mt-3">
          {promo ? (
            <p className="flex items-center justify-between gap-3 rounded-xl border border-live/30 bg-live/[0.07] px-3 py-2.5 text-sm">
              <span>
                Kode <b>{promo.code}</b> dipakai
              </span>
              <button
                type="button"
                onClick={() => {
                  setPromo(null);
                  setPromoInput("");
                }}
                aria-label="Hapus kode promo"
                className="text-ink-faint hover:text-ink"
              >
                <X size={16} aria-hidden />
              </button>
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase().slice(0, 20))}
                placeholder="Kalau punya, contoh: HEMAT10"
                aria-label="Kode promo"
                className="min-w-0 flex-1 rounded-xl border border-line bg-ground px-3.5 py-2.5 text-base uppercase sm:text-sm placeholder:normal-case placeholder:text-ink-faint focus:border-ice focus:outline-none"
              />
              <button type="button" onClick={applyPromo} className="rounded-xl border border-line-strong px-4 text-sm font-semibold hover:bg-raised">
                Pakai
              </button>
            </div>
          )}
          {promoMsg && <p className="mt-1.5 text-xs text-warn">{promoMsg}</p>}
        </div>

        <div className="ice -mx-5 mt-5 rounded-b-[calc(var(--radius-card)-1px)] px-5 pb-5 sm:-mx-6 sm:px-6 sm:pb-6">
          <span className="perf -mx-5 sm:-mx-6" aria-hidden />
          <p className="text-sm font-medium text-[#2b3a55]">Total pembayaran</p>
          <p className="text-3xl font-extrabold tracking-tight tabular">{rupiah(total)}</p>

          {user === null ? (
            <>
              <Link
                href={loginHref}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-5 py-3.5 font-semibold text-snow shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)]"
              >
                <LogIn size={18} aria-hidden /> Masuk untuk membeli
              </Link>
              <p className="mt-3 text-center text-xs text-[#2b3a55]">
                Masuk dulu supaya pesanan dan chat sama admin tersimpan di akunmu.
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={submit}
                disabled={!ready || busy || user === undefined}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-5 py-3.5 font-semibold text-snow shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
                Buat pesanan <ArrowRight size={18} aria-hidden />
              </button>
              {!ready && problems.length > 0 && <p className="mt-3 text-center text-xs text-[#2b3a55]">{problems[0]}</p>}
              {user && ready && <p className="mt-3 text-center text-xs text-[#2b3a55]">Masuk sebagai {user.name}.</p>}
            </>
          )}
          {error && (
            <p className="mt-3 rounded-xl bg-onyx px-3.5 py-2.5 text-sm text-[#fbbf24]" role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
