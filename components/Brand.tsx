import Image from "next/image";
import Link from "next/link";

/** Logo bulat dengan cincin chrome yang berputar pelan. */
export function LogoOrb({ size = "h-11 w-11" }: { size?: string }) {
  return (
    <span className={"logo-orb relative grid shrink-0 place-items-center rounded-full " + size}>
      <span className="logo-spin absolute inset-0 rounded-full" aria-hidden />
      <span className="relative h-[calc(100%-3px)] w-[calc(100%-3px)] overflow-hidden rounded-full bg-ground">
        <Image src="/brand/server-icon.jpg" alt="" width={112} height={112} className="h-full w-full scale-[1.3] object-cover" priority />
      </span>
    </span>
  );
}

/** Logo lengkap dengan nama toko (dipakai di footer). */
export function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="444 Store, ke beranda">
      <LogoOrb />
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[17px] font-extrabold tracking-[-0.02em]">
          444 <span className="font-medium text-ink-muted">Store</span>
        </span>
        <span className="mt-0.5 block text-[11px] text-ink-faint">Robux & item Roblox</span>
      </span>
    </Link>
  );
}
