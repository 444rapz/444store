"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { rupiah } from "@/lib/store";
import { gigPrice } from "@/lib/pricing";

/** Cek harga Gift In Game: ketik harga item dalam Robux, harga Rupiah-nya langsung keluar. */
export function GigCalculator({ rate }: { rate: number }) {
  const [robux, setRobux] = useState("100");
  const n = Number(robux) || 0;
  return (
    <section className="glow-card rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6" aria-labelledby="hitung">
      <h2 id="hitung" className="text-lg font-bold">Cek harga item</h2>
      <p className="mt-1 text-sm text-ink-muted">Ketik harga item atau gamepass dalam Robux.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <label className="relative">
          <span className="sr-only">Harga item dalam Robux</span>
          <RobuxIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ice" />
          <input
            inputMode="numeric"
            value={robux}
            onChange={(e) => setRobux(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-28 rounded-xl border border-line-strong bg-ground py-2.5 pl-10 pr-3 text-lg font-extrabold tabular focus:border-ice focus:outline-none"
          />
        </label>
        <ArrowRight size={18} className="text-ink-faint" aria-hidden />
        <p className="rounded-xl bg-ice/15 px-4 py-2.5 text-lg font-extrabold text-ice tabular" aria-live="polite">
          {rupiah(gigPrice(n, rate))}
        </p>
      </div>
    </section>
  );
}
