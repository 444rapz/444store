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

      {/* Ulasan: ringkasan rating di kiri, feed ala channel Discord di kanan */}
      <section className="mx-auto mt-28 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16" aria-labelledby="ulasan">
        <div className="lg:pt-4">
          <h2 id="ulasan" className="text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            Kata yang <span className="text-ice">udah beli</span>
          </h2>
          <p className="mt-3 max-w-[36ch] text-ink-muted">
            Tiap ulasan ditulis pembeli sendiri setelah tiketnya selesai, langsung masuk dari bot Discord 444s.
          </p>
          {stats.review_count > 0 && (
            <div className="mt-8 flex items-center gap-5">
              <p className="text-7xl font-extrabold leading-none tracking-[-0.05em] tabular">{stats.rating_avg.toFixed(1)}</p>
              <div>
                <span className="flex gap-1 text-ice" aria-label={"Rata-rata " + stats.rating_avg + " dari 5"}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.round(stats.rating_avg) ? "currentColor" : "none"} aria-hidden />
                  ))}
                </span>
                <p className="mt-1.5 text-sm text-ink-muted">dari {number(stats.review_count)} ulasan pembeli</p>
              </div>
            </div>
          )}
          <a
            href={CONTACT.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-medium transition-colors hover:border-discord hover:bg-discord/15"
          >
            <MessageCircle size={17} aria-hidden /> Lihat semua di Discord 444s
          </a>
        </div>
        <Reviews reviews={s.reviews} />
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

      {/* Penutup: ajakan beli bersama avatar Roblox admin 444s */}
      <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6" aria-labelledby="ajak">
        <div className="glow-card relative grid overflow-hidden rounded-[28px] border border-line-strong md:grid-cols-[1.15fr_0.85fr]">
          <div className="relative z-10 order-2 px-6 pb-12 pt-4 sm:px-12 md:order-1 md:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ground/50 px-3 py-1.5 text-xs text-ink-muted tabular">
              <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
              {s.stock > 0 ? (
                <>
                  Stok <RobuxIcon className="h-3.5 w-3.5" /> {number(s.stock)} siap dikirim
                </>
              ) : (
                "Stok lagi habis"
              )}
            </p>
            <h2 id="ajak" className="mt-5 max-w-[12ch] text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Siap top up <span className="text-ice">Robux?</span>
            </h2>
            <p className="mt-4 max-w-[40ch] text-ink-muted sm:text-lg">
              {s.rate > 0 ? (
                <>
                  Cuma <span className="font-semibold text-ink tabular">{rupiah(s.rate)}</span> per Robux. Bayar pakai QRIS, terus admin 444s
                  yang kirim langsung ke username kamu.
                </>
              ) : (
                "Bayar pakai QRIS, terus admin 444s yang kirim langsung ke username kamu."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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

          <div className="relative order-1 h-72 md:order-2 md:h-auto md:min-h-[440px]">
            <span aria-hidden className="avatar-stage absolute inset-x-6 bottom-6 top-10 md:inset-x-4 md:bottom-10" />
            <svg viewBox="0 0 24 24" aria-hidden className="sparkle right-[14%] top-[16%] h-5 w-5">
              <path d={SPARK} fill="currentColor" />
            </svg>
            <svg viewBox="0 0 24 24" aria-hidden className="sparkle left-[14%] top-[40%] h-3 w-3" style={{ animationDelay: "1.6s" }}>
              <path d={SPARK} fill="currentColor" />
            </svg>
            <Image
              src="/brand/me.png"
              alt="Avatar Roblox admin 444s"
              width={420}
              height={420}
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.6)] md:h-[96%]"
            />
            <Image
              src="/brand/chrome-infinity.png"
              alt=""
              width={300}
              height={225}
              className="icon-img float-a absolute right-5 top-6 w-20 md:right-8 md:top-10 md:w-24"
            />
            <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-ground/80 px-3 py-1.5 text-xs font-semibold backdrop-blur md:bottom-8">
              <span className="relative h-5 w-5 overflow-hidden rounded-md">
                <Image src="/brand/server-icon.jpg" alt="" width={40} height={40} className="h-full w-full object-cover" />
              </span>
              rapz, admin 444s
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
