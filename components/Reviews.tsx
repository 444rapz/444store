import { Star } from "lucide-react";
import type { Review } from "@/lib/store";
import { number } from "@/lib/store";

function Card({ r }: { r: Review }) {
  return (
    <figure className="w-[280px] shrink-0 rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <div className="flex items-center gap-0.5 text-violet-soft" aria-label={`${r.rating} dari 5 bintang`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} aria-hidden />
        ))}
      </div>
      <blockquote className="mt-3 text-[15px] leading-snug">{r.text}</blockquote>
      <figcaption className="mt-4 flex items-center justify-between text-xs text-ink-faint">
        <span className="tabular">{r.name}</span>
        {r.robux > 0 && <span className="tabular">{number(r.robux)} Robux</span>}
      </figcaption>
    </figure>
  );
}

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-ink-muted">Ulasan pembeli akan muncul di sini.</p>;
  }
  const loop = [...reviews, ...reviews];
  return (
    <div className="marquee -mx-4 overflow-hidden px-4 sm:mx-0 sm:px-0">
      <div className="marquee-track">
        {loop.map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </div>
    </div>
  );
}
