import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, Star } from "lucide-react";
import { DiscordIcon, WhatsAppIcon } from "@/components/BrandIcons";
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
            <DiscordIcon size={17} /> Gabung Discord 444s
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
            <DiscordIcon size={17} /> Lihat semua di Discord 444s
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
              <WhatsAppIcon size={16} className="text-whatsapp" /> WhatsApp
            </a>
            <a
              href={CONTACT.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-medium hover:bg-raised"
            >
              <DiscordIcon size={16} className="text-[#8c96ff]" /> Discord
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
          <div className="relative z-10 order-2 px-6 pb-12 pt-8 sm:px-12 md:order-1 md:py-16">
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
            <h2 id="ajak" className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Gas top&nbsp;up <span className="block text-ice">Robux?</span>
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
                <DiscordIcon size={18} /> Tanya admin
              </a>
            </div>
          </div>

          <div className="relative order-1 grid place-items-center px-6 pb-2 pt-12 md:order-2 md:py-12">
            <svg viewBox="0 0 24 24" aria-hidden className="sparkle right-[12%] top-[10%] h-5 w-5">
              <path d={SPARK} fill="currentColor" />
            </svg>
            <svg viewBox="0 0 24 24" aria-hidden className="sparkle bottom-[14%] left-[10%] h-3 w-3" style={{ animationDelay: "1.6s" }}>
              <path d={SPARK} fill="currentColor" />
            </svg>
            {/* Kartu profil admin ala kartu pemain Roblox */}
            <div className="float-b relative w-[260px] sm:w-[280px]" style={{ "--r": "3deg" } as CSSProperties}>
              <div className="logo-ring rounded-[24px] p-[1.5px]">
                <div className="rounded-[22.5px] bg-[#111114] p-3.5">
                  <div className="avatar-bg relative h-52 overflow-hidden rounded-2xl">
                    <Image
                      src="/brand/me.png"
                      alt="Avatar Roblox rapz, owner 444 Store"
                      width={420}
                      height={420}
                      className="absolute left-[-27%] top-1 h-auto w-[160%] max-w-none"
                    />
                  </div>
                  <div className="mt-3.5 flex items-start justify-between gap-3 px-1">
                    <div>
                      <p className="flex items-center gap-1.5 text-lg font-extrabold leading-tight">
                        rapz
                        <Image
                          src="/brand/verified.png"
                          alt="Terverifikasi di Roblox"
                          title="Terverifikasi di Roblox"
                          width={36}
                          height={36}
                          className="h-[18px] w-[18px]"
                        />
                      </p>
                      <p className="text-xs text-ink-muted">Owner 444 Store</p>
                    </div>
                    <span className="chrome-chip rounded-full px-2.5 py-1 text-[11px] font-bold">Admin</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-white/[0.05] py-2">
                      <p className="text-lg font-extrabold tabular">{stats.orders_done ? number(stats.orders_done) : "-"}</p>
                      <p className="text-[11px] text-ink-faint">pesanan selesai</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.05] py-2">
                      <p className="inline-flex items-center gap-1 text-lg font-extrabold tabular">
                        {stats.rating_avg ? stats.rating_avg.toFixed(1) : "-"}
                        <Star size={14} className="text-ice" fill="currentColor" aria-hidden />
                      </p>
                      <p className="text-[11px] text-ink-faint">rating pembeli</p>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/brand/chrome-infinity.png"
                alt=""
                width={300}
                height={225}
                className="icon-img absolute -right-4 -top-7 w-16 sm:-right-9 sm:-top-9 sm:w-24"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
