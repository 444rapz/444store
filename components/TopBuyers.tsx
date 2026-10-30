import { Crown } from "lucide-react";
import type { TopBuyer } from "@/lib/store";
import { rupiah } from "@/lib/store";

const AVATAR = ["bg-ice/15 text-ice", "bg-violet/20 text-violet-soft", "bg-blush/15 text-blush", "bg-silver/15 text-silver"];

// Urutan podium: juara 2 di kiri, juara 1 di tengah (lebih tinggi), juara 3 di kanan
const PODIUM = [1, 0, 2];

function Podium({ b, rank }: { b: TopBuyer; rank: number }) {
  const first = rank === 0;
  return (
    <li
      className={
        "flex flex-col items-center rounded-[var(--radius-card)] px-2 pb-4 pt-5 text-center " +
        (first ? "metal shadow-[0_18px_30px_-16px_rgb(188_214_255/0.55)]" : "mt-6 border border-line bg-raised/60")
      }
    >
      <span className={"grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold tabular " + (first ? "bg-ground text-ink" : "chrome-chip")}>
        {first ? <Crown size={14} aria-hidden /> : rank + 1}
      </span>
      <span
        className={
          "mt-3 grid h-11 w-11 place-items-center rounded-full text-lg font-bold " + (first ? "bg-ground/90 text-ink" : AVATAR[rank % AVATAR.length])
        }
        aria-hidden
      >
        {b.name.charAt(0).toUpperCase()}
      </span>
      <p className="mt-2 w-full truncate text-sm font-semibold tabular">{b.name}</p>
      <p className="mt-0.5 text-[13px] font-extrabold tabular sm:text-base">{rupiah(b.total_rp)}</p>
      <p className={"text-[11px] tabular " + (first ? "text-[#3b3f47]" : "text-ink-faint")}>{b.orders} pesanan</p>
    </li>
  );
}

export function TopBuyers({ buyers }: { buyers: TopBuyer[] }) {
  const podium = buyers.length >= 3;
  const list = podium ? buyers.slice(3) : buyers;
  const offset = podium ? 3 : 0;
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="chrome-chip grid h-9 w-9 place-items-center rounded-xl">
            <Crown size={18} aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Top Pembeli</p>
            <p className="text-xs text-ink-faint">Dari pesanan yang sudah selesai</p>
          </div>
        </div>
        <span className="rounded-full bg-ice/15 px-3 py-1 text-xs font-semibold text-ice">Top {buyers.length || 10}</span>
      </div>
      {!buyers.length ? (
        <p className="px-5 py-6 text-ink-muted">Belum ada data pembeli.</p>
      ) : (
        <>
          {podium && (
            <ol className="grid grid-cols-3 items-start gap-2 px-3 pt-5 sm:gap-3 sm:px-5" aria-label="Tiga besar">
              {PODIUM.map((i) => (
                <Podium key={i} b={buyers[i]} rank={i} />
              ))}
            </ol>
          )}
          <ol className="mt-3 divide-y divide-line" start={offset + 1}>
            {list.map((b, i) => (
              <li key={offset + i} className="flex items-center gap-3 px-5 py-3">
                <span className="w-6 shrink-0 text-center text-sm font-semibold text-ink-faint tabular">{offset + i + 1}</span>
                <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold " + AVATAR[(offset + i) % AVATAR.length]} aria-hidden>
                  {b.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium tabular">{b.name}</p>
                  <p className="text-xs text-ink-faint tabular">{b.orders} pesanan</p>
                </div>
                <p className="font-bold tabular">{rupiah(b.total_rp)}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
