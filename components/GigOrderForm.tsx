"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, LogIn, Plus, Search, Server, TriangleAlert, X } from "lucide-react";
import { RobuxIcon } from "./RobuxIcon";
import { ProfilePreview, RobloxAvatar } from "./RobloxProfile";
import { useRobloxLookup } from "@/lib/roblox";
import { useWebUser, webApi, type Order } from "@/lib/web";
import { API_URL, PAY_METHODS, number, rupiah, type GigItem, type PayMethod } from "@/lib/store";

type Game = { universeId: number; placeId: number; name: string; players: number; icon: string };
type Pass = { id: number; name: string; robux: number; icon: string };
type Product =
  | { source: "pass"; universeId: number; game: string; passId: number; name: string; robux: number; icon: string }
  | { source: "item"; itemId: number; game: string; name: string; robux: number; icon: string };
type Line = Product & { username: string; display: string; avatar: string; server: "link" | "admin"; serverLink: string };

const SERVER_LINK = /^https:\/\/(www\.)?roblox\.com\/\S*(share\?code=|privateServerLinkCode=)\S+$/i;
const EXAMPLE = "https://www.roblox.com/games/9872472334/Evade";

function Icon({ src, size }: { src: string; size: string }) {
  return (
    <span className={"relative block shrink-0 overflow-hidden rounded-xl bg-raised " + size}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />}
    </span>
  );
}

