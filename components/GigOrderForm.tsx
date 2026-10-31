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
import { gigPrice } from "@/lib/pricing";

type Game = { universeId: number; placeId: number; name: string; players: number; icon: string };
type Pass = { id: number; name: string; robux: number; icon: string };
type Product =
  | { source: "pass"; universeId: number; game: string; passId: number; name: string; robux: number; icon: string }
  | { source: "item"; itemId: number; game: string; name: string; robux: number; icon: string };
type Line = Product & { username: string; display: string; avatar: string; server: "link" | "admin"; serverLink: string };

const SERVER_LINK = /^https:\/\/(www\.)?roblox\.com\/\S*(share\?code=|privateServerLinkCode=)\S+$/i;
const FIRST = 12;
const MAX_LINES = 10;
const keyOf = (p: Product) => (p.source === "pass" ? `p${p.passId}` : `i${p.itemId}`);

function Icon({ src, size }: { src: string; size: string }) {
  return (
    <span className={"relative block shrink-0 overflow-hidden bg-raised " + size}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />}
    </span>
  );
}

/** Satu pilihan gamepass/item yang ringkas: ikon kecil, nama, harga Robux dan Rupiah. */
function Choice({ icon, name, sub, robux, price, selected, onPick }: {
  icon: string;
  name: string;
  sub?: string;
  robux: number;
  price: number;
  selected: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPick}
      title={name}
      className={`flex h-full w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors ${
        selected ? "border-ice bg-ice/10" : "border-line bg-raised/50 hover:border-line-strong"
      }`}
    >
      {icon && <Icon src={icon} size="h-10 w-10 rounded-lg" />}
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{name}</span>
        {sub && <span className="block truncate text-[11px] text-ink-faint">{sub}</span>}
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs tabular">
          <span className="inline-flex items-center gap-0.5 text-ink-faint">
            <RobuxIcon className="h-3 w-3 text-ice" /> {number(robux)}
          </span>
          <span className="font-bold text-ink">{rupiah(price)}</span>
        </span>
      </span>
      {selected && <Check size={16} className="shrink-0 text-ice" aria-hidden />}
    </button>
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
  const [passQuery, setPassQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [picked, setPicked] = useState<Product[]>([]);
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
    setPassQuery("");
    setShowAll(false);
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

  const pq = passQuery.trim().toLowerCase();
  const matched = (passes ?? []).filter((p) => !pq || p.name.toLowerCase().includes(pq));
  const shown = showAll || pq ? matched : matched.slice(0, FIRST);
  const linkOk = server === "admin" || SERVER_LINK.test(serverLink.trim());
  const recipientOk = valid && (status === "found" || status === "error");
  const roomLeft = MAX_LINES - cart.length;
  const canAdd = picked.length > 0 && picked.length <= roomLeft && recipientOk && linkOk;
  const total = cart.reduce((n, l) => n + gigPrice(l.robux, rate), 0);
  const isPicked = (key: string) => picked.some((p) => keyOf(p) === key);

  function toggle(p: Product) {
    setPicked((cur) => (cur.some((x) => keyOf(x) === keyOf(p)) ? cur.filter((x) => keyOf(x) !== keyOf(p)) : [...cur, p]));
  }

  function addLine() {
    if (!canAdd) return;
    const who = {
      username: profile?.name ?? uname,
      display: profile?.displayName ?? uname,
      avatar: profile?.avatar ?? "",
      server,
      serverLink: server === "link" ? serverLink.trim() : "",
    };
    setCart((c) => [...c, ...picked.map((p) => ({ ...p, ...who }))]);
    setUsername("");
    setPicked([]);
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="grid grid-cols-1 gap-5">
        <Box n={1} title="Pilih gamepass" sub="Khusus game yang punya fitur gift. Bisa pilih lebih dari satu gamepass.">
          <label className="relative block">
            <span className="sr-only">Cari game</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 200))}
              placeholder="Contoh: Evade"
              className="w-full rounded-xl border border-line bg-ground py-3 pl-11 pr-4 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
          {!game && (
            <p className="mt-2 text-xs text-ink-faint">
              Ketik nama game atau tempel link game-nya dari Roblox, lalu centang gamepass yang mau dikirim.
            </p>
          )}

          {searching && (
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 size={16} className="animate-spin" aria-hidden /> Mencari game...
            </p>
          )}
          {searchErr && <p className="mt-3 text-sm text-warn">{searchErr}</p>}

          {!game && games && !searching && (
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {games.length === 0 && <li className="text-sm text-ink-muted">Game tidak ketemu. Coba nama lain atau tempel link game.</li>}
              {games.map((g) => (
                <li key={g.universeId}>
                  <button
                    type="button"
                    onClick={() => pickGame(g)}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-raised/50 p-2.5 text-left transition-colors hover:border-ice"
                  >
                    <Icon src={g.icon} size="h-11 w-11 rounded-lg" />
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
                <Icon src={game.icon} size="h-11 w-11 rounded-lg" />
                <p className="min-w-0 flex-1 truncate font-semibold">{game.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setGame(null);
                    setPasses(null);
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
                <>
                  {passes.length > FIRST && (
                    <label className="relative mt-3 block">
                      <span className="sr-only">Cari gamepass</span>
                      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden />
                      <input
                        value={passQuery}
                        onChange={(e) => setPassQuery(e.target.value.slice(0, 60))}
                        placeholder={`Cari di ${passes.length} gamepass`}
                        className="w-full rounded-xl border border-line bg-ground py-2.5 pl-10 pr-4 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none sm:text-sm"
                      />
                    </label>
                  )}
                  <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {shown.map((p) => (
                      <li key={p.id}>
                        <Choice
                          icon={p.icon}
                          name={p.name}
                          robux={p.robux}
                          price={gigPrice(p.robux, rate)}
                          selected={isPicked(`p${p.id}`)}
                          onPick={() =>
                            toggle({ source: "pass", universeId: game.universeId, game: game.name, passId: p.id, name: p.name, robux: p.robux, icon: p.icon })
                          }
                        />
                      </li>
                    ))}
                    {shown.length === 0 && <li className="text-sm text-ink-muted">Gamepass tidak ketemu.</li>}
                  </ul>
                  {!showAll && !pq && matched.length > FIRST && (
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="mt-2 w-full rounded-lg border border-line-strong py-2 text-sm font-semibold text-ink-muted hover:bg-raised hover:text-ink"
                    >
                      Tampilkan semua {matched.length} gamepass
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-semibold">Atau pilih item dari admin</p>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {items.map((it) => {
                  const icon = it.image ? `${API_URL}${it.image}` : "";
                  return (
                    <li key={it.id}>
                      <Choice
                        icon={icon}
                        name={it.name}
                        sub={it.game}
                        robux={it.robux}
                        price={it.price}
                        selected={isPicked(`i${it.id}`)}
                        onPick={() => toggle({ source: "item", itemId: it.id, game: it.game, name: it.name, robux: it.robux, icon })}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Box>

        <Box n={2} title="Penerima dan server" sub="Akun yang mau dikirimi item dan server tempat admin mengirim.">
          {picked.length > 0 ? (
            <ul className="grid grid-cols-1 gap-1.5" aria-label="Gamepass yang dipilih">
              {picked.map((p) => (
                <li key={keyOf(p)} className="flex items-center gap-3 rounded-xl border border-line bg-raised/50 p-2 text-sm">
                  {p.icon && <Icon src={p.icon} size="h-9 w-9 rounded-lg" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-ink-faint">{p.game}</span>
                  </span>
                  <span className="font-bold tabular">{rupiah(gigPrice(p.robux, rate))}</span>
                  <button
                    type="button"
                    onClick={() => toggle(p)}
                    aria-label={`Batal pilih ${p.name}`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint hover:bg-ink/5 hover:text-ink"
                  >
                    <X size={15} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-line-strong px-3.5 py-3 text-sm text-ink-muted">Pilih satu atau beberapa gamepass dulu di langkah 1.</p>
          )}

          <label className="mt-4 block">
            <span className="text-sm text-ink-muted">Username Roblox penerima <span className="text-ink-faint">(bukan display name)</span></span>
            <input
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Contoh: builderman"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
          <ProfilePreview status={status} profile={profile} username={uname} />

          <fieldset className="mt-5">
            <legend className="text-sm text-ink-muted">Server untuk pengiriman</legend>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                  placeholder="Contoh: https://www.roblox.com/share?code=abc123&type=Server"
                  aria-invalid={!!serverLink && !linkOk}
                  className="w-full rounded-xl border border-line bg-ground px-4 py-3 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none aria-[invalid=true]:border-warn sm:text-sm"
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
            <Plus size={18} aria-hidden /> {picked.length > 1 ? `Tambah ${picked.length} item ke pesanan` : "Tambah ke pesanan"}
          </button>
          <p className="mt-2 text-xs text-ink-faint">
            {picked.length > roomLeft
              ? `Satu pesanan maksimal ${MAX_LINES} item. Kurangi pilihanmu dulu, ya.`
              : "Bisa ditambah lagi untuk teman, game lain, atau gamepass lain."}
          </p>
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
          <ul className="mt-4 grid grid-cols-1 gap-2">
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
                  <span className="text-sm font-bold tabular">{rupiah(gigPrice(l.robux, rate))}</span>
                  <button
                    type="button"
                    onClick={() => setCart((c) => c.filter((_, j) => j !== i))}
                    aria-label={`Hapus ${l.name}`}
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-faint hover:bg-ink/5 hover:text-ink"
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
            placeholder="Contoh: aku online jam 8 malam"
            className="mt-1.5 w-full resize-none rounded-xl border border-line bg-ground px-3.5 py-2.5 text-base placeholder:text-ink-faint focus:border-ice focus:outline-none sm:text-sm"
          />
        </label>

        <div className="ice -mx-5 mt-5 rounded-b-[calc(var(--radius-card)-1px)] px-5 pb-5 sm:-mx-6 sm:px-6 sm:pb-6">
          <span className="perf -mx-5 sm:-mx-6" aria-hidden />
          <p className="text-sm font-medium text-[#2b3a55]">Total pembayaran</p>
          <p className="text-3xl font-extrabold tracking-tight tabular">{rupiah(total)}</p>
          {user === null ? (
            <Link
              href="/masuk?next=/item"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-5 py-3.5 font-semibold text-snow"
            >
              <LogIn size={18} aria-hidden /> Masuk untuk membeli
            </Link>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!cart.length || busy || !ready || user === undefined}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-5 py-3.5 font-semibold text-snow transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy && <Loader2 size={18} className="animate-spin" aria-hidden />}
              Buat pesanan <ArrowRight size={18} aria-hidden />
            </button>
          )}
          <p className="mt-3 text-center text-xs text-[#2b3a55]">
            Pesanan diproses setelah kamu upload bukti bayar atau kabari admin di chat kalau sudah transfer.
          </p>
          {error && (
            <p className="mt-3 rounded-xl bg-onyx px-3.5 py-2.5 text-sm text-[#fbbf24]" role="alert">
              {error}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
