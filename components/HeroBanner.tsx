import Image from "next/image";
import Link from "next/link";
import { ArrowRight, QrCode, Search, ShieldCheck, Zap } from "lucide-react";
import { number, rupiah } from "@/lib/store";

export function HeroBanner({ rate, stock }: { rate: number; stock: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 md:pt-8">
      <div className="relative">
        <div className="relative overflow-hidden rounded-[26px] border border-line-strong">
          <Image
            src="/brand/banner.jpg"
            alt="Banner 444 Store"
            width={1400}
            height={700}
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-auto w-full"
          />
        </div>
        <Image src="/brand/chrome-infinity.png" alt="" width={240} height={180} className="icon-img float-a pointer-events-none absolute -left-3 -top-6 w-24 sm:-left-8 sm:-top-10 sm:w-40" />
        <Image src="/brand/chrome-heart.png" alt="" width={220} height={220} className="icon-img float-b pointer-events-none absolute -bottom-8 -right-2 w-24 sm:-bottom-12 sm:-right-6 sm:w-40" />
        <Image src="/brand/tribal-violet.png" alt="" width={200} height={200} className="icon-img float-c pointer-events-none absolute -right-3 -top-8 hidden w-28 sm:block" />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          {rate > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs text-ink-muted tabular">
              <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
              Stok {number(stock)} Robux · {rupiah(rate)} / Robux
            </p>
          )}
          <h1 className="mt-4 text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            Top up Robux murah,
            <span className="block text-ice">proses kilat.</span>
          </h1>
          <p className="mt-4 max-w-[44ch] text-base text-ink-muted sm:text-lg">
            Robux dikirim ke username kamu tanpa password, diproses langsung sama admin 444s.
          </p>
        </div>
        <div className="md:justify-self-end">
          <div className="flex flex-wrap gap-3">
            <a href="#beli" className="chrome-btn inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold">
              Beli Robux sekarang <ArrowRight size={18} aria-hidden />
            </a>
            <Link href="/cek-pesanan" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3.5 font-medium hover:bg-raised">
              <Search size={17} aria-hidden /> Cek Pesanan
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-ice" aria-hidden /> Tanpa password</li>
            <li className="flex items-center gap-1.5"><Zap size={16} className="text-ice" aria-hidden /> Proses kilat</li>
            <li className="flex items-center gap-1.5"><QrCode size={16} className="text-ice" aria-hidden /> Bayar pakai QRIS</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