function Box({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line-strong bg-surface p-5 sm:p-6">
      <header className="flex items-center gap-3">
        <span className="chrome-chip grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-extrabold tabular">{n}</span>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {sub && <p className="text-sm text-ink-muted">{sub}</p>}
        </div>
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function GigOrderForm({ rate, ready, items }: { rate: number; ready: boolean; items: GigItem[] }) {
  const router = useRouter();
  const user = useWebUser();
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [passes, setPasses] = useState<Pass[] | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [username, setUsername] = useState("");
  const [server, setServer] = useState<"link" | "admin">("admin");
  const [serverLink, setServerLink] = useState("");
  const [cart, setCart] = useState<Line[]>([]);
  const [pay, setPay] = useState<PayMethod>("qris");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { uname, valid, status, profile } = useRobloxLookup(username);

  // Cari game setelah berhenti mengetik
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      setSearchErr("");
      try {
        const r = await fetch(`/api/roblox/games?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const d = await r.json();
        if (!r.ok) setSearchErr(d.error || "Pencarian gagal.");
        setGames(d.games ?? []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setSearchErr("Pencarian gagal. Coba lagi.");
      }
      setSearching(false);
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  async function pickGame(g: Game) {
    setGame(g);
    setPasses(null);
    setProduct(null);
    try {
      const r = await fetch(`/api/roblox/passes?universe=${g.universeId}`);
      const d = await r.json();
      setPasses(r.ok ? d.passes ?? [] : []);
      if (!r.ok) setSearchErr(d.error || "Daftar gamepass belum bisa dimuat.");
    } catch {
      setPasses([]);
      setSearchErr("Daftar gamepass belum bisa dimuat.");
    }
  }

  const linkOk = server === "admin" || SERVER_LINK.test(serverLink.trim());
  const recipientOk = valid && (status === "found" || status === "error");
  const canAdd = !!product && recipientOk && linkOk && cart.length < 10;
  const total = cart.reduce((n, l) => n + l.robux * rate, 0);

  function addLine() {
    if (!canAdd || !product) return;
    setCart((c) => [
      ...c,
      {
        ...product,
        username: profile?.name ?? uname,
        display: profile?.displayName ?? uname,
        avatar: profile?.avatar ?? "",
        server,
        serverLink: server === "link" ? serverLink.trim() : "",
      },
    ]);
    setUsername("");
    setProduct(null);
  }

  async function submit() {
    if (!cart.length || busy || !ready) return;
    setBusy(true);
    setError("");
    const r = await webApi<{ order: Order }>("orders", {
      method: "POST",
      body: JSON.stringify({
        product: "gig",
        payment_method: pay,
        note,
        lines: cart.map((l) =>
          l.source === "pass"
            ? { source: "pass", universe_id: l.universeId, pass_id: l.passId, game: l.game, username: l.username, server: l.server, server_link: l.serverLink }
            : { source: "item", item_id: l.itemId, username: l.username, server: l.server, server_link: l.serverLink },
        ),
      }),
    });
    if (r.status === 401) {
      setBusy(false);
      return router.push("/masuk?next=/item");
    }
    if (!r.ok) {
      setBusy(false);
      return setError(r.data.error || "Pesanan gagal dibuat. Coba lagi.");
    }
    router.push(`/pesanan/${r.data.order.invoice}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="grid gap-5">
        <Box n={1} title="Pilih gamepass" sub="Cari nama game atau tempel link game Roblox.">
          <label className="relative block">
            <span className="sr-only">Cari game</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 200))}
              placeholder="Contoh: Evade, Blox Fruits, atau link game"
              className="w-full rounded-xl border border-line bg-ground py-3 pl-11 pr-4 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
          <p className="mt-2 text-xs text-ink-faint">
            Contoh link:{" "}
            <button type="button" onClick={() => setQuery(EXAMPLE)} className="break-all text-ice hover:underline">
              {EXAMPLE}
            </button>
          </p>

          {searching && (
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 size={16} className="animate-spin" aria-hidden /> Mencari game...
            </p>
          )}
          {searchErr && <p className="mt-3 text-sm text-warn">{searchErr}</p>}

          {!game && games && !searching && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {games.length === 0 && <li className="text-sm text-ink-muted">Game tidak ketemu. Coba nama lain atau tempel link game.</li>}
              {games.map((g) => (
                <li key={g.universeId}>
                  <button
                    type="button"
                    onClick={() => pickGame(g)}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-raised/50 p-2.5 text-left transition-colors hover:border-ice"
                  >
                    <Icon src={g.icon} size="h-12 w-12" />
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-semibold leading-tight">{g.name}</span>
                      {g.players > 0 && <span className="text-xs text-ink-faint tabular">{number(g.players)} pemain</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {game && (
            <div className="mt-4">
              <div className="flex items-center gap-3 rounded-xl border border-ice bg-ice/10 p-2.5">
                <Icon src={game.icon} size="h-12 w-12" />
                <p className="min-w-0 flex-1 truncate font-semibold">{game.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setGame(null);
                    setPasses(null);
                    setProduct(null);
                  }}
                  className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold hover:bg-raised"
                >
                  Ganti game
                </button>
              </div>
              {passes === null ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                  <Loader2 size={16} className="animate-spin" aria-hidden /> Memuat gamepass...
                </p>
              ) : passes.length === 0 ? (
                <p className="mt-4 text-sm text-ink-muted">Game ini belum punya gamepass yang dijual.</p>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {passes.map((p) => {
                    const selected = product?.source === "pass" && product.passId === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setProduct({ source: "pass", universeId: game.universeId, game: game.name, passId: p.id, name: p.name, robux: p.robux, icon: p.icon })
                          }
                          className={`flex h-full w-full flex-col items-start gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                            selected ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                          }`}
                        >
                          <Icon src={p.icon} size="aspect-square w-full" />
                          <span className="line-clamp-2 text-sm font-semibold leading-tight">{p.name}</span>
                          <span className="mt-auto inline-flex items-center gap-1 text-xs text-ink-muted tabular">
                            <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(p.robux)}
                          </span>
                          <span className="font-extrabold tabular">{rupiah(p.robux * rate)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-semibold">Atau pilih item dari admin</p>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {items.map((it) => {
                  const selected = product?.source === "item" && product.itemId === it.id;
                  const icon = it.image ? `${API_URL}${it.image}` : "";
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setProduct({ source: "item", itemId: it.id, game: it.game, name: it.name, robux: it.robux, icon })}
                        className={`flex h-full w-full flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-colors ${
                          selected ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                        }`}
                      >
                        <span className="line-clamp-2 text-sm font-semibold leading-tight">{it.name}</span>
                        {it.game && <span className="text-xs text-ink-faint">{it.game}</span>}
                        <span className="mt-auto inline-flex items-center gap-1 text-xs text-ink-muted tabular">
                          <RobuxIcon className="h-3.5 w-3.5 text-ice" /> {number(it.robux)}
                        </span>
                        <span className="font-extrabold tabular">{rupiah(it.price)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Box>

        <Box n={2} title="Penerima dan server" sub="Akun yang mau dikirimi item dan server tempat admin mengirim.">
          {product ? (
            <p className="flex items-center gap-3 rounded-xl border border-line bg-raised/50 p-2.5 text-sm">
              <Icon src={product.icon} size="h-10 w-10" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{product.name}</span>
                <span className="block truncate text-xs text-ink-faint">{product.game}</span>
              </span>
              <span className="font-bold tabular">{rupiah(product.robux * rate)}</span>
            </p>
          ) : (
            <p className="rounded-xl border border-dashed border-line-strong px-3.5 py-3 text-sm text-ink-muted">Pilih gamepass atau item dulu di langkah 1.</p>
          )}

          <label className="mt-4 block">
            <span className="text-sm text-ink-muted">Username Roblox penerima</span>
            <input
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Username, bukan display name"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
          <ProfilePreview status={status} profile={profile} username={uname} />

          <fieldset className="mt-5">
            <legend className="text-sm text-ink-muted">Server untuk pengiriman</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["admin", "Minta admin siapkan server", "Admin yang buat server, nanti kamu diajak join."],
                  ["link", "Aku kirim link private server", "Salin link dari tombol Share di private server kamu."],
                ] as const
              ).map(([value, title, desc]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors ${
                    server === value ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
                  }`}
                >
                  <input type="radio" name="server" checked={server === value} onChange={() => setServer(value)} className="mt-1 h-4 w-4 accent-[#bcd6ff]" />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {server === "link" && (
              <label className="mt-3 block">
                <span className="sr-only">Link private server</span>
                <input
                  value={serverLink}
                  onChange={(e) => setServerLink(e.target.value.slice(0, 400))}
                  placeholder="https://www.roblox.com/share?code=...&type=Server"
                  aria-invalid={!!serverLink && !linkOk}
                  className="w-full rounded-xl border border-line bg-ground px-4 py-3 text-sm placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn"
                />
                {!!serverLink && !linkOk && <span className="mt-1.5 block text-xs text-warn">Link belum benar. Pakai link dari tombol Share di private server.</span>}
              </label>
            )}
          </fieldset>

          <button
            type="button"
            onClick={addLine}
            disabled={!canAdd}
            className="chrome-btn mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} aria-hidden /> Tambah ke pesanan
          </button>
          <p className="mt-2 text-xs text-ink-faint">Bisa ditambah lagi untuk teman, game lain, atau gamepass lain.</p>
        </Box>
      </div>

      <aside className="glow-card rounded-[var(--radius-card)] border border-line-strong px-5 pt-5 sm:px-6 sm:pt-6 lg:sticky lg:top-24" aria-label="Ringkasan pesanan">
        <h2 className="text-lg font-bold tracking-tight">Pesanan Gift In Game</h2>
        {!ready && (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-warn/30 bg-warn/10 px-3 py-2.5 text-sm text-warn">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden /> Gift In Game lagi disiapkan, belum bisa dipesan.
          </p>
        )}
        {cart.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-line-strong px-3.5 py-4 text-center text-sm text-ink-muted">
            Belum ada item. Pilih gamepass, isi penerima, lalu tekan Tambah ke pesanan.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {cart.map((l, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line bg-ground/50 p-2.5">
                <RobloxAvatar src={l.avatar} size="h-10 w-10" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">{l.name}</p>
                  <p className="truncate text-xs text-ink-faint">{l.game}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    ke @{l.username} · <Server size={11} className="inline" aria-hidden /> {l.server === "link" ? "link server" : "server admin"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold tabular">{rupiah(l.robux * rate)}</span>
                  <button
                    type="button"
                    onClick={() => setCart((c) => c.filter((_, j) => j !== i))}
                    aria-label={`Hapus ${l.name}`}
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-faint hover:bg-white/5 hover:text-ink"
                  >
                    <X size={15} aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-5 text-sm text-ink-muted">Cara bayar</p>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Metode pembayaran">
          {PAY_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={pay === m.id}
              onClick={() => setPay(m.id)}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                pay === m.id ? "border-ice bg-ice/10" : "border-line bg-raised/50 text-ink-muted hover:border-line-strong"
              }`}
            >
              {m.name}
              {pay === m.id && <Check size={15} className="text-ice" aria-hidden />}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="text-sm text-ink-muted">Catatan untuk admin (opsional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 300))}
            rows={2}
            className="mt-1.5 w-full resize-none rounded-xl border border-line bg-ground px-3.5 py-2.5 text-sm focus:border-ice focus:outline-none"
          />
        </label>

        <div className="ice -mx-5 mt-5 rounded-b-[calc(var(--radius-card)-1px)] px-5 pb-5 sm:-mx-6 sm:px-6 sm:pb-6">
          <span className="perf -mx-5 sm:-mx-6" aria-hidden />
          <p className="text-sm font-medium text-[#2b3a55]">Total pembayaran</p>
          <p className="text-3xl font-extrabold tracking-tight tabular">{rupiah(total)}</p>
          {user === null ? (
            <Link
              href="/masuk?next=/item"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0c] px-5 py-3.5 font-semibold text-ink"
            >
              <LogIn size={18} aria-hidden /> Masuk untuk membeli
            </Link>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!cart.length || busy || !ready || user === undefined}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0b0c] px-5 py-3.5 font-semibold text-ink transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy && <Loader2 size={18} className="animate-spin" aria-hidden />}
              Buat pesanan <ArrowRight size={18} aria-hidden />
            </button>
          )}
          <p className="mt-3 text-center text-xs text-[#2b3a55]">
            Pesanan diproses setelah kamu upload bukti bayar atau kabari admin di chat kalau sudah transfer.
          </p>
          {error && (
            <p className="mt-3 rounded-xl bg-[#0b0b0c] px-3.5 py-2.5 text-sm text-warn" role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
