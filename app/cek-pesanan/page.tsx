import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/store";

export const metadata: Metadata = {
  title: "Cek Pesanan",
  description: "Cek status pesanan 444 Store pakai kode invoice.",
};

const STAGES = ["Menunggu pembayaran", "Menunggu verifikasi", "Diproses", "Selesai"];

export default function CekPesananPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-8 sm:px-6 md:pt-14">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Cek Pesanan</h1>
      <p className="mt-4 text-ink-muted sm:text-lg">
        Pesanan yang dibuat dari website nanti bisa dilacak di sini pakai kode invoice, dari dibayar sampai selesai.
      </p>

      <ol className="mt-8 grid gap-2 sm:grid-cols-4" aria-label="Tahapan pesanan">
        {STAGES.map((st, i) => (
          <li key={st} className="rounded-xl border border-line bg-surface px-3 py-3 text-sm">
            <span className="block text-xs text-ink-faint tabular">Tahap {i + 1}</span>
            {st}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="font-semibold">Pesan lewat Discord atau WhatsApp?</h2>
        <p className="mt-2 text-ink-muted">Status pesananmu ada di tiket atau chat dengan admin. Tanya di sana kalau belum ada kabar.</p>
        <a href={CONTACT.discord} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm hover:bg-raised">
          <MessageCircle size={16} aria-hidden /> Buka Discord 444s
        </a>
      </div>
    </div>
  );
}
