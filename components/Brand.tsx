import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="444 Store, ke beranda">
      <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-ink text-[13px] font-bold tracking-tight text-ground tabular transition-transform duration-300 group-hover:-rotate-6">
        444
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight">444 Store</span>
          <span className="block text-[11px] text-ink-faint">Robux & item Roblox</span>
        </span>
      )}
    </Link>
  );
}
