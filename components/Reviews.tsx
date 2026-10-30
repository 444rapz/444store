import { Star } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import type { Review } from "@/lib/store";
import { number } from "@/lib/store";

function Stars({ rating, size }: { rating: number; size: number }) {
  return (
    <span className="flex gap-0.5 text-ice" aria-label={`${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} aria-hidden />
      ))}
    </span>
  );
}

function Amount({ robux }: { robux: number }) {
  if (robux <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1 tabular">
      <RobuxIcon className="h-3.5 w-3.5" /> {number(robux)} Robux
    </span>
  );
}

// Satu ulasan paling lengkap ditampilkan besar, sisanya daftar ringkas di sebelahnya
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-ink-muted">Ulasan pembeli akan muncul di sini.</p>;
  }
  const [top, ...rest] = [...reviews].sort((a, b) => b.text.length - a.text.length);
  const list = rest.slice(0, 4);

  return (
    <div className="grid gap-10 border-t border-line-strong pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <figure>
        <Stars rating={top.rating} size={18} />
        <blockquote className="mt-5 text-2xl font-semibold leading-snug tracking-tight sm:text-[2rem]">
          &ldquo;{top.text}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-raised font-bold text-ink" aria-hidden>
            {top.name.charAt(0).toUpperCase()}
          </span>
          <span className="font-semibold text-ink tabular">{top.name}</span>
          <Amount robux={top.robux} />
        </figcaption>
      </figure>

      {list.length > 0 && (
        <ul className="divide-y divide-line border-y border-line lg:border-t-0">
          {list.map((r, i) => (
            <li key={i} className="py-5 first:pt-0 max-lg:first:pt-5">
              <div className="flex items-center justify-between gap-3 text-xs text-ink-faint">
                <Stars rating={r.rating} size={13} />
                <Amount robux={r.robux} />
              </div>
              <p className="mt-2 text-[15px] leading-snug">{r.text}</p>
              <p className="mt-1.5 text-xs text-ink-faint tabular">{r.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
