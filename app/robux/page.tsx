import type { Metadata } from "next";
import { OrderCounter } from "@/components/OrderCounter";
import { RobuxIcon } from "@/components/RobuxIcon";
import { getSummary, number, rupiah } from "@/lib/store";

export const revalidate = 30;
export const metadata: Metadata = {
  title: "Robux via Username",
  description: "Beli Robux via username tanpa password. Harga dan stok live, bayar pakai QRIS.",
};

export default async function RobuxPage() {
  const s = await getSummary();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-8 sm:px-6 md:pt-14 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-14">
      <div>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Robux via Username</h1>
        <p className="mt-4 max-w-[48ch] text-ink-muted sm:text-lg">
          Kamu cukup kasih username Roblox. Admin mengirim Robux ke akunmu tanpa minta password.
        </p>
        <dl className="mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
          <div className="bg-surface p-4">
            <dt className="text-sm text-ink-muted">Harga</dt>
            <dd className="mt-1 text-xl font-semibold tabular">{s.rate ? rupiah(s.rate) : "-"}<span className="text-sm font-normal text-ink-muted"> / 1 Robux</span></dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-sm text-ink-muted">Stok sekarang</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-xl font-semibold tabular"><RobuxIcon className="h-5 w-5 text-ice" /> {number(s.stock)}</dd>
          </div>
        </dl>
        <h2 className="mt-10 text-lg font-semibold">Sebelum order</h2>
        <ul className="mt-3 max-w-[60ch] list-disc space-y-2 pl-5 text-ink-muted marker:text-ink-faint">
          <li>Pakai username (yang ada tanda @), bukan display name.</li>
          <li>Pastikan username sudah benar, Robux dikirim ke akun itu.</li>
          <li>Simpan bukti bayar sampai pesananmu selesai.</li>
        </ul>
      </div>
      <OrderCounter initialRate={s.rate} initialStock={s.stock} />
    </div>
  );
}
