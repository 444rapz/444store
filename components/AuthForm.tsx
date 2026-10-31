"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, MessageCircle } from "lucide-react";
import { LogoOrb } from "./Brand";
import { oauthUrl, useWebUser, webApi, type WebUser } from "@/lib/web";

const ERRORS: Record<string, string> = {
  dibatalkan: "Login dibatalkan. Coba lagi kalau mau masuk.",
  discord_off: "Login Discord lagi nggak aktif. Pakai cara lain dulu, ya.",
  google_off: "Login Google belum aktif. Pakai cara lain dulu, ya.",
  discord_gagal: "Login Discord gagal. Coba lagi sebentar.",
  google_gagal: "Login Google gagal. Coba lagi sebentar.",
  sesi_login: "Sesi login sudah habis. Coba masuk lagi.",
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6h-4a12 12 0 0 0 0 10.9l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

export function AuthForm({ next, error, startMode }: { next: string; error: string; startMode: "login" | "register" }) {
  const router = useRouter();
  const user = useWebUser();
  const [mode, setMode] = useState(startMode);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(ERRORS[error] || "");
  const [providers, setProviders] = useState({ discord: true, google: false });

  useEffect(() => {
    webApi<{ discord: boolean; google: boolean }>("auth/providers").then((r) => {
      if (r.ok) setProviders({ discord: r.data.discord, google: r.data.google });
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const r = await webApi<{ user: WebUser }>(mode === "login" ? "auth/login" : "auth/register", {
      method: "POST",
      body: JSON.stringify({ identifier, password, name }),
    });
    setBusy(false);
    if (!r.ok) return setMessage(r.data.error || "Gagal masuk. Coba lagi.");
    router.replace(next);
    router.refresh();
  }

  if (user) {
    return (
      <div className="glow-card rounded-[24px] border border-line-strong p-6 text-center sm:p-8">
        <LogoOrb size="mx-auto h-14 w-14" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Kamu sudah masuk</h1>
        <p className="mt-1 text-ink-muted">Sebagai {user.name}.</p>
        <button type="button" onClick={() => router.replace(next)} className="chrome-btn mt-6 w-full rounded-full px-5 py-3.5 font-semibold">
          Lanjut
        </button>
      </div>
    );
  }

  return (
    <div className="glow-card rounded-[24px] border border-line-strong p-6 sm:p-8">
      <LogoOrb size="h-12 w-12" />
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em]">{mode === "login" ? "Masuk dulu, yuk" : "Bikin akun"}</h1>
      <p className="mt-2 text-ink-muted">Pesanan dan chat sama admin tersimpan di akunmu, jadi nggak bakal hilang.</p>

      <div className="mt-6 grid gap-2.5">
        {providers.discord && (
          <button
            type="button"
            onClick={() => {
              window.location.href = oauthUrl("discord", next);
            }}
            className="flex items-center justify-center gap-2.5 rounded-full bg-discord px-5 py-3.5 font-semibold text-white transition-transform active:scale-[0.98]"
          >
            <MessageCircle size={18} aria-hidden /> Lanjut pakai Discord
          </button>
        )}
        {providers.google && (
          <button
            type="button"
            onClick={() => {
              window.location.href = oauthUrl("google", next);
            }}
            className="flex items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3.5 font-semibold text-[#1f1f1f] transition-transform active:scale-[0.98]"
          >
            <GoogleMark /> Lanjut pakai Google
          </button>
        )}
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-line-strong" /> atau pakai email / nomor WA <span className="h-px flex-1 bg-line-strong" />
      </div>

      <div className="grid grid-cols-2 rounded-full border border-line-strong bg-ground/50 p-1 text-sm" role="tablist" aria-label="Pilih masuk atau daftar">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setMessage("");
            }}
            className={`rounded-full py-2 font-medium transition-colors ${mode === m ? "chrome-chip" : "text-ink-muted hover:text-ink"}`}
          >
            {m === "login" ? "Masuk" : "Daftar"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4">
        {mode === "register" && (
          <label className="block">
            <span className="text-sm text-ink-muted">Nama panggilan</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="Contoh: Rafi"
              autoComplete="nickname"
              className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm text-ink-muted">Email atau nomor WhatsApp</span>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.slice(0, 120))}
            placeholder="nama@email.com atau 0812..."
            autoComplete="username"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-ground px-4 py-3 placeholder:text-ink-faint focus:border-ice focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink-muted">Password</span>
          <span className="relative mt-1.5 block">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 72))}
              placeholder={mode === "register" ? "Minimal 6 karakter" : "Password akun kamu"}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              required
              minLength={6}
              className="w-full rounded-xl border border-line bg-ground py-3 pl-4 pr-12 placeholder:text-ink-faint focus:border-ice focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-faint hover:text-ink"
            >
              {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          </span>
        </label>

        {message && (
          <p className="rounded-xl border border-warn/30 bg-warn/10 px-3.5 py-3 text-sm text-warn" role="alert">
            {message}
          </p>
        )}

        <button type="submit" disabled={busy} className="chrome-btn flex items-center justify-center gap-2 rounded-full px-5 py-3.5 font-semibold disabled:opacity-60">
          {busy && <Loader2 size={17} className="animate-spin" aria-hidden />}
          {mode === "login" ? "Masuk" : "Daftar dan masuk"}
        </button>
        {mode === "register" && (
          <p className="text-center text-xs text-ink-faint">Nomor WA cuma dipakai buat masuk dan dihubungi admin soal pesanan.</p>
        )}
      </form>
    </div>
  );
}
