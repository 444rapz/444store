import { ChevronDown } from "lucide-react";

const ITEMS = [
  {
    q: "Perlu kasih password akun Roblox?",
    a: "Nggak. Robux via username cukup pakai username Roblox kamu. Admin nggak pernah minta password.",
  },
  {
    q: "Berapa lama pesanan diproses?",
    a: "Setelah bukti bayar masuk, admin cek manual lalu langsung proses. Kalau admin lagi sibuk bisa sedikit lebih lama, statusnya bisa kamu tanyakan di Discord atau WhatsApp.",
  },
  {
    q: "Bayarnya pakai apa?",
    a: "QRIS, jadi bisa dari aplikasi bank atau e-wallet apa aja. Bisa juga transfer ke DANA, GoPay, atau ShopeePay.",
  },
  {
    q: "Username atau display name?",
    a: "Username. Itu nama yang ada tanda @ di profil Roblox kamu, bukan nama tampilan.",
  },
  {
    q: "Kalau stoknya kurang gimana?",
    a: "Angka stok di halaman ini selalu terbaru. Kalau jumlah yang kamu mau lebih besar dari stok, tanya admin kapan restock.",
  },
  {
    q: "Gift In Game itu apa?",
    a: "Item atau gamepass di dalam game Roblox. Admin masuk ke server kamu lalu mengirim itemnya ke karaktermu.",
  },
];

export function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {ITEMS.map((it) => (
        <details key={it.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown size={18} className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-[65ch] pb-5 text-ink-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
