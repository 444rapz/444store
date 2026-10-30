import Image from "next/image";
import type { CSSProperties } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { Counter } from "./Counter";
import { number } from "@/lib/store";

type Stats = { orders_done: number; robux_sold: number; review_count: number; rating_avg: number };

export function StatsRow({ stats }: { stats: Stats }) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="angka">
      <div className="glow-card relative rounded-[26px] border border-line-strong px-5 pb-8 pt-9 sm:px-12 sm:pb-12 sm:pt-12">
        <Image
          src="/brand/robux-hex.png"
          alt=""
          width={240}
          height={260}
          className="sticker -right-3 -top-10 w-[78px] sm:-right-6 sm:-top-14 sm:w-[124px]"
          style={{ "--r": "12deg", "--z": "0px" } as CSSProperties}
        />
        <h2 id="angka" className="max-w-[18ch] text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
          Robux yang udah dikirim ke pembeli
        </h2>
        <p className="mt-2 max-w-[52ch] text-ink-muted">
          Angkanya dihitung otomatis dari tiket yang selesai di Discord 444s, bukan diketik manual.
        </p>

        <div className="mt-8">
          <Counter value={stats.robux_sold} label={number(stats.robux_sold) + " Robux terkirim"} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
