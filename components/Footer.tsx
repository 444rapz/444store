import Link from "next/link";
import { Brand } from "./Brand";
import { CONTACT, waLink } from "@/lib/store";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pb-28 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Brand />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Top up Robux murah dan proses kilat, dikerjakan langsung oleh admin 444s. Pesanan dicek manual satu per satu.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Belanja</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><Link className="hover:text-ink" href="/robux">Robux via Username</Link></li>
            <li><Link className="hover:text-ink" href="/item">Gift In Game</Link></li>
            <li><Link className="hover:text-ink" href="/cek-pesanan">Cek Pesanan</Link></li>
            <li><Link className="hover:text-ink" href="/#faq">Pertanyaan umum</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Hubungi admin</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li><a className="hover:text-ink" href={CONTACT.discord} target="_blank" rel="noopener noreferrer">Discord 444s</a></li>
            <li><a className="hover:text-ink" href={waLink("Halo min, aku mau tanya soal order.")} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a className="hover:text-ink" href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer">TikTok @rapz444s</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs leading-relaxed text-ink-faint sm:px-6">
        <p>
          444 Store adalah toko independen dan tidak berafiliasi dengan Roblox Corporation. Roblox dan Robux adalah merek milik Roblox Corporation.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} 444 Store</p>
      </div>
    </footer>
  );
}
