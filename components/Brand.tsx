import Link from "next/link";

/** Logo toko tanpa background; warnanya mengikuti teks (putih di mode gelap, hitam di mode terang). */
export function LogoOrb({ size = "h-11 w-11", tone = "text-ink" }: { size?: string; tone?: string }) {
  return <span aria-hidden className={`logo-mark ${tone} ${size}`} />;
}

/** Logo dengan nama toko (dipakai di footer). */
export function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="444 Store, ke beranda">
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
