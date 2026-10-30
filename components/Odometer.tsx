"use client";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Angka bergulir per digit (motion khas halaman order). */
export function Odometer({ value, className = "" }: { value: string; className?: string }) {
  const chars = value.split("");
  return (
    <span className={`inline-flex tabular ${className}`} aria-label={value} role="text">
      {chars.map((ch, i) => {
        const key = chars.length - i;
        if (!/\d/.test(ch)) {
          return (
            <span key={`s${key}`} aria-hidden className="whitespace-pre">
              {ch}
            </span>
          );
        }
        return (
          <span key={`d${key}`} className="odo-col" aria-hidden>
            <span className="odo-strip" style={{ transform: `translateY(-${Number(ch)}em)` }}>
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
