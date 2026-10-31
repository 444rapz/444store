import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { CONTACT, number, rupiah } from "@/lib/store";

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
  tint: string;
  area?: string;
  big?: boolean;
};

// Ubin chrome pastel ala ikon Y2K; layanan utama dibuat paling besar
export function CategoryGrid({ rate, stock }: { rate: number; stock: number }) {
  const cats: Cat[] = [
    {
      href: "/robux",
      badge: "Terlaris",
      title: "Robux via Username",
      sub: "Cukup username Roblox, tanpa password. Harga dan stok selalu live dari bot.",
      foot: rate ? "Mulai " + rupiah(100 * rate) : "Lihat harga",
      img: "/brand/robux-hex.png",
      imgClass: "-bottom-10 -right-8 w-44 sm:-bottom-14 sm:-right-10 sm:w-64",
      r: "14deg",
      tint: "tile-ice",
      area: "col-span-2 md:row-span-2",
      big: true,
    },
    {
      href: "/item",
      badge: "Join server",
      title: "Gift In Game",
      sub: "Item dan gamepass dari game yang punya fitur gift.",
      foot: "Cek harga",
      img: "/brand/chrome-heart.png",
      imgClass: "-right-2 -top-2 w-16 sm:-bottom-5 sm:-right-5 sm:top-auto sm:w-28",
      r: "-10deg",
      tint: "tile-blush",
    },
    {
      href: "/pesanan",
      badge: "Lacak",
      title: "Cek Pesanan",
      sub: "Pantau status pesananmu.",
      foot: "Pakai kode invoice",
      img: "/brand/chrome-infinity.png",
      imgClass: "-right-3 -top-1 w-20 sm:-bottom-4 sm:-right-6 sm:top-auto sm:w-32",
      r: "8deg",
      tint: "tile-silver",
    },
    {
      href: CONTACT.discord,
      external: true,
      badge: "Komunitas",
      title: "Discord 444s",
      sub: "Info restock, giveaway, dan tanya admin langsung.",
      foot: "Gabung gratis",
      img: "/brand/tribal-violet.png",
      imgClass: "-bottom-6 right-2 w-28 sm:right-6 sm:w-32",
      r: "12deg",
      tint: "tile-violet",
      area: "col-span-2",
    },
  ];

  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="kategori">
      <h2 id="kategori" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
        Pilih layanan
      </h2>
      <p className="mt-2 text-ink-muted">Mau Robux atau item in game? Semua diproses langsung sama admin 444s.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cats.map((c) => {
          const inner = (
            <>
              <Image
                src={c.img}
                alt=""
                width={360}
                height={360}
                className={"sticker " + c.imgClass}
                style={{ "--r": c.r, "--z": "0px" } as CSSProperties}
              />
              <span className="relative z-10 w-fit rounded-full bg-onyx px-2.5 py-1 text-[11px] font-semibold text-snow">{c.badge}</span>
              <span
                className={
                  "relative z-10 mt-4 block font-extrabold leading-[1.02] tracking-[-0.03em] " +
                  (c.big ? "max-w-[9ch] text-4xl sm:text-6xl" : "max-w-[11ch] text-xl sm:text-2xl")
                }
              >
                {c.title}
              </span>
              <span className={"relative z-10 mt-2 block text-[#2f3540] " + (c.big ? "max-w-[30ch] sm:text-lg" : "max-w-[24ch] text-sm")}>
                {c.sub}
              </span>
              {c.big && rate > 0 && (
                <span className="relative z-10 mt-5 flex flex-wrap gap-2 text-sm font-semibold tabular">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5">
                    <RobuxIcon className="h-4 w-4" /> 100 = {rupiah(100 * rate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5">
                    Stok <RobuxIcon className="h-4 w-4" /> {number(stock)}
                  </span>
                </span>
              )}
              {c.big ? (
                <span className="relative z-10 mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-onyx px-5 py-3 text-sm font-semibold text-snow">
                  {c.foot} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              ) : (
                <span className="relative z-10 mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold">
                  {c.foot} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              )}
            </>
          );
          const cls =
            "tile group " + c.tint + " " + (c.area ?? "") + (c.big ? " min-h-[340px] p-6 sm:min-h-[440px] sm:p-8" : " min-h-[210px] p-5");
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
