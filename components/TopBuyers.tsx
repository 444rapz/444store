import type { TopBuyer } from "@/lib/store";
import { rupiah } from "@/lib/store";

export function TopBuyers({ buyers }: { buyers: TopBuyer[] }) {
  if (!buyers.length) return <p className="text-ink-muted">Belum ada data pembeli.</p>;
  const max = buyers[0]?.total_rp || 1;
  return (
    <ol className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
      {buyers.map((b, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3.5">
          <span className={`text-sm font-semibold tabular ${i < 3 ? "text-violet-soft" : "text-ink-faint"}`}>{i + 1}</span>
          <div className="min-w-0">
            <p className="truncate font-medium tabular">{b.name}</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-raised" aria-hidden>
              <div className="h-full rounded-full bg-violet/70" style={{ width: `${Math.max(6, (b.total_rp / max) * 100)}%` }} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular">{rupiah(b.total_rp)}</p>
            <p className="text-xs text-ink-faint tabular">{b.orders} pesanan</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
