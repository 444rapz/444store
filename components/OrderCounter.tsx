"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Loader2, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import { Odometer } from "./Odometer";
import { CopyButton } from "./CopyButton";
import { PayLogos } from "./PayLogos";
import { RobuxIcon } from "./RobuxIcon";
import { API_URL, CONTACT, PACKAGES, PAYMENT, number, rupiah, waLink } from "@/lib/store";

type Mode = "robux" | "budget";
type Profile = { name: string; displayName: string; avatar: string; verified: boolean };
type Lookup = { user: string; state: "found" | "notfound" | "error"; profile?: Profile };
type Status = "idle" | "loading" | Lookup["state"];

const VALID_USERNAME = /^[A-Za-z0-9_]{3,20}$/;
const TAG: Record<string, string> = {
  Murah: "bg-ice text-[#0d1626]",
  Populer: "bg-blush text-[#3a1426]",
  "Best seller": "bg-violet-soft text-[#1d1240]",
};

function Avatar({ profile, size }: { profile: Profile; size: string }) {
  return (
    <span className={"relative shrink-0 overflow-hidden rounded-xl bg-raised ring-1 ring-line-strong " + size}>
      {profile.avatar && <Image src={profile.avatar} alt="" width={150} height={150} unoptimized className="h-full w-full object-cover" />}
    </span>
  );
}

/** Kartu profil Roblox di bawah kolom username, supaya pembeli yakin akunnya benar. */
function ProfilePreview({ status, profile, username }: { status: Status; profile?: Profile; username: string }) {
  if (status === "loading") {
    return (
      <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-muted" aria-live="polite">
        <Loader2 size={15} className="animate-spin" aria-hidden /> Mencari akun Roblox...
      </p>
    );
  }
  if (status === "found" && profile) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-live/30 bg-live/[0.07] p-2.5 pr-3" aria-live="polite">
        <Avatar profile={profile} size="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-semibold">
            <span className="truncate">{profile.displayName}</span>
            {profile.verified && <BadgeCheck size={15} className="shrink-0 text-ice" aria-label="Terverifikasi Roblox" />}
          </p>
          <p className="truncate text-sm text-ink-muted">@{profile.name}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live">
          <Check size={13} aria-hidden /> Akun ketemu
        </span>
      </div>
    );
  }
  if (status === "notfound") {
    return (
      <p className="mt-2.5 flex items-start gap-2 text-sm text-warn" aria-live="polite">
        <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
        Username @{username} nggak ketemu di Roblox. Cek lagi ejaannya, pakai username (bukan display name).
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="mt-2.5 text-sm text-ink-muted" aria-live="polite">
        Belum bisa cek akun Roblox sekarang. Pastikan username sudah benar, ya.
      </p>
    );
  }
  return null;
}

