import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Logo toko dengan bingkai chrome; baris kecil di bawah nama bisa diisi info live (misalnya stok). */
export function Brand({ sub }: { sub?: ReactNode }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="444 Store, ke beranda">
      <span className="logo-ring block h-11 w-11 shrink-0 rounded-[14px] p-[1.5px] transition-transform duration-500 group-hover:-rotate-6">
        <span className="block h-full w-full overflow-hidden rounded-[12.5px] bg-ground">
          <Image src="/brand/server-icon.jpg" alt="" width={96} height={96} className="h-full w-full scale-[1.22] object-cover" priority />
        </span>
      </span>
      <span className="leading-tight">
        <span className="block text-[17px] font-extrabold tracking-[-0.02em]">
          444 <span className="font-medium text-ink-muted">Store</span>
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-faint tabular">{sub ?? "Robux & item Roblox"}</span>
      </span>
    </Link>
  );
}
