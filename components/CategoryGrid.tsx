import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT, rupiah } from "@/lib/store";

type Cat = { href: string; external?: boolean; badge: string; title: string; sub: string; foot: string; img: string; round?: boolean };

export function CategoryGrid({ rate }: { rate: number }) {
  const cats: Cat[] = [
    { href: "/robux", badge: "Terlaris", title: "Robux via Username", sub: "Cukup username, tanpa password", foot: rate ? "Mulai " + rupiah(100 * rate) : "Lihat harga", img: "/brand/robux-hex.png" },
    { href: "/item", badge: "Join server", title: "Gift In Game", sub: "Item & gamepass dalam game", foot: "Tanya harga", img: "/brand/chrome-heart.png" },
    { href: "/cek-pesanan", badge: "Lacak", title: "Cek Pesanan", sub: "Pantau status pesananmu", foot: "Pakai kode invoice", img: "/brand/chrome-infinity.png" },
    { href: CONTACT.discord, external: true, badge: "Komunitas", title: "Discord 444s", sub: "Info restock & giveaway", foot: "Gabung gratis", img: "/brand/server-icon.jpg", round: true },
  ];

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="kategori">
      <h2 id="kategori" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Pilih layanan</h2>
      <p className="mt-2 text-ink-muted">Mau Robux atau item in game? Semua diproses admin 444s.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cats.map((c) => {
          const inner = (
            <>
              <span className="chrome-chip absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl px-3 py-1 text-[11px] font-semibold">{c.badge}</span>
              <span className="mx-auto mt-7 grid h-24 w-24 place-items-center transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-5deg]">
                <Image
                  src={c.img}
                  alt=""
                  width={192}
                  height={192}
                  className={c.round ? "h-16 w-16 rounded-2xl object-cover ring-1 ring-line-strong" : "icon-img h-24 w-24 object-contain"}
                />
              </span>
              <span className="mt-3 block text-center text-[17px] font-bold leading-tight tracking-tight">{c.title}</span>
              <span className="mt-1 block text-center text-xs text-ink-muted">{c.sub}</span>
              <span className="mt-4 flex items-center justify-center gap-1.5 border-t border-line pt-3 text-sm font-semibold tabular">
                {c.foot} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </>
          );
          const cls = "group relative overflow-hidden rounded-[20px] border border-line bg-surface px-4 pb-4 transition-colors hover:border-ice/50";
          return c.external ? (
            <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          ) : (
            <Link key={c.title} href={c.href} className={cls}>{inner}</Link>
          );
        })}
      </div>
    </section>
  );
}
