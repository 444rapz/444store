import type { Metadata } from "next";
import { DiscordIcon, WhatsAppIcon } from "@/components/BrandIcons";
import { GigCalculator } from "@/components/GigCalculator";
import { GigOrderForm } from "@/components/GigOrderForm";
import { CONTACT, getGig, waLink } from "@/lib/store";

export const revalidate = 30;
export const metadata: Metadata = {
  title: "Gift In Game",
  description: "Item dan gamepass di dalam game Roblox, khusus game yang punya fitur gift. Admin masuk ke server kamu, lalu mengirim itemnya langsung ke akunmu.",
};

const STEPS = [
  { title: "Pilih gamepass", text: "Cari game-nya, pilih gamepass, isi username penerima dan server." },
  { title: "Bayar", text: "Bayar pakai QRIS atau e-wallet, lalu upload bukti bayar di halaman pesanan." },
  { title: "Admin join server", text: "Admin masuk ke server dan mengirim itemnya langsung ke akunmu." },
];

export default async function ItemPage() {
  const gig = await getGig();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pt-12">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Gift In Game</h1>
        {gig.ready ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-live/15 px-3 py-1 text-sm font-semibold text-live">
            <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden /> Ready
          </span>
        ) : (
          <span className="rounded-full bg-warn/15 px-3 py-1 text-sm font-semibold text-warn">Lagi disiapkan</span>
        )}
      </div>
      <p className="mt-3 max-w-[56ch] text-ink-muted sm:text-lg">
        Item dan gamepass di dalam game Roblox, khusus game yang punya fitur gift. Admin masuk ke server kamu, lalu mengirim itemnya langsung ke akunmu.
      </p>

      {gig.rate > 0 && (
        <div className="mt-8">
          <GigCalculator rate={gig.rate} />
        </div>
      )}

      <div className="mt-8">
        <GigOrderForm rate={gig.rate} ready={gig.ready} items={gig.items} />
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]" aria-labelledby="cara">
        <div>
          <h2 id="cara" className="text-2xl font-extrabold tracking-tight">Cara pesannya</h2>
          <ol className="relative mt-6 space-y-7">
            <span aria-hidden className="absolute bottom-6 left-[23px] top-6 w-px bg-line-strong" />
            {STEPS.map((st, i) => (
              <li key={st.title} className="relative flex gap-4">
                <span className="chrome-chip relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl font-extrabold tabular">{i + 1}</span>
                <div className="pt-1">
                  <h3 className="text-lg font-bold">{st.title}</h3>
                  <p className="mt-0.5 text-ink-muted">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="self-start rounded-[var(--radius-card)] border border-line-strong bg-surface p-5 sm:p-6">
          <p className="font-semibold">Item kamu nggak ada?</p>
          <p className="mt-1 text-sm text-ink-muted">Chat admin aja, sebutin game dan itemnya.</p>
          <div className="mt-4 grid gap-2">
            <a href={CONTACT.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl bg-discord px-4 py-3 text-sm font-semibold text-white">
              <DiscordIcon size={18} /> Tanya di Discord
            </a>
            <a
              href={waLink("Halo min, aku mau beli item in game. Game: ... Item: ...")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-line-strong px-4 py-3 text-sm font-semibold hover:bg-raised"
            >
              <WhatsAppIcon size={18} className="text-whatsapp" /> Tanya di WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
