import Image from "next/image";
import Link from "next/link";

/** Logo toko dengan bingkai chrome. `bare` menyembunyikan baris kecil di bawah nama (dipakai di navigasi). */
export function Brand({ bare = false }: { bare?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="444 Store, ke beranda">
      <span className="logo-ring block h-11 w-11 shrink-0 rounded-full p-[1.5px] transition-transform duration-500 group-hover:-rotate-12">
        <span className="block h-full w-full overflow-hidden rounded-full bg-ground">
          <Image src="/brand/server-icon.jpg" alt="" width={96} height={96} className="h-full w-full scale-[1.25] object-cover" priority />
        </span>
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[17px] font-extrabold tracking-[-0.02em]">
          444 <span className="font-medium text-ink-muted">Store</span>
        </span>
        {!bare && <span className="mt-0.5 block text-[11px] text-ink-faint">Robux & item Roblox</span>}
      </span>
    </Link>
  );
}
