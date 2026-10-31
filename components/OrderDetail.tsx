"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ImageUp, Loader2, Send, Star, TriangleAlert, X } from "lucide-react";
import { BuyerAvatar } from "./BuyerAvatar";
import { CopyButton } from "./CopyButton";
import { PayLogos } from "./PayLogos";
import { RobuxIcon } from "./RobuxIcon";
import { RobloxAvatar } from "./RobloxProfile";
import { StatusPill } from "./StatusPill";
import { compressImage, webApi, type ChatMessage, type Order } from "@/lib/web";
import { PAYMENT, number, rupiah } from "@/lib/store";

const STEPS = ["Menunggu pembayaran", "Menunggu verifikasi", "Diproses", "Selesai"];
const STEP_INDEX: Record<string, number> = { awaiting_payment: 0, awaiting_verification: 1, processing: 2, done: 3 };

function toDate(s: string) {
  return new Date(s.replace(" ", "T") + "Z");
}

export function formatDate(s: string) {
  const d = toDate(s);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function clock(s: string) {
  const d = toDate(s);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(s: string) {
  const d = toDate(s);
  const key = (x: Date) => x.toDateString();
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (key(d) === key(today)) return "Hari ini";
  if (key(d) === key(yesterday)) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function merge(a: ChatMessage[], b: ChatMessage[]) {
  const max = a.length ? a[a.length - 1].id : 0;
  return [...a, ...b.filter((m) => m.id > max)];
}

/** Ekor gelembung chat ala WhatsApp. */
function Tail({ mine }: { mine: boolean }) {
  return (
    <svg viewBox="0 0 8 13" aria-hidden className={`absolute top-0 h-[13px] w-2 ${mine ? "-right-2 text-[#005c4b]" : "-left-2 text-[#202c33]"}`}>
      <path fill="currentColor" d={mine ? "M0 0h8L0 13z" : "M8 0H0l8 13z"} />
    </svg>
  );
}

function ChatPanel({
  order,
  invoice,
  messages,
  onSend,
}: {
  order: Order;
  invoice: string;
  messages: ChatMessage[];
  onSend: (body: string) => Promise<boolean>;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    if (await onSend(body)) setText("");
    setSending(false);
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-[#0b141a] lg:sticky lg:top-24" aria-labelledby="chat">
      <div className="flex items-center gap-3 bg-[#202c33] px-4 py-2.5">
        {order.admin ? (
          <BuyerAvatar name={order.admin.name} src={order.admin.avatar} />
        ) : (
          <Image src="/brand/server-icon.jpg" alt="" width={80} height={80} className="h-10 w-10 rounded-full" />
        )}
        <div className="min-w-0">
          <h2 id="chat" className="truncate font-semibold text-[#e9edef]">
            {order.admin ? order.admin.name : "Admin 444 Store"}
          </h2>
          <p className="truncate text-xs text-[#8696a0]">
            {order.admin ? "Admin 444 Store, lagi menangani pesananmu" : "Menunggu admin mengambil pesanan"}
          </p>
        </div>
      </div>

      <div ref={listRef} className="h-[440px] overflow-y-auto px-3 py-3 sm:h-[500px]" aria-live="polite">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const newDay = !prev || dayLabel(prev.created_at) !== dayLabel(m.created_at);
          const mine = m.sender === "buyer";
          const firstOfRun =
            newDay || !prev || prev.sender !== m.sender || prev.author !== m.author || toDate(m.created_at).getTime() - toDate(prev.created_at).getTime() > 5 * 60000;
          return (
            <Fragment key={m.id}>
              {newDay && (
                <p className="my-3 flex justify-center">
                  <span className="rounded-lg bg-[#182229] px-3 py-1 text-xs text-[#8696a0]">{dayLabel(m.created_at)}</span>
                </p>
              )}
              {m.sender === "system" ? (
                <p className="my-2 flex justify-center">
                  <span className="max-w-[88%] rounded-lg bg-[#182229] px-3 py-1.5 text-center text-xs leading-snug text-[#ffd279]">{m.body}</span>
                </p>
              ) : (
                <div className={`flex gap-2 ${mine ? "justify-end" : "justify-start"} ${firstOfRun ? "mt-2.5" : "mt-0.5"}`}>
                  {!mine && (firstOfRun ? <BuyerAvatar name={m.author} src={m.avatar} size="h-8 w-8" text="text-sm" /> : <span className="w-8 shrink-0" />)}
                  <div
                    className={`relative max-w-[78%] rounded-lg px-2.5 pb-1.5 pt-1.5 text-[14.5px] leading-snug text-[#e9edef] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)] ${
                      mine ? "bg-[#005c4b]" : "bg-[#202c33]"
                    } ${firstOfRun ? (mine ? "rounded-tr-none" : "rounded-tl-none") : ""}`}
                  >
                    {firstOfRun && <Tail mine={mine} />}
                    {!mine && firstOfRun && (
                      <p className="mb-0.5 text-[12.5px] font-semibold text-[#53bdeb]">
                        {m.author} <span className="font-normal text-[#8696a0]">· Admin</span>
                      </p>
                    )}
                    {m.image && (
                      <a href={`/api/web/orders/${invoice}/media/${m.id}`} target="_blank" rel="noopener noreferrer" className="block">
                        <Image
                          src={`/api/web/orders/${invoice}/media/${m.id}`}
                          alt="Gambar di chat"
                          width={260}
                          height={260}
                          unoptimized
                          className="max-h-64 w-auto rounded-md"
                        />
                      </a>
                    )}
                    <p className="whitespace-pre-wrap break-words">
                      {m.body}
                      <span aria-hidden className="inline-block w-14" />
                    </p>
                    <span className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[11px] text-[#8696a0]">
                      {clock(m.created_at)}
                      {mine && <Check size={14} aria-label="Terkirim" />}
                    </span>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 bg-[#202c33] px-3 py-2.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder="Ketik pesan"
          aria-label="Pesan ke admin"
          className="min-w-0 flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Kirim pesan"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#00a884] text-[#0b141a] transition-opacity disabled:opacity-50"
        >
          {sending ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
        </button>
      </form>
    </section>
  );
}

function ReviewBox({ order, onSent }: { order: Order; onSent: (o: Order, m: ChatMessage[]) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (order.review) {
    return (
      <section className="rounded-[var(--radius-card)] border border-live/30 bg-live/[0.06] p-5 sm:p-6">
        <h2 className="font-bold">Ulasan kamu</h2>
        <div className="mt-2 flex gap-1 text-ice" aria-label={`${order.review.rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={20} fill={i < order.review!.rating ? "currentColor" : "none"} aria-hidden />
          ))}
        </div>
        {order.review.text && <p className="mt-2">{order.review.text}</p>}
        <p className="mt-2 text-sm text-ink-muted">Makasih! Ulasanmu tampil di toko dan di channel vouch Discord 444s.</p>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || busy) return;
    setBusy(true);
    setErr("");
    const r = await webApi<{ order: Order; messages: ChatMessage[] }>(`orders/${order.invoice}/review`, {
      method: "POST",
      body: JSON.stringify({ rating, text }),
    });
    setBusy(false);
    if (!r.ok) return setErr(r.data.error || "Ulasan gagal dikirim.");
    onSent(r.data.order, r.data.messages);
  }

  const shown = hover || rating;
  return (
    <form onSubmit={submit} className="glow-card rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6">
      <h2 className="text-lg font-bold">Gimana pesananmu?</h2>
      <p className="mt-1 text-sm text-ink-muted">Kasih bintang dan ulasan. Nanti tampil di toko dan channel vouch Discord 444s.</p>
      <div className="mt-4 flex gap-1.5" role="radiogroup" aria-label="Pilih bintang" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} bintang`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            className="rounded-lg p-1 text-ice transition-transform hover:scale-110"
          >
            <Star size={30} fill={n <= shown ? "currentColor" : "none"} strokeWidth={1.6} aria-hidden />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        rows={3}
        placeholder="Ceritain pengalamanmu (opsional)"
        className="mt-3 w-full resize-none rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
      />
      {err && <p className="mt-2 text-sm text-warn">{err}</p>}
      <button type="submit" disabled={!rating || busy} className="chrome-btn mt-3 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold disabled:opacity-50">
        {busy && <Loader2 size={17} className="animate-spin" aria-hidden />}
        Kirim ulasan
      </button>
    </form>
  );
}

export function OrderDetail({ invoice }: { invoice: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "notfound" | "error">("loading");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const lastId = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lastId.current = messages.length ? messages[messages.length - 1].id : 0;
  }, [messages]);

  useEffect(() => {
    let alive = true;
    webApi<{ order: Order; messages: ChatMessage[] }>(`orders/${invoice}`).then((r) => {
      if (!alive) return;
      if (r.status === 401) return router.replace(`/masuk?next=${encodeURIComponent(`/pesanan/${invoice}`)}`);
      if (r.status === 404) return setState("notfound");
      if (!r.ok) return setState("error");
      setOrder(r.data.order);
      setMessages(r.data.messages);
      setState("ok");
    });
    return () => {
      alive = false;
    };
  }, [invoice, router]);

  // Status dan chat baru dicek tiap 4 detik selama halaman dibuka
  useEffect(() => {
    if (state !== "ok") return;
    const t = setInterval(async () => {
      if (document.hidden) return;
      const r = await webApi<{ order: Order; messages: ChatMessage[] }>(`orders/${invoice}/messages?after=${lastId.current}`);
      if (!r.ok) return;
      setOrder(r.data.order);
      if (r.data.messages.length) setMessages((m) => merge(m, r.data.messages));
    }, 4000);
    return () => clearInterval(t);
  }, [state, invoice]);

  async function send(body: string) {
    const r = await webApi<{ messages: ChatMessage[] }>(`orders/${invoice}/messages`, { method: "POST", body: JSON.stringify({ body }) });
    if (!r.ok) {
      setNotice(r.data.error || "Pesan gagal terkirim.");
      return false;
    }
    setMessages((m) => merge(m, r.data.messages));
    return true;
  }

  async function upload(file: File) {
    setUploading(true);
    setNotice("");
    const blob = await compressImage(file);
    const form = new FormData();
    form.append("file", blob, "bukti.jpg");
    const r = await webApi<{ order: Order; messages: ChatMessage[] }>(`orders/${invoice}/proof`, { method: "POST", body: form });
    setUploading(false);
    if (!r.ok) return setNotice(r.data.error || "Upload gagal. Coba lagi.");
    setOrder(r.data.order);
    setMessages((m) => merge(m, r.data.messages));
  }

  async function cancel() {
    if (!window.confirm("Batalkan pesanan ini?")) return;
    const r = await webApi<{ order: Order }>(`orders/${invoice}/cancel`, { method: "POST" });
    if (!r.ok) return setNotice(r.data.error || "Pesanan tidak bisa dibatalkan.");
    setOrder(r.data.order);
  }

  if (state === "loading") {
    return (
      <p className="flex items-center gap-2 text-ink-muted">
        <Loader2 size={18} className="animate-spin" aria-hidden /> Memuat pesanan...
      </p>
    );
  }
  if (state !== "ok" || !order) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line-strong bg-surface p-6">
        <h1 className="text-2xl font-extrabold">{state === "notfound" ? "Pesanan tidak ditemukan" : "Pesanan belum bisa dimuat"}</h1>
        <p className="mt-2 text-ink-muted">
          {state === "notfound" ? "Pastikan kamu masuk pakai akun yang sama waktu membuat pesanan." : "Coba muat ulang halaman sebentar lagi."}
        </p>
        <Link href="/pesanan" className="chrome-btn mt-5 inline-flex rounded-full px-5 py-3 font-semibold">
          Lihat pesanan saya
        </Link>
      </div>
    );
  }

  const step = STEP_INDEX[order.status] ?? -1;
  const payable = order.status === "awaiting_payment" || order.status === "awaiting_verification";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="grid gap-5">
        <div>
          <Link href="/pesanan" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={16} aria-hidden /> Pesanan saya
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Pesanan {order.invoice}</h1>
            <StatusPill status={order.status} label={order.status_label} />
          </div>
          <p className="mt-1 text-sm text-ink-faint">Dibuat {formatDate(order.created_at)}</p>
        </div>

        {step >= 0 ? (
          <ol className="grid grid-cols-4 gap-2" aria-label="Tahapan pesanan">
            {STEPS.map((s, i) => (
              <li key={s} className="min-w-0">
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-ice" : "bg-line-strong"}`} />
                <span className={`mt-2 flex items-start gap-1 text-xs leading-tight sm:text-sm ${i === step ? "font-semibold text-ink" : "text-ink-faint"}`}>
                  {i < step && <Check size={14} className="mt-px shrink-0 text-ice" aria-hidden />}
                  {s}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="flex items-start gap-2 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#fca5a5]">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
            {order.status === "rejected"
              ? `Pesanan ditolak admin.${order.reject_reason ? ` Alasan: ${order.reject_reason}` : ""} Tanya admin di chat kalau ada yang belum jelas.`
              : "Pesanan ini sudah dibatalkan."}
          </p>
        )}

        {order.status === "done" && (
          <ReviewBox
            order={order}
            onSent={(o, m) => {
              setOrder(o);
              setMessages((prev) => merge(prev, m));
            }}
          />
        )}

        {payable && (
          <section className="glow-card rounded-[var(--radius-card)] border border-line-strong p-5 sm:p-6" aria-labelledby="bayar">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="bayar" className="text-sm text-ink-muted">Total yang harus dibayar</h2>
                <p className="text-3xl font-extrabold tracking-tight tabular">{rupiah(order.total)}</p>
              </div>
              <CopyButton text={String(order.total)} label="Salin nominal" />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-[220px_1fr]">
              <div className="overflow-hidden rounded-xl bg-white p-3">
                <Image src="/qris.png" alt="Kode QRIS 444 Store" width={520} height={520} className="h-auto w-full" />
              </div>
              <div>
                <p className="font-semibold">Scan QRIS pakai aplikasi apa aja</p>
                <PayLogos className="mt-2.5" />
                <p className="mt-3 text-sm text-ink-muted">
                  Atau transfer {PAYMENT.ewalletNames}: <span className="tabular text-ink">{PAYMENT.ewallet}</span> a.n. {PAYMENT.holder}
                </p>
                <CopyButton text={PAYMENT.ewalletRaw} label="Salin nomor" />
              </div>
            </div>

            <div className="mt-6 border-t border-line pt-5">
              {order.has_proof ? (
                <p className="flex items-start gap-2 text-sm text-live">
                  <Check size={18} className="mt-0.5 shrink-0" aria-hidden />
                  Bukti bayar sudah dikirim. Admin lagi ngecek, statusnya bakal berubah sendiri di halaman ini.
                </p>
              ) : (
                <p className="text-sm text-ink-muted">Sudah bayar? Upload screenshot bukti bayarnya di sini.</p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className={`${order.has_proof ? "border border-line-strong hover:bg-raised" : "chrome-btn"} inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold disabled:opacity-60`}
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ImageUp size={18} aria-hidden />}
                  {order.has_proof ? "Ganti bukti bayar" : "Upload bukti bayar"}
                </button>
                {order.status === "awaiting_payment" && (
                  <button type="button" onClick={cancel} className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm text-ink-muted hover:text-ink">
                    <X size={16} aria-hidden /> Batalkan pesanan
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {notice && (
          <p className="rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn" role="alert">
            {notice}
          </p>
        )}

        <section className="rounded-[var(--radius-card)] border border-line-strong bg-surface p-5 sm:p-6" aria-labelledby="detail">
          <h2 id="detail" className="text-lg font-bold">Detail pesanan</h2>
          <div className="mt-4 flex items-center gap-3">
            <RobloxAvatar src={order.roblox.avatar} size="h-12 w-12" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{order.roblox.display}</p>
              <p className="truncate text-sm text-ink-muted">@{order.roblox.username}</p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-ink-faint">Jumlah</dt>
              <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold tabular">
                <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(order.robux)} Robux
              </dd>
            </div>
            <div>
              <dt className="text-ink-faint">Total</dt>
              <dd className="mt-0.5 font-semibold tabular">
                {rupiah(order.total)}
                {order.discount > 0 && <span className="ml-1.5 text-xs font-normal text-live">hemat {rupiah(order.discount)}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-ink-faint">Umur akun</dt>
              <dd className="mt-0.5 font-semibold">{order.age_group === "adult" ? "18+ tahun" : "Di bawah 18"}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Metode bayar</dt>
              <dd className="mt-0.5 font-semibold">QRIS</dd>
            </div>
            {order.note && (
              <div className="col-span-2">
                <dt className="text-ink-faint">Catatan</dt>
                <dd className="mt-0.5">{order.note}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <ChatPanel order={order} invoice={invoice} messages={messages} onSend={send} />
    </div>
  );
}
