import Link from "next/link";
import { ArrowRight, Gift, MessageCircle, Search } from "lucide-react";
import { RobuxCoin } from "./RobuxCoin";
import { CONTACT, rupiah } from "@/lib/store";

type Cat = {
  href: string;
  external?: boolean;
  badge: string;
  badgeClass: string;
  title: string;
  sub: string;
  foot: string;
  tile: string;
  icon: React.ReactNode;
};

export function CategoryGrid({ rate }: { rate: number }) {
  const cats: Cat[] = [
    {
      href: "/robux",
      badge: "Terlaris",
      badgeClass: "bg-pink text-white",
      title: "Robux via Username",
      sub: "Cukup username, tanpa password",
      foot: rate ? "Mulai " + rupiah(100 * rate) : "Lihat harga",
      tile: "bg-gold/15",
      icon: <RobuxCoin id="cat-coin" size={46} tone="gold" />,
    },
    {
      href: "/item",
      badge: "Join server",
      badgeClass: "bg-violet text-white",
      title: "Gift In Game",
      sub: "Item & gamepass dalam game",
      foot: "Tanya harga",
      tile: "bg-violet/15",
      icon: <Gift size={30} className="text-violet-soft" aria-hidden />,
    },
    {
      href: "/cek-pesanan",
      badge: "Lacak",
      badgeClass: "bg-gold text-ground",
      title: "Cek Pesanan",
      sub: "Pantau status pesananmu",
      foot: "Pakai kode invoice",
      tile: "bg-gold/10",
      icon: <Search size={28} className="text-gold" aria-hidden />,
    },
    {
      href: CONTACT.discord,
      external: true,
      badge: "Komunitas",
      badgeClass: "bg-discord text-white",
      title: "Discord 444s",
      sub: "Info restock & giveaway",
      foot: "Gabung gratis",
      tile: "bg-discord/15",
      icon: <MessageCircle size={28} className="text-[#a5adff]" aria-hidden />,
    },
  ];

  return (
    <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6" aria-labelledby="kategori">
      <h2 id="kategori" className="font-display text-3xl font-bold sm:text-4xl">
        Pilih <span className="text-pink">layanan</span>
      </h2>
      <p className="mt-2 text-ink-muted">Mau Robux atau item in game? Semua diproses admin 444s.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cats.map((c) => {
          const inner = (
            <>
              <span className={"absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl px-3 py-1 text-[11px] font-semibold " + c.badgeClass}>
                {c.badge}
              </span>
              <span className={"mx-auto mt-6 grid h-20 w-20 place-items-center rounded-3xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-4deg] " + c.tile}>
                {c.icon}
              </span>
              <span className="mt-4 block text-center font-display text-lg font-bold leading-tight">{c.title}</span>
              <span className="mt-1 block text-center text-xs text-ink-muted">{c.sub}</span>
              <span className="mt-4 flex items-center justify-center gap-1.5 border-t border-line pt-3 text-sm font-semibold tabular">
                {c.foot} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </>
          );
          const cls = "group relative overflow-hidden rounded-[20px] border border-line bg-surface px-4 pb-4 transition-colors hover:border-pink/50";
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
