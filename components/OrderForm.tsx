"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, ExternalLink, Loader2, LogIn, Minus, Plus, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { PayLogos } from "./PayLogos";
import { ProfilePreview, RobloxAvatar } from "./RobloxProfile";
import { useRobloxLookup } from "@/lib/roblox";
import { useWebUser, webApi, type Order } from "@/lib/web";
import { API_URL, number, rupiah } from "@/lib/store";

const MIN = 10;
const MAX = 10000;
const PRESETS = [100, 200, 400, 500, 1000, 2000, 5000];

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

  const max = Math.max(MIN, Math.min(stock, MAX));
  const subtotal = robux * rate;
  const discount = promo ? Math.min(promo.discount, subtotal) : 0;
  const total = subtotal - discount;
  const overStock = robux > stock;

  // Potongan promo dihitung ulang kalau jumlah Robux berubah
  const appliedCode = promo?.code;
  useEffect(() => {
    if (!appliedCode) return;
    const t = setTimeout(async () => {
      const r = await webApi<{ code: string; discount: number }>("promo", {
        method: "POST",
        body: JSON.stringify({ code: appliedCode, robux }),
      });
      if (r.ok) setPromo({ code: r.data.code, discount: r.data.discount });
      else {
        setPromo(null);
        setPromoMsg(r.data.error || "Kode promo tidak berlaku untuk jumlah ini.");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [robux, appliedCode]);

  async function applyPromo() {
    setPromoMsg("");
    const code = promoInput.trim();
    if (!code) return;
    const r = await webApi<{ code: string; discount: number }>("promo", { method: "POST", body: JSON.stringify({ code, robux }) });
    if (!r.ok) return setPromoMsg(r.data.error || "Kode promo tidak bisa dipakai.");
    setPromo({ code: r.data.code, discount: r.data.discount });
  }

  const problems: string[] = [];
  if (rate <= 0) problems.push("Harga belum bisa dimuat.");
  if (robux < MIN) problems.push(`Minimal ${MIN} Robux.`);
  if (overStock) problems.push(`Stok sekarang cuma ${number(stock)} Robux.`);
  if (!valid) problems.push("Isi username Roblox penerima.");
  else if (status === "notfound") problems.push("Username Roblox belum ketemu.");
  if (!twoStep) problems.push("Centang konfirmasi 2-Step Verification.");
  const ready = problems.length === 0 && status !== "loading";

  async function submit() {
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    const r = await webApi<{ order: Order }>("orders", {
      method: "POST",
      body: JSON.stringify({
        robux,
        roblox_username: profile?.name ?? uname,
        age_group: age,
        two_step: twoStep,
        note,
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="grid gap-5">
        <Step n={1} title="Pilih nominal Robux" sub={rate > 0 ? `Harga ${rupiah(rate)} per Robux` : undefined}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAmount(robux - (robux > 100 ? 100 : 10))}
              aria-label="Kurangi"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong hover:bg-raised"
            >
              <Minus size={18} aria-hidden />
            </button>
            <label className="relative flex-1">
              <span className="sr-only">Jumlah Robux</span>
              <RobuxIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ice" />
              <input
                inputMode="numeric"
                value={robux ? String(robux) : ""}
                onChange={(e) => setRobux(Math.min(MAX, Number(e.target.value.replace(/\D/g, "").slice(0, 5)) || 0))}
                onBlur={() => setAmount(robux)}
                className="w-full rounded-2xl border border-line bg-ground py-3.5 pl-12 pr-4 text-center text-2xl font-extrabold tabular focus:border-ice focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setAmount(robux + (robux >= 100 ? 100 : 10))}
              aria-label="Tambah"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong hover:bg-raised"
            >
              <Plus size={18} aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-ink-muted tabular">
            = <span className="font-semibold text-ink">{rupiah(subtotal)}</span>
          </p>
          <input
            type="range"
            min={MIN}
            max={max}
            step={10}
            value={Math.min(robux, max)}
            onChange={(e) => setRobux(Number(e.target.value))}
            aria-label="Geser jumlah Robux"
            className="mt-4 w-full accent-[#bcd6ff]"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-faint tabular">
            <span>Min {MIN}</span>
            <span>Maks {number(max)}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => {
              const selected = robux === p;
              const disabled = p > stock;
              return (
                <button
                  key={p}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => setRobux(p)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                    selected ? "metal border-transparent" : "border-line bg-raised/60 hover:border-line-strong"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-extrabold tabular">
                    <RobuxIcon className={`h-3.5 w-3.5 ${selected ? "" : "text-ice"}`} /> {number(p)}
                  </span>
                  <span className={`block text-xs tabular ${selected ? "text-[#3b3f47]" : "text-ink-muted"}`}>
                    {rate > 0 ? rupiah(p * rate) : "-"}
                  </span>
                </button>
              );
            })}
          </div>
          {overStock && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
              Stok sekarang cuma {number(stock)} Robux. Kurangi jumlahnya atau tanya admin kapan restock.
            </p>
          )}
        </Step>

        <Step n={2} title="Data akun Roblox" sub="Cukup username, Robux dikirim tanpa password.">
          <label className="block">
            <span className="text-sm text-ink-muted">Username Roblox penerima</span>
            <input
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Username, bukan display name"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              aria-invalid={status === "notfound"}
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn"
            />
          </label>
          <ProfilePreview status={status} profile={profile} username={uname} />

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
              <span className="text-sm">Aku sudah memastikan 2-Step Verification (Email) aktif di akun penerima.</span>
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm text-ink-muted">Umur akun Roblox penerima</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
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

        <Step n={3} title="Cara bayar" sub="Pembayaran dicek manual oleh admin.">
          <div className="rounded-xl border border-ice bg-ice/10 p-4">
            <p className="flex items-center justify-between gap-3 font-semibold">
              QRIS (semua bank dan e-wallet)
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ice text-[#0d1626]">
                <Check size={14} aria-hidden />
              </span>
            </p>
            <p className="mt-1.5 text-sm text-ink-muted">
              Bisa dibayar pakai DANA, GoPay, ShopeePay, OVO, atau aplikasi bank. Kode QRIS muncul setelah pesanan dibuat, lalu kamu upload
              bukti bayarnya.
            </p>
            <PayLogos className="mt-3" />
          </div>
        </Step>
      </div>

      <aside className="glow-card rounded-[var(--radius-card)] border border-line-strong px-5 pt-5 sm:px-6 sm:pt-6 lg:sticky lg:top-24" aria-label="Ringkasan pesanan">
        <h2 className="text-lg font-bold tracking-tight">Ringkasan pesanan</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-ground/50 p-3">
          {profile ? (
            <RobloxAvatar src={profile.avatar} size="h-11 w-11" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised text-xs font-bold text-ink-faint">RBX</span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{profile ? profile.displayName : valid ? uname : "Username belum diisi"}</p>
            <p className="truncate text-xs text-ink-muted">{profile ? `@${profile.name}` : "Akun Roblox penerima"}</p>
          </div>
        </div>
        <div className="mt-3 divide-y divide-line">
          <Row label="Layanan">Robux via Username</Row>
          <Row label="Jumlah">
            <span className="inline-flex items-center gap-1 tabular">
              <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(robux)}
            </span>
          </Row>
          <Row label="Umur akun">{age === "adult" ? "18+ tahun" : "Di bawah 18"}</Row>
          <Row label="Metode bayar">QRIS</Row>
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
                placeholder="Kode promo"
                aria-label="Kode promo"
                className="min-w-0 flex-1 rounded-xl border border-line bg-ground px-3.5 py-2.5 text-sm uppercase placeholder:normal-case placeholder:text-ink-faint focus:border-ice focus:outline-none"
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0c] px-5 py-3.5 font-semibold text-ink shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)]"
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
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0c] px-5 py-3.5 font-semibold text-ink shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
                Buat pesanan <ArrowRight size={18} aria-hidden />
              </button>
              {!ready && problems.length > 0 && <p className="mt-3 text-center text-xs text-[#2b3a55]">{problems[0]}</p>}
              {user && ready && <p className="mt-3 text-center text-xs text-[#2b3a55]">Masuk sebagai {user.name}.</p>}
            </>
          )}
          {error && (
            <p className="mt-3 rounded-xl bg-[#0b0b0c] px-3.5 py-2.5 text-sm text-warn" role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
