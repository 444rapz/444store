import type { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";
import { RobuxIcon } from "@/components/RobuxIcon";
import { getSummary, number, rupiah } from "@/lib/store";

export const revalidate = 30;
export const metadata: Metadata = {
  title: "Robux via Username",
  description: "Beli Robux via username tanpa password. Harga dan stok live, bayar pakai QRIS, chat langsung sama admin.",
};

export default async function RobuxPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [s, q] = await Promise.all([getSummary(), searchParams]);
  const jumlah = Number(q.jumlah);
  const initialRobux = Number.isFinite(jumlah) && jumlah >= 10 ? Math.min(Math.round(jumlah), 10000) : 100;
  const initialUsername = /^[A-Za-z0-9_]{3,20}$/.test(q.username || "") ? (q.username as string) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Robux via Username</h1>
          <p className="mt-3 max-w-[52ch] text-ink-muted">
            Isi tiga langkah di bawah. Setelah pesanan dibuat, kamu bayar pakai QRIS dan bisa chat langsung sama admin di halaman pesanan.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 tabular">
            <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
            Stok <RobuxIcon className="h-3.5 w-3.5" /> {number(s.stock)}
          </span>
          {s.rate > 0 && <span className="rounded-full border border-line-strong px-3 py-1.5 tabular">{rupiah(s.rate)} / Robux</span>}
        </div>
      </div>
      <div className="mt-8">
        <OrderForm initialRate={s.rate} initialStock={s.stock} initialRobux={initialRobux} initialUsername={initialUsername} />
      </div>
    </div>
  );
}
