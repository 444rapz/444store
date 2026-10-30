import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { StatsRow } from "@/components/StatsRow";
import { OrderCounter } from "@/components/OrderCounter";
import { Reviews } from "@/components/Reviews";
import { TopBuyers } from "@/components/TopBuyers";
import { RatingSeal } from "@/components/RatingSeal";
import { Faq } from "@/components/Faq";
import { PayLogos } from "@/components/PayLogos";
import { RobuxIcon } from "@/components/RobuxIcon";
import { CONTACT, getSummary, number, waLink } from "@/lib/store";

export const revalidate = 30;

const STEPS = [
  { title: "Pilih jumlah", text: "Pilih paket atau ketik sendiri. Total bayar langsung kelihatan." },
  { title: "Bayar pakai QRIS", text: "Scan dari aplikasi bank atau e-wallet apa aja." },
  { title: "Robux dikirim", text: "Admin cek pembayaran, Robux masuk ke username kamu." },
];

const H2 = "text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl";
const SPARK = "M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z";
const sticker = (r: string) => ({ "--r": r, "--z": "0px" }) as CSSProperties;

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

      {/* Leaderboard: panggung juara dan segel rating */}
      <section className="relative mx-auto mt-28 max-w-6xl px-4 sm:px-6" aria-labelledby="komunitas">
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
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <TopBuyers buyers={s.top_buyers} />
          <div className="flex flex-col items-center text-center">
            <RatingSeal rating={stats.rating_avg} />
            <p className="mt-5 max-w-[28ch] text-ink-muted">
              Dari {number(stats.review_count)} ulasan asli yang ditulis pembeli setelah pesanannya selesai.
            </p>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-discord px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={17} aria-hidden /> Gabung Discord 444s
            </a>
          </div>
        </div>
      </section>

      {/* Ulasan: dua baris gelembung chat berjalan berlawanan arah */}
      <section className="mt-28" aria-labelledby="ulasan">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="ulasan" className={H2}>
            Kata yang <span className="text-ice">udah beli</span>
          </h2>
          <p className="mt-2 text-ink-muted">Ulasan asli dari tiket yang sudah selesai.</p>
        </div>
        <div className="mt-6">
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

      {/* Penutup: pita silver selebar layar dengan stiker */}
      <section className="metal relative mt-32 overflow-hidden" aria-labelledby="ajak">
        <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute left-[46%] top-10 h-10 w-10 text-[#25282e]/50">
          <path d={SPARK} fill="currentColor" />
        </svg>
        <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute bottom-12 left-[4%] h-6 w-6 text-[#25282e]/45">
          <path d={SPARK} fill="currentColor" />
        </svg>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-48 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <h2
            id="ajak"
            className="max-w-[12ch] text-[clamp(2.6rem,7.5vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0b0b0c]"
          >
            {s.stock > 0 ? (
              <>
                Stok lagi ada{" "}
                <span className="inline-flex items-baseline gap-2 whitespace-nowrap tabular">
                  <RobuxIcon className="h-[0.75em] w-[0.75em] translate-y-[0.06em]" />
                  {number(s.stock)}.
                </span>{" "}
                Gas sekarang?
              </>
            ) : (
              "Stok lagi habis. Tanya admin kapan restock, ya."
            )}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg text-[#33373f]">
            Tinggal pilih jumlah, isi username, bayar pakai QRIS. Sisanya admin 444s yang urus.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#beli"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b0b0c] px-6 py-3.5 font-semibold text-ink shadow-[0_12px_22px_-10px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Beli Robux sekarang <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/25 px-5 py-3.5 font-medium text-[#0b0b0c] transition-colors hover:bg-black/5"
            >
              <MessageCircle size={18} aria-hidden /> Tanya admin
            </a>
          </div>
        </div>
        <Image
          src="/brand/robux-hex.png"
          alt=""
          width={400}
          height={433}
          className="sticker bottom-6 right-[38%] w-28 sm:bottom-auto sm:right-[16%] sm:top-12 sm:w-52"
          style={sticker("12deg")}
        />
        <Image
          src="/brand/chrome-infinity.png"
          alt=""
          width={400}
          height={300}
          className="sticker bottom-10 right-4 w-32 sm:bottom-12 sm:right-[4%] sm:w-56"
          style={sticker("-10deg")}
        />
        <Image
          src="/brand/tribal-violet.png"
          alt=""
          width={300}
          height={300}
          className="sticker bottom-20 left-4 w-24 sm:bottom-auto sm:left-auto sm:right-[34%] sm:top-1/2 sm:w-32"
          style={sticker("14deg")}
        />
        <Image
          src="/brand/chrome-heart.png"
          alt=""
          width={300}
          height={300}
          className="sticker -bottom-8 right-[22%] hidden w-40 lg:block"
          style={sticker("-6deg")}
        />
      </section>
    </>
  );
}
