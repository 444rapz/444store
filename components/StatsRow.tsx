import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { number } from "@/lib/store";

type Stats = { orders_done: number; robux_sold: number; review_count: number; rating_avg: number };

export function StatsRow({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total Robux terkirim", value: number(stats.robux_sold), note: "Ke akun Roblox pembeli", img: "/brand/robux-hex.png" },
    { label: "Pesanan selesai", value: number(stats.orders_done), note: "Dicek manual oleh admin", img: "/brand/chrome-infinity.png" },
    { label: "Rating pembeli", value: stats.rating_avg ? stats.rating_avg.toFixed(1) : "-", note: number(stats.review_count) + " ulasan asli", img: "/brand/chrome-heart.png" },
  ];
  return (
    <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6" aria-label="Angka toko">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="relative overflow-hidden rounded-[20px] border border-line bg-surface p-5">
            <Image src={it.img} alt="" width={140} height={140} className="pointer-events-none absolute -right-4 -top-3 h-20 w-20 object-contain opacity-90" />
            <p className="text-sm text-ink-muted">{it.label}</p>
            <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em] tabular">{it.value}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-faint">
              <BadgeCheck size={14} className="text-ice" aria-hidden /> {it.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
