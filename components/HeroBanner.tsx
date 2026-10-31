import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, QrCode, Search, ShieldCheck, Zap } from "lucide-react";
import { Tilt } from "./Tilt";
import { RobuxIcon } from "./RobuxIcon";
import { number, rupiah } from "@/lib/store";

const SPARK = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z";

// Garis barcode dibuat dari teks, hasilnya selalu sama di server dan browser
function barcode(seed: string) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of seed) {
    const c = ch.charCodeAt(0);
    for (let k = 0; k < 3; k++) {
      const w = 1 + ((c >> k) & 1) + ((c >> (k + 3)) & 1);
      bars.push({ x, w });
      x += w + 1 + ((c >> (k + 1)) & 1);
    }
  }
  return { bars, width: x };
}
const CODE = barcode("444S.STORE");

const sticker = (r: string, z: string) => ({ "--r": r, "--z": z }) as CSSProperties;

export function HeroBanner({ rate, stock }: { rate: number; stock: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-9 sm:px-6 md:pt-14" aria-labelledby="hero-judul">
      <Tilt>
        <div className="ticket">
          <div className="ticket-body px-6 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-9">
            <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute bottom-[16%] right-[9%] hidden h-16 w-16 text-[#25282e]/60 md:block">
              <path d={SPARK} fill="currentColor" />
            </svg>
            <svg viewBox="0 0 24 24" aria-hidden className="sparkle pointer-events-none absolute right-[27%] top-[52%] hidden h-6 w-6 text-[#25282e]/55 md:block">
              <path d={SPARK} fill="currentColor" />
            </svg>

            <p className="flex items-center gap-2 text-sm font-semibold">
              <Image src="/brand/server-icon.jpg" alt="" width={56} height={56} className="h-7 w-7 rounded-lg" />
              444 Store
            </p>
            <h1 id="hero-judul" className="mt-5 max-w-[14ch] text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Top up Robux murah, proses kilat.
            </h1>
            <p className="mt-4 max-w-[40ch] text-[#33373f] sm:text-lg">
              Robux dikirim ke username kamu tanpa password, diproses langsung sama admin 444s.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#beli"
                className="inline-flex items-center gap-2 rounded-full bg-ground px-6 py-3.5 font-semibold text-ink shadow-[0_12px_22px_-10px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Beli Robux sekarang <ArrowRight size={18} aria-hidden />
              </a>
              <Link
                href="/cek-pesanan"
                className="inline-flex items-center gap-2 rounded-full border border-black/25 px-5 py-3.5 font-medium transition-colors hover:bg-black/5"
              >
                <Search size={17} aria-hidden /> Cek Pesanan
              </Link>
            </div>
          </div>

          <div className="ticket-stub flex items-center justify-between gap-4 px-6 py-5 md:flex-col md:items-stretch md:px-8 md:py-9">
            <div>
              <p className="text-sm font-medium text-[#2b3a55]">Harga hari ini</p>
              <p className="mt-1 text-4xl font-extrabold tracking-[-0.035em] tabular md:text-5xl">{rate > 0 ? rupiah(rate) : "-"}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#2b3a55] tabular">
                per <RobuxIcon className="h-3.5 w-3.5" /> 1
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold tabular md:mt-4">
                <span className="live-dot mr-0.5 h-2 w-2 rounded-full bg-[#16a34a]" aria-hidden />
                Stok <RobuxIcon className="h-4 w-4" /> {number(stock)}
              </p>
            </div>
            <div className="w-28 shrink-0 md:w-full">
              <svg viewBox={`0 0 ${CODE.width} 40`} preserveAspectRatio="none" aria-hidden className="h-12 w-full text-[#0d1626] md:h-14">
                {CODE.bars.map((b, i) => (
                  <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="currentColor" />
                ))}
              </svg>
              <p className="mt-1.5 text-center text-[11px] font-semibold tracking-[0.14em] text-[#2b3a55]">444S.STORE</p>
            </div>
          </div>

          <span className="ticket-sheen" aria-hidden />
          <span className="ticket-perf" aria-hidden />
          <span className="ticket-notch ticket-notch-l" aria-hidden />
          <span className="ticket-notch ticket-notch-r" aria-hidden />
        </div>

        <Image
          src="/brand/chrome-heart.png"
          alt=""
          width={300}
          height={300}
          priority
          className="sticker -top-12 right-[350px] hidden w-[150px] md:block"
          style={sticker("9deg", "60px")}
        />
        <Image
          src="/brand/chrome-infinity.png"
          alt=""
          width={300}
          height={225}
          priority
          className="sticker -right-1.5 top-[calc(100%-188px)] w-[80px] md:-bottom-12 md:right-[250px] md:top-auto md:w-[140px]"
          style={sticker("-8deg", "50px")}
        />
        <Image
          src="/brand/tribal-violet.png"
          alt=""
          width={240}
          height={240}
          className="sticker -right-6 -top-10 hidden w-[108px] md:block"
          style={sticker("14deg", "44px")}
        />
      </Tilt>

      <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
        <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-ice" aria-hidden /> Tanpa password</li>
        <li className="flex items-center gap-1.5"><Zap size={16} className="text-ice" aria-hidden /> Proses kilat</li>
        <li className="flex items-center gap-1.5"><QrCode size={16} className="text-ice" aria-hidden /> Bayar pakai QRIS</li>
      </ul>
    </section>
  );
}
