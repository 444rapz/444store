import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="444 Store, ke beranda">
      <span className="relative h-9 w-9 overflow-hidden rounded-[11px] ring-1 ring-line-strong transition-transform duration-300 group-hover:-rotate-6">
        <Image src="/brand/server-icon.jpg" alt="" width={72} height={72} className="h-full w-full object-cover" priority />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight">444 Store</span>
          <span className="block text-[11px] text-ink-faint">Robux & item Roblox</span>
        </span>
      )}
    </Link>
  );
}
