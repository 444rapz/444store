/** Simbol Robux (segi enam dengan kotak di tengah), ikut warna teks di sekitarnya. */
export function RobuxIcon({ className = "h-[1em] w-[1em]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={"inline-block shrink-0 " + className}>
      <path d="M12 1.8 20.83 6.9v10.2L12 22.2 3.17 17.1V6.9Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M12 5.8 17.37 8.9v6.2L12 18.2l-5.37-3.1V8.9ZM9.5 9.5v5h5v-5Z"
        fill="currentColor"
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
