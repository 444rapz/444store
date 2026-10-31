"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { Odometer } from "./Odometer";
import { RobuxIcon } from "./RobuxIcon";
import { ProfilePreview } from "./RobloxProfile";
import { useRobloxLookup } from "@/lib/roblox";
import { API_URL, PACKAGES, number, rupiah } from "@/lib/store";
import { budgetToRobux, robuxPrice } from "@/lib/pricing";

type Mode = "robux" | "budget";

const TAG: Record<string, string> = {
  Murah: "bg-ice-soft text-[#0d1626]",
  Populer: "bg-blush text-[#3a1426]",
  "Best seller": "bg-violet-soft text-[#1d1240]",
};

/** Kalkulator cepat di beranda: pilih jumlah dan username, lalu lanjut ke halaman order lengkap. */
export function OrderCounter({ initialRate, initialStock }: { initialRate: number; initialStock: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(initialRate);
  const [stock, setStock] = useState(initialStock);
  const [mode, setMode] = useState<Mode>("robux");
  const [amount, setAmount] = useState(PACKAGES[0].amount);
  const [custom, setCustom] = useState("");
  const [budget, setBudget] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const { uname, valid: usernameOk, status, profile } = useRobloxLookup(username);

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
      return budgetToRobux(b, rate);
    }
    const c = Number(custom.replace(/\D/g, ""));
    return custom ? c : amount;
  }, [mode, budget, custom, amount, rate]);

  const total = robux > 0 ? robuxPrice(robux, rate) : 0;
  const overStock = robux > stock;
  const priceReady = rate > 0;
  const canContinue = priceReady && robux > 0 && !overStock && usernameOk && status !== "notfound" && status !== "loading";

  return (
    <form
      className="glow-card rounded-[var(--radius-card)] border border-line-strong px-5 pt-5 sm:px-6 sm:pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!canContinue) return;
        const q = new URLSearchParams({ jumlah: String(robux), username: profile?.name ?? uname });
        router.push(`/robux?${q}`);
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
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-5 py-3.5 text-base font-semibold text-snow shadow-[0_14px_24px_-12px_rgb(13_22_38/0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lanjut pesan <ArrowRight size={18} aria-hidden />
        </button>
        <p className="mt-3 text-center text-xs text-[#2b3a55]">Tanpa password. Robux dikirim ke username kamu.</p>
      </div>
    </form>
  );
}
