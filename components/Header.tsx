"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins, Gift, House, MessageCircle, Search } from "lucide-react";
import { Brand } from "./Brand";
import { API_URL, CONTACT, number } from "@/lib/store";

const NAV = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/robux", label: "Robux", icon: Coins },
  { href: "/item", label: "Item", icon: Gift },
  { href: "/cek-pesanan", label: "Cek Pesanan", icon: Search },
];

export function Header() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const [stock, setStock] = useState<number | null>(null);

  // Stok live di bawah nama toko
  useEffect(() => {
    fetch(`${API_URL}/api/rates`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.stock !== undefined) setStock(Number(d.stock));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Brand
            sub={
              stock !== null ? (
                <>
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" aria-hidden />
                  Stok {number(stock)} Robux
                </>
              ) : undefined
            }
          />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Menu utama">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                  active(n.href) ? "bg-raised text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a
            href={CONTACT.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-sm text-ink transition-colors hover:border-discord hover:bg-discord/15"
          >
            <MessageCircle size={16} aria-hidden />
            <span className="hidden sm:inline">Gabung Discord</span>
            <span className="sm:hidden">Discord</span>
          </a>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Menu bawah"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${
                  active(href) ? "text-ink" : "text-ink-faint"
                }`}
              >
                <Icon size={20} strokeWidth={active(href) ? 2.2 : 1.8} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
