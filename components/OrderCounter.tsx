"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import { Odometer } from "./Odometer";
import { CopyButton } from "./CopyButton";
import { PayLogos } from "./PayLogos";
import { RobuxIcon } from "./RobuxIcon";
import { API_URL, CONTACT, PACKAGES, PAYMENT, number, rupiah, waLink } from "@/lib/store";

type Mode = "robux" | "budget";

export function OrderCounter({ initialRate, initialStock }: { initialRate: number; initialStock: number }) {
  const [rate, setRate] = useState(initialRate);
  const [stock, setStock] = useState(initialStock);
  const [mode, setMode] = useState<Mode>("robux");
  const [amount, setAmount] = useState(PACKAGES[0].amount);
  const [custom, setCustom] = useState("");
  const [budget, setBudget] = useState("");
  const [username, setUsername] = useState("");
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
  const usernameOk = /^[A-Za-z0-9_]{3,20}$/.test(username.trim());
  const canContinue = priceReady && robux > 0 && !overStock && usernameOk;

  const orderText =
    "Halo min, aku mau order Robux via username.\n" +
    `Jumlah: ${number(robux)} Robux\nTotal: ${rupiah(total)}\nUsername Roblox: ${username.trim()}\n` +
    "Bukti transfer aku kirim di sini ya.";

  if (step === 2) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden /> Ubah pesanan
        </button>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-sm text-ink-muted">Kamu bayar</p>
            <p className="text-3xl font-semibold tracking-tight tabular">{rupiah(total)}</p>
          </div>
          <p className="text-right text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1 tabular">
              <RobuxIcon className="h-3.5 w-3.5" /> {number(robux)}
            </span>
            <br />
            ke <span className="text-ink">{username.trim()}</span>
          </p>
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
      className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canContinue) setStep(2);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Robux via Username</h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-ink-muted tabular">
          <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
          Stok <RobuxIcon className="h-3.5 w-3.5" /> {number(stock)}
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-line p-1 text-sm" role="tablist" aria-label="Cara memilih jumlah">
        {(["robux", "budget"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${mode === m ? "bg-ink text-ground" : "text-ink-muted hover:text-ink"}`}
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
                    selected ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                  }`}
                >
                  <span className={`block h-4 text-[10px] font-medium leading-4 ${selected ? "text-ice" : "text-ink-faint"}`}>
                    {p.tag ?? ""}
                  </span>
                  <span className="flex items-center gap-1.5 text-base font-semibold tabular">
                    <RobuxIcon className={`h-3.5 w-3.5 ${selected ? "text-ice" : "text-ink-muted"}`} />
                    {number(p.amount)}
                  </span>
                  <span className="block text-xs text-ink-muted tabular">{priceReady ? rupiah(p.amount * rate) : "-"}</span>
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
          aria-invalid={touched && !usernameOk}
          className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn"
        />
        {touched && !usernameOk && (
          <span className="mt-1.5 block text-sm text-warn">Isi username Roblox (3 sampai 20 huruf, angka, atau garis bawah).</span>
        )}
      </label>

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

      <span className="perf -mx-5 mt-4 sm:-mx-6" aria-hidden />
      <div className="flex items-end justify-between gap-4 pt-1">
        <div>
          <p className="text-sm text-ink-muted">Total bayar</p>
          <Odometer value={rupiah(total)} className="text-3xl font-semibold tracking-tight" />
        </div>
        <p className="text-right text-xs text-ink-faint tabular">{priceReady ? `${rupiah(rate)} / Robux` : ""}</p>
      </div>

      <button
        type="submit"
        disabled={!priceReady || robux <= 0 || overStock}
        className="chrome-btn mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Lanjut bayar <ArrowRight size={18} aria-hidden />
      </button>
      <p className="mt-3 text-center text-xs text-ink-faint">Tanpa password. Robux dikirim ke username kamu.</p>
    </form>
  );
}
