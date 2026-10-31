"use client";

import { useState } from "react";
import { RobuxIcon } from "./RobuxIcon";
import { rupiah } from "@/lib/store";

/** Kalkulator Gift In Game: ketik harga item dalam Robux, langsung keluar harga Rupiah-nya. */
export function GigCalculator({ rate }: { rate: number }) {
  const [robux, setRobux] = useState("100");
  const n = Number(robux) || 0;
  return (
    <section className="glow-card rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6" aria-labelledby="hitung">
      <h2 id="hitung" className="text-lg font-bold">Hitung harga Gift In Game</h2>
      <p className="mt-1 text-sm text-ink-muted">Ketik harga item atau gamepass dalam Robux, harganya langsung keluar.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm sm:text-base">
        <label className="relative">
          <span className="sr-only">Harga item dalam Robux</span>
          <RobuxIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ice" />
          <input
            inputMode="numeric"
            value={robux}
            onChange={(e) => setRobux(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-32 rounded-xl border border-line-strong bg-ground py-2.5 pl-9 pr-3 text-lg font-extrabold tabular focus:border-ice focus:outline-none"
          />
        </label>
        <span className="text-ink-faint">×</span>
        <span className="rounded-xl border border-line-strong px-3 py-2.5 font-semibold tabular">{rate}</span>
        <span className="text-ink-faint">=</span>
        <span className="rounded-xl bg-ice/15 px-4 py-2.5 text-lg font-extrabold text-ice tabular">{rupiah(n * rate)}</span>
      </div>
      <p className="mt-3 text-xs text-ink-faint">Rumus: [ Harga item ] × [ Rate ] = Harga GIG. Contoh: 100 Robux × {rate} = {rupiah(100 * rate)}.</p>
    </section>
  );
}
