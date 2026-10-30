const STARS = [
  { top: "12%", left: "6%", size: 14, delay: "0s" },
  { top: "68%", left: "3%", size: 10, delay: "1.4s" },
  { top: "22%", left: "47%", size: 9, delay: "2.6s" },
  { top: "82%", left: "44%", size: 12, delay: "0.8s" },
];

/** Bintang empat sudut dari identitas rapz444.site, dipakai hemat. */
export function Sparkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
      {STARS.map((s, i) => (
        <svg
          key={i}
          className="sparkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" />
        </svg>
      ))}
    </div>
  );
}
