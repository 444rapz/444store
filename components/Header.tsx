"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Coins, Gift, House, MessageCircle, Receipt, ShoppingBag, UserRound } from "lucide-react";
import { LogoOrb } from "./Brand";
import { CONTACT } from "@/lib/store";
import { useWebUser } from "@/lib/web";

const NAV = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/robux", label: "Robux", icon: Coins },
  { href: "/item", label: "Item", icon: Gift },
  { href: "/pesanan", label: "Pesanan", icon: Receipt },
];

// Navigasi berupa pulau melayang: atas untuk semua layar, bawah khusus HP
export function Header() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const [scrolled, setScrolled] = useState(false);
  const user = useWebUser(path);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const swap = "[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="nav-shell mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full pl-2.5 pr-2.5 sm:pl-3">
          <Link href="/" aria-label="444 Store, ke beranda" className="grid items-center">
            <span aria-hidden className={swap + (scrolled ? " pointer-events-none scale-75 opacity-0 blur-sm" : "")}>
              <LogoOrb />
            </span>
            <span
              aria-hidden
              className={
                swap +
                " whitespace-nowrap pl-2 text-lg font-extrabold tracking-[-0.02em]" +
                (scrolled ? "" : " pointer-events-none -translate-x-2 opacity-0 blur-sm")
              }
            >
              444 <span className="font-medium text-ink-muted">Store</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Menu utama">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active(n.href) ? "chrome-chip" : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="hidden h-11 w-11 place-items-center rounded-full border border-line-strong sm:grid text-ink-muted transition-colors hover:border-discord hover:bg-discord/15 hover:text-ink"
            >
              <MessageCircle size={18} aria-hidden />
            </a>
            <Link href="/robux" className="chrome-btn inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold sm:px-5">
              <ShoppingBag size={16} aria-hidden /> Beli Robux
            </Link>
            <Link
              href={user ? "/pesanan" : "/masuk"}
              aria-label={user ? `Akun ${user.name}, lihat pesanan` : "Masuk atau daftar"}
              className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-line-strong text-ink-muted transition-colors hover:text-ink"
            >
              {user?.avatar ? (
                <Image src={user.avatar} alt="" width={88} height={88} unoptimized className="h-full w-full object-cover" />
              ) : user ? (
                <span className="text-sm font-bold text-ink">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <UserRound size={18} aria-hidden />
              )}
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-40 pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Menu bawah">
        <ul className="nav-shell mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full p-1.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-medium transition-colors ${
                  active(href) ? "chrome-chip" : "text-ink-faint hover:text-ink"
                }`}
              >
                <Icon size={19} strokeWidth={active(href) ? 2.2 : 1.8} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
