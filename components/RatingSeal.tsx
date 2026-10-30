import { Star } from "lucide-react";

/** Segel rating: teks melingkar yang berputar pelan, angka rating di koin silver di tengah. */
export function RatingSeal({ rating }: { rating: number }) {
  return (
    <div className="relative grid h-60 w-60 place-items-center sm:h-72 sm:w-72">
      <svg viewBox="0 0 200 200" className="seal-ring absolute inset-0 h-full w-full text-silver" aria-hidden>
        <defs>
          <path id="seal-path" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
        </defs>
        <text className="fill-current text-[12.5px] font-bold">
          <textPath href="#seal-path" textLength="520" lengthAdjust="spacing">
            RATING ASLI DARI PEMBELI · 444 STORE ·
          </textPath>
        </text>
      </svg>
      <div className="metal grid h-[64%] w-[64%] place-items-center rounded-full shadow-[0_20px_40px_-18px_rgb(188_214_255/0.6)]">
        <div className="text-center">
          <p className="text-6xl font-extrabold leading-none tracking-[-0.04em] tabular">{rating ? rating.toFixed(1) : "-"}</p>
          <div className="mt-2 flex justify-center gap-0.5" aria-label={"Rata-rata " + rating + " dari 5"}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill={i < Math.round(rating) ? "currentColor" : "none"} aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
