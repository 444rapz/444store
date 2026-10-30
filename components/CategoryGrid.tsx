import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { CONTACT, rupiah } from "@/lib/store";

type Cat = {
  href: string;
  external?: boolean;
  badge: string;
  title: string;
  sub: string;
  foot: string;
  img: string;
  imgClass: string;
  r: string;
  span?: string;
  featured?: boolean;
};

export function CategoryGrid({ rate }: { rate: number }) {
  const cats: Cat[] = [
    {
      href: "/robux",
      badge: "Terlaris",
      title: "Robux via Username",
      sub: "Cukup username Roblox, tanpa password. Harga dan stok selalu live.",
      foot: rate ? "Mulai " + rupiah(100 * rate) : "Lihat harga",
      img: "/brand/robux-hex.png",
      imgClass: "-right-3 -top-10 w-[96px] sm:w-[116px]",
      r: "10deg",
      span: "col-span-2",
      featured: true,
    },
    {
      href: "/item",
      badge: "Join server",
      title: "Gift In Game",
      sub: "Item dan gamepass dikirim di dalam game.",
      foot: "Tanya harga",
      img: "/brand/chrome-heart.png",
      imgClass: "-right-2 -top-8 w-[78px]",
      r: "-9deg",
    },
    {
      href: "/cek-pesanan",
      badge: "Lacak",
      title: "Cek Pesanan",
      sub: "Pantau status pesananmu.",
      foot: "Pakai kode invoice",
      img: "/brand/chrome-infinity.png",
      imgClass: "-right-3 -top-6 w-[86px]",
      r: "8deg",
    },
    {
      href: CONTACT.discord,
      external: true,
      badge: "Komunitas",
      title: "Discord 444s",
      sub: "Info restock, giveaway, dan tanya admin.",
      foot: "Gabung gratis",
      img: "/brand/tribal-violet.png",
      imgClass: "-right-2 -top-8 w-[80px]",
      r: "12deg",
      span: "col-span-2 md:col-span-1",
    },
  ];

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="kategori">
      <h2 id="kategori" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
        Pilih layanan
      </h2>
      <p className="mt-2 text-ink-muted">Mau Robux atau item in game? Semua diproses langsung sama admin 444s.</p>
      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-5">
        {cats.map((c) => {
          const inner = (
            <>
              <Image
                src={c.img}
                alt=""
                width={280}
                height={280}
                className={"sticker " + c.imgClass}
                style={{ "--r": c.r, "--z": "0px" } as CSSProperties}
              />
              <div className="tix-body">
                <span className="chrome-chip inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold">{c.badge}</span>
                <span className={"mt-5 block font-bold leading-tight tracking-tight " + (c.featured ? "text-2xl sm:text-3xl" : "text-lg")}>
                  {c.title}
                </span>
                <span className={"mt-1.5 block text-ink-muted " + (c.featured ? "max-w-[34ch] text-sm" : "text-xs")}>{c.sub}</span>
                {c.featured && rate > 0 && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted tabular">
                    <RobuxIcon className="h-4 w-4 text-ice" /> 100 = <span className="font-semibold text-ink">{rupiah(100 * rate)}</span>
                  </span>
                )}
              </div>
              <span className="perf" aria-hidden />
              <span className="tix-foot">
                <span className="tabular">{c.foot}</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </>
          );
          const cls = "tix group " + (c.featured ? "glow-card " : "") + (c.span ?? "");
          return c.external ? (
            <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={c.title} href={c.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
