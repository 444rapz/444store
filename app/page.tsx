import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, MessageCircle, Phone, Star } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { StatsRow } from "@/components/StatsRow";
import { OrderCounter } from "@/components/OrderCounter";
import { Reviews } from "@/components/Reviews";
import { TopBuyers } from "@/components/TopBuyers";
import { Faq } from "@/components/Faq";
import { PayLogos } from "@/components/PayLogos";
import { RobuxIcon } from "@/components/RobuxIcon";
import { CONTACT, getSummary, number, rupiah, waLink } from "@/lib/store";

export const revalidate = 30;

const STEPS = [
  { title: "Pilih jumlah", text: "Pilih paket atau ketik sendiri. Total bayar langsung kelihatan." },
  { title: "Bayar pakai QRIS", text: "Scan dari aplikasi bank atau e-wallet apa aja." },
  { title: "Robux dikirim", text: "Admin cek pembayaran, Robux masuk ke username kamu." },
];

const H2 = "text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl";
const SPARK = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z";

export default async function Home() {
  const s = await getSummary();
  const { stats } = s;

  return (
    <>
      <HeroBanner rate={s.rate} stock={s.stock} />
      <CategoryGrid rate={s.rate} stock={s.stock} />
      {stats.orders_done > 0 && <StatsRow stats={stats} />}

      {/* Beli: langkah berupa garis waktu, form order di sebelahnya */}
      <section id="beli" className="mx-auto mt-28 max-w-6xl scroll-mt-20 px-4 sm:px-6" aria-labelledby="beli-judul">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,470px)] lg:gap-16">
          <div>
            <h2 id="beli-judul" className="text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Beli Robux
              <br />
              <span className="text-ice">tiga langkah.</span>
            </h2>
            <p className="mt-3 max-w-[42ch] text-ink-muted">Gampang kok. Harga dan stok di form ini selalu terbaru.</p>
            <ol className="relative mt-10 space-y-9">
              <span aria-hidden className="absolute bottom-8 left-[27px] top-8 w-px bg-line-strong" />
              {STEPS.map((st, i) => (
                <li key={st.title} className="relative flex gap-5">
                  <span className="chrome-chip relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl font-extrabold tabular">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-xl font-bold tracking-tight">{st.title}</h3>
                    <p className="mt-1 max-w-[36ch] text-ink-muted">{st.text}</p>
                    {i === 1 && <PayLogos className="mt-3" />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <OrderCounter initialRate={s.rate} initialStock={s.stock} />
        </div>
      </section>

      {/* Leaderboard: panggung juara dan daftar peringkat */}
      <section className="relative mx-auto mt-28 max-w-6xl px-4 sm:px-6" aria-labelledby="komunitas">
        <Image
          src="/brand/web-heart.png"
          alt=""
          width={477}
          height={517}
          className="pointer-events-none absolute -top-16 right-0 -z-10 w-72 opacity-[0.07]"
        />
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 id="komunitas" className={H2}>
              Leaderboard <span className="text-ice">komunitas</span>
            </h2>
            <p className="mt-2 text-ink-muted">Peringkat dihitung otomatis dari pesanan yang sudah selesai. Nama disamarkan.</p>
          </div>
          <a
            href={CONTACT.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-discord px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle size={17} aria-hidden /> Gabung Discord 444s
          </a>
        </div>
        <div className="mt-12">
          <TopBuyers buyers={s.top_buyers} />
        </div>
      </section>

      {/* Ulasan: satu ulasan besar dan daftar ringkas, rating di judul */}
      <section className="mx-auto mt-28 max-w-6xl px-4 sm:px-6" aria-labelledby="ulasan">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="ulasan" className={H2}>
              Kata yang <span className="text-ice">udah beli</span>
            </h2>
            <p className="mt-2 text-ink-muted">Ulasan asli dari tiket yang sudah selesai.</p>
          </div>
          {stats.review_count > 0 && (
            <div className="flex items-center gap-4">
              <p className="text-5xl font-extrabold leading-none tracking-[-0.04em] tabular">{stats.rating_avg.toFixed(1)}</p>
              <div>
                <span className="flex gap-0.5 text-ice" aria-label={"Rata-rata " + stats.rating_avg + " dari 5"}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(stats.rating_avg) ? "currentColor" : "none"} aria-hidden />
                  ))}
                </span>
                <p className="mt-1 text-sm text-ink-muted">dari {number(stats.review_count)} ulasan</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-10">
          <Reviews reviews={s.reviews} />
        </div>
      </section>

      {/* FAQ: judul besar menempel di kiri, jawaban di kanan */}
      <section
        id="faq"
        className="mx-auto mt-28 grid max-w-6xl scroll-mt-20 gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
        aria-labelledby="faq-judul"
      >
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-judul" className="text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            Masih <span className="text-ice">bingung?</span>
          </h2>
          <p className="mt-3 max-w-[34ch] text-ink-muted">Ini yang paling sering ditanya. Kalau jawabannya belum ada, langsung chat admin aja.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={waLink("Halo min, aku mau tanya soal order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-medium hover:border-whatsapp hover:bg-whatsapp/10"
            >
              <Phone size={16} aria-hidden /> WhatsApp
            </a>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-medium hover:bg-raised"
            >
              <MessageCircle size={16} aria-hidden /> Discord
            </a>
          </div>
          <Image
            src="/brand/chrome-infinity.png"
            alt=""
            width={300}
            height={225}
            className="icon-img float-a mt-12 hidden w-44 lg:block"
            style={{ "--r": "-8deg" } as CSSProperties}
          />
        </div>
        <Faq />
      </section>

      {/* Penutup: ajakan singkat di tengah dengan satu ikon chrome */}
      <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6" aria-labelledby="ajak">
        <div className="glow-card relative overflow-hidden rounded-[28px] border border-line-strong px-6 py-14 text-center sm:px-12 sm:py-20">
          <svg viewBox="0 0 24 24" aria-hidden className="sparkle left-[12%] top-[22%] h-4 w-4">
            <path d={SPARK} fill="currentColor" />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden className="sparkle bottom-[18%] right-[10%] h-6 w-6" style={{ animationDelay: "1.4s" }}>
            <path d={SPARK} fill="currentColor" />
          </svg>
          <Image
            src="/brand/chrome-infinity.png"
            alt=""
            width={360}
            height={270}
            className="icon-img float-a mx-auto w-32 sm:w-40"
          />
          <h2 id="ajak" className="mx-auto mt-6 max-w-[14ch] text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            Siap top up Robux?
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-ink-muted sm:text-lg">
            {s.stock > 0 && s.rate > 0 ? (
              <>
                Stok sekarang{" "}
                <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-ink tabular">
                  <RobuxIcon className="h-4 w-4" /> {number(s.stock)}
                </span>
                , harga <span className="font-semibold text-ink tabular">{rupiah(s.rate)}</span> per Robux. Bayar pakai QRIS, admin
                444s yang kirim ke username kamu.
              </>
            ) : (
              "Stok lagi habis. Tanya admin kapan restock, ya."
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#beli" className="chrome-btn inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold">
              Beli Robux sekarang <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3.5 font-medium hover:bg-raised"
            >
              <MessageCircle size={18} aria-hidden /> Tanya admin
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
