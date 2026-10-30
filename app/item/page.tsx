import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { CONTACT, waLink } from "@/lib/store";

export const metadata: Metadata = {
  title: "Gift In Game",
  description: "Item dan gamepass di dalam game Roblox, dikirim admin lewat join server.",
};

export default function ItemPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 md:pt-14">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Gift In Game</h1>
      <p className="mt-4 max-w-[52ch] text-ink-muted sm:text-lg">
        Item dan gamepass di dalam game. Admin masuk ke server kamu, lalu mengirim itemnya langsung ke karaktermu.
      </p>

      <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold">Daftar item lagi disiapkan</h2>
        <p className="mt-2 text-ink-muted">
          Sementara ini, sebutkan nama game dan item yang kamu mau ke admin. Harga dan stoknya langsung dicekkan buat kamu.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a href={CONTACT.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-discord px-4 py-3 text-sm font-medium text-white">
            <MessageCircle size={18} aria-hidden /> Tanya di Discord
          </a>
          <a
            href={waLink("Halo min, aku mau beli item in game. Game: ... Item: ...")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-line-strong px-4 py-3 text-sm font-medium hover:bg-raised"
          >
            <Phone size={18} aria-hidden /> Tanya di WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
