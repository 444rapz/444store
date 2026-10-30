import { Star } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import type { Review } from "@/lib/store";
import { number } from "@/lib/store";

const TINT = ["bubble-ink", "bubble-ice", "bubble-blush"];

// Ulasan sebagai gelembung chat, seperti pesan pembeli di tiket Discord
function Bubble({ r, i }: { r: Review; i: number }) {
  return (
    <figure className={"bubble " + TINT[i % TINT.length]}>
      <figcaption className="flex items-center gap-2 text-xs">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-black/10 text-[13px] font-bold" aria-hidden>
          {r.name.charAt(0).toUpperCase()}
        </span>
        <span className="font-semibold tabular">{r.name}</span>
        <span className="ml-auto flex" aria-label={`${r.rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, k) => (
            <Star key={k} size={12} fill={k < r.rating ? "currentColor" : "none"} strokeWidth={1.6} aria-hidden />
          ))}
        </span>
      </figcaption>
      <blockquote className="mt-2.5 text-[15px] font-medium leading-snug">{r.text}</blockquote>
      {r.robux > 0 && (
        <p className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-black/60 tabular">
          <RobuxIcon className="h-3.5 w-3.5" /> {number(r.robux)} Robux
        </p>
      )}
    </figure>
  );
}

function Row({ items, reverse, start }: { items: Review[]; reverse?: boolean; start: number }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden py-3">
      <div className={"marquee-track items-start " + (reverse ? "reverse" : "")}>
        {loop.map((r, i) => (
          <Bubble key={i} r={r} i={start + (i % items.length)} />
        ))}
      </div>
    </div>
  );
}

export function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="px-4 text-ink-muted sm:px-6">Ulasan pembeli akan muncul di sini.</p>;
  }
  if (reviews.length < 6) return <Row items={reviews} start={0} />;
  const a = reviews.filter((_, i) => i % 2 === 0);
  const b = reviews.filter((_, i) => i % 2 === 1);
  return (
    <div>
      <Row items={a} start={0} />
      <Row items={b} start={1} reverse />
    </div>
  );
}
