import { Star } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import type { Review } from "@/lib/store";
import { number } from "@/lib/store";

function Card({ r }: { r: Review }) {
  return (
    <figure className="tix w-[280px] shrink-0">
      <div className="tix-body">
        <div className="flex items-center gap-0.5 text-ice" aria-label={`${r.rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={1.5} aria-hidden />
          ))}
        </div>
        <blockquote className="mt-3 text-[15px] leading-snug">{r.text}</blockquote>
      </div>
      <span className="perf" aria-hidden />
      <figcaption className="tix-foot text-xs font-medium text-ink-faint">
        <span className="tabular">{r.name}</span>
        {r.robux > 0 && (
          <span className="inline-flex items-center gap-1 text-ink-muted tabular">
            <RobuxIcon className="h-3.5 w-3.5" /> {number(r.robux)}
          </span>
        )}
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
    <div className="marquee -mx-4 overflow-hidden px-4 py-2 sm:mx-0 sm:px-0">
      <div className="marquee-track">
        {loop.map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </div>
    </div>
  );
}
