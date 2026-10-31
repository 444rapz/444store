"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ImageUp, Loader2, MessageCircle, Send, TriangleAlert, X } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { PayLogos } from "./PayLogos";
import { RobuxIcon } from "./RobuxIcon";
import { RobloxAvatar } from "./RobloxProfile";
import { StatusPill } from "./StatusPill";
import { compressImage, webApi, type ChatMessage, type Order } from "@/lib/web";
import { PAYMENT, number, rupiah } from "@/lib/store";

const STEPS = ["Menunggu pembayaran", "Menunggu verifikasi", "Diproses", "Selesai"];
const STEP_INDEX: Record<string, number> = { awaiting_payment: 0, awaiting_verification: 1, processing: 2, done: 3 };

export function formatDate(s: string) {
  const d = new Date(s.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function merge(a: ChatMessage[], b: ChatMessage[]) {
  const max = a.length ? a[a.length - 1].id : 0;
  return [...a, ...b.filter((m) => m.id > max)];
}

export function OrderDetail({ invoice }: { invoice: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "notfound" | "error">("loading");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const lastId = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastId.current = messages.length ? messages[messages.length - 1].id : 0;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
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

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const r = await webApi<{ messages: ChatMessage[] }>(`orders/${invoice}/messages`, { method: "POST", body: JSON.stringify({ body }) });
    setSending(false);
    if (!r.ok) return setNotice(r.data.error || "Pesan gagal terkirim.");
    setText("");
    setMessages((m) => merge(m, r.data.messages));
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

      <section className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-[#101013] lg:sticky lg:top-24" aria-labelledby="chat">
        <div className="flex items-center gap-2.5 border-b border-line bg-surface px-4 py-3">
          <MessageCircle size={18} className="text-ice" aria-hidden />
          <div>
            <h2 id="chat" className="font-semibold">Chat dengan admin</h2>
            <p className="text-xs text-ink-faint">Admin balas dari Discord, semua chat tersimpan di sini.</p>
          </div>
        </div>
        <div ref={listRef} className="h-[420px] space-y-3 overflow-y-auto px-4 py-4 sm:h-[480px]" aria-live="polite">
          {messages.map((m) =>
            m.sender === "system" ? (
              <p key={m.id} className="mx-auto max-w-[90%] rounded-full bg-white/[0.05] px-3 py-1.5 text-center text-xs text-ink-muted">
                {m.body}
              </p>
            ) : (
              <div key={m.id} className={`flex flex-col ${m.sender === "buyer" ? "items-end" : "items-start"}`}>
                <span className="mb-1 px-1 text-[11px] text-ink-faint">
                  {m.sender === "admin" ? `${m.author} · Admin` : "Kamu"} · {formatDate(m.created_at).split(" ").slice(-1)[0]}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug ${
                    m.sender === "buyer" ? "rounded-br-md bg-ice text-[#0d1626]" : "rounded-bl-md bg-raised text-ink"
                  }`}
                >
                  {m.image && (
                    <a href={`/api/web/orders/${invoice}/media/${m.id}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Image
                        src={`/api/web/orders/${invoice}/media/${m.id}`}
                        alt="Gambar di chat"
                        width={240}
                        height={240}
                        unoptimized
                        className="max-h-60 w-auto rounded-lg"
                      />
                    </a>
                  )}
                  {m.body && <p className={m.image ? "mt-1.5" : ""}>{m.body}</p>}
                </div>
              </div>
            ),
          )}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-line bg-surface p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 1000))}
            placeholder="Tulis pesan ke admin..."
            aria-label="Pesan ke admin"
            className="min-w-0 flex-1 rounded-full border border-line bg-ground px-4 py-2.5 placeholder:text-ink-faint focus:border-ice focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            aria-label="Kirim pesan"
            className="chrome-btn grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-40"
          >
            {sending ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
          </button>
        </form>
      </section>
    </div>
  );
}
