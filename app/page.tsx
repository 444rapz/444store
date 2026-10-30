import Link from "next/link";
import { ArrowRight, Gift, MessageCircle, Star } from "lucide-react";
import { OrderCounter } from "@/components/OrderCounter";
import { Reviews } from "@/components/Reviews";
import { TopBuyers } from "@/components/TopBuyers";
import { Faq } from "@/components/Faq";
import { Sparkles } from "@/components/Sparkles";
import { CONTACT, PACKAGES, getSummary, number, rupiah } from "@/lib/store";

export const revalidate = 30;

const STEPS = [
  { title: "Pilih jumlah", text: "Pilih paket atau ketik sendiri jumlah Robux-nya. Total bayar langsung kelihatan." },
  { title: "Bayar pakai QRIS", text: "Scan dari aplikasi bank atau e-wallet apa aja, lalu kirim bukti bayarnya." },
  { title: "Robux dikirim", text: "Admin cek pembayaranmu, lalu Robux dikirim ke username kamu. Tanpa password." },
];

export default async function Home() {
  const s = await getSummary();
  const { stats } = s;
  const proof: string[] = [];
  if (stats.review_count > 0) proof.push(stats.rating_avg.toFixed(1) + " dari " + number(stats.review_count) + " ulasan");
  if (stats.orders_done > 0) proof.push(number(stats.orders_done) + " pesanan selesai");
  if (stats.robux_sold > 0) proof.push(number(stats.robux_sold) + " Robux terkirim");

  return (
    <>
      <section id="beli" className="relative scroll-mt-20">
        <Sparkles />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-6 sm:px-6 md:pt-14 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-14 lg:pb-20">
          <div className="lg:pt-10">
            <h1 className="text-[2rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Robux murah, proses kilat, dikerjakan admin beneran.
            </h1>
            <p className="mt-4 max-w-[46ch] text-base text-ink-muted sm:text-lg">
              Pilih jumlah, isi username, bayar pakai QRIS. Robux dikirim ke akunmu tanpa perlu password.
            </p>
            {proof.length > 0 && (
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted tabular">
                <Star size={15} className="text-violet-soft" fill="currentColor" aria-hidden />
                {proof.map((p, i) => (
                  <span key={p} className="flex items-center gap-3">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-faint" aria-hidden />}
                    {p}
                  </span>
                ))}
              </p>
            )}
            <div className="mt-7 hidden gap-3 lg:flex">
              <Link href="/item" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm hover:bg-raised">
                <Gift size={16} aria-hidden /> Cari item in game
              </Link>
              <a
                href={CONTACT.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink-muted hover:text-ink"
              >
                <MessageCircle size={16} aria-hidden /> Tanya admin dulu
              </a>
            </div>
          </div>
          <OrderCounter initialRate={s.rate} initialStock={s.stock} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="kategori">
        <h2 id="kategori" className="text-2xl font-semibold sm:text-3xl">Mau beli apa?</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-[1.25fr_1fr]">
          <Link
            href="/robux"
            className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-violet/60"
          >
            <p className="text-sm text-ink-muted">Paling sering dibeli</p>
            <h3 className="mt-1 text-2xl font-semibold">Robux via Username</h3>
            <p className="mt-2 max-w-[40ch] text-ink-muted">Cukup username Roblox. Pilih jumlah sendiri, harga dan stok selalu terbaru.</p>
            <p className="mt-6 flex items-center justify-between">
              <span className="text-sm text-ink-muted">
                Mulai dari <span className="text-lg font-semibold text-ink tabular">{s.rate ? rupiah(PACKAGES[0].amount * s.rate) : "-"}</span>
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-ground transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={18} aria-hidden />
              </span>
            </p>
          </Link>
          <Link href="/item" className="group rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-violet/60">
            <p className="text-sm text-ink-muted">Dikirim lewat join server</p>
            <h3 className="mt-1 text-2xl font-semibold">Gift In Game</h3>
            <p className="mt-2 max-w-[36ch] text-ink-muted">Item dan gamepass di dalam game, dikirim admin langsung ke karaktermu.</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Lihat item <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="harga">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="harga" className="text-2xl font-semibold sm:text-3xl">Harga Robux hari ini</h2>
          <p className="text-sm text-ink-muted tabular">
            {s.rate ? rupiah(s.rate) + " per Robux · stok " + number(s.stock) : "Harga sedang dimuat"}
          </p>
        </div>
        <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Jumlah</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {PACKAGES.map((p) => (
                <tr key={p.amount} className="hover:bg-surface/60">
                  <td className="px-4 py-3 tabular">
                    {number(p.amount)} Robux
                    {p.tag && <span className="ml-2 text-xs text-violet-soft">{p.tag}</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular">{s.rate ? rupiah(p.amount * s.rate) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="ulasan">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-4 sm:px-6">
          <h2 id="ulasan" className="text-2xl font-semibold sm:text-3xl">Kata yang udah beli</h2>
          {stats.review_count > 0 && (
            <p className="text-sm text-ink-muted tabular">
              Rata-rata {stats.rating_avg.toFixed(1)} dari {number(stats.review_count)} ulasan asli
            </p>
          )}
        </div>
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
          <Reviews reviews={s.reviews} />
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Top Pembeli</h2>
          <p className="mt-2 text-sm text-ink-muted">Dari pesanan yang sudah selesai. Nama disamarkan.</p>
          <div className="mt-6">
            <TopBuyers buyers={s.top_buyers} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Cara order</h2>
          <p className="mt-2 text-sm text-ink-muted">Cuma tiga langkah, gampang kok.</p>
          <ol className="mt-6 space-y-6">
            {STEPS.map((st, i) => (
              <li key={st.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong font-semibold tabular">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{st.title}</h3>
                  <p className="mt-1 text-ink-muted">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-20 px-4 sm:px-6" aria-labelledby="faq-judul">
        <h2 id="faq-judul" className="text-2xl font-semibold sm:text-3xl">Pertanyaan yang sering ditanya</h2>
        <div className="mt-6">
          <Faq />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface px-6 py-10 sm:px-10">
          <Sparkles />
          <h2 className="relative max-w-[20ch] text-2xl font-semibold sm:text-4xl">
            Stok lagi ada {number(s.stock)} Robux. Gas sekarang?
          </h2>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <a href="#beli" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-ground">
              Beli Robux <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 hover:bg-raised"
            >
              <MessageCircle size={18} aria-hidden /> Gabung Discord 444s
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
