type Props = { size?: number; tone?: "gold" | "violet" | "pink"; className?: string; id: string };

const TONES = {
  gold: ["#ffe9a8", "#ffc23d", "#c98a12", "#7a4f05"],
  violet: ["#e2d6ff", "#a78bfa", "#6d3fe0", "#36197d"],
  pink: ["#ffd3e1", "#ff7aa6", "#d63a6c", "#6f1534"],
};

/** Koin heksagon bergaya Robux (gambar vektor sendiri, bukan logo resmi). */
export function RobuxCoin({ size = 96, tone = "gold", className = "", id }: Props) {
  const [hi, mid, lo, deep] = TONES[tone];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id={id + "-face"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <linearGradient id={id + "-edge"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lo} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
      </defs>
      <path d="M60 14 L101 37 L101 87 L60 110 L19 87 L19 37 Z" fill={"url(#" + id + "-edge)"} />
      <path d="M60 6 L101 29 L101 79 L60 102 L19 79 L19 29 Z" fill={"url(#" + id + "-face)"} />
      <path d="M60 22 L87 37.5 L87 70.5 L60 86 L33 70.5 L33 37.5 Z" fill="none" stroke={deep} strokeOpacity="0.55" strokeWidth="7" strokeLinejoin="round" />
      <rect x="51" y="45" width="18" height="18" rx="3" transform="rotate(45 60 54)" fill={deep} fillOpacity="0.6" />
      <path d="M27 31 L60 12 L72 19" fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
