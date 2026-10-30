import Image from "next/image";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { StatsRow } from "@/components/StatsRow";
import { OrderCounter } from "@/components/OrderCounter";
import { Reviews } from "@/components/Reviews";
import { TopBuyers } from "@/components/TopBuyers";
import { Faq } from "@/components/Faq";
import { CONTACT, getSummary, number } from "@/lib/store";

export const revalidate = 30;

const STEPS = [
  { title: "Pilih jumlah", text: "Pilih paket atau ketik sendiri. Total bayar langsung kelihatan." },
  { title: "Bayar pakai QRIS", text: "Scan dari aplikasi bank atau e-wallet apa aja." },
  { title: "Robux dikirim", text: "Admin cek pembayaran, Robux masuk ke username kamu." },
];

const H2 = "text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl";

export default async function Home() {
  const s = await getSummary();
  const { stats } = s;

  return (
    <>
      <HeroBanner rate={s.rate} stock={s.stock} />
      <CategoryGrid rate={s.rate} />
      {stats.orders_done > 0 && <StatsRow stats={stats} />}

      <section id="beli" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-4 sm:px-6" aria-labelledby="beli-judul">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,470px)] lg:gap-14">
          <div>
            <h2 id="beli-judul" className={H2}>
              Beli Robux <span className="text-ice">sekarang</span>
            </h2>
            <p className="mt-2 max-w-[44ch] text-ink-muted">Cuma tiga langkah, gampang kok. Harga dan stok di sebelah selalu terbaru.</p>
            <ol className="mt-8 space-y-4">
              {STEPS.map((st, i) => (
                <li key={st.title} className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
                  <span className="chrome-chip grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-extrabold tabular">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{st.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-muted">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <OrderCounter initialRate={s.rate} initialStock={s.stock} />
        </div>
      </section>

      <section className="relative mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="komunitas">
        <Image
          src="/brand/web-heart.png"
          alt=""
          width={477}
          height={517}
          className="pointer-events-none absolute -top-16 right-0 -z-10 w-72 opacity-[0.07]"
        />
        <h2 id="komunitas" className={H2}>
          Leaderboard <span className="text-ice">komunitas</span>
        </h2>
        <p className="mt-2 text-ink-muted">Peringkat dihitung otomatis dari pesanan yang sudah selesai. Nama disamarkan.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <TopBuyers buyers={s.top_buyers} />
          <div className="glow-card flex flex-col justify-between rounded-[var(--radius-card)] border border-line p-6">
            <div>
              <p className="text-sm text-ink-muted">Rating dari pembeli</p>
              <p className="mt-2 text-7xl font-extrabold leading-none tracking-[-0.04em] tabular">
                {stats.rating_avg ? stats.rating_avg.toFixed(1) : "-"}
              </p>
              <div className="mt-3 flex gap-1 text-ice" aria-label={"Rata-rata " + stats.rating_avg + " dari 5"}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={22} fill={i < Math.round(stats.rating_avg) ? "currentColor" : "none"} aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-ink-muted">Dari {number(stats.review_count)} ulasan asli setelah pesanan selesai.</p>
            </div>
            <div className="mt-8 flex items-end justify-between gap-4">
              <a
                href={CONTACT.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-discord px-5 py-3 text-sm font-semibold text-white"
              >
                <MessageCircle size={17} aria-hidden /> Gabung Discord 444s
              </a>
              <Image
                src="/brand/tribal-violet.png"
                alt=""
                width={160}
                height={160}
                className="icon-img float-b h-20 w-20 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="ulasan">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="ulasan" className={H2}>
            Kata yang <span className="text-ice">udah beli</span>
          </h2>
          <p className="mt-2 text-ink-muted">Ulasan asli dari tiket yang sudah selesai.</p>
        </div>
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
          <Reviews reviews={s.reviews} />
        </div>
      </section>

      <section id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-20 px-4 sm:px-6" aria-labelledby="faq-judul">
        <h2 id="faq-judul" className={H2}>
          Masih <span className="text-ice">bingung?</span>
        </h2>
        <div className="mt-6">
          <Faq />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="glow-card relative overflow-hidden rounded-[26px] border border-line-strong px-6 py-10 sm:px-12 sm:py-14">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
              Stok lagi ada <span className="text-ice tabular">{number(s.stock)}</span> Robux. Gas sekarang?
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#beli" className="chrome-btn inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold">
                Beli Robux <ArrowRight size={18} aria-hidden />
              </a>
              <a
                href={CONTACT.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3.5 hover:bg-raised"
              >
                <MessageCircle size={18} aria-hidden /> Tanya admin
              </a>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -bottom-8 -right-6 opacity-40 sm:right-10 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:opacity-100"
            aria-hidden
          >
            <Image src="/brand/chrome-infinity.png" alt="" width={300} height={225} className="icon-img float-a w-44 sm:w-60" />
          </div>
        </div>
      </section>
    </>
  );
}