export function OrderCounter({ initialRate, initialStock }: { initialRate: number; initialStock: number }) {
  const [rate, setRate] = useState(initialRate);
  const [stock, setStock] = useState(initialStock);
  const [mode, setMode] = useState<Mode>("robux");
  const [amount, setAmount] = useState(PACKAGES[0].amount);
  const [custom, setCustom] = useState("");
  const [budget, setBudget] = useState("");
  const [username, setUsername] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [touched, setTouched] = useState(false);

  // Harga dan stok ikut berubah tanpa muat ulang (tiap 30 detik)
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

  const uname = username.trim();
  const usernameOk = VALID_USERNAME.test(uname);

  // Cari akun Roblox setelah pembeli berhenti mengetik sebentar
  useEffect(() => {
    if (!VALID_USERNAME.test(uname)) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch("/api/roblox?username=" + encodeURIComponent(uname), { signal: ctrl.signal })
        .then(async (r) => {
          const d = await r.json().catch(() => null);
          if (!r.ok || !d) return setLookup({ user: uname, state: "error" });
          setLookup(d.found ? { user: uname, state: "found", profile: d as Profile } : { user: uname, state: "notfound" });
        })
        .catch((e) => {
          if (e?.name !== "AbortError") setLookup({ user: uname, state: "error" });
        });
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [uname]);

  const status: Status = !usernameOk ? "idle" : lookup?.user === uname ? lookup.state : "loading";
  const profile = status === "found" ? lookup?.profile : undefined;

  const robux = useMemo(() => {
    if (mode === "budget") {
      const b = Number(budget.replace(/\D/g, ""));
      return rate > 0 ? Math.floor(b / rate) : 0;
    }
    const c = Number(custom.replace(/\D/g, ""));
    return custom ? c : amount;
  }, [mode, budget, custom, amount, rate]);

  const total = robux * rate;
  const overStock = robux > stock;
  const priceReady = rate > 0;
  const accountOk = status === "found" || status === "error";
  const canContinue = priceReady && robux > 0 && !overStock && usernameOk && accountOk;
  const robloxName = profile?.name ?? uname;

  const orderText =
    "Halo min, aku mau order Robux via username.\n" +
    `Jumlah: ${number(robux)} Robux\nTotal: ${rupiah(total)}\nUsername Roblox: ${robloxName}\n` +
    "Bukti transfer aku kirim di sini ya.";

  if (step === 2) {
    return (
      <div className="glow-card rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden /> Ubah pesanan
        </button>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-muted">Kamu bayar</p>
            <p className="text-3xl font-extrabold tracking-tight tabular">{rupiah(total)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink-muted tabular">
              <RobuxIcon className="h-3.5 w-3.5" /> {number(robux)} Robux
            </p>
          </div>
          <div className="flex min-w-0 items-center gap-2.5 text-right">
            <div className="min-w-0">
              <p className="text-xs text-ink-faint">Dikirim ke</p>
              <p className="truncate font-semibold">{profile?.displayName ?? robloxName}</p>
              <p className="truncate text-xs text-ink-muted">@{robloxName}</p>
            </div>
            {profile && <Avatar profile={profile} size="h-12 w-12" />}
          </div>
        </div>
        <span className="perf -mx-5 mt-3 sm:-mx-6" aria-hidden />

        <ol className="mt-3 space-y-6">
          <li>
            <p className="font-medium">1. Scan QRIS ini pakai aplikasi apa aja</p>
            <div className="mt-3 overflow-hidden rounded-xl bg-white p-3 sm:max-w-[260px]">
              <Image src="/qris.png" alt="Kode QRIS 444 Store" width={520} height={520} className="h-auto w-full" priority />
            </div>
            <PayLogos className="mt-3" />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <span>
                Atau transfer {PAYMENT.ewalletNames}: <span className="tabular text-ink">{PAYMENT.ewallet}</span> a.n. {PAYMENT.holder}
              </span>
              <CopyButton text={PAYMENT.ewalletRaw} label="Salin nomor" />
            </div>
          </li>
          <li>
            <p className="font-medium">2. Kirim bukti bayar ke admin</p>
            <p className="mt-1 text-sm text-ink-muted">
              Detail pesananmu sudah ditulis otomatis, tinggal kirim bersama screenshot bukti bayar.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                href={CONTACT.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl bg-discord px-4 py-3 text-sm font-medium text-white transition-transform active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} aria-hidden /> Lewat Discord
                </span>
                <span className="text-xs text-white/80">Buka tiket</span>
              </a>
              <a
                href={waLink(orderText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-line-strong px-4 py-3 text-sm font-medium transition-colors hover:border-whatsapp hover:bg-whatsapp/10"
              >
                <span className="flex items-center gap-2">
                  <Phone size={18} aria-hidden /> Lewat WhatsApp
                </span>
                <span className="text-xs text-ink-faint">Tanpa Discord</span>
              </a>
            </div>
          </li>
        </ol>
        <p className="mt-6 text-sm text-ink-muted">
          Pesanan diproses setelah bukti bayar dicek admin. Robux dikirim ke username kamu, tanpa perlu password.
        </p>
      </div>
    );
  }

  return (
    <form
      className="glow-card rounded-[var(--radius-card)] border border-line-strong px-5 pt-5 sm:px-6 sm:pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canContinue) setStep(2);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Robux via Username</h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ground/50 px-3 py-1 text-xs text-ink-muted tabular">
          <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
          Stok <RobuxIcon className="h-3.5 w-3.5" /> {number(stock)}
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-line-strong bg-ground/50 p-1 text-sm" role="tablist" aria-label="Cara memilih jumlah">
        {(["robux", "budget"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${mode === m ? "chrome-chip font-semibold" : "text-ink-muted hover:text-ink"}`}
          >
            {m === "robux" ? "Jumlah Robux" : "Pakai budget"}
          </button>
        ))}
      </div>

      {mode === "robux" ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PACKAGES.map((p) => {
              const selected = !custom && amount === p.amount;
              return (
                <button
                  key={p.amount}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setAmount(p.amount);
                    setCustom("");
                  }}
                  className={`rounded-xl border px-3 pb-3 pt-2 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.97] ${
                    selected
                      ? "metal border-transparent shadow-[0_12px_24px_-14px_rgb(188_214_255/0.7)]"
                      : "border-line bg-raised/60 hover:border-line-strong"
                  }`}
                >
                  <span className="block h-4">
                    {p.tag && (
                      <span className={"inline-block rounded-full px-1.5 text-[10px] font-bold leading-4 " + TAG[p.tag]}>{p.tag}</span>
                    )}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-base font-extrabold tabular">
                    <RobuxIcon className={`h-3.5 w-3.5 ${selected ? "" : "text-ice"}`} />
                    {number(p.amount)}
                  </span>
                  <span className={`block text-xs tabular ${selected ? "text-[#3b3f47]" : "text-ink-muted"}`}>
                    {priceReady ? rupiah(p.amount * rate) : "-"}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="mt-3 block">
            <span className="text-sm text-ink-muted">Atau ketik jumlah Robux</span>
            <input
              inputMode="numeric"
              placeholder="Contoh: 750"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base tabular placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
        </>
      ) : (
        <label className="mt-4 block">
          <span className="text-sm text-ink-muted">Budget kamu (Rupiah)</span>
          <input
            inputMode="numeric"
            placeholder="Contoh: 50000"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/\D/g, "").slice(0, 9))}
            className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base tabular placeholder:text-ink-faint focus:border-ice focus:outline-none"
          />
          <span className="mt-1.5 block text-sm text-ink-muted">
            Dapat{" "}
            <span className="inline-flex items-center gap-1 align-middle tabular text-ink">
              <RobuxIcon className="h-3.5 w-3.5" /> {number(robux)} Robux
            </span>
          </span>
        </label>
      )}

      <label className="mt-4 block">
        <span className="text-sm text-ink-muted">Username Roblox penerima</span>
        <input
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Username, bukan display name"
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 20))}
          aria-invalid={(touched && !usernameOk) || status === "notfound"}
          className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn"
        />
      </label>
      {touched && !usernameOk ? (
        <p className="mt-1.5 text-sm text-warn">Isi username Roblox (3 sampai 20 huruf, angka, atau garis bawah).</p>
      ) : (
        <ProfilePreview status={status} profile={profile} username={uname} />
      )}

      {overStock && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
          Stok sekarang cuma {number(stock)} Robux. Kurangi jumlahnya atau tanya admin kapan restock.
        </p>
      )}
      {!priceReady && (
        <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn">
          Harga belum bisa dimuat. Coba muat ulang halaman, atau tanya admin lewat Discord.
        </p>
      )}

      <div className="ice -mx-5 mt-5 rounded-b-[calc(var(--radius-card)-1px)] px-5 pb-5 sm:-mx-6 sm:px-6 sm:pb-6">
        <span className="perf -mx-5 sm:-mx-6" aria-hidden />
        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-sm font-medium text-[#2b3a55]">Total bayar</p>
            <Odometer value={rupiah(total)} className="text-3xl font-extrabold tracking-tight" />
          </div>
          <p className="text-right text-xs font-medium text-[#2b3a55] tabular">{priceReady ? `${rupiah(rate)} / Robux` : ""}</p>
        </div>
        <button
          type="submit"
          disabled={!priceReady || robux <= 0 || overStock}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0c] px-5 py-3.5 text-base font-semibold text-ink shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lanjut bayar <ArrowRight size={18} aria-hidden />
        </button>
        <p className="mt-3 text-center text-xs text-[#2b3a55]">Tanpa password. Robux dikirim ke username kamu.</p>
      </div>
    </form>
  );
}
