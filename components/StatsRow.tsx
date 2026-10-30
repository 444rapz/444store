import Image from "next/image";
import type { CSSProperties } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { Counter } from "./Counter";
import { number } from "@/lib/store";

type Stats = { orders_done: number; robux_sold: number; review_count: number; rating_avg: number };

const SPARK = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z";
const STARS = [
  { cls: "left-[8%] top-[18%] h-5 w-5", d: "0s" },
  { cls: "left-[22%] bottom-[16%] h-3 w-3", d: "1.6s" },
  { cls: "right-[12%] bottom-[22%] h-6 w-6", d: "0.8s" },
  { cls: "right-[30%] top-[12%] h-3 w-3", d: "2.4s" },
];

// Pita penuh selebar layar: angka Robux terkirim di ubin chrome yang berputar
export function StatsRow({ stats }: { stats: Stats }) {
  return (
    <section className="band mt-28 overflow-hidden" aria-labelledby="angka">
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        {STARS.map((s, i) => (
          <svg key={i} viewBox="0 0 24 24" aria-hidden className={"sparkle " + s.cls} style={{ animationDelay: s.d }}>
            <path d={SPARK} fill="currentColor" />
          </svg>
        ))}
        <Image
          src="/brand/chrome-heart.png"
          alt=""
          width={300}
          height={300}
          className="sticker -left-6 top-10 hidden w-36 lg:block"
          style={{ "--r": "-14deg", "--z": "0px" } as CSSProperties}
        />
        <Image
          src="/brand/robux-hex.png"
          alt=""
          width={300}
          height={325}
          className="sticker -right-4 top-4 w-20 sm:w-28 lg:-right-2 lg:top-auto lg:bottom-10 lg:w-36"
          style={{ "--r": "12deg", "--z": "0px" } as CSSProperties}
        />

        <h2 id="angka" className="mx-auto max-w-[18ch] text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">
          Robux yang udah dikirim ke pembeli
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-ink-muted">
          Dihitung otomatis dari tiket yang selesai di Discord 444s, bukan diketik manual.
        </p>

        <div className="mt-10 flex justify-center">
          <Counter className="counter-xl" value={stats.robux_sold} label={number(stats.robux_sold) + " Robux terkirim"} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-ground/60 px-4 py-2.5 text-sm">
            <BadgeCheck size={17} className="text-ice" aria-hidden />
            <span className="font-bold tabular">{number(stats.orders_done)}</span> pesanan selesai
          </p>
          {stats.review_count > 0 && (
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-ground/60 px-4 py-2.5 text-sm">
              <Star size={16} className="text-ice" fill="currentColor" aria-hidden />
              <span className="font-bold tabular">{stats.rating_avg.toFixed(1)}</span> dari {number(stats.review_count)} ulasan
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
