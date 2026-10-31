import { Crown } from "lucide-react";
import type { TopBuyer } from "@/lib/store";
import { rupiah } from "@/lib/store";
import { BuyerAvatar } from "./BuyerAvatar";

// Panggung juara: juara 2 di kiri, juara 1 di tengah (balok paling tinggi), juara 3 di kanan
const PODIUM = [1, 0, 2];
const BLOCK = ["metal h-36 sm:h-48", "block-tint tile-ice h-24 sm:h-32", "block-tint tile-violet h-16 sm:h-24"];
const RING = ["ring-ink/80", "ring-ice/80", "ring-violet-soft/80"];

function Step({ b, rank }: { b: TopBuyer; rank: number }) {
  return (
    <li className="flex min-w-0 flex-col items-center text-center">
      {rank === 0 && <Crown size={26} className="mb-1.5 text-ice" aria-hidden />}
      <span className={"rounded-full ring-2 ring-offset-2 ring-offset-ground " + RING[rank]}>
        <BuyerAvatar name={b.name} src={b.avatar} size="h-14 w-14 sm:h-16 sm:w-16" text="text-xl" />
      </span>
      <p className="mt-2 w-full truncate text-sm font-semibold tabular">{b.name}</p>
      <p className="text-[13px] font-extrabold tabular sm:text-base">{rupiah(b.total_rp)}</p>
      <div className={"mt-3 flex w-full justify-center rounded-t-2xl pt-2 " + BLOCK[rank]}>
        <span className="text-4xl font-extrabold leading-none tracking-[-0.05em] tabular sm:text-6xl">{rank + 1}</span>
      </div>
    </li>
  );
}

export function TopBuyers({ buyers }: { buyers: TopBuyer[] }) {
  if (!buyers.length) return <p className="text-ink-muted">Belum ada data pembeli.</p>;
  const podium = buyers.length >= 3;
  const list = podium ? buyers.slice(3) : buyers;
  const offset = podium ? 3 : 0;
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14">
      {podium && (
        <ol className="grid grid-cols-3 items-end gap-2 border-b-2 border-line-strong sm:gap-4" aria-label="Tiga besar pembeli">
          {PODIUM.map((i) => (
            <Step key={i} b={buyers[i]} rank={i} />
          ))}
        </ol>
      )}
      <ol start={offset + 1}>
        {list.map((b, i) => (
          <li key={offset + i} className="flex items-center gap-3 border-b border-line py-3">
            <span className="w-6 shrink-0 text-sm font-bold text-ink-faint tabular">{offset + i + 1}</span>
            <BuyerAvatar name={b.name} src={b.avatar} size="h-8 w-8" text="text-sm" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium tabular">{b.name}</span>
            <span className="text-sm font-bold tabular">{rupiah(b.total_rp)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
