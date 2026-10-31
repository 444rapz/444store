import type { Metadata } from "next";
import Image from "next/image";
import { DiscordIcon, WhatsAppIcon } from "@/components/BrandIcons";
import { RobuxIcon } from "@/components/RobuxIcon";
import { API_URL, CONTACT, getGig, number, rupiah, waLink } from "@/lib/store";

export const revalidate = 30;
export const metadata: Metadata = {
  title: "Gift In Game",
  description: "Item dan gamepass di dalam game Roblox. Admin masuk ke server kamu, lalu mengirim itemnya langsung ke akunmu.",
};

const STEPS = [
  { title: "Pilih item", text: "Cek harga di daftar, lalu chat admin item mana yang kamu mau." },
  { title: "Bayar", text: "Bayar pakai QRIS atau e-wallet sesuai total dari admin." },
  { title: "Admin join server", text: "Admin masuk ke server kamu dan mengirim itemnya langsung ke akunmu." },
];

export default async function ItemPage() {
  const gig = await getGig();
  const rate = gig.rate;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
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
            Item dan gamepass di dalam game Roblox. Admin masuk ke server kamu, lalu mengirim itemnya langsung ke akunmu.
          </p>
        </div>
      </div>

      {rate > 0 && (
        <section className="glow-card mt-8 rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6" aria-labelledby="hitung">
          <h2 id="hitung" className="text-lg font-bold">Cara hitung harganya</h2>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold sm:text-base">
            <span className="rounded-lg border border-line-strong px-3 py-1.5">Harga item (Robux)</span>
            <span className="text-ink-faint">×</span>
            <span className="rounded-lg border border-line-strong px-3 py-1.5">Rate</span>
            <span className="text-ink-faint">=</span>
            <span className="rounded-lg bg-ice/15 px-3 py-1.5 text-ice">Harga GIG</span>
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted tabular">
            Contoh:
            <span className="inline-flex items-center gap-1 rounded-md bg-raised px-2 py-1 font-semibold text-ink">
              <RobuxIcon className="h-3.5 w-3.5 text-ice" /> 100 Robux
            </span>
            ×
            <span className="rounded-md bg-raised px-2 py-1 font-semibold text-ink">{rate}</span>
            =
            <span className="font-extrabold text-ink">{rupiah(100 * rate)}</span>
          </p>
        </section>
      )}

      <section className="mt-10" aria-labelledby="daftar">
        <h2 id="daftar" className="text-2xl font-extrabold tracking-tight">Daftar item</h2>
        {gig.items.length === 0 ? (
          <div className="mt-4 rounded-[var(--radius-card)] border border-line-strong bg-surface p-6">
            <p className="font-semibold">Daftar item lagi disiapkan</p>
            <p className="mt-1 text-ink-muted">Sementara ini, sebutkan nama game dan item yang kamu mau ke admin. Harganya langsung dicekkan buat kamu.</p>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {gig.items.map((it) => (
              <li key={it.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-surface">
                <div className="relative grid aspect-square place-items-center bg-raised">
                  {it.image ? (
                    <Image src={`${API_URL}${it.image}`} alt={it.name} fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  ) : (
                    <Image src="/brand/chrome-heart.png" alt="" width={160} height={160} className="icon-img w-1/2" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="font-bold leading-tight">{it.name}</p>
                  {it.game && <p className="mt-0.5 text-xs text-ink-faint">{it.game}</p>}
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-ink-muted tabular">
                    <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(it.robux)} × {rate}
                  </p>
                  <p className="text-lg font-extrabold tabular">{rupiah(it.price)}</p>
                  <a
                    href={waLink(`Halo min, aku mau beli item ${it.name}${it.game ? ` (${it.game})` : ""} seharga ${rupiah(it.price)}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!gig.ready}
                    className={`mt-3 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${
                      gig.ready ? "chrome-btn" : "pointer-events-none border border-line-strong text-ink-faint"
                    }`}
                  >
                    {gig.ready ? "Pesan item" : "Belum ready"}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

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
          <p className="font-semibold">Tanya admin dulu</p>
          <p className="mt-1 text-sm text-ink-muted">Item yang kamu cari belum ada di daftar? Chat admin aja.</p>
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
