import { Crown, Trophy } from "lucide-react";
import type { TopBuyer } from "@/lib/store";
import { rupiah } from "@/lib/store";

const MEDAL = ["text-gold bg-gold/15", "text-silver bg-silver/15", "text-bronze bg-bronze/15"];
const AVATAR = ["bg-pink/20 text-pink-soft", "bg-violet/20 text-violet-soft", "bg-gold/20 text-gold-soft", "bg-live/15 text-live", "bg-discord/20 text-[#a5adff]"];

export function TopBuyers({ buyers }: { buyers: TopBuyer[] }) {
  return (
    <div className="rounded-[20px] border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold"><Crown size={18} aria-hidden /></span>
          <div>
            <p className="font-semibold">Top Pembeli</p>
            <p className="text-xs text-ink-faint">Dari pesanan yang sudah selesai</p>
          </div>
        </div>
        <span className="rounded-full bg-pink/15 px-3 py-1 text-xs font-semibold text-pink-soft">Top {buyers.length || 10}</span>
      </div>
      {!buyers.length ? (
        <p className="px-5 py-6 text-ink-muted">Belum ada data pembeli.</p>
      ) : (
        <ol className="divide-y divide-line">
          {buyers.map((b, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3">
              {i < 3 ? (
                <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full " + MEDAL[i]}><Trophy size={16} aria-hidden /></span>
              ) : (
                <span className="grid h-8 w-8 shrink-0 place-items-center text-sm font-semibold text-ink-faint tabular">{i + 1}</span>
              )}
              <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold " + AVATAR[i % AVATAR.length]} aria-hidden>
                {b.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium tabular">{b.name}</p>
                <p className="text-xs text-ink-faint tabular">{b.orders} pesanan</p>
              </div>
              <p className="font-display font-bold text-gold tabular">{rupiah(b.total_rp)}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
