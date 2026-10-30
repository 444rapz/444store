"use client";

import { useEffect, useRef, useState } from "react";
import { RobuxIcon } from "./RobuxIcon";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Angka besar di ubin chrome; berputar dari nol saat pertama kali terlihat di layar. */
export function Counter({ value, label }: { value: number; label: string }) {
  const text = Math.round(value).toLocaleString("id-ID");
  const ref = useRef<HTMLDivElement>(null);
  const [rolled, setRolled] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Kalau sudah kelihatan sejak awal, angka dibiarkan apa adanya
    if (el.getBoundingClientRect().top < innerHeight) return;
    setRolled(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRolled(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = text.split("");
  return (
    <div ref={ref} className="counter" role="img" aria-label={label}>
      <span className="counter-tile counter-icon">
        <RobuxIcon className="h-[0.62em] w-[0.62em]" />
      </span>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="counter-tile">
            <span
              className="counter-strip"
              style={{ transform: `translateY(calc(var(--h) * -${rolled ? ch : 0}))`, transitionDelay: `${i * 110}ms` }}
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="counter-sep" aria-hidden>
            {ch}
          </span>
        ),
      )}
    </div>
  );
}
