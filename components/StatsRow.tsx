import { BadgeCheck, PackageCheck, Star } from "lucide-react";
import { RobuxCoin } from "./RobuxCoin";
import { number } from "@/lib/store";

type Stats = { orders_done: number; robux_sold: number; review_count: number; rating_avg: number };

export function StatsRow({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "Total Robux terkirim",
      value: number(stats.robux_sold),
      note: "Ke akun Roblox pembeli",
      icon: <RobuxCoin id="stat-coin" size={30} tone="gold" />,
    },
    {
      label: "Pesanan selesai",
      value: number(stats.orders_done),
      note: "Dicek manual oleh admin",
      icon: <PackageCheck size={26} className="text-live" aria-hidden />,
    },
    {
      label: "Rating pembeli",
      value: stats.rating_avg ? stats.rating_avg.toFixed(1) : "-",
      note: number(stats.review_count) + " ulasan asli",
      icon: <Star size={26} className="text-gold" fill="currentColor" aria-hidden />,
    },
  ];
  return (
    <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6" aria-label="Angka toko">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-[20px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-muted">{it.label}</p>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-raised">{it.icon}</span>
            </div>
            <p className="mt-2 font-display text-4xl font-bold tabular">{it.value}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-faint">
              <BadgeCheck size={14} className="text-live" aria-hidden /> {it.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
