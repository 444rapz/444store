import Link from "next/link";
import { ArrowRight, QrCode, Search, ShieldCheck, Zap } from "lucide-react";
import { RobuxCoin } from "./RobuxCoin";
import { number, rupiah } from "@/lib/store";

export function HeroBanner({ rate, stock }: { rate: number; stock: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 md:pt-8">
      <div className="glow-card relative overflow-hidden rounded-[28px] border border-line px-6 pb-8 pt-7 sm:px-10 sm:py-12 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-6">
        <div className="relative z-10">
          {rate > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ground/60 px-3 py-1.5 text-xs text-ink-muted tabular">
              <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
              Stok {number(stock)} Robux · {rupiah(rate)} / Robux
            </p>
          )}
          <h1 className="mt-4 font-display text-[2.6rem] font-bold leading-[1] tracking-tight sm:text-6xl lg:text-7xl">
            Top Up Robux
            <span className="block text-pink">Murah &amp; Kilat</span>
          </h1>
          <p className="mt-4 max-w-[42ch] text-base text-ink-muted sm:text-lg">
            Robux dikirim ke username kamu tanpa password, diproses langsung sama admin 444s.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#beli"
              className="inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgb(255_92_141/0.8)] transition-transform active:scale-[0.97]"
            >
              Beli Robux sekarang <ArrowRight size={18} aria-hidden />
            </a>
            <Link href="/cek-pesanan" className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ground/40 px-5 py-3.5 font-medium hover:bg-raised">
              <Search size={17} aria-hidden /> Cek Pesanan
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-live" aria-hidden /> Tanpa password</li>
            <li className="flex items-center gap-1.5"><Zap size={16} className="text-gold" aria-hidden /> Proses kilat</li>
            <li className="flex items-center gap-1.5"><QrCode size={16} className="text-violet-soft" aria-hidden /> Bayar pakai QRIS</li>
          </ul>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-6 h-56 w-56 opacity-40 md:pointer-events-auto md:relative md:right-auto md:top-auto md:mx-auto md:h-80 md:w-80 md:opacity-100" aria-hidden>
          <div className="absolute inset-6 rounded-full bg-pink/25 blur-3xl" />
          <div className="float-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ marginLeft: "-6%", marginTop: "-4%" }}>
            <RobuxCoin id="hero-gold" size={190} tone="gold" className="drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]" />
          </div>
          <div className="float-b absolute right-2 top-2" style={{ ["--r" as string]: "14deg" }}>
            <RobuxCoin id="hero-violet" size={84} tone="violet" className="drop-shadow-[0_14px_20px_rgb(0_0_0/0.5)]" />
          </div>
          <div className="float-c absolute bottom-4 left-4" style={{ ["--r" as string]: "-12deg" }}>
            <RobuxCoin id="hero-pink" size={64} tone="pink" className="drop-shadow-[0_12px_18px_rgb(0_0_0/0.5)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
