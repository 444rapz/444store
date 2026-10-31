"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Loader2, LogOut, ShoppingBag } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { RobloxAvatar } from "./RobloxProfile";
import { StatusPill } from "./StatusPill";
import { formatDate } from "./OrderDetail";
import { useWebUser, webApi, type Order } from "@/lib/web";
import { number, rupiah } from "@/lib/store";

export function MyOrders() {
  const router = useRouter();
  const user = useWebUser();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    webApi<{ orders: Order[] }>("orders").then((r) => {
      if (r.status === 401) return router.replace("/masuk?next=/pesanan");
      setOrders(r.ok ? r.data.orders : []);
    });
  }, [router]);

  async function logout() {
    await webApi("auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Pesanan saya</h1>
          {user && <p className="mt-2 text-ink-muted">Masuk sebagai {user.name}.</p>}
        </div>
        {user && (
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm hover:bg-raised">
            <LogOut size={16} aria-hidden /> Keluar
          </button>
        )}
      </div>

      <div className="mt-8">
        {orders === null ? (
          <p className="flex items-center gap-2 text-ink-muted">
            <Loader2 size={18} className="animate-spin" aria-hidden /> Memuat pesanan...
          </p>
        ) : orders.length === 0 ? (
          <div className="glow-card rounded-[var(--radius-card)] border border-line-strong p-8 text-center">
            <h2 className="text-xl font-bold">Belum ada pesanan</h2>
            <p className="mt-2 text-ink-muted">Pesanan Robux yang kamu buat di website bakal muncul di sini, lengkap dengan chat admin.</p>
            <Link href="/robux" className="chrome-btn mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold">
              <ShoppingBag size={17} aria-hidden /> Beli Robux
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3">
            {orders.map((o) => (
              <li key={o.invoice}>
                <Link
                  href={`/pesanan/${o.invoice}`}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-[var(--radius-card)] border border-line-strong bg-surface p-4 transition-colors hover:border-ice/50"
                >
                  <RobloxAvatar src={o.roblox.avatar} size="h-12 w-12" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold leading-none tabular">{o.invoice}</span>
                      <StatusPill status={o.status} label={o.status_label} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-none text-ink-muted">
                      <span className="inline-flex items-center gap-1 font-semibold text-ink tabular">
                        <RobuxIcon className="h-3.5 w-3.5 text-ice" />
                        {number(o.robux)}
                      </span>
                      <span aria-hidden className="text-ink-faint">·</span>
                      <span className="truncate">
                        {o.product === "gig" ? `Gift In Game, ${o.items.length} item` : o.items.length > 1 ? `${o.items.length} penerima` : `@${o.roblox.username}`}
                      </span>
                      <span aria-hidden className="text-ink-faint">·</span>
                      <span className="text-ink-faint tabular">{formatDate(o.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold tabular">{rupiah(o.total)}</span>
                    <ChevronRight size={18} className="shrink-0 text-ink-faint" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
