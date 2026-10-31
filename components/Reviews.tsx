import { Hash, Lock, Star } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { BuyerAvatar } from "./BuyerAvatar";
import type { Review } from "@/lib/store";
import { number } from "@/lib/store";

const NAME_COLOR = ["text-ice", "text-violet-soft", "text-blush", "text-silver"];

function tone(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h % NAME_COLOR.length;
}

function day(date: string) {
  const d = new Date(date + "T00:00:00Z");
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function ReviewItem({ r }: { r: Review }) {
  const t = tone(r.name);
  return (
    <li className="flex gap-3 px-4 py-3">
      <BuyerAvatar name={r.name} src={r.avatar} />
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className={"font-semibold tabular " + NAME_COLOR[t]}>{r.name}</span>
          <span className="rounded bg-white/[0.06] px-1.5 text-[10px] font-semibold uppercase leading-4 text-ink-muted">Pembeli</span>
          <span className="text-xs text-ink-faint">{day(r.date)}</span>
        </p>
        <p className="mt-0.5 text-[15px] leading-snug text-ink/90">{r.text}</p>
        <p className="mt-1.5 flex items-center gap-3 text-xs text-ink-faint">
          <span className="flex gap-0.5 text-ice" aria-label={`${r.rating} dari 5 bintang`}>
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} size={12} fill={k < r.rating ? "currentColor" : "none"} strokeWidth={1.6} aria-hidden />
            ))}
          </span>
          {r.robux > 0 && (
            <span className="inline-flex items-center gap-1 tabular">
              <RobuxIcon className="h-3.5 w-3.5" /> {number(r.robux)} Robux
            </span>
          )}
        </p>
      </div>
    </li>
  );
}

// Ulasan ditampilkan seperti channel Discord, karena memang ditulis pembeli dari tiket Discord
export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-[#101013] shadow-[0_40px_70px_-40px_rgb(0_0_0/0.95)]">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
        <Hash size={18} className="text-ink-faint" aria-hidden />
        <span className="font-semibold">ulasan-pembeli</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden /> Live dari bot
        </span>
      </div>

      {!reviews.length ? (
        <p className="px-4 py-10 text-center text-ink-muted">Ulasan pembeli akan muncul di sini.</p>
      ) : (
        <div className="review-feed h-[440px] sm:h-[500px]">
          <div className="review-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="py-1">
                {reviews.map((r, i) => (
                  <ReviewItem key={i} r={r} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}

      <p className="flex items-center gap-2 border-t border-line bg-surface px-4 py-3 text-xs text-ink-faint">
        <Lock size={13} aria-hidden /> Ulasan cuma bisa ditulis pembeli setelah tiketnya selesai.
      </p>
    </div>
  );
}
